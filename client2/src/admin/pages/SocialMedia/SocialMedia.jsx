import React, { useEffect, useState } from "react";

import {
  getAdminSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  activateSocialMedia,
  deactivateSocialMedia,
  deleteSocialMedia,
} from "../../services/socialMediaAdminService";

const PLATFORMS = ["Facebook", "LinkedIn", "Instagram", "X", "YouTube"];

const SocialMedia = () => {
  const [socialMedia, setSocialMedia] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    platform: "Facebook",
    url: "",
    isActive: true,
    displayOrder: 0,
  });

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadSocialMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminSocialMedia();

      setSocialMedia(response?.data || []);
    } catch (err) {
      console.error("Load social media error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load social media links.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocialMedia();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      platform: "Facebook",
      url: "",
      isActive: true,
      displayOrder: 0,
    });

    setEditingId(null);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      platform: item.platform || "Facebook",
      url: item.url || "",
      isActive: item.isActive === true || item.isActive === "true",
      displayOrder: item.displayOrder || 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.url.trim()) {
      setError("Please enter the social media URL.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        platform: formData.platform,
        url: formData.url.trim(),
        isActive: formData.isActive,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editingId) {
        await updateSocialMedia(editingId, payload);

        setSuccess("Social media link updated successfully.");
      } else {
        await createSocialMedia(payload);

        setSuccess("Social media link added successfully.");
      }

      resetForm();

      await loadSocialMedia();
    } catch (err) {
      console.error("Save social media error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to save social media link.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ACTIVATE / DEACTIVATE
  // =========================================================

  const handleToggle = async (item) => {
    try {
      setError("");
      setSuccess("");

      if (item.isActive) {
        await deactivateSocialMedia(item._id);

        setSuccess(`${item.platform} has been deactivated.`);
      } else {
        await activateSocialMedia(item._id);

        setSuccess(`${item.platform} has been activated.`);
      }

      await loadSocialMedia();
    } catch (err) {
      console.error("Toggle social media error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to change status.",
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${item.platform} link?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSocialMedia(item._id);

      setSuccess(`${item.platform} link deleted successfully.`);

      if (editingId === item._id) {
        resetForm();
      }

      await loadSocialMedia();
    } catch (err) {
      console.error("Delete social media error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to delete social media link.",
      );
    }
  };

  // =========================================================
  // PLATFORM ICON
  // =========================================================

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Facebook":
        return "ⓕ";

      case "LinkedIn":
        return "in";

      case "Instagram":
        return "◎";

      case "X":
        return "𝕏";

      case "YouTube":
        return "▶";

      default:
        return "●";
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2
            className="fw-bold mb-1"
            style={{
              color: "#0A2E5C",
            }}
          >
            Social Media Management
          </h2>

          <p className="text-muted mb-0">
            Manage social media links displayed on the public website.
          </p>
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}

          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}

          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      <div className="row g-4">
        {/* ===================================================
            FORM
        =================================================== */}

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header text-white fw-bold"
              style={{
                background: "#0A2E5C",
              }}
            >
              {editingId ? "Edit Social Media" : "Add Social Media"}
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* PLATFORM */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Platform</label>

                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="form-select"
                    disabled={!!editingId}
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>

                  {editingId && (
                    <small className="text-muted">
                      Platform cannot be changed while editing.
                    </small>
                  )}
                </div>

                {/* URL */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Social Media URL
                  </label>

                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://..."
                    required
                  />

                  <small className="text-muted">
                    Enter the complete social media profile URL.
                  </small>
                </div>

                {/* DISPLAY ORDER */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                  />

                  <small className="text-muted">
                    Lower numbers appear first.
                  </small>
                </div>

                {/* ACTIVE */}

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    id="socialActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="socialActive"
                  >
                    Active / Show on Website
                  </label>
                </div>

                {/* BUTTONS */}

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn text-white flex-grow-1"
                    style={{
                      background: "#0A2E5C",
                    }}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Link"
                        : "Add Link"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ===================================================
            LIST
        =================================================== */}

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Social Media Links</h5>

                <span className="badge bg-secondary">
                  {socialMedia.length} Platform
                  {socialMedia.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" />

                  <div className="mt-2 text-muted">Loading social media...</div>
                </div>
              ) : socialMedia.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    style={{
                      fontSize: "45px",
                    }}
                  >
                    🌐
                  </div>

                  <h5 className="mt-3">No Social Media Links</h5>

                  <p className="text-muted">
                    Add your first social media link using the form.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead
                      style={{
                        background: "#f5f7fa",
                      }}
                    >
                      <tr>
                        <th>#</th>
                        <th>Platform</th>
                        <th>URL</th>
                        <th>Status</th>
                        <th
                          className="text-center"
                          style={{
                            minWidth: "260px",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {socialMedia.map((item, index) => {
                        const isActive =
                          item.isActive === true || item.isActive === "true";

                        return (
                          <tr key={item._id}>
                            <td>{index + 1}</td>

                            {/* PLATFORM */}

                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    background: "#0A2E5C",
                                    color: "#fff",
                                    fontWeight: "700",
                                  }}
                                >
                                  {getPlatformIcon(item.platform)}
                                </span>

                                <strong>{item.platform}</strong>
                              </div>
                            </td>

                            {/* URL */}

                            <td>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                style={{
                                  maxWidth: "300px",
                                  display: "inline-block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={item.url}
                              >
                                {item.url}
                              </a>
                            </td>

                            {/* STATUS */}

                            <td>
                              {isActive ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary">
                                  Inactive
                                </span>
                              )}
                            </td>

                            {/* ACTIONS */}

                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    isActive ? "btn-warning" : "btn-success"
                                  }`}
                                  onClick={() => handleToggle(item)}
                                >
                                  {isActive ? "Deactivate" : "Activate"}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(item)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
