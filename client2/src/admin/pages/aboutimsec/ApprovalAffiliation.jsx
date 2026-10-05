import React, { useEffect, useState } from "react";

import {
  getAdminApprovalAffiliations,
  createApprovalAffiliation,
  updateApprovalAffiliation,
  publishApprovalAffiliation,
  unpublishApprovalAffiliation,
  deleteApprovalAffiliation,
} from "../../services/approvalAffiliationAdminService";

const DOCUMENT_TYPES = ["Approval", "Affiliation", "Certificate", "Other"];

const ApprovalAffiliation = () => {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    documentType: "Approval",
    otherDocumentType: "",
    pdfLink: "",
    issuingAuthority: "",
    session: "",
    isPublished: false,
    displayOrder: 0,
  });

  // =========================================================
  // LOAD DOCUMENTS
  // =========================================================

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminApprovalAffiliations();

      setDocuments(response?.data || []);
    } catch (err) {
      console.error("Load approval/affiliation error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================================================
  // HANDLE CHANGE
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
      title: "",
      description: "",
      documentType: "Approval",
      otherDocumentType: "",
      pdfLink: "",
      issuingAuthority: "",
      session: "",
      isPublished: false,
      displayOrder: 0,
    });

    setEditingId(null);
  };

  // =========================================================
  // EDIT DOCUMENT
  // =========================================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      documentType: item.documentType || "Approval",
      otherDocumentType: item.otherDocumentType || "",
      pdfLink: item.pdfLink || "",
      issuingAuthority: item.issuingAuthority || "",
      session: item.session || "",
      isPublished: item.isPublished === true || item.isPublished === "true",
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

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!formData.title.trim()) {
      setError("Please enter the title.");
      return;
    }

    if (!formData.pdfLink.trim()) {
      setError("Please enter the PDF link.");
      return;
    }

    if (
      formData.documentType === "Other" &&
      !formData.otherDocumentType.trim()
    ) {
      setError("Please enter the Other Document Name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        documentType: formData.documentType,

        otherDocumentType:
          formData.documentType === "Other"
            ? formData.otherDocumentType.trim()
            : "",

        pdfLink: formData.pdfLink.trim(),

        issuingAuthority: formData.issuingAuthority.trim(),

        session: formData.session.trim(),

        isPublished: formData.isPublished,

        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editingId) {
        await updateApprovalAffiliation(editingId, payload);

        setSuccess("Document updated successfully.");
      } else {
        await createApprovalAffiliation(payload);

        setSuccess("Document added successfully.");
      }

      resetForm();

      await loadDocuments();
    } catch (err) {
      console.error("Save approval/affiliation error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to save document.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // PUBLISH / UNPUBLISH
  // =========================================================

  const handlePublishToggle = async (item) => {
    try {
      setError("");
      setSuccess("");

      const isPublished =
        item.isPublished === true || item.isPublished === "true";

      if (isPublished) {
        await unpublishApprovalAffiliation(item._id);

        setSuccess("Document unpublished successfully.");
      } else {
        await publishApprovalAffiliation(item._id);

        setSuccess("Document published successfully.");
      }

      await loadDocuments();
    } catch (err) {
      console.error("Publish/unpublish error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to change publication status.",
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteApprovalAffiliation(item._id);

      setSuccess("Document deleted successfully.");

      if (editingId === item._id) {
        resetForm();
      }

      await loadDocuments();
    } catch (err) {
      console.error("Delete document error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to delete document.",
      );
    }
  };

  // =========================================================
  // DOCUMENT TYPE DISPLAY
  // =========================================================

  const getDocumentTypeName = (item) => {
    if (item.documentType === "Other") {
      return item.otherDocumentType || "Other";
    }

    return item.documentType;
  };

  return (
    <div className="container-fluid py-4">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4">
        <h2
          className="fw-bold mb-1"
          style={{
            color: "#0A2E5C",
          }}
        >
          Approvals & Affiliations
        </h2>

        <p className="text-muted mb-0">
          Manage approval, affiliation, certificate and other official
          documents.
        </p>
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
              {editingId ? "Edit Document" : "Add Document"}
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* TITLE */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter document title"
                    required
                  />
                </div>

                {/* DOCUMENT TYPE */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Document Type
                  </label>

                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OTHER DOCUMENT NAME */}

                {formData.documentType === "Other" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Other Document Name
                    </label>

                    <input
                      type="text"
                      name="otherDocumentType"
                      value={formData.otherDocumentType}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter document type name"
                      required
                    />
                  </div>
                )}

                {/* DESCRIPTION */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter short description"
                  />
                </div>

                {/* PDF LINK */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">PDF Link</label>

                  <input
                    type="url"
                    name="pdfLink"
                    value={formData.pdfLink}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://example.com/document.pdf"
                    required
                  />

                  <small className="text-muted">
                    Paste the complete URL of the PDF document.
                  </small>
                </div>

                {/* ISSUING AUTHORITY */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Issuing Authority
                  </label>

                  <input
                    type="text"
                    name="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. AICTE, AKTU, UGC"
                  />
                </div>

                {/* SESSION */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Session / Year
                  </label>

                  <input
                    type="text"
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 2025-26"
                  />
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
                    Lower number appears first.
                  </small>
                </div>

                {/* PUBLISH */}

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isPublished"
                    id="approvalPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="approvalPublished"
                  >
                    Publish on Website
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
                        ? "Update Document"
                        : "Add Document"}
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
            DOCUMENT LIST
        =================================================== */}

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Documents</h5>

                <span className="badge bg-secondary">
                  {documents.length} Document
                  {documents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" />

                  <div className="mt-2 text-muted">Loading documents...</div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    style={{
                      fontSize: "45px",
                    }}
                  >
                    📄
                  </div>

                  <h5 className="mt-3">No Documents</h5>

                  <p className="text-muted">
                    Add your first approval, affiliation or certificate
                    document.
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

                        <th>Title</th>

                        <th>Type</th>

                        <th>Authority</th>

                        <th>Session</th>

                        <th>Status</th>

                        <th
                          className="text-center"
                          style={{
                            minWidth: "280px",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {documents.map((item, index) => {
                        const isPublished =
                          item.isPublished === true ||
                          item.isPublished === "true";

                        return (
                          <tr key={item._id}>
                            {/* NUMBER */}

                            <td>{index + 1}</td>

                            {/* TITLE */}

                            <td>
                              <div>
                                <strong>{item.title}</strong>

                                {item.description && (
                                  <div
                                    className="text-muted small mt-1"
                                    style={{
                                      maxWidth: "250px",
                                    }}
                                  >
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* TYPE */}

                            <td>
                              <span className="badge bg-primary">
                                {getDocumentTypeName(item)}
                              </span>
                            </td>

                            {/* AUTHORITY */}

                            <td>{item.issuingAuthority || "-"}</td>

                            {/* SESSION */}

                            <td>{item.session || "-"}</td>

                            {/* STATUS */}

                            <td>
                              {isPublished ? (
                                <span className="badge bg-success">
                                  Published
                                </span>
                              ) : (
                                <span className="badge bg-secondary">
                                  Unpublished
                                </span>
                              )}
                            </td>

                            {/* ACTIONS */}

                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                {/* VIEW PDF */}

                                <a
                                  href={item.pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-info text-white"
                                >
                                  View PDF
                                </a>

                                {/* EDIT */}

                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>

                                {/* PUBLISH */}

                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    isPublished ? "btn-warning" : "btn-success"
                                  }`}
                                  onClick={() => handlePublishToggle(item)}
                                >
                                  {isPublished ? "Unpublish" : "Publish"}
                                </button>

                                {/* DELETE */}

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

export default ApprovalAffiliation;
