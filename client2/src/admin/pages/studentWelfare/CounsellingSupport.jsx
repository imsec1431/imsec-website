import { useEffect, useState } from "react";

import {
  FaSave,
  FaUndo,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import counsellingSupportAdminService from "../../services/counsellingSupportAdminService";

import "./counsellingSupport.css";

const DEFAULT_DATA = {
  title: "Counselling Support",

  heading: "Student Counselling Support",

  description:
    "The institute provides counselling support to help students address academic, personal and career-related concerns.",

  counsellorName: "Student Counsellor",

  designation: "Student Counsellor",

  email: "",

  phone: "",

  published: true,
};

const CounsellingSupport = () => {
  const [formData, setFormData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await counsellingSupportAdminService.getCounsellingSupportAdmin();

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to load counselling support information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!formData.title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!formData.heading.trim()) {
        setError("Heading is required.");
        return;
      }

      if (!formData.description.trim()) {
        setError("Description is required.");
        return;
      }

      const response =
        await counsellingSupportAdminService.updateCounsellingSupport(formData);

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });

      setMessage("Counselling Support updated successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to update counselling support.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset Counselling Support to default data?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response =
        await counsellingSupportAdminService.resetCounsellingSupport();

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });

      setMessage("Counselling Support reset successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset counselling support.");
    } finally {
      setResetting(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="counselling-admin-loading">
        Loading Counselling Support...
      </div>
    );
  }

  return (
    <div className="container-fluid counselling-admin-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="counselling-admin-header">
        <div>
          <div className="counselling-admin-title">
            <FaUserGraduate />

            <div>
              <h2>Counselling Support</h2>

              <p>Manage student counselling support information</p>
            </div>
          </div>
        </div>

        <div className="counselling-admin-actions">
          <button
            type="button"
            className="counselling-reset-btn"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="submit"
            form="counselling-support-form"
            className="counselling-save-btn"
            disabled={saving || resetting}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && <div className="counselling-success-message">{message}</div>}

      {error && <div className="counselling-error-message">{error}</div>}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form id="counselling-support-form" onSubmit={handleSave}>
        {/* ===================================================
            PAGE INFORMATION
        =================================================== */}

        <div className="counselling-admin-card">
          <div className="counselling-card-header">
            <div>
              <span>PAGE INFORMATION</span>
              <h3>Counselling Support Content</h3>
            </div>
          </div>

          <div className="counselling-form-grid">
            <div className="counselling-form-group">
              <label>
                Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
              />
            </div>

            <div className="counselling-form-group">
              <label>
                Heading <span>*</span>
              </label>

              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="Enter heading"
              />
            </div>

            <div className="counselling-form-group counselling-full-width">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Enter counselling support description"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            COUNSELLOR INFORMATION
        =================================================== */}

        <div className="counselling-admin-card">
          <div className="counselling-card-header">
            <div>
              <span>CONTACT INFORMATION</span>
              <h3>Counsellor Details</h3>
            </div>
          </div>

          <div className="counselling-form-grid">
            <div className="counselling-form-group">
              <label>Counsellor Name</label>

              <input
                type="text"
                name="counsellorName"
                value={formData.counsellorName}
                onChange={handleChange}
                placeholder="Enter counsellor name"
              />
            </div>

            <div className="counselling-form-group">
              <label>Designation</label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter designation"
              />
            </div>

            <div className="counselling-form-group">
              <label>
                <FaEnvelope />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="counselling-form-group">
              <label>
                <FaPhone />
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            PUBLISH
        =================================================== */}

        <div className="counselling-admin-card">
          <div className="counselling-publish-row">
            <div>
              <h4>Publish Counselling Support</h4>

              <p>
                Enable this option to display the counselling support
                information on the public website.
              </p>
            </div>

            <label className="counselling-switch">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />

              <span></span>
            </label>
          </div>
        </div>

        {/* ===================================================
            BOTTOM SAVE
        =================================================== */}

        <div className="counselling-bottom-actions">
          <button
            type="button"
            className="counselling-reset-btn"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="submit"
            className="counselling-save-btn"
            disabled={saving || resetting}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CounsellingSupport;
