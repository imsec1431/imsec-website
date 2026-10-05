import express from "express";

import {
  loginAdmin,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyLoginOTP,
  resendLoginOTP,
  getCurrentAdmin,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
   LOGIN
============================================================ */

router.post("/login", loginAdmin);

/* ============================================================
   GET CURRENT LOGGED-IN ADMIN / SUB ADMIN
============================================================ */

router.get("/me", protect, getCurrentAdmin);

/* ============================================================
   PROTECTED ROUTE - CHANGE PASSWORD
============================================================ */

router.put("/change-password", protect, changePassword);

/* ============================================================
   FORGOT PASSWORD
============================================================ */

router.post("/forgot-password", forgotPassword);

/* ============================================================
   VERIFY FORGOT PASSWORD OTP
============================================================ */

router.post("/verify-otp", verifyOTP);

/* ============================================================
   RESET PASSWORD
============================================================ */

router.put("/reset-password", resetPassword);

/* ============================================================
   VERIFY LOGIN OTP
============================================================ */

router.post("/verify-login-otp", verifyLoginOTP);

/* ============================================================
   RESEND LOGIN OTP
============================================================ */

router.post("/resend-login-otp", resendLoginOTP);

export default router;
