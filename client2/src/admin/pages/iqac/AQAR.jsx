import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaSave,
  FaUndo,
  FaEye,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";

import aqarAdminService from "../../services/aqarAdminService";
import "./aqar.css";

const AQAR = () => {
  const [formData, setFormData] = useState({
    title: "AQAR",
    pdfUrl: "",
    published: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAQAR = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await aqarAdminService.getAQARAdmin();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setFormData({
          title: data.title || "AQAR",
          pdfUrl: data.pdfUrl || "",
          published: data.published !== undefined ? data.published : true,
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to load AQAR information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAQAR();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await aqarAdminService.updateAQAR(formData);

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setFormData({
          title: data.title || "AQAR",
          pdfUrl: data.pdfUrl || "",
          published: data.published !== undefined ? data.published : true,
        });
      }

      setMessage("AQAR updated successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to update AQAR information.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset AQAR to default values?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await aqarAdminService.resetAQAR();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setFormData({
          title: data.title || "AQAR",
          pdfUrl: data.pdfUrl || "",
          published: data.published !== undefined ? data.published : true,
        });
      }

      setMessage("AQAR reset successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset AQAR.");
    } finally {
      setResetting(false);
    }
  };

  const hasPdf = formData.pdfUrl && formData.pdfUrl.trim().length > 0;

  if (loading) {
    return (
      <div className="aqar-admin-page">
        <div className="aqar-loading">Loading AQAR...</div>
      </div>
    );
  }

  return (
    <div className="aqar-admin-page">
      <div className="aqar-admin-header">
        <div>
          <div className="aqar-admin-icon">
            <FaFilePdf />
          </div>

          <div>
            <h1>AQAR</h1>
            <p>Manage Annual Quality Assurance Report</p>
          </div>
        </div>

        <button
          type="button"
          className="aqar-reset-btn"
          onClick={handleReset}
          disabled={resetting}
        >
          <FaUndo />
          {resetting ? "Resetting..." : "Reset Defaults"}
        </button>
      </div>

      {message && (
        <div className="aqar-success-message">
          <FaCheckCircle />
          {message}
        </div>
      )}

      {error && <div className="aqar-error-message">{error}</div>}

      <form className="aqar-admin-card" onSubmit={handleSave}>
        <div className="aqar-card-heading">
          <div>
            <h2>AQAR Information</h2>
            <p>
              Update the title and PDF document displayed on the public website.
            </p>
          </div>
        </div>

        <div className="aqar-form-grid">
          <div className="aqar-form-group">
            <label htmlFor="title">
              Title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter AQAR title"
            />
          </div>

          <div className="aqar-form-group aqar-full-width">
            <label htmlFor="pdfUrl">PDF URL</label>

            <div className="aqar-url-input">
              <FaFilePdf />

              <input
                id="pdfUrl"
                name="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://example.com/aqar.pdf"
              />
            </div>

            <small>
              Enter the complete URL of the AQAR PDF. No file upload is
              required.
            </small>
          </div>

          <div className="aqar-publish-row">
            <label className="aqar-switch">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />

              <span className="aqar-slider"></span>
            </label>

            <div>
              <strong>Publish AQAR</strong>
              <p>Show this document on the public website.</p>
            </div>
          </div>
        </div>

        {hasPdf && (
          <div className="aqar-preview-box">
            <div className="aqar-preview-icon">
              <FaFilePdf />
            </div>

            <div className="aqar-preview-content">
              <h3>{formData.title}</h3>

              <p>PDF document is configured and ready to display.</p>

              <div className="aqar-preview-actions">
                <a
                  href={formData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aqar-view-btn"
                >
                  <FaEye />
                  View PDF
                </a>

                <a
                  href={formData.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aqar-download-btn"
                >
                  <FaDownload />
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="aqar-form-footer">
          <button type="submit" className="aqar-save-btn" disabled={saving}>
            <FaSave />

            {saving ? "Saving..." : "Save AQAR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AQAR;
