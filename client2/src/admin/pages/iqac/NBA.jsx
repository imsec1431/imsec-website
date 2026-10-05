import { useEffect, useState } from "react";
import "./nba.css";

import nbaAdminService from "../../services/nbaAdminService";

const emptyRecord = {
  title: "",
  heading: "",
  pdfUrl: "",
  published: true,
  order: 1,
};

const NBA = () => {
  const [data, setData] = useState({
    hero: {
      title: "NBA",
      subtitle: "National Board of Accreditation",
      breadcrumb: "Home / IQAC / NBA",
    },
    records: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  /* =======================================================
     LOAD NBA
  ======================================================= */

  const loadNBA = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await nbaAdminService.getNBAAdmin();

      const pageData = response?.data?.data || response?.data || response;

      setData({
        hero: {
          title: pageData?.hero?.title || "NBA",
          subtitle:
            pageData?.hero?.subtitle || "National Board of Accreditation",
          breadcrumb: pageData?.hero?.breadcrumb || "Home / IQAC / NBA",
        },
        records: Array.isArray(pageData?.records) ? pageData.records : [],
      });
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to load NBA information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNBA();
  }, []);

  /* =======================================================
     HERO CHANGE
  ======================================================= */

  const handleHeroChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     SAVE PAGE INFORMATION
  ======================================================= */

  const handleSavePage = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await nbaAdminService.updateNBA(data);

      const pageData = response?.data?.data || response?.data || response;

      if (pageData) {
        setData({
          hero: {
            title: pageData?.hero?.title || "NBA",
            subtitle:
              pageData?.hero?.subtitle || "National Board of Accreditation",
            breadcrumb: pageData?.hero?.breadcrumb || "Home / IQAC / NBA",
          },
          records: Array.isArray(pageData?.records) ? pageData.records : [],
        });
      }

      alert("NBA page information saved successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to save NBA information.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const handleAdd = () => {
    setModalMode("add");

    setSelectedRecord({
      ...emptyRecord,
      order: data.records.length + 1,
    });

    setModalOpen(true);
  };

  /* =======================================================
     OPEN VIEW MODAL
  ======================================================= */

  const handleView = (record) => {
    setModalMode("view");
    setSelectedRecord({
      ...record,
    });
    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const handleEdit = (record) => {
    setModalMode("edit");
    setSelectedRecord({
      ...record,
    });
    setModalOpen(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  /* =======================================================
     RECORD INPUT CHANGE
  ======================================================= */

  const handleRecordChange = (field, value) => {
    setSelectedRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =======================================================
     SAVE RECORD
  ======================================================= */

  const handleSaveRecord = async () => {
    if (!selectedRecord?.title?.trim()) {
      alert("Please enter NBA title.");
      return;
    }

    if (!selectedRecord?.heading?.trim()) {
      alert("Please enter NBA heading.");
      return;
    }

    if (!selectedRecord?.pdfUrl?.trim()) {
      alert("Please enter NBA PDF URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let updatedRecords = [...data.records];

      if (modalMode === "add") {
        updatedRecords.push({
          ...selectedRecord,
          title: selectedRecord.title.trim(),
          heading: selectedRecord.heading.trim(),
          pdfUrl: selectedRecord.pdfUrl.trim(),
          order: Number(selectedRecord.order) || updatedRecords.length + 1,
        });
      } else {
        updatedRecords = updatedRecords.map((item) =>
          item._id === selectedRecord._id
            ? {
                ...selectedRecord,
                title: selectedRecord.title.trim(),
                heading: selectedRecord.heading.trim(),
                pdfUrl: selectedRecord.pdfUrl.trim(),
                order: Number(selectedRecord.order) || 1,
              }
            : item,
        );
      }

      const response = await nbaAdminService.updateNBA({
        ...data,
        records: updatedRecords,
      });

      const pageData = response?.data?.data || response?.data || response;

      setData({
        hero: {
          title: pageData?.hero?.title || data.hero.title,
          subtitle: pageData?.hero?.subtitle || data.hero.subtitle,
          breadcrumb: pageData?.hero?.breadcrumb || data.hero.breadcrumb,
        },
        records: Array.isArray(pageData?.records)
          ? pageData.records
          : updatedRecords,
      });

      closeModal();

      alert(
        modalMode === "add"
          ? "NBA record added successfully."
          : "NBA record updated successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to save NBA record.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE RECORD
  ======================================================= */

  const handleDelete = async (record) => {
    if (!record?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await nbaAdminService.deleteNBARecord(record._id);

      const pageData = response?.data?.data || response?.data || response;

      setData((prev) => ({
        ...prev,
        records: Array.isArray(pageData?.records)
          ? pageData.records
          : prev.records.filter((item) => item._id !== record._id),
      }));

      alert("NBA record deleted successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to delete NBA record.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     TOGGLE PUBLISH
  ======================================================= */

  const handleTogglePublish = async (record) => {
    try {
      setSaving(true);
      setError("");

      const updatedRecords = data.records.map((item) =>
        item._id === record._id
          ? {
              ...item,
              published: !item.published,
            }
          : item,
      );

      const response = await nbaAdminService.updateNBA({
        ...data,
        records: updatedRecords,
      });

      const pageData = response?.data?.data || response?.data || response;

      setData((prev) => ({
        ...prev,
        records: Array.isArray(pageData?.records)
          ? pageData.records
          : updatedRecords,
      }));
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to update publish status.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET DEFAULTS
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm("Reset NBA page to default settings?");

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await nbaAdminService.resetNBA();

      const pageData = response?.data?.data || response?.data || response;

      setData({
        hero: {
          title: pageData?.hero?.title || "NBA",
          subtitle:
            pageData?.hero?.subtitle || "National Board of Accreditation",
          breadcrumb: pageData?.hero?.breadcrumb || "Home / IQAC / NBA",
        },
        records: Array.isArray(pageData?.records) ? pageData.records : [],
      });

      alert("NBA defaults restored successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset NBA defaults.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="nba-admin-page">
        <div className="nba-loading">Loading NBA information...</div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="nba-admin-page">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="nba-page-header">
        <div>
          <h2>NBA CMS</h2>
          <p>Manage National Board of Accreditation content</p>
        </div>

        <button
          type="button"
          className="nba-btn nba-btn-secondary"
          onClick={handleReset}
          disabled={saving}
        >
          Reset Defaults
        </button>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && <div className="nba-alert">{error}</div>}

      {/* ===================================================
          HERO INFORMATION
      =================================================== */}

      <div className="nba-panel">
        <div className="nba-panel-header">
          <div>
            <h3>Page Information</h3>
            <p>Manage NBA page title and breadcrumb.</p>
          </div>

          <button
            type="button"
            className="nba-btn nba-btn-primary"
            onClick={handleSavePage}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Page Information"}
          </button>
        </div>

        <div className="nba-form-grid">
          <div className="nba-form-group">
            <label>Title</label>

            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => handleHeroChange("title", e.target.value)}
              placeholder="NBA"
            />
          </div>

          <div className="nba-form-group">
            <label>Heading / Subtitle</label>

            <input
              type="text"
              value={data.hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
              placeholder="National Board of Accreditation"
            />
          </div>

          <div className="nba-form-group nba-full-width">
            <label>Breadcrumb</label>

            <input
              type="text"
              value={data.hero.breadcrumb}
              onChange={(e) => handleHeroChange("breadcrumb", e.target.value)}
              placeholder="Home / IQAC / NBA"
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          RECORDS
      =================================================== */}

      <div className="nba-panel">
        <div className="nba-panel-header">
          <div>
            <h3>NBA Documents</h3>
            <p>Manage NBA documents and PDF links.</p>
          </div>

          <button
            type="button"
            className="nba-btn nba-btn-primary"
            onClick={handleAdd}
          >
            + Add NBA
          </button>
        </div>

        {data.records.length === 0 ? (
          <div className="nba-empty">
            <h4>No NBA records found</h4>
            <p>Add your first NBA document.</p>

            <button
              type="button"
              className="nba-btn nba-btn-primary"
              onClick={handleAdd}
            >
              + Add NBA
            </button>
          </div>
        ) : (
          <div className="nba-table-wrapper">
            <table className="nba-table">
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
                {data.records.map((record, index) => (
                  <tr key={record._id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{record.title}</strong>
                    </td>

                    <td>{record.heading}</td>

                    <td>
                      {record.pdfUrl ? (
                        <a
                          href={record.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="nba-pdf-link"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span>No PDF</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={
                          record.published
                            ? "nba-status published"
                            : "nba-status unpublished"
                        }
                        onClick={() => handleTogglePublish(record)}
                        disabled={saving}
                      >
                        {record.published ? "Published" : "Unpublished"}
                      </button>
                    </td>

                    <td>
                      <div className="nba-actions">
                        <button
                          type="button"
                          className="nba-action view"
                          onClick={() => handleView(record)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="nba-action edit"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="nba-action delete"
                          onClick={() => handleDelete(record)}
                          disabled={saving}
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

      {/* ===================================================
          MODAL
      =================================================== */}

      {modalOpen && selectedRecord && (
        <div className="nba-modal-overlay" onClick={closeModal}>
          <div className="nba-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nba-modal-header">
              <div>
                <h3>
                  {modalMode === "add"
                    ? "Add NBA"
                    : modalMode === "edit"
                      ? "Edit NBA"
                      : "View NBA"}
                </h3>

                <p>NBA document information</p>
              </div>

              <button
                type="button"
                className="nba-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="nba-modal-body">
              <div className="nba-form-group">
                <label>Title</label>

                <input
                  type="text"
                  value={selectedRecord.title}
                  onChange={(e) => handleRecordChange("title", e.target.value)}
                  disabled={modalMode === "view"}
                  placeholder="Enter title"
                />
              </div>

              <div className="nba-form-group">
                <label>Heading</label>

                <input
                  type="text"
                  value={selectedRecord.heading}
                  onChange={(e) =>
                    handleRecordChange("heading", e.target.value)
                  }
                  disabled={modalMode === "view"}
                  placeholder="Enter heading"
                />
              </div>

              <div className="nba-form-group">
                <label>PDF Link</label>

                <input
                  type="url"
                  value={selectedRecord.pdfUrl}
                  onChange={(e) => handleRecordChange("pdfUrl", e.target.value)}
                  disabled={modalMode === "view"}
                  placeholder="https://example.com/nba.pdf"
                />

                {selectedRecord.pdfUrl && (
                  <a
                    href={selectedRecord.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="nba-modal-pdf"
                  >
                    Open PDF →
                  </a>
                )}
              </div>

              <div className="nba-form-row">
                <div className="nba-form-group">
                  <label>Order</label>

                  <input
                    type="number"
                    min="1"
                    value={selectedRecord.order}
                    onChange={(e) =>
                      handleRecordChange("order", e.target.value)
                    }
                    disabled={modalMode === "view"}
                  />
                </div>

                <div className="nba-form-group">
                  <label>Status</label>

                  <select
                    value={
                      selectedRecord.published ? "published" : "unpublished"
                    }
                    onChange={(e) =>
                      handleRecordChange(
                        "published",
                        e.target.value === "published",
                      )
                    }
                    disabled={modalMode === "view"}
                  >
                    <option value="published">Published</option>

                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="nba-modal-footer">
              <button
                type="button"
                className="nba-btn nba-btn-light"
                onClick={closeModal}
              >
                Close
              </button>

              {modalMode !== "view" && (
                <button
                  type="button"
                  className="nba-btn nba-btn-primary"
                  onClick={handleSaveRecord}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modalMode === "add"
                      ? "Add NBA"
                      : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NBA;
