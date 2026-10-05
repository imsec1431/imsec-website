// Login / Authentication

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import Admin from "../models/Admin.js";
import sendEmail from "../utils/sendEmail.js";

/* =========================================================
   OTP SECURITY CONSTANTS
========================================================= */

const OTP_LENGTH = 6;

// OTP remains valid for 3 minutes
const OTP_EXPIRY_MS = 3 * 60 * 1000;

// Maximum wrong OTP attempts
const MAX_OTP_ATTEMPTS = 10;

// Minimum time between OTP requests
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

// Maximum OTP requests inside rate-limit window
const MAX_OTP_REQUESTS = 5;

// OTP request rate-limit window
const OTP_REQUEST_WINDOW_MS = 15 * 60 * 1000;

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/**
 * Generate a secure 6-digit numeric OTP.
 */
const generateOTP = () => {
  return otpGenerator.generate(OTP_LENGTH, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

/**
 * Check whether another OTP can be sent.
 *
 * Returns:
 * {
 *   allowed: true
 * }
 *
 * OR
 *
 * {
 *   allowed: false,
 *   message: "...",
 *   retryAfter: seconds
 * }
 */
const checkOtpRequestLimit = (
  admin,
  lastSentField,
  countField,
  windowField,
) => {
  const now = Date.now();

  const lastSentAt = admin[lastSentField]
    ? new Date(admin[lastSentField]).getTime()
    : null;

  const windowStart = admin[windowField]
    ? new Date(admin[windowField]).getTime()
    : null;

  /*
   * -------------------------------------------------------
   * 60 SECOND RESEND COOLDOWN
   * -------------------------------------------------------
   */

  if (lastSentAt && now - lastSentAt < OTP_RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil(
      (OTP_RESEND_COOLDOWN_MS - (now - lastSentAt)) / 1000,
    );

    return {
      allowed: false,
      message: `Please wait ${remainingSeconds} second(s) before requesting another OTP.`,
      retryAfter: remainingSeconds,
    };
  }

  /*
   * -------------------------------------------------------
   * 15 MINUTE REQUEST WINDOW
   * -------------------------------------------------------
   */

  if (!windowStart || now - windowStart >= OTP_REQUEST_WINDOW_MS) {
    return {
      allowed: true,
      newWindow: true,
    };
  }

  const requestCount = Number(admin[countField] || 0);

  if (requestCount >= MAX_OTP_REQUESTS) {
    const remainingSeconds = Math.ceil(
      (OTP_REQUEST_WINDOW_MS - (now - windowStart)) / 1000,
    );

    return {
      allowed: false,
      message: "Too many OTP requests. Please try again later.",
      retryAfter: remainingSeconds,
    };
  }

  return {
    allowed: true,
    newWindow: false,
  };
};

/**
 * Update OTP request tracking.
 */
const updateOtpRequestTracking = (
  admin,
  lastSentField,
  countField,
  windowField,
  isNewWindow,
) => {
  const now = new Date();

  admin[lastSentField] = now;

  if (isNewWindow) {
    admin[windowField] = now;
    admin[countField] = 1;
  } else {
    admin[countField] = Number(admin[countField] || 0) + 1;
  }
};

/* ============================================================
   LOGIN ADMIN
============================================================ */

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /* ========================================================
       FIND ADMIN
    ======================================================== */

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* ========================================================
       CHECK ACCOUNT STATUS
    ======================================================== */

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    /* ========================================================
       CHECK PASSWORD
    ======================================================== */

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* ========================================================
       SUB ADMIN
       NO OTP
       DIRECT LOGIN
    ======================================================== */

    if (admin.role === "Sub Admin") {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "50m",
        },
      );

      /* ------------------------------------------------------
         Clear any old OTP values
      ------------------------------------------------------ */

      admin.loginOtp = null;
      admin.loginOtpExpire = null;
      admin.loginOtpAttempts = 0;
      admin.loginLockedUntil = null;

      admin.otp = null;
      admin.otpExpire = null;
      admin.otpAttempts = 0;
      admin.otpLockedUntil = null;

      admin.lastLogin = new Date();

      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Sub Admin login successful.",
        token,
        requiresOtp: false,

        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,

          permissions: admin.permissions || {
            modules: [],
            departments: [],
          },
        },
      });
    }

    /* ========================================================
       NORMAL ADMIN
       LOGIN OTP
    ======================================================== */

    /*
     * Check OTP request rate limit.
     */

    const otpLimit = checkOtpRequestLimit(
      admin,
      "loginOtpLastSentAt",
      "loginOtpResendCount",
      "loginOtpResendWindowStart",
    );

    if (!otpLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: otpLimit.message,
        retryAfter: otpLimit.retryAfter,
      });
    }

    /* ========================================================
       GENERATE 6-DIGIT OTP
    ======================================================== */

    const loginOtp = generateOTP();

    admin.loginOtp = loginOtp;

    /*
     * OTP valid for exactly 3 minutes.
     */

    admin.loginOtpExpire = new Date(Date.now() + OTP_EXPIRY_MS);

    /*
     * Reset failed attempts for the NEW OTP.
     */

    admin.loginOtpAttempts = 0;
    admin.loginLockedUntil = null;

    /*
     * Update OTP request tracking.
     */

    updateOtpRequestTracking(
      admin,
      "loginOtpLastSentAt",
      "loginOtpResendCount",
      "loginOtpResendWindowStart",
      otpLimit.newWindow,
    );

    await admin.save();

    /* ========================================================
       SEND OTP EMAIL
    ======================================================== */

    await sendEmail(
      admin.email,
      "Login Verification OTP",
      `
        <h2>Admin Login Verification</h2>

        <p>Your login OTP is:</p>

        <h1>${loginOtp}</h1>

        <p>
          This OTP is valid for <b>3 minutes</b>.
        </p>

        <p>
          You have a maximum of <b>10 verification attempts</b>
          for this OTP.
        </p>

        <p>
          If you didn't request this login,
          please ignore this email.
        </p>
      `,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      email: admin.email,
      role: admin.role,
      requiresOtp: true,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   CHANGE PASSWORD
============================================================ */

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /* ========================================================
       PASSWORD LENGTH
    ======================================================== */

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    /* ========================================================
       GET LOGGED-IN ADMIN
    ======================================================== */

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       CHECK CURRENT PASSWORD
    ======================================================== */

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    /* ========================================================
       NEW PASSWORD MUST BE DIFFERENT
    ======================================================== */

    const isSamePassword = await bcrypt.compare(newPassword, admin.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    /* ========================================================
       HASH NEW PASSWORD
    ======================================================== */

    const salt = await bcrypt.genSalt(10);

    admin.password = await bcrypt.hash(newPassword, salt);

    /* ========================================================
       PASSWORD CHANGE DATE
    ======================================================== */

    admin.lastPasswordChange = new Date();

    /* ========================================================
       CLEAR OLD OTP DATA
    ======================================================== */

    admin.otp = null;
    admin.otpExpire = null;
    admin.otpAttempts = 0;
    admin.otpLockedUntil = null;

    admin.loginOtp = null;
    admin.loginOtpExpire = null;
    admin.loginOtpAttempts = 0;
    admin.loginLockedUntil = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   GET CURRENT ADMIN / SUB ADMIN
============================================================ */

export const getCurrentAdmin = async (req, res) => {
  try {
    /*
     * protect middleware already identifies
     * the logged-in admin.
     *
     * Fetch latest record from MongoDB so the latest
     * Sub Admin permissions are returned.
     */

    const admin = await Admin.findById(req.admin?._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    /* ========================================================
       CHECK ACCOUNT STATUS
    ======================================================== */

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    return res.status(200).json({
      success: true,

      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        isActive: admin.isActive,

        permissions: admin.permissions || {
          modules: [],
          departments: [],
        },
      },
    });
  } catch (error) {
    console.error("Get Current Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current admin.",
    });
  }
};

/* ============================================================
   FORGOT PASSWORD
============================================================ */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    /* ========================================================
       FIND ADMIN
    ======================================================== */

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       SUB ADMIN
       NO OTP PASSWORD RESET
    ======================================================== */

    if (admin.role === "Sub Admin") {
      return res.status(403).json({
        success: false,
        message:
          "Forgot password through OTP is not available for Sub Admin. Please contact the administrator.",
      });
    }

    /* ========================================================
       CHECK OTP REQUEST RATE LIMIT
    ======================================================== */

    const otpLimit = checkOtpRequestLimit(
      admin,
      "otpLastSentAt",
      "otpResendCount",
      "otpResendWindowStart",
    );

    if (!otpLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: otpLimit.message,
        retryAfter: otpLimit.retryAfter,
      });
    }

    /* ========================================================
       GENERATE OTP
    ======================================================== */

    const otp = generateOTP();

    admin.otp = otp;

    /* ========================================================
       OTP VALID FOR 3 MINUTES
    ======================================================== */

    admin.otpExpire = new Date(Date.now() + OTP_EXPIRY_MS);

    /* ========================================================
       RESET ATTEMPTS FOR NEW OTP
    ======================================================== */

    admin.otpAttempts = 0;
    admin.otpLockedUntil = null;

    /* ========================================================
       UPDATE REQUEST TRACKING
    ======================================================== */

    updateOtpRequestTracking(
      admin,
      "otpLastSentAt",
      "otpResendCount",
      "otpResendWindowStart",
      otpLimit.newWindow,
    );

    await admin.save();

    /* ========================================================
       SEND EMAIL
    ======================================================== */

    await sendEmail(
      admin.email,
      "Password Reset OTP",
      `
        <h2>Password Reset</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP is valid for <b>3 minutes</b>.
        </p>

        <p>
          You have a maximum of <b>10 verification attempts</b>
          for this OTP.
        </p>

        <p>
          If you didn't request this,
          please ignore this email.
        </p>
      `,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   VERIFY FORGOT PASSWORD OTP
============================================================ */

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       SUB ADMIN CANNOT USE OTP
    ======================================================== */

    if (admin.role === "Sub Admin") {
      return res.status(403).json({
        success: false,
        message: "OTP verification is not available for Sub Admin.",
      });
    }

    /* ========================================================
       CHECK LOCK
    ======================================================== */

    if (admin.otpLockedUntil && admin.otpLockedUntil > new Date()) {
      return res.status(429).json({
        success: false,
        message:
          "Maximum 10 OTP verification attempts exceeded. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP EXISTS
    ======================================================== */

    if (!admin.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP EXPIRY
    ======================================================== */

    if (!admin.otpExpire || admin.otpExpire < Date.now()) {
      admin.otp = null;
      admin.otpExpire = null;
      admin.otpAttempts = 0;
      admin.otpLockedUntil = null;

      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP
    ======================================================== */

    if (String(admin.otp) !== String(otp)) {
      admin.otpAttempts = Number(admin.otpAttempts || 0) + 1;

      /* ------------------------------------------------------
         10TH WRONG ATTEMPT
      ------------------------------------------------------ */

      if (admin.otpAttempts >= MAX_OTP_ATTEMPTS) {
        admin.otp = null;
        admin.otpExpire = null;
        admin.otpLockedUntil = null;

        await admin.save();

        return res.status(429).json({
          success: false,
          message:
            "Maximum 10 OTP attempts exceeded. Please request a new OTP.",
          remainingAttempts: 0,
        });
      }

      await admin.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - admin.otpAttempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
      });
    }

    /* ========================================================
       OTP CORRECT
       
       We keep the OTP temporarily because your existing
       frontend uses verifyOTP before resetPassword.
       
       resetPassword will clear it after the password reset.
    ======================================================== */

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   RESET PASSWORD
============================================================ */

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /* ========================================================
       PASSWORD LENGTH
    ======================================================== */

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    /* ========================================================
       FIND ADMIN
    ======================================================== */

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       SUB ADMIN CANNOT RESET THROUGH OTP
    ======================================================== */

    if (admin.role === "Sub Admin") {
      return res.status(403).json({
        success: false,
        message: "OTP password reset is not available for Sub Admin.",
      });
    }

    /* ========================================================
       CHECK LOCK
    ======================================================== */

    if (admin.otpLockedUntil && admin.otpLockedUntil > new Date()) {
      return res.status(429).json({
        success: false,
        message:
          "Maximum 10 OTP verification attempts exceeded. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP EXISTS
    ======================================================== */

    if (!admin.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK EXPIRY
    ======================================================== */

    if (!admin.otpExpire || admin.otpExpire < Date.now()) {
      admin.otp = null;
      admin.otpExpire = null;
      admin.otpAttempts = 0;
      admin.otpLockedUntil = null;

      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP
    ======================================================== */

    if (String(admin.otp) !== String(otp)) {
      admin.otpAttempts = Number(admin.otpAttempts || 0) + 1;

      /* ------------------------------------------------------
         10TH WRONG ATTEMPT
      ------------------------------------------------------ */

      if (admin.otpAttempts >= MAX_OTP_ATTEMPTS) {
        admin.otp = null;
        admin.otpExpire = null;
        admin.otpLockedUntil = null;

        await admin.save();

        return res.status(429).json({
          success: false,
          message:
            "Maximum 10 OTP attempts exceeded. Please request a new OTP.",
          remainingAttempts: 0,
        });
      }

      await admin.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - admin.otpAttempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
      });
    }

    /* ========================================================
       HASH PASSWORD
    ======================================================== */

    const salt = await bcrypt.genSalt(10);

    admin.password = await bcrypt.hash(password, salt);

    /* ========================================================
       REMOVE OTP
       
       OTP cannot be reused after successful password reset.
    ======================================================== */

    admin.otp = null;
    admin.otpExpire = null;
    admin.otpAttempts = 0;
    admin.otpLockedUntil = null;

    /* ========================================================
       CLEAR LOGIN OTP
    ======================================================== */

    admin.loginOtp = null;
    admin.loginOtpExpire = null;
    admin.loginOtpAttempts = 0;
    admin.loginLockedUntil = null;

    admin.lastPasswordChange = new Date();

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   VERIFY LOGIN OTP
============================================================ */

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    /* ========================================================
       FIND ADMIN
    ======================================================== */

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       SUB ADMIN NEVER USES LOGIN OTP
    ======================================================== */

    if (admin.role === "Sub Admin") {
      return res.status(403).json({
        success: false,
        message: "Sub Admin does not require OTP verification.",
      });
    }

    /* ========================================================
       CHECK OTP LOCK
    ======================================================== */

    if (admin.loginLockedUntil && admin.loginLockedUntil > new Date()) {
      return res.status(429).json({
        success: false,
        message:
          "Maximum 10 OTP verification attempts exceeded. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP EXISTS
    ======================================================== */

    if (!admin.loginOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP EXPIRY
    ======================================================== */

    if (!admin.loginOtpExpire || admin.loginOtpExpire < Date.now()) {
      admin.loginOtp = null;
      admin.loginOtpExpire = null;
      admin.loginOtpAttempts = 0;
      admin.loginLockedUntil = null;

      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    /* ========================================================
       CHECK OTP
    ======================================================== */

    if (String(admin.loginOtp) !== String(otp)) {
      admin.loginOtpAttempts = Number(admin.loginOtpAttempts || 0) + 1;

      /* ------------------------------------------------------
         10TH WRONG ATTEMPT
      ------------------------------------------------------ */

      if (admin.loginOtpAttempts >= MAX_OTP_ATTEMPTS) {
        /*
         * Immediately destroy the OTP.
         */

        admin.loginOtp = null;
        admin.loginOtpExpire = null;
        admin.loginLockedUntil = null;

        await admin.save();

        return res.status(429).json({
          success: false,
          message:
            "Maximum 10 OTP attempts exceeded. Please request a new OTP.",
          remainingAttempts: 0,
        });
      }

      await admin.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - admin.loginOtpAttempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
      });
    }

    /* ========================================================
       OTP CORRECT
    ======================================================== */

    /* ========================================================
       GENERATE JWT
    ======================================================== */

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "50m",
      },
    );

    /* ========================================================
       CLEAR OTP IMMEDIATELY
       
       This prevents OTP reuse.
    ======================================================== */

    admin.loginOtp = null;
    admin.loginOtpExpire = null;
    admin.loginOtpAttempts = 0;
    admin.loginLockedUntil = null;

    admin.lastLogin = new Date();

    await admin.save();

    /* ========================================================
       SUCCESS RESPONSE
    ======================================================== */

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,

      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,

        permissions: admin.permissions || {
          modules: [],
          departments: [],
        },
      },
    });
  } catch (error) {
    console.error("Verify Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   RESEND LOGIN OTP
============================================================ */

export const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    /* ========================================================
       FIND ADMIN
    ======================================================== */

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    /* ========================================================
       SUB ADMIN
       NO OTP
    ======================================================== */

    if (admin.role === "Sub Admin") {
      return res.status(403).json({
        success: false,
        message: "Sub Admin does not use login OTP.",
      });
    }

    /* ========================================================
       CHECK REQUEST RATE LIMIT
    ======================================================== */

    const otpLimit = checkOtpRequestLimit(
      admin,
      "loginOtpLastSentAt",
      "loginOtpResendCount",
      "loginOtpResendWindowStart",
    );

    if (!otpLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: otpLimit.message,
        retryAfter: otpLimit.retryAfter,
      });
    }

    /* ========================================================
       GENERATE NEW 6-DIGIT OTP
    ======================================================== */

    const loginOtp = generateOTP();

    admin.loginOtp = loginOtp;

    /* ========================================================
       NEW OTP VALID FOR 3 MINUTES
    ======================================================== */

    admin.loginOtpExpire = new Date(Date.now() + OTP_EXPIRY_MS);

    /* ========================================================
       RESET VERIFICATION ATTEMPTS
       
       New OTP = new 10-attempt limit.
    ======================================================== */

    admin.loginOtpAttempts = 0;
    admin.loginLockedUntil = null;

    /* ========================================================
       UPDATE REQUEST LIMIT
    ======================================================== */

    updateOtpRequestTracking(
      admin,
      "loginOtpLastSentAt",
      "loginOtpResendCount",
      "loginOtpResendWindowStart",
      otpLimit.newWindow,
    );

    await admin.save();

    /* ========================================================
       SEND EMAIL
    ======================================================== */

    await sendEmail(
      admin.email,
      "Login Verification OTP",
      `
        <h2>Admin Login Verification</h2>

        <p>Your new OTP is:</p>

        <h1>${loginOtp}</h1>

        <p>
          This OTP is valid for <b>3 minutes</b>.
        </p>

        <p>
          You have a maximum of <b>10 verification attempts</b>
          for this OTP.
        </p>

        <p>
          Do not share this OTP with anyone.
        </p>
      `,
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
