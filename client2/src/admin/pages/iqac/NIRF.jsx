import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaRedo,
  FaFilePdf,
} from "react-icons/fa";

import nirfAdminService from "../../services/nirfAdminService";

import "./nirf.css";

const emptyRecord = {
  title: "",
  heading: "",
  pdfUrl: "",
  published: true,
  order: 1,
};

const NIRF = () => {
  const [data, setData] = useState({
    hero: {
      title: "NIRF",
      subtitle: "National Institutional Ranking Framework",
      breadcrumb: "Home / IQAC / NIRF",
    },
    records: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form, setForm] = useState(emptyRecord);

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadNIRF = async () => {
    try {
      setLoading(true);

      const response = await nirfAdminService.getNIRFAdmin();

      const pageData = response?.data || response;

      setData({
        hero: pageData?.hero || {
          title: "NIRF",
          subtitle: "National Institutional Ranking Framework",
          breadcrumb: "Home / IQAC / NIRF",
        },

        records: pageData?.records || [],
      });
    } catch (error) {
      console.error("Load NIRF Error:", error);

      alert(error?.message || "Unable to load NIRF data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNIRF();
  }, []);

  /* =====================================================
     HERO CHANGE
  ===================================================== */

  const handleHeroChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  /* =====================================================
     SAVE HERO
  ===================================================== */

  const saveHero = async () => {
    try {
      setSaving(true);

      await nirfAdminService.updateNIRF({
        hero: data.hero,
      });

      alert("NIRF page information updated successfully.");

      await loadNIRF();
    } catch (error) {
      console.error("Save NIRF Hero Error:", error);

      alert(error?.message || "Failed to update NIRF information.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     ADD
  ===================================================== */

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      ...emptyRecord,
      order: data.records.length + 1,
    });

    setShowModal(true);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const openEditModal = (record) => {
    setEditingId(record._id);

    setForm({
      title: record.title || "",
      heading: record.heading || "",
      pdfUrl: record.pdfUrl || "",
      published: record.published !== false,
      order: record.order || 1,
    });

    setShowModal(true);
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     SAVE RECORD
  ===================================================== */

  const saveRecord = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter title.");
      return;
    }

    if (!form.heading.trim()) {
      alert("Please enter heading.");
      return;
    }

    if (!form.pdfUrl.trim()) {
      alert("Please enter PDF link.");
      return;
    }

    try {
      setSaving(true);

      let records = [...data.records];

      const recordData = {
        ...form,
        title: form.title.trim(),
        heading: form.heading.trim(),
        pdfUrl: form.pdfUrl.trim(),
        order: Number(form.order) || 1,
      };

      if (editingId) {
        records = records.map((item) =>
          item._id === editingId
            ? {
                ...item,
                ...recordData,
              }
            : item,
        );
      } else {
        records.push(recordData);
      }

      await nirfAdminService.updateNIRF({
        records,
      });

      alert(
        editingId
          ? "NIRF record updated successfully."
          : "NIRF record added successfully.",
      );

      setShowModal(false);
      setEditingId(null);
      setForm(emptyRecord);

      await loadNIRF();
    } catch (error) {
      console.error("Save NIRF Record Error:", error);

      alert(error?.message || "Failed to save NIRF record.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     VIEW
  ===================================================== */

  const viewRecord = (record) => {
    setSelectedRecord(record);
    setViewModal(true);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteRecord = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this NIRF record?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await nirfAdminService.deleteNIRFRecord(id);

      alert("NIRF record deleted successfully.");

      await loadNIRF();
    } catch (error) {
      console.error("Delete NIRF Record Error:", error);

      alert(error?.message || "Failed to delete NIRF record.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     PUBLISH TOGGLE
  ===================================================== */

  const togglePublish = async (record) => {
    try {
      setSaving(true);

      const records = data.records.map((item) =>
        item._id === record._id
          ? {
              ...item,
              published: !item.published,
            }
          : item,
      );

      await nirfAdminService.updateNIRF({
        records,
      });

      await loadNIRF();
    } catch (error) {
      console.error("Toggle NIRF Status Error:", error);

      alert(error?.message || "Failed to update publish status.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetDefaults = async () => {
    const confirmed = window.confirm("Reset NIRF page to default data?");

    if (!confirmed) return;

    try {
      setSaving(true);

      await nirfAdminService.resetNIRF();

      alert("NIRF defaults restored successfully.");

      await loadNIRF();
    } catch (error) {
      console.error("Reset NIRF Error:", error);

      alert(error?.message || "Failed to reset NIRF.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <div className="nirf-loading">Loading NIRF...</div>;
  }

  return (
    <div className="container-fluid nirf-admin">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="nirf-page-header">
        <div>
          <h2>NIRF Management</h2>

          <p>Manage NIRF title, heading and PDF documents.</p>
        </div>

        <button
          type="button"
          className="nirf-reset-btn"
          onClick={resetDefaults}
          disabled={saving}
        >
          <FaRedo />
          Reset Defaults
        </button>
      </div>

      {/* =================================================
          PAGE INFORMATION
      ================================================= */}

      <div className="nirf-panel">
        <div className="nirf-panel-title">
          <h4>NIRF Page Information</h4>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Title</label>

            <input
              type="text"
              className="form-control"
              value={data.hero?.title || ""}
              onChange={(e) => handleHeroChange("title", e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Heading / Subtitle</label>

            <input
              type="text"
              className="form-control"
              value={data.hero?.subtitle || ""}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Breadcrumb</label>

            <input
              type="text"
              className="form-control"
              value={data.hero?.breadcrumb || ""}
              onChange={(e) => handleHeroChange("breadcrumb", e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className="nirf-save-btn"
          onClick={saveHero}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Page Information"}
        </button>
      </div>

      {/* =================================================
          NIRF DOCUMENTS
      ================================================= */}

      <div className="nirf-panel">
        <div className="nirf-panel-header">
          <div>
            <h4>NIRF Documents</h4>

            <p>Add and manage NIRF PDF links.</p>
          </div>

          <button type="button" className="nirf-add-btn" onClick={openAddModal}>
            <FaPlus />
            Add NIRF
          </button>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {data.records.length === 0 ? (
          <div className="nirf-empty">
            <FaFilePdf />

            <h5>No NIRF records found</h5>

            <p>Click "Add NIRF" to create your first document.</p>
          </div>
        ) : (
          /* =================================================
             TABLE
          ================================================= */

          <div className="table-responsive">
            <table className="table nirf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Heading</th>
                  <th>PDF</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {[...data.records]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((record, index) => (
                    <tr key={record._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{record.title}</strong>
                      </td>

                      <td>{record.heading}</td>

                      <td>
                        <a
                          href={record.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="nirf-pdf-link"
                        >
                          <FaFilePdf />
                          View PDF
                        </a>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            record.published
                              ? "nirf-status published"
                              : "nirf-status unpublished"
                          }
                          onClick={() => togglePublish(record)}
                          disabled={saving}
                        >
                          {record.published ? "Published" : "Unpublished"}
                        </button>
                      </td>

                      <td>
                        <div className="nirf-actions">
                          <button
                            type="button"
                            className="view"
                            title="View"
                            onClick={() => viewRecord(record)}
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            className="edit"
                            title="Edit"
                            onClick={() => openEditModal(record)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            title="Delete"
                            onClick={() => deleteRecord(record._id)}
                          >
                            <FaTrash />
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

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div className="nirf-modal-overlay">
          <div className="nirf-modal">
            <div className="nirf-modal-header">
              <h4>{editingId ? "Edit NIRF" : "Add NIRF"}</h4>

              <button type="button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={saveRecord}>
              <div className="nirf-modal-body">
                <div className="mb-3">
                  <label>Title</label>

                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Enter title"
                  />
                </div>

                <div className="mb-3">
                  <label>Heading</label>

                  <input
                    type="text"
                    className="form-control"
                    value={form.heading}
                    onChange={(e) =>
                      handleFormChange("heading", e.target.value)
                    }
                    placeholder="Enter heading"
                  />
                </div>

                <div className="mb-3">
                  <label>PDF Link</label>

                  <input
                    type="url"
                    className="form-control"
                    value={form.pdfUrl}
                    onChange={(e) => handleFormChange("pdfUrl", e.target.value)}
                    placeholder="https://example.com/nirf.pdf"
                  />

                  <small>Enter the complete PDF URL.</small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Order</label>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={form.order}
                      onChange={(e) =>
                        handleFormChange("order", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Status</label>

                    <select
                      className="form-control"
                      value={form.published ? "published" : "unpublished"}
                      onChange={(e) =>
                        handleFormChange(
                          "published",
                          e.target.value === "published",
                        )
                      }
                    >
                      <option value="published">Published</option>

                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="nirf-modal-footer">
                <button
                  type="button"
                  className="nirf-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="nirf-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update NIRF"
                      : "Add NIRF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {viewModal && selectedRecord && (
        <div className="nirf-modal-overlay">
          <div className="nirf-modal">
            <div className="nirf-modal-header">
              <h4>NIRF Details</h4>

              <button type="button" onClick={() => setViewModal(false)}>
                ×
              </button>
            </div>

            <div className="nirf-modal-body">
              <div className="nirf-view-row">
                <strong>Title</strong>

                <span>{selectedRecord.title}</span>
              </div>

              <div className="nirf-view-row">
                <strong>Heading</strong>

                <span>{selectedRecord.heading}</span>
              </div>

              <div className="nirf-view-row">
                <strong>PDF</strong>

                <a
                  href={selectedRecord.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="nirf-pdf-link"
                >
                  <FaFilePdf />
                  Open PDF
                </a>
              </div>

              <div className="nirf-view-row">
                <strong>Status</strong>

                <span>
                  {selectedRecord.published ? "Published" : "Unpublished"}
                </span>
              </div>
            </div>

            <div className="nirf-modal-footer">
              <button
                type="button"
                className="nirf-cancel-btn"
                onClick={() => setViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NIRF;
