import { useEffect, useState } from "react";

import {
  FaSave,
  FaUndo,
  FaHeartbeat,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import medicalSupportAdminService from "../../services/medicalSupportAdminService";

import "./medicalSupport.css";

const DEFAULT_DATA = {
  title: "Medical Support",

  heading: "Student Medical Support",

  description:
    "The institute provides medical support and basic healthcare facilities to students and staff to promote their health, safety and overall well-being.",

  supportPersonName: "Campus Health Support Team",

  designation: "Medical Support Services",

  email: "medicalsupport@imsec.ac.in",

  phone: "+91-120-4081999",

  medicalFacility:
    "The institute provides basic medical assistance, first-aid facilities and necessary health support on campus. Students and staff can contact the designated support team whenever medical assistance is required.",

  published: true,
};

const MedicalSupport = () => {
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
        await medicalSupportAdminService.getMedicalSupportAdmin();

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to load medical support information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     HANDLE CHANGE
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

      if (!formData.supportPersonName.trim()) {
        setError("Support Person Name is required.");
        return;
      }

      if (!formData.designation.trim()) {
        setError("Designation is required.");
        return;
      }

      if (!formData.email.trim()) {
        setError("Email is required.");
        return;
      }

      if (!formData.phone.trim()) {
        setError("Phone is required.");
        return;
      }

      if (!formData.medicalFacility.trim()) {
        setError("Medical Facility information is required.");
        return;
      }

      const response =
        await medicalSupportAdminService.updateMedicalSupport(formData);

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });

      setMessage("Medical Support updated successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to update medical support.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset Medical Support to default data?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await medicalSupportAdminService.resetMedicalSupport();

      const data = response?.data?.data || response?.data || response;

      setFormData({
        ...DEFAULT_DATA,
        ...(data || {}),
      });

      setMessage("Medical Support reset successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset medical support.");
    } finally {
      setResetting(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="medical-admin-loading">Loading Medical Support...</div>
    );
  }

  return (
    <div className="container-fluid medical-admin-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="medical-admin-header">
        <div className="medical-admin-title">
          <FaHeartbeat />

          <div>
            <h2>Medical Support</h2>

            <p>Manage student medical support information</p>
          </div>
        </div>

        <div className="medical-admin-actions">
          <button
            type="button"
            className="medical-reset-btn"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="submit"
            form="medical-support-form"
            className="medical-save-btn"
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

      {message && <div className="medical-success-message">{message}</div>}

      {error && <div className="medical-error-message">{error}</div>}

      <form id="medical-support-form" onSubmit={handleSave}>
        {/* ===================================================
            PAGE INFORMATION
        =================================================== */}

        <div className="medical-admin-card">
          <div className="medical-card-header">
            <div>
              <span>PAGE INFORMATION</span>

              <h3>Medical Support Content</h3>
            </div>
          </div>

          <div className="medical-form-grid">
            <div className="medical-form-group">
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

            <div className="medical-form-group">
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

            <div className="medical-form-group medical-full-width">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Enter medical support description"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            SUPPORT CONTACT
        =================================================== */}

        <div className="medical-admin-card">
          <div className="medical-card-header">
            <div>
              <span>CONTACT INFORMATION</span>

              <h3>Support Details</h3>
            </div>
          </div>

          <div className="medical-form-grid">
            <div className="medical-form-group">
              <label>
                Support Person Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="supportPersonName"
                value={formData.supportPersonName}
                onChange={handleChange}
                placeholder="Enter support person name"
              />
            </div>

            <div className="medical-form-group">
              <label>
                Designation
                <span>*</span>
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter designation"
              />
            </div>

            <div className="medical-form-group">
              <label>
                <FaEnvelope />
                Email
                <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="medical-form-group">
              <label>
                <FaPhone />
                Phone
                <span>*</span>
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
            MEDICAL FACILITY
        =================================================== */}

        <div className="medical-admin-card">
          <div className="medical-card-header">
            <div>
              <span>FACILITY INFORMATION</span>

              <h3>Medical Facility</h3>
            </div>
          </div>

          <div className="medical-form-grid">
            <div className="medical-form-group medical-full-width">
              <label>
                Medical Facility Information
                <span>*</span>
              </label>

              <textarea
                name="medicalFacility"
                value={formData.medicalFacility}
                onChange={handleChange}
                rows="6"
                placeholder="Enter medical facility information"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            PUBLISH
        =================================================== */}

        <div className="medical-admin-card">
          <div className="medical-publish-row">
            <div>
              <h4>Publish Medical Support</h4>

              <p>
                Enable this option to display medical support information on the
                public website.
              </p>
            </div>

            <label className="medical-switch">
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
            BOTTOM ACTIONS
        =================================================== */}

        <div className="medical-bottom-actions">
          <button
            type="button"
            className="medical-reset-btn"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="submit"
            className="medical-save-btn"
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

export default MedicalSupport;
