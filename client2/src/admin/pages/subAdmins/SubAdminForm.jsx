import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSave,
  FaShieldAlt,
  FaSyncAlt,
  FaUserShield,
} from "react-icons/fa";

import {
  createSubAdmin,
  getSubAdmin,
  updateSubAdmin,
  resetSubAdminPassword,
} from "../../services/subAdminService";

import "./SubAdminForm.css";

/* =========================================================
   SUB ADMIN FORM
   ========================================================= */

const SubAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });

  /* =======================================================
     RESET PASSWORD STATE
  ======================================================= */

  const [resetPassword, setResetPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);

  /* =======================================================
     UI STATE
  ======================================================= */

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [resettingPassword, setResettingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     LOAD SUB ADMIN
  ======================================================= */

  useEffect(() => {
    if (isEditMode) {
      loadSubAdmin();
    }
  }, [id]);

  const loadSubAdmin = async () => {
    try {
      setLoadingData(true);
      setError("");
      setSuccess("");

      const response = await getSubAdmin(id);

      const data = response?.data?.data || response?.data;

      if (!data) {
        throw new Error("Sub Admin data not found.");
      }

      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        isActive: data.isActive !== false,
      });
    } catch (err) {
      console.error("Load Sub Admin Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load Sub Admin.",
      );
    } finally {
      setLoadingData(false);
    }
  };

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();

    const email = formData.email.trim().toLowerCase();

    const password = formData.password;

    if (!name) {
      setError("Please enter Sub Admin name.");
      return;
    }

    if (!email) {
      setError("Please enter Sub Admin email.");
      return;
    }

    /*
     * Password is required only while creating.
     */
    if (!isEditMode && !password) {
      setError("Please enter a password.");
      return;
    }

    if (!isEditMode && password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await updateSubAdmin(id, {
          name,
          email,
          isActive: formData.isActive,
        });

        setSuccess("Sub Admin updated successfully.");

        /*
         * Password is not updated here.
         * Admin uses Reset Password section
         * to change an existing Sub Admin password.
         */
        setFormData((previous) => ({
          ...previous,
          password: "",
        }));
      } else {
        await createSubAdmin({
          name,
          email,
          password,
          isActive: formData.isActive,
        });

        setSuccess("Sub Admin created successfully.");

        setFormData({
          name: "",
          email: "",
          password: "",
          isActive: true,
        });
      }
    } catch (err) {
      console.error("Save Sub Admin Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Sub Admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RESET SUB ADMIN PASSWORD
  ======================================================= */

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!resetPassword) {
      setError("Please enter the new password.");
      return;
    }

    if (resetPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset this Sub Admin's password?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setResettingPassword(true);

      await resetSubAdminPassword(id, resetPassword);

      setSuccess("Sub Admin password reset successfully.");

      setResetPassword("");
      setShowResetPassword(false);
    } catch (err) {
      console.error("Reset Sub Admin Password Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset Sub Admin password.",
      );
    } finally {
      setResettingPassword(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingData) {
    return (
      <div className="subadmin-form-page">
        <div className="subadmin-form-loading">
          <div className="subadmin-form-spinner" />

          <p>Loading Sub Admin...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="subadmin-form-page">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="subadmin-form-header">
        <div className="subadmin-form-header-left">
          <button
            type="button"
            className="subadmin-form-back-btn"
            onClick={() => navigate("/imsec-control-center/sub-admins")}
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="subadmin-form-title-row">
              <div className="subadmin-form-title-icon">
                <FaUserShield />
              </div>

              <div>
                <h1 className="subadmin-form-title">
                  {isEditMode ? "Edit Sub Admin" : "Create Sub Admin"}
                </h1>

                <p className="subadmin-form-subtitle">
                  {isEditMode
                    ? "Update Sub Admin account details"
                    : "Create a new Sub Admin account"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

      {error && (
        <div className="subadmin-form-alert subadmin-form-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="subadmin-form-alert subadmin-form-alert-success">
          {success}
        </div>
      )}

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div
        className={
          isEditMode
            ? "subadmin-form-grid subadmin-form-grid-edit"
            : "subadmin-form-grid"
        }
      >
        {/* =================================================
            ACCOUNT DETAILS
        ================================================= */}

        <div className="subadmin-form-card">
          <div className="subadmin-form-card-header">
            <div className="subadmin-form-card-icon">
              <FaUserShield />
            </div>

            <div>
              <h2>Account Details</h2>

              <p>Basic information for the Sub Admin account.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="subadmin-form">
            {/* NAME */}

            <div className="subadmin-form-group">
              <label htmlFor="name">
                Name
                <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Sub Admin name"
                autoComplete="name"
              />
            </div>

            {/* EMAIL */}

            <div className="subadmin-form-group">
              <label htmlFor="email">
                Email
                <span>*</span>
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                autoComplete="email"
              />
            </div>

            {/* PASSWORD - CREATE ONLY */}

            {!isEditMode && (
              <div className="subadmin-form-group">
                <label htmlFor="password">
                  Initial Password
                  <span>*</span>
                </label>

                <div className="subadmin-form-password-wrapper">
                  <FaLock className="subadmin-form-input-icon" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter initial password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="subadmin-form-password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <small>Minimum 6 characters.</small>
              </div>
            )}

            {/* ACTIVE STATUS */}

            <div className="subadmin-form-status-box">
              <div>
                <strong>Account Status</strong>

                <p>Inactive Sub Admins cannot log in.</p>
              </div>

              <label className="subadmin-form-switch">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <span />
              </label>
            </div>

            {/* FORM ACTIONS */}

            <div className="subadmin-form-actions">
              <button
                type="button"
                className="subadmin-form-btn subadmin-form-btn-secondary"
                onClick={() => navigate("/imsec-control-center/sub-admins")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="subadmin-form-btn subadmin-form-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSyncAlt className="subadmin-form-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {isEditMode ? "Update Sub Admin" : "Create Sub Admin"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* =================================================
            PASSWORD RESET - EDIT MODE
        ================================================= */}

        {isEditMode && (
          <div className="subadmin-form-card subadmin-password-reset-card">
            <div className="subadmin-form-card-header">
              <div className="subadmin-form-card-icon subadmin-form-card-icon-warning">
                <FaLock />
              </div>

              <div>
                <h2>Reset Password</h2>

                <p>Admin can directly set a new password.</p>
              </div>
            </div>

            <div className="subadmin-password-reset-content">
              {/* SECURITY INFORMATION */}

              <div className="subadmin-password-reset-info">
                <FaShieldAlt />

                <div>
                  <strong>Admin Password Reset</strong>

                  <p>The administrator can set a new password directly.</p>

                  <p>
                    <strong>No OTP is required.</strong>
                  </p>
                </div>
              </div>

              {/* NEW PASSWORD */}

              <div className="subadmin-form-group">
                <label htmlFor="resetPassword">
                  New Password
                  <span>*</span>
                </label>

                <div className="subadmin-form-password-wrapper">
                  <FaLock className="subadmin-form-input-icon" />

                  <input
                    id="resetPassword"
                    type={showResetPassword ? "text" : "password"}
                    value={resetPassword}
                    onChange={(e) => {
                      setResetPassword(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="subadmin-form-password-toggle"
                    onClick={() =>
                      setShowResetPassword((previous) => !previous)
                    }
                    aria-label={
                      showResetPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showResetPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <small>Minimum 6 characters.</small>
              </div>

              {/* RESET BUTTON */}

              <button
                type="button"
                className="subadmin-form-reset-btn"
                onClick={handleResetPassword}
                disabled={resettingPassword}
              >
                {resettingPassword ? (
                  <>
                    <FaSyncAlt className="subadmin-form-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          LOGIN INFORMATION
      =================================================== */}

      <div className="subadmin-form-login-info">
        <FaShieldAlt />

        <div>
          <strong>Sub Admin Login Policy</strong>

          <p>
            Sub Admin login uses only
            <strong> Email + Password</strong>. No login OTP is required.
          </p>

          <p>
            If a Sub Admin forgets the password, the administrator can reset it
            from this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubAdminForm;
