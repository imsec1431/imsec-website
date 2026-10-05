import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUndo,
  FaEye,
  FaExternalLinkAlt,
  FaCertificate,
  FaUpload,
  FaTimes,
} from "react-icons/fa";

import {
  getAccreditationsAdmin,
  updateAccreditations,
  uploadAccreditationPhoto,
  deleteAccreditationPhoto,
  resetAccreditations,
} from "../../services/accreditationsAdminService";

import "./accreditationsPage.css";

const emptyRecord = {
  title: "",
  description: "",
  accreditationBody: "",
  validity: "",
  photoUrl: "",
  photoPublicId: "",
  linkUrl: "",
  certificateUrl: "",
  isActive: true,
  order: 1,
};

const Accreditations = () => {
  const [data, setData] = useState({
    title: "Accreditations",
    description: "Institutional accreditations and recognitions of IMSEC.",
    published: true,
    records: [],
  });

  const [editingRecord, setEditingRecord] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
     ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccreditationsAdmin();

      const pageData = response?.data?.data || response?.data || response;

      if (pageData) {
        setData({
          title: pageData.title || "Accreditations",

          description: pageData.description || "",

          published: pageData.published !== false,

          records: Array.isArray(pageData.records) ? pageData.records : [],
        });
      }
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to load accreditations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     PAGE FIELD CHANGE
     ========================================================= */

  const handlePageChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     OPEN ADD FORM
     ========================================================= */

  const handleAdd = () => {
    setEditingRecord({
      ...emptyRecord,
      order: data.records.length + 1,
    });

    setShowForm(true);
    setMessage("");
    setError("");
  };

  /* =========================================================
     OPEN EDIT FORM
     ========================================================= */

  const handleEdit = (record) => {
    setEditingRecord({
      ...record,
    });

    setShowForm(true);
    setMessage("");
    setError("");
  };

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleRecordChange = (field, value) => {
    setEditingRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     PHOTO UPLOAD
     ========================================================= */

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const response = await uploadAccreditationPhoto(file);

      const uploaded = response?.data?.data || response?.data || response;

      if (!uploaded?.photoUrl) {
        throw new Error("Photo upload failed.");
      }

      setEditingRecord((prev) => ({
        ...prev,

        photoUrl: uploaded.photoUrl,

        photoPublicId: uploaded.photoPublicId || "",
      }));

      setMessage("Photo uploaded successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to upload photo.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* =========================================================
     REMOVE PHOTO
     ========================================================= */

  const handleRemovePhoto = async () => {
    if (!editingRecord?.photoUrl) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      if (editingRecord.photoPublicId) {
        await deleteAccreditationPhoto(editingRecord.photoPublicId);
      }

      setEditingRecord((prev) => ({
        ...prev,
        photoUrl: "",
        photoPublicId: "",
      }));

      setMessage("Photo removed successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to remove photo.");
    } finally {
      setUploading(false);
    }
  };

  /* =========================================================
     SAVE RECORD TO LOCAL STATE
     ========================================================= */

  const handleSaveRecord = () => {
    if (!editingRecord?.title?.trim()) {
      setError("Please enter accreditation title/name.");

      return;
    }

    const record = {
      ...editingRecord,

      title: editingRecord.title.trim(),

      description: editingRecord.description?.trim() || "",

      accreditationBody: editingRecord.accreditationBody?.trim() || "",

      validity: editingRecord.validity?.trim() || "",

      linkUrl: editingRecord.linkUrl?.trim() || "",

      certificateUrl: editingRecord.certificateUrl?.trim() || "",

      order: Number(editingRecord.order) || 1,

      isActive: editingRecord.isActive !== false,
    };

    setData((prev) => {
      const exists = prev.records.some((item) => item._id === record._id);

      if (exists) {
        return {
          ...prev,
          records: prev.records.map((item) =>
            item._id === record._id ? record : item,
          ),
        };
      }

      return {
        ...prev,
        records: [...prev.records, record],
      };
    });

    setEditingRecord(null);
    setShowForm(false);

    setMessage("Record added to the page. Click Save Changes to persist it.");

    setError("");
  };

  /* =========================================================
     CANCEL FORM
     ========================================================= */

  const handleCancel = () => {
    setEditingRecord(null);
    setShowForm(false);
    setError("");
  };

  /* =========================================================
     DELETE RECORD
     ========================================================= */

  const handleDelete = async (record) => {
    const confirmed = window.confirm(`Delete "${record.title}"?`);

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      if (record.photoPublicId) {
        try {
          await deleteAccreditationPhoto(record.photoPublicId);
        } catch (photoError) {
          console.warn("Photo deletion warning:", photoError);
        }
      }

      setData((prev) => ({
        ...prev,

        records: prev.records.filter((item) => item._id !== record._id),
      }));

      setMessage("Record deleted. Click Save Changes to persist it.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to delete record.");
    }
  };

  /* =========================================================
     SAVE EVERYTHING
     ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: data.title,
        description: data.description,
        published: data.published,

        records: data.records.map((record, index) => ({
          ...record,
          order: Number(record.order) || index + 1,
        })),
      };

      const response = await updateAccreditations(payload);

      const updated = response?.data?.data || response?.data || response;

      if (updated) {
        setData({
          title: updated.title || payload.title,

          description: updated.description || payload.description,

          published: updated.published !== false,

          records: Array.isArray(updated.records)
            ? updated.records
            : payload.records,
        });
      }

      setMessage("Accreditations saved successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to save accreditations.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET DEFAULTS
     ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset Accreditations to model defaults? This will remove your current records.",
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await resetAccreditations();

      const resetData = response?.data?.data || response?.data || response;

      if (resetData) {
        setData({
          title: resetData.title || "Accreditations",

          description: resetData.description || "",

          published: resetData.published !== false,

          records: Array.isArray(resetData.records) ? resetData.records : [],
        });
      }

      setEditingRecord(null);
      setShowForm(false);

      setMessage("Accreditations reset to defaults.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset defaults.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SORT RECORDS
     ========================================================= */

  const sortedRecords = [...data.records].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
  );

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="accreditations-admin-page">
        <div className="accreditations-loading">Loading Accreditations...</div>
      </div>
    );
  }

  return (
    <div className="accreditations-admin-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="accreditations-admin-header">
        <div>
          <div className="accreditations-admin-kicker">
            COE / ACCREDITATIONS
          </div>

          <h1>Accreditations</h1>

          <p>
            Manage institutional accreditation information, photographs, links
            and certificates.
          </p>
        </div>

        <div className="accreditations-header-actions">
          <button
            type="button"
            className="accreditations-btn secondary"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo />
            Reset Defaults
          </button>

          <button
            type="button"
            className="accreditations-btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && (
        <div className="accreditations-message success">{message}</div>
      )}

      {error && <div className="accreditations-message error">{error}</div>}

      {/* =====================================================
          PAGE SETTINGS
      ===================================================== */}

      <section className="accreditations-admin-section">
        <div className="accreditations-section-heading">
          <div>
            <span>PAGE SETTINGS</span>

            <h2>Accreditations Page</h2>
          </div>

          <label className="accreditations-switch-row">
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) => handlePageChange("published", e.target.checked)}
            />

            <span className="accreditations-switch">
              <span />
            </span>

            <strong>Published</strong>
          </label>
        </div>

        <div className="accreditations-form-grid">
          <div className="accreditations-field full">
            <label>Page Title</label>

            <input
              type="text"
              value={data.title}
              onChange={(e) => handlePageChange("title", e.target.value)}
              placeholder="Accreditations"
            />
          </div>

          <div className="accreditations-field full">
            <label>Page Description</label>

            <textarea
              rows="4"
              value={data.description}
              onChange={(e) => handlePageChange("description", e.target.value)}
              placeholder="Enter page description..."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          RECORDS
      ===================================================== */}

      <section className="accreditations-admin-section">
        <div className="accreditations-section-heading">
          <div>
            <span>ACCREDITATION RECORDS</span>

            <h2>Manage Accreditations</h2>
          </div>

          <button
            type="button"
            className="accreditations-btn primary"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Accreditation
          </button>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="accreditations-empty">
            <FaCertificate />

            <h3>No accreditations added</h3>

            <p>Add your first accreditation record using the button above.</p>

            <button
              type="button"
              className="accreditations-btn primary"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Accreditation
            </button>
          </div>
        ) : (
          <div className="accreditations-record-list">
            {sortedRecords.map((record, index) => (
              <div
                className="accreditation-record-card"
                key={record._id || `record-${index}`}
              >
                <div className="accreditation-record-photo">
                  {record.photoUrl ? (
                    <img src={record.photoUrl} alt={record.title} />
                  ) : (
                    <div className="accreditation-photo-placeholder">
                      <FaCertificate />
                    </div>
                  )}
                </div>

                <div className="accreditation-record-content">
                  <div className="accreditation-record-top">
                    <div>
                      <span className="accreditation-record-number">
                        #{record.order || index + 1}
                      </span>

                      <h3>{record.title}</h3>
                    </div>

                    <span
                      className={
                        record.isActive
                          ? "accreditation-status active"
                          : "accreditation-status inactive"
                      }
                    >
                      {record.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {record.accreditationBody && (
                    <p className="accreditation-body">
                      <strong>Body:</strong> {record.accreditationBody}
                    </p>
                  )}

                  {record.validity && (
                    <p className="accreditation-body">
                      <strong>Validity:</strong> {record.validity}
                    </p>
                  )}

                  {record.description && (
                    <p className="accreditation-description">
                      {record.description}
                    </p>
                  )}

                  <div className="accreditation-record-links">
                    {record.linkUrl && (
                      <a
                        href={record.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="accreditation-small-link"
                      >
                        <FaExternalLinkAlt />
                        View Link
                      </a>
                    )}

                    {record.certificateUrl && (
                      <a
                        href={record.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="accreditation-small-link certificate"
                      >
                        <FaCertificate />
                        Certificate
                      </a>
                    )}
                  </div>

                  <div className="accreditation-record-actions">
                    <button
                      type="button"
                      className="accreditations-action-btn edit"
                      onClick={() => handleEdit(record)}
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="accreditations-action-btn delete"
                      onClick={() => handleDelete(record)}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      {showForm && editingRecord && (
        <div className="accreditation-editor-overlay">
          <div className="accreditation-editor">
            <div className="accreditation-editor-header">
              <div>
                <span>{editingRecord._id ? "EDIT RECORD" : "NEW RECORD"}</span>

                <h2>
                  {editingRecord._id
                    ? "Edit Accreditation"
                    : "Add Accreditation"}
                </h2>
              </div>

              <button
                type="button"
                className="accreditation-close-btn"
                onClick={handleCancel}
              >
                <FaTimes />
              </button>
            </div>

            <div className="accreditation-editor-body">
              {/* TITLE */}

              <div className="accreditations-field full">
                <label>Title / Name *</label>

                <input
                  type="text"
                  value={editingRecord.title}
                  onChange={(e) => handleRecordChange("title", e.target.value)}
                  placeholder="e.g. NAAC Accreditation"
                />
              </div>

              {/* PHOTO */}

              <div className="accreditations-field full">
                <label>Accreditation Photo</label>

                <div className="accreditation-upload-box">
                  {editingRecord.photoUrl ? (
                    <div className="accreditation-upload-preview">
                      <img src={editingRecord.photoUrl} alt="Accreditation" />

                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploading}
                      >
                        <FaTrash />
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <label className="accreditation-upload-label">
                      <FaUpload />

                      <strong>
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </strong>

                      <span>JPG, JPEG, PNG or WEBP</span>

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* TWO COLUMNS */}

              <div className="accreditations-form-grid">
                <div className="accreditations-field">
                  <label>Accreditation Body</label>

                  <input
                    type="text"
                    value={editingRecord.accreditationBody}
                    onChange={(e) =>
                      handleRecordChange("accreditationBody", e.target.value)
                    }
                    placeholder="Enter accreditation body"
                  />
                </div>

                <div className="accreditations-field">
                  <label>Validity</label>

                  <input
                    type="text"
                    value={editingRecord.validity}
                    onChange={(e) =>
                      handleRecordChange("validity", e.target.value)
                    }
                    placeholder="e.g. 2024 - 2029"
                  />
                </div>

                <div className="accreditations-field">
                  <label>Display Order</label>

                  <input
                    type="number"
                    min="1"
                    value={editingRecord.order}
                    onChange={(e) =>
                      handleRecordChange("order", e.target.value)
                    }
                  />
                </div>

                <div className="accreditations-field">
                  <label>Status</label>

                  <label className="accreditation-checkbox">
                    <input
                      type="checkbox"
                      checked={editingRecord.isActive}
                      onChange={(e) =>
                        handleRecordChange("isActive", e.target.checked)
                      }
                    />

                    <span>Active</span>
                  </label>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="accreditations-field full">
                <label>Description</label>

                <textarea
                  rows="5"
                  value={editingRecord.description}
                  onChange={(e) =>
                    handleRecordChange("description", e.target.value)
                  }
                  placeholder="Enter accreditation description..."
                />
              </div>

              {/* LINK */}

              <div className="accreditations-field full">
                <label>Link URL</label>

                <input
                  type="url"
                  value={editingRecord.linkUrl}
                  onChange={(e) =>
                    handleRecordChange("linkUrl", e.target.value)
                  }
                  placeholder="https://drive.google.com/..."
                />

                <small>
                  Use this for the main accreditation details or Drive link.
                </small>
              </div>

              {/* CERTIFICATE */}

              <div className="accreditations-field full">
                <label>Certificate URL</label>

                <input
                  type="url"
                  value={editingRecord.certificateUrl}
                  onChange={(e) =>
                    handleRecordChange("certificateUrl", e.target.value)
                  }
                  placeholder="https://drive.google.com/..."
                />

                <small>
                  Paste the Drive or external URL containing the certificate.
                </small>
              </div>
            </div>

            {/* FOOTER */}

            <div className="accreditation-editor-footer">
              <button
                type="button"
                className="accreditations-btn secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="button"
                className="accreditations-btn primary"
                onClick={handleSaveRecord}
                disabled={uploading}
              >
                <FaSave />
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accreditations;
