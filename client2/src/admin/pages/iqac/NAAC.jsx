import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaRedo,
  FaFilePdf,
} from "react-icons/fa";

import naacAdminService from "../../services/naacAdminService";

import "./naac.css";

const emptyRecord = {
  title: "",
  heading: "",
  pdfUrl: "",
  published: true,
  order: 1,
};

const NAAC = () => {
  const [data, setData] = useState({
    hero: {
      title: "NAAC",
      subtitle: "National Assessment and Accreditation Council",
      breadcrumb: "Home / IQAC / NAAC",
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

  const loadNAAC = async () => {
    try {
      setLoading(true);

      const response = await naacAdminService.getNAACAdmin();

      const pageData = response?.data || response;

      setData({
        hero: pageData?.hero || {
          title: "NAAC",
          subtitle: "National Assessment and Accreditation Council",
          breadcrumb: "Home / IQAC / NAAC",
        },

        records: pageData?.records || [],
      });
    } catch (error) {
      alert(error?.message || "Unable to load NAAC data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNAAC();
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

      await naacAdminService.updateNAAC({
        hero: data.hero,
      });

      alert("NAAC page information updated successfully.");

      await loadNAAC();
    } catch (error) {
      alert(error?.message || "Failed to update NAAC information.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     OPEN ADD
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
     OPEN EDIT
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

      await naacAdminService.updateNAAC({
        records,
      });

      alert(
        editingId
          ? "NAAC record updated successfully."
          : "NAAC record added successfully.",
      );

      setShowModal(false);
      setEditingId(null);
      setForm(emptyRecord);

      await loadNAAC();
    } catch (error) {
      alert(error?.message || "Failed to save NAAC record.");
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
      "Are you sure you want to delete this NAAC record?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await naacAdminService.deleteNAACRecord(id);

      alert("NAAC record deleted successfully.");

      await loadNAAC();
    } catch (error) {
      alert(error?.message || "Failed to delete NAAC record.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     TOGGLE PUBLISH
  ===================================================== */

  const togglePublish = async (record) => {
    try {
      const records = data.records.map((item) =>
        item._id === record._id
          ? {
              ...item,
              published: !item.published,
            }
          : item,
      );

      await naacAdminService.updateNAAC({
        records,
      });

      await loadNAAC();
    } catch (error) {
      alert(error?.message || "Failed to update publish status.");
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetDefaults = async () => {
    const confirmed = window.confirm("Reset NAAC page to default data?");

    if (!confirmed) return;

    try {
      setSaving(true);

      await naacAdminService.resetNAAC();

      alert("NAAC defaults restored successfully.");

      await loadNAAC();
    } catch (error) {
      alert(error?.message || "Failed to reset NAAC.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <div className="naac-loading">Loading NAAC...</div>;
  }

  return (
    <div className="container-fluid naac-admin">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="naac-page-header">
        <div>
          <h2>NAAC Management</h2>

          <p>Manage NAAC title, heading and PDF documents.</p>
        </div>

        <button
          type="button"
          className="naac-reset-btn"
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

      <div className="naac-panel">
        <div className="naac-panel-title">
          <h4>NAAC Page Information</h4>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Title</label>

            <input
              type="text"
              value={data.hero?.title || ""}
              onChange={(e) => handleHeroChange("title", e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Heading / Subtitle</label>

            <input
              type="text"
              value={data.hero?.subtitle || ""}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Breadcrumb</label>

            <input
              type="text"
              value={data.hero?.breadcrumb || ""}
              onChange={(e) => handleHeroChange("breadcrumb", e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <button
          type="button"
          className="naac-save-btn"
          onClick={saveHero}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Page Information"}
        </button>
      </div>

      {/* =================================================
          RECORDS
      ================================================= */}

      <div className="naac-panel">
        <div className="naac-panel-header">
          <div>
            <h4>NAAC Documents</h4>

            <p>Add and manage NAAC PDF links.</p>
          </div>

          <button type="button" className="naac-add-btn" onClick={openAddModal}>
            <FaPlus />
            Add NAAC
          </button>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        {data.records.length === 0 ? (
          <div className="naac-empty">
            <FaFilePdf />

            <h5>No NAAC records found</h5>

            <p>Click "Add NAAC" to create your first document.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table naac-table">
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
                {data.records
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
                          className="naac-pdf-link"
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
                              ? "naac-status published"
                              : "naac-status unpublished"
                          }
                          onClick={() => togglePublish(record)}
                        >
                          {record.published ? "Published" : "Unpublished"}
                        </button>
                      </td>

                      <td>
                        <div className="naac-actions">
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
        <div className="naac-modal-overlay">
          <div className="naac-modal">
            <div className="naac-modal-header">
              <h4>{editingId ? "Edit NAAC" : "Add NAAC"}</h4>

              <button type="button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={saveRecord}>
              <div className="naac-modal-body">
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
                    placeholder="https://example.com/file.pdf"
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

              <div className="naac-modal-footer">
                <button
                  type="button"
                  className="naac-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="naac-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update NAAC"
                      : "Add NAAC"}
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
        <div className="naac-modal-overlay">
          <div className="naac-modal">
            <div className="naac-modal-header">
              <h4>NAAC Details</h4>

              <button type="button" onClick={() => setViewModal(false)}>
                ×
              </button>
            </div>

            <div className="naac-modal-body">
              <div className="naac-view-row">
                <strong>Title</strong>

                <span>{selectedRecord.title}</span>
              </div>

              <div className="naac-view-row">
                <strong>Heading</strong>

                <span>{selectedRecord.heading}</span>
              </div>

              <div className="naac-view-row">
                <strong>PDF</strong>

                <a
                  href={selectedRecord.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="naac-pdf-link"
                >
                  <FaFilePdf />
                  Open PDF
                </a>
              </div>

              <div className="naac-view-row">
                <strong>Status</strong>

                <span>
                  {selectedRecord.published ? "Published" : "Unpublished"}
                </span>
              </div>
            </div>

            <div className="naac-modal-footer">
              <button
                type="button"
                className="naac-cancel-btn"
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

export default NAAC;
