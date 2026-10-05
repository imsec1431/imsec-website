import React, { useEffect, useState } from "react";

import {
  getAdminConvocations,
  createConvocation,
  updateConvocation,
  publishConvocation,
  unpublishConvocation,
  deleteConvocation,
} from "../../../services/convocationAdminService";

const initialForm = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  pdfLink: "",

  socialMedia: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    x: "",
  },

  isPublished: false,
  displayOrder: 0,
};

const Convocation = () => {
  const [convocations, setConvocations] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Fetch
  // ==========================================
  const fetchConvocations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminConvocations();

      setConvocations(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch convocations:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load convocations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocations();
  }, []);

  // ==========================================
  // Form Change
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // Social Media Change
  // ==========================================
  const handleSocialMediaChange = (platform, value) => {
    setForm((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        year: Number(form.year),
        displayOrder: Number(form.displayOrder || 0),
      };

      if (editingId) {
        await updateConvocation(editingId, payload);

        setSuccess("Convocation updated successfully.");
      } else {
        await createConvocation(payload);

        setSuccess("Convocation created successfully.");
      }

      resetForm();
      await fetchConvocations();
    } catch (err) {
      console.error("Save convocation error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save convocation.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Edit
  // ==========================================
  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      year: item.year || new Date().getFullYear(),
      pdfLink: item.pdfLink || "",

      socialMedia: {
        facebook: item.socialMedia?.facebook || "",
        instagram: item.socialMedia?.instagram || "",
        youtube: item.socialMedia?.youtube || "",
        linkedin: item.socialMedia?.linkedin || "",
        x: item.socialMedia?.x || "",
      },

      isPublished: Boolean(item.isPublished),

      displayOrder: item.displayOrder ?? 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Reset
  // ==========================================
  const resetForm = () => {
    setForm({
      ...initialForm,
      socialMedia: {
        ...initialForm.socialMedia,
      },
    });

    setEditingId(null);
  };

  // ==========================================
  // Publish / Unpublish
  // ==========================================
  const handlePublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await publishConvocation(id);

      setSuccess("Convocation published successfully.");

      await fetchConvocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish convocation.");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await unpublishConvocation(id);

      setSuccess("Convocation unpublished successfully.");

      await fetchConvocations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to unpublish convocation.",
      );
    }
  };

  // ==========================================
  // Delete
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this convocation?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteConvocation(id);

      setSuccess("Convocation deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchConvocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete convocation.");
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Convocation</h2>

          <p className="text-muted mb-0">
            Manage convocation information, photographs PDF and social media
            links.
          </p>
        </div>
      </div>

      {/* ====================================== */}
      {/* Alerts */}
      {/* ====================================== */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* ====================================== */}
      {/* Form */}
      {/* ====================================== */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editingId ? "Edit Convocation" : "Add Convocation"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Title <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter convocation title"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Description <span className="text-danger">*</span>
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter convocation description"
                required
              />
            </div>

            <div className="row">
              {/* Year */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  Year <span className="text-danger">*</span>
                </label>

                <input
                  type="number"
                  name="year"
                  className="form-control"
                  value={form.year}
                  onChange={handleChange}
                  min="1900"
                  max="2200"
                  required
                />
              </div>

              {/* Display Order */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Display Order</label>

                <input
                  type="number"
                  name="displayOrder"
                  className="form-control"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min="0"
                />

                <small className="text-muted">
                  Lower number = higher priority
                </small>
              </div>

              {/* Published */}
              <div className="col-md-4 mb-3 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    name="isPublished"
                    className="form-check-input"
                    id="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="isPublished"
                  >
                    Publish on Website
                  </label>
                </div>
              </div>
            </div>

            {/* PDF */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Photos PDF Link <span className="text-danger">*</span>
              </label>

              <input
                type="url"
                name="pdfLink"
                className="form-control"
                value={form.pdfLink}
                onChange={handleChange}
                placeholder="https://example.com/convocation-photos.pdf"
                required
              />

              <small className="text-muted">
                Enter the PDF URL containing the convocation photographs.
              </small>
            </div>

            {/* Social Media */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">
                Social Media Links
                <small className="text-muted ms-2">(Optional)</small>
              </h5>

              <div className="row">
                {/* Facebook */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Facebook</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.socialMedia.facebook}
                    onChange={(e) =>
                      handleSocialMediaChange("facebook", e.target.value)
                    }
                    placeholder="https://facebook.com/..."
                  />
                </div>

                {/* Instagram */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Instagram</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                  />
                </div>

                {/* YouTube */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">YouTube</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.socialMedia.youtube}
                    onChange={(e) =>
                      handleSocialMediaChange("youtube", e.target.value)
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>

                {/* LinkedIn */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">LinkedIn</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.socialMedia.linkedin}
                    onChange={(e) =>
                      handleSocialMediaChange("linkedin", e.target.value)
                    }
                    placeholder="https://linkedin.com/..."
                  />
                </div>

                {/* X */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">X</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.socialMedia.x}
                    onChange={(e) =>
                      handleSocialMediaChange("x", e.target.value)
                    }
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Convocation"
                    : "Add Convocation"}
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

      {/* ====================================== */}
      {/* List */}
      {/* ====================================== */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Convocation List</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : convocations.length === 0 ? (
            <div className="text-center text-muted py-5">
              No convocations found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Social Media</th>
                    <th>Status</th>
                    <th>PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {convocations.map((item) => (
                    <tr key={item._id}>
                      {/* Order */}
                      <td>
                        <strong>{item.displayOrder}</strong>
                      </td>

                      {/* Year */}
                      <td>
                        <span className="badge bg-secondary">{item.year}</span>
                      </td>

                      {/* Title */}
                      <td>
                        <strong>{item.title}</strong>

                        {item.description && (
                          <div
                            className="text-muted small mt-1"
                            style={{
                              maxWidth: "350px",
                            }}
                          >
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </div>
                        )}
                      </td>

                      {/* Social Media */}
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {item.socialMedia?.facebook && (
                            <span className="badge bg-primary">FB</span>
                          )}

                          {item.socialMedia?.instagram && (
                            <span className="badge bg-danger">IG</span>
                          )}

                          {item.socialMedia?.youtube && (
                            <span className="badge bg-danger">YT</span>
                          )}

                          {item.socialMedia?.linkedin && (
                            <span className="badge bg-primary">LI</span>
                          )}

                          {item.socialMedia?.x && (
                            <span className="badge bg-dark">X</span>
                          )}

                          {!item.socialMedia?.facebook &&
                            !item.socialMedia?.instagram &&
                            !item.socialMedia?.youtube &&
                            !item.socialMedia?.linkedin &&
                            !item.socialMedia?.x && (
                              <span className="text-muted small">None</span>
                            )}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {item.isPublished ? (
                          <span className="badge bg-success">Published</span>
                        ) : (
                          <span className="badge bg-secondary">
                            Unpublished
                          </span>
                        )}
                      </td>

                      {/* PDF */}
                      <td>
                        {item.pdfLink && (
                          <a
                            href={item.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-danger"
                          >
                            View PDF
                          </a>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          {item.isPublished ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleUnpublish(item._id)}
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handlePublish(item._id)}
                            >
                              Publish
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Convocation;
