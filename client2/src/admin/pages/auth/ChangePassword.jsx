import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSave,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";

import { changePassword } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "./ChangePassword.css";

/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

const ChangePassword = () => {
  const navigate = useNavigate();

  const { admin } = useAuth();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =======================================================
     PASSWORD VISIBILITY
  ======================================================= */

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =======================================================
     UI STATE
  ======================================================= */

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const currentPassword = formData.currentPassword;

    const newPassword = formData.newPassword;

    const confirmPassword = formData.confirmPassword;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");

      return;
    }

    if (newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");

      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");

      return;
    }

    /* =====================================================
       GET TOKEN
    ===================================================== */

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("adminToken");

    if (!token) {
      setError("Your session has expired. Please login again.");

      return;
    }

    /* =====================================================
       API
    ===================================================== */

    try {
      setLoading(true);

      const response = await changePassword(
        {
          currentPassword,
          newPassword,
        },
        token,
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Failed to change password.",
        );
      }

      setSuccess("Password changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Change Password Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="change-password-page">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="change-password-header">
        <div className="change-password-header-left">
          <button
            type="button"
            className="change-password-back-btn"
            onClick={() => navigate("/imsec-control-center")}
          >
            <FaArrowLeft />
          </button>

          <div className="change-password-title-icon">
            <FaLock />
          </div>

          <div>
            <h1>Change Password</h1>

            <p>Update your account password</p>
          </div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="change-password-container">
        <div className="change-password-card">
          {/* =================================================
              CARD HEADER
          ================================================= */}

          <div className="change-password-card-header">
            <div className="change-password-card-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h2>Account Security</h2>

              <p>Change the password for your administrator account.</p>
            </div>
          </div>

          {/* =================================================
              ALERTS
          ================================================= */}

          {error && (
            <div className="change-password-alert change-password-alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="change-password-alert change-password-alert-success">
              {success}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form className="change-password-form" onSubmit={handleSubmit}>
            {/* CURRENT PASSWORD */}

            <div className="change-password-group">
              <label htmlFor="currentPassword">
                Current Password
                <span>*</span>
              </label>

              <div className="change-password-input-wrapper">
                <FaLock className="change-password-input-icon" />

                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="change-password-eye-btn"
                  onClick={() =>
                    setShowCurrentPassword((previous) => !previous)
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}

            <div className="change-password-group">
              <label htmlFor="newPassword">
                New Password
                <span>*</span>
              </label>

              <div className="change-password-input-wrapper">
                <FaLock className="change-password-input-icon" />

                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="change-password-eye-btn"
                  onClick={() => setShowNewPassword((previous) => !previous)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <small>Password must contain at least 6 characters.</small>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="change-password-group">
              <label htmlFor="confirmPassword">
                Confirm New Password
                <span>*</span>
              </label>

              <div className="change-password-input-wrapper">
                <FaLock className="change-password-input-icon" />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="change-password-eye-btn"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* =================================================
                PASSWORD REQUIREMENTS
            ================================================= */}

            <div className="change-password-requirements">
              <div className="change-password-requirements-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Password Security</strong>

                <ul>
                  <li>Use at least 6 characters.</li>

                  <li>Use a password that you do not use elsewhere.</li>

                  <li>Do not share your password with anyone.</li>
                </ul>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="change-password-actions">
              <button
                type="button"
                className="change-password-btn change-password-btn-secondary"
                onClick={() => navigate("/imsec-control-center")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="change-password-btn change-password-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSyncAlt className="change-password-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* =================================================
              USER INFO
          ================================================= */}

          {admin?.email && (
            <div className="change-password-account-info">
              <strong>Logged in account</strong>

              <span>{admin.email}</span>

              {admin.role && <span>{admin.role}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
