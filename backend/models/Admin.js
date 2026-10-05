import mongoose from "mongoose";

/* =========================================================
   SUB-MODULE PERMISSION SCHEMA
========================================================= */

const subModulePermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   MODULE PERMISSION SCHEMA
========================================================= */

const modulePermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    subModules: {
      type: [subModulePermissionSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   DEPARTMENT PERMISSION SCHEMA
========================================================= */

const departmentPermissionSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       DEPARTMENT ID
    ------------------------------------------------------- */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    /* -------------------------------------------------------
       DEPARTMENT SLUG
    ------------------------------------------------------- */

    slug: {
      type: String,
      trim: true,
      default: "",
    },

    /* -------------------------------------------------------
       DEPARTMENT NAME
    ------------------------------------------------------- */

    name: {
      type: String,
      trim: true,
      default: "",
    },

    /* -------------------------------------------------------
       DEPARTMENT ACCESS
    ------------------------------------------------------- */

    enabled: {
      type: Boolean,
      default: false,
    },

    /* -------------------------------------------------------
       DEPARTMENT MODULES
    ------------------------------------------------------- */

    modules: {
      type: [modulePermissionSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   ADMIN SCHEMA
========================================================= */

const adminSchema = new mongoose.Schema(
  {
    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    /* =====================================================
       ROLE
    ===================================================== */

    role: {
      type: String,

      enum: [
        "Super Admin",
        "Director",
        "Dean",
        "HOD",
        "Faculty Admin",
        "Placement Admin",
        "Media Admin",
        "Sub Admin",
      ],

      default: "Faculty Admin",
    },

    /* =====================================================
       DEPARTMENT

       Existing field retained for compatibility.
    ===================================================== */

    department: {
      type: String,
      default: "MCA",
    },

    /* =====================================================
       SUB-ADMIN PERMISSIONS
    ===================================================== */

    permissions: {
      /* ---------------------------------------------------
         GLOBAL MODULE PERMISSIONS
      --------------------------------------------------- */

      modules: {
        type: [modulePermissionSchema],
        default: [],
      },

      /* ---------------------------------------------------
         DEPARTMENT PERMISSIONS
      --------------------------------------------------- */

      departments: {
        type: [departmentPermissionSchema],
        default: [],
      },
    },

    /* =====================================================
       STATUS
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },

    /* =====================================================
       LOGIN OTP
    ===================================================== */

    loginOtp: {
      type: String,
      default: null,
    },

    loginOtpExpire: {
      type: Date,
      default: null,
    },

    /* =====================================================
       LOGIN OTP SECURITY
       
       Maximum 10 verification attempts for one OTP.
    ===================================================== */

    loginOtpAttempts: {
      type: Number,
      default: 0,
    },

    /* -----------------------------------------------------
       LOGIN OTP LOCK
       
       This can be used to temporarily block verification
       after too many failed attempts.
    ----------------------------------------------------- */

    loginLockedUntil: {
      type: Date,
      default: null,
    },

    /* -----------------------------------------------------
       LOGIN OTP LAST SENT
       
       Used for resend/request rate limiting.
    ----------------------------------------------------- */

    loginOtpLastSentAt: {
      type: Date,
      default: null,
    },

    /* -----------------------------------------------------
       LOGIN OTP RESEND COUNT
       
       Number of OTP requests inside the current
       rate-limit window.
    ----------------------------------------------------- */

    loginOtpResendCount: {
      type: Number,
      default: 0,
    },

    /* -----------------------------------------------------
       LOGIN OTP RESEND WINDOW
       
       Starting point of the current rate-limit window.
    ----------------------------------------------------- */

    loginOtpResendWindowStart: {
      type: Date,
      default: null,
    },

    /* =====================================================
       FORGOT PASSWORD OTP
    ===================================================== */

    otp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },

    /* =====================================================
       FORGOT PASSWORD OTP SECURITY

       Maximum 10 verification attempts for one OTP.
    ===================================================== */

    otpAttempts: {
      type: Number,
      default: 0,
    },

    /* -----------------------------------------------------
       FORGOT PASSWORD OTP LOCK
    ----------------------------------------------------- */

    otpLockedUntil: {
      type: Date,
      default: null,
    },

    /* -----------------------------------------------------
       FORGOT PASSWORD OTP LAST SENT
    ----------------------------------------------------- */

    otpLastSentAt: {
      type: Date,
      default: null,
    },

    /* -----------------------------------------------------
       FORGOT PASSWORD OTP RESEND COUNT
    ----------------------------------------------------- */

    otpResendCount: {
      type: Number,
      default: 0,
    },

    /* -----------------------------------------------------
       FORGOT PASSWORD OTP RESEND WINDOW
    ----------------------------------------------------- */

    otpResendWindowStart: {
      type: Date,
      default: null,
    },

    /* =====================================================
       LOGIN TRACKING
    ===================================================== */

    lastLogin: {
      type: Date,
      default: null,
    },

    lastLogout: {
      type: Date,
      default: null,
    },

    lastPasswordChange: {
      type: Date,
      default: null,
    },

    /* =====================================================
       CREATED BY
    ===================================================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
