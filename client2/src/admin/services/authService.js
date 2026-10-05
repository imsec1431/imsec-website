import axios from "axios";
import { getConfiguredApiBase } from "../utils/adminHttp";

const API = axios.create({
  baseURL: `${getConfiguredApiBase()}/api/auth`,
});

// =========================================================
// LOGIN
// =========================================================

export const loginAdmin = (data) => API.post("/login", data);

// =========================================================
// VERIFY LOGIN OTP
// =========================================================

export const verifyLoginOTP = (data) => API.post("/verify-login-otp", data);

// =========================================================
// RESEND LOGIN OTP
// =========================================================

export const resendLoginOTP = (data) => API.post("/resend-login-otp", data);

// =========================================================
// FORGOT PASSWORD
// =========================================================

export const forgotPassword = (data) => API.post("/forgot-password", data);

// =========================================================
// VERIFY FORGOT PASSWORD OTP
// =========================================================

export const verifyOTP = (data) => API.post("/verify-otp", data);

// =========================================================
// RESET PASSWORD
// =========================================================

export const resetPassword = (data) => API.put("/reset-password", data);

// =========================================================
// CHANGE PASSWORD
// =========================================================

export const changePassword = (data, token) =>
  API.put("/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// =========================================================
// GET CURRENT LOGGED-IN ADMIN
// =========================================================

export const getCurrentAdmin = (token) =>
  API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default API;
