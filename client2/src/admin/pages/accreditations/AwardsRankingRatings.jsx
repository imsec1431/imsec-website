import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUndo,
  FaUpload,
  FaCertificate,
  FaTrophy,
  FaStar,
  FaChartLine,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";

import {
  getAwardsRankingRatingsAdmin,
  updateAwardsRankingRatings,
  uploadRecognitionPhoto,
  deleteRecognitionPhoto,
  resetAwardsRankingRatings,
} from "../../services/awardsRankingRatingsAdminService";

import "./awardsRankingRatings.css";

const emptyRecord = {
  type: "award",
  title: "",
  photoUrl: "",
  photoPublicId: "",
  pdfUrl: "",
  isActive: true,
  order: 1,
};

const typeLabels = {
  award: "Award",
  ranking: "Ranking",
  rating: "Rating",
};

const getTypeIcon = (type) => {
  if (type === "ranking") {
    return <FaChartLine />;
  }

  if (type === "rating") {
    return <FaStar />;
  }

  return <FaTrophy />;
};

const AwardsRankingRatings = () => {
  const [data, setData] = useState({
    title: "Awards, Rankings & Ratings",
    description: "Awards, rankings and ratings received by the institution.",
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

      const response = await getAwardsRankingRatingsAdmin();

      const pageData = response?.data?.data || response?.data || response;

      if (pageData) {
        setData({
          title: pageData.title || "Awards, Rankings & Ratings",

          description: pageData.description || "",

          published: pageData.published !== false,

          records: Array.isArray(pageData.records) ? pageData.records : [],
        });
      }
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to load information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     PAGE CHANGE
     ========================================================= */

  const handlePageChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     ADD
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
     EDIT
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
     RECORD CHANGE
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

      const response = await uploadRecognitionPhoto(file);

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
        await deleteRecognitionPhoto(editingRecord.photoPublicId);
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
     SAVE RECORD TO STATE
     ========================================================= */

  const handleSaveRecord = () => {
    if (!editingRecord?.title?.trim()) {
      setError("Please enter a title.");

      return;
    }

    const record = {
      ...editingRecord,

      type: editingRecord.type || "award",

      title: editingRecord.title.trim(),

      photoUrl: editingRecord.photoUrl || "",

      photoPublicId: editingRecord.photoPublicId || "",

      pdfUrl: editingRecord.pdfUrl?.trim() || "",

      isActive: editingRecord.isActive !== false,

      order: Number(editingRecord.order) || 1,
    };

    const exists = data.records.some((item) => item._id === record._id);

    if (exists) {
      setData((prev) => ({
        ...prev,

        records: prev.records.map((item) =>
          item._id === record._id ? record : item,
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,

        records: [...prev.records, record],
      }));
    }

    setEditingRecord(null);
    setShowForm(false);
    setError("");

    setMessage("Record prepared. Click Save Changes to store it.");
  };

  /* =========================================================
     CANCEL
     ========================================================= */

  const handleCancel = () => {
    setEditingRecord(null);
    setShowForm(false);
    setError("");
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (record) => {
    const confirmed = window.confirm(`Delete "${record.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      if (record.photoPublicId) {
        try {
          await deleteRecognitionPhoto(record.photoPublicId);
        } catch (photoError) {
          console.warn("Photo deletion warning:", photoError);
        }
      }

      setData((prev) => ({
        ...prev,

        records: prev.records.filter((item) => item._id !== record._id),
      }));

      setMessage("Record deleted. Click Save Changes to persist the change.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to delete record.");
    }
  };

  /* =========================================================
     SAVE ALL
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

      const response = await updateAwardsRankingRatings(payload);

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

      setMessage("Awards, rankings and ratings saved successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to save information.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
     ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset Awards, Rankings & Ratings to model defaults?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await resetAwardsRankingRatings();

      const resetData = response?.data?.data || response?.data || response;

      if (resetData) {
        setData({
          title: resetData.title || "Awards, Rankings & Ratings",

          description: resetData.description || "",

          published: resetData.published !== false,

          records: Array.isArray(resetData.records) ? resetData.records : [],
        });
      }

      setEditingRecord(null);
      setShowForm(false);

      setMessage("Information reset to defaults.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset defaults.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SORT
     ========================================================= */

  const sortedRecords = [...data.records].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
  );

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="arr-admin-page">
        <div className="arr-loading">Loading Awards, Rankings & Ratings...</div>
      </div>
    );
  }

  return (
    <div className="arr-admin-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="arr-header">
        <div>
          <span className="arr-kicker">ACCREDITATIONS / RECOGNITION</span>

          <h1>Awards, Rankings & Ratings</h1>

          <p>Manage awards, rankings and ratings from one place.</p>
        </div>

        <div className="arr-header-actions">
          <button
            type="button"
            className="arr-btn secondary"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo />
            Reset Defaults
          </button>

          <button
            type="button"
            className="arr-btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGE
          ===================================================== */}

      {message && <div className="arr-message success">{message}</div>}

      {error && <div className="arr-message error">{error}</div>}

      {/* =====================================================
          PAGE SETTINGS
          ===================================================== */}

      <section className="arr-section">
        <div className="arr-section-header">
          <div>
            <span>PAGE SETTINGS</span>

            <h2>Recognition Page</h2>
          </div>

          <label className="arr-publish-switch">
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) => handlePageChange("published", e.target.checked)}
            />

            <span className="arr-switch">
              <span />
            </span>

            <strong>Published</strong>
          </label>
        </div>

        <div className="arr-page-fields">
          <div className="arr-field">
            <label>Page Title</label>

            <input
              type="text"
              value={data.title}
              onChange={(e) => handlePageChange("title", e.target.value)}
            />
          </div>

          <div className="arr-field">
            <label>Page Description</label>

            <textarea
              rows="3"
              value={data.description}
              onChange={(e) => handlePageChange("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          RECORDS
          ===================================================== */}

      <section className="arr-section">
        <div className="arr-section-header">
          <div>
            <span>RECORDS</span>

            <h2>Awards, Rankings & Ratings</h2>
          </div>

          <button type="button" className="arr-btn primary" onClick={handleAdd}>
            <FaPlus />
            Add Record
          </button>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="arr-empty">
            <FaCertificate />

            <h3>No records added</h3>

            <p>Add an award, ranking or rating to get started.</p>

            <button
              type="button"
              className="arr-btn primary"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Record
            </button>
          </div>
        ) : (
          <div className="arr-record-list">
            {sortedRecords.map((record, index) => (
              <div
                className="arr-record-card"
                key={record._id || `record-${index}`}
              >
                {/* PHOTO */}

                <div className="arr-record-photo">
                  {record.photoUrl ? (
                    <img src={record.photoUrl} alt={record.title} />
                  ) : (
                    <div className="arr-photo-placeholder">
                      {getTypeIcon(record.type)}
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="arr-record-content">
                  <div className="arr-record-top">
                    <div>
                      <span className={`arr-type-badge ${record.type}`}>
                        {getTypeIcon(record.type)}

                        {typeLabels[record.type]}
                      </span>

                      <h3>{record.title}</h3>
                    </div>

                    <span
                      className={
                        record.isActive
                          ? "arr-status active"
                          : "arr-status inactive"
                      }
                    >
                      {record.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="arr-record-meta">
                    Display Order: {record.order || index + 1}
                  </div>

                  {record.pdfUrl && (
                    <a
                      href={record.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arr-pdf-link"
                    >
                      <FaFilePdf />
                      View PDF
                    </a>
                  )}

                  <div className="arr-record-actions">
                    <button
                      type="button"
                      className="arr-action edit"
                      onClick={() => handleEdit(record)}
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="arr-action delete"
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
        <div className="arr-editor-overlay">
          <div className="arr-editor">
            {/* HEADER */}

            <div className="arr-editor-header">
              <div>
                <span>{editingRecord._id ? "EDIT RECORD" : "NEW RECORD"}</span>

                <h2>{editingRecord._id ? "Edit Record" : "Add Record"}</h2>
              </div>

              <button
                type="button"
                className="arr-close"
                onClick={handleCancel}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="arr-editor-body">
              {/* TYPE */}

              <div className="arr-field">
                <label>Type *</label>

                <select
                  value={editingRecord.type}
                  onChange={(e) => handleRecordChange("type", e.target.value)}
                >
                  <option value="award">Award</option>

                  <option value="ranking">Ranking</option>

                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* TITLE */}

              <div className="arr-field">
                <label>Title *</label>

                <input
                  type="text"
                  value={editingRecord.title}
                  onChange={(e) => handleRecordChange("title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              {/* PHOTO */}

              <div className="arr-field">
                <label>Photo</label>

                <div className="arr-upload">
                  {editingRecord.photoUrl ? (
                    <div className="arr-upload-preview">
                      <img src={editingRecord.photoUrl} alt="Recognition" />

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
                    <label className="arr-upload-label">
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

              {/* PDF */}

              <div className="arr-field">
                <label>PDF URL</label>

                <input
                  type="url"
                  value={editingRecord.pdfUrl}
                  onChange={(e) => handleRecordChange("pdfUrl", e.target.value)}
                  placeholder="https://drive.google.com/..."
                />

                <small>Paste the PDF or Google Drive URL.</small>
              </div>

              {/* ORDER + STATUS */}

              <div className="arr-two-fields">
                <div className="arr-field">
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

                <div className="arr-field">
                  <label>Status</label>

                  <label className="arr-active-checkbox">
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
            </div>

            {/* FOOTER */}

            <div className="arr-editor-footer">
              <button
                type="button"
                className="arr-btn secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="button"
                className="arr-btn primary"
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

export default AwardsRankingRatings;
