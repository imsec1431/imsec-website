import React, { useEffect, useState } from "react";

import { Alert, Badge, Button, Form, Modal, Spinner } from "react-bootstrap";

import {
  getAdminUptacCounselling,
  createUptacCounselling,
  updateUptacCounselling,
  publishUptacCounselling,
  unpublishUptacCounselling,
  deleteUptacCounselling,
  getUptacPdfUrl,
  getUptacPdfBlob,
} from "../../../services/uptacCounsellingService.js";

import "./UPTACCounselling.css";

const UPTACCounselling = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [counselling, setCounselling] = useState(null);

  // =====================================================
  // PAGE LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // SAVE LOADING
  // =====================================================

  const [saving, setSaving] = useState(false);

  // =====================================================
  // ACTION LOADING
  // =====================================================

  const [actionLoading, setActionLoading] = useState(false);

  // =====================================================
  // PDF LOADING
  // =====================================================

  const [pdfLoading, setPdfLoading] = useState(false);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // =====================================================
  // MODALS
  // =====================================================

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showPdfModal, setShowPdfModal] = useState(false);

  // =====================================================
  // EDIT MODE
  // =====================================================

  const [editMode, setEditMode] = useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [session, setSession] = useState("2026-27");

  const [title, setTitle] = useState("UPTAC Counselling 2026-27");

  const [description, setDescription] = useState("");

  const [isPublished, setIsPublished] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);

  // =====================================================
  // PDF BLOB URL
  // =====================================================

  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  // =====================================================
  // LOAD ADMIN DATA
  // =====================================================

  const loadCounselling = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminUptacCounselling();

      // console.log("UPTAC admin response:", response);

      setCounselling(response?.data || null);
    } catch (err) {
      console.error("UPTAC counselling load error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load UPTAC counselling.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCounselling();
  }, []);

  // =====================================================
  // CLEAR PDF BLOB
  // =====================================================

  const clearPdfBlob = () => {
    if (pdfBlobUrl) {
      window.URL.revokeObjectURL(pdfBlobUrl);
    }

    setPdfBlobUrl("");
  };

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = () => {
    setSession("2026-27");

    setTitle("UPTAC Counselling 2026-27");

    setDescription("");

    setIsPublished(true);

    setSelectedFile(null);

    setError("");
  };

  // =====================================================
  // OPEN UPLOAD
  // =====================================================

  const handleOpenUpload = () => {
    setEditMode(false);

    clearForm();

    setShowUploadModal(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = () => {
    if (!counselling) {
      return;
    }

    setEditMode(true);

    setSession(counselling.session || "2026-27");

    setTitle(counselling.title || "UPTAC Counselling 2026-27");

    setDescription(counselling.description || "");

    setIsPublished(Boolean(counselling.isPublished));

    setSelectedFile(null);

    setError("");

    setShowUploadModal(true);
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);

      return;
    }

    // ---------------------------------------------------
    // EXTENSION
    // ---------------------------------------------------

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".pdf")) {
      setError("Only PDF files are allowed.");

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    // ---------------------------------------------------
    // MIME
    // ---------------------------------------------------

    if (file.type && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    // ---------------------------------------------------
    // SIZE
    // ---------------------------------------------------

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF file must not exceed 10 MB.");

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);

    setError("");
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");

    setMessage("");

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!session.trim()) {
      setError("Please enter the current session.");

      return;
    }

    if (!title.trim()) {
      setError("Please enter the title.");

      return;
    }

    if (!editMode && !selectedFile) {
      setError("Please select the UPTAC counselling PDF.");

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("session", session.trim());

      formData.append("title", title.trim());

      formData.append("description", description.trim());

      formData.append("isPublished", isPublished ? "true" : "false");

      // IMPORTANT:
      // This must match upload.single("pdfFile")
      // in the backend route.

      if (selectedFile) {
        formData.append("pdfFile", selectedFile);
      }

      let response;

      // ------------------------------------------------
      // UPDATE
      // ------------------------------------------------

      if (editMode && counselling?._id) {
        response = await updateUptacCounselling(counselling._id, formData);
      }

      // ------------------------------------------------
      // CREATE
      // ------------------------------------------------
      else {
        response = await createUptacCounselling(formData);
      }

      // console.log("UPTAC save response:", response);

      setMessage(
        response?.message ||
          (editMode
            ? "UPTAC counselling updated successfully."
            : "UPTAC counselling uploaded successfully."),
      );

      setShowUploadModal(false);

      setSelectedFile(null);

      await loadCounselling();
    } catch (err) {
      console.error("UPTAC counselling save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save UPTAC counselling.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleViewPdf = async () => {
    try {
      if (!counselling?.pdfFile) {
        setError("UPTAC counselling PDF is not available.");

        return;
      }

      setError("");

      setPdfLoading(true);

      // -----------------------------------------------
      // GET CLOUDINARY URL
      // -----------------------------------------------

      const pdfUrl = getUptacPdfUrl(counselling.pdfFile);

      // console.log("UPTAC PDF URL:", pdfUrl);

      if (!pdfUrl) {
        throw new Error("UPTAC PDF URL is empty.");
      }

      // -----------------------------------------------
      // FETCH PDF AS BLOB
      //
      // NO ADMIN TOKEN IS SENT HERE.
      // -----------------------------------------------

      const blob = await getUptacPdfBlob(pdfUrl);

      // -----------------------------------------------
      // CLEAN OLD BLOB
      // -----------------------------------------------

      clearPdfBlob();

      // -----------------------------------------------
      // CREATE NEW BLOB URL
      // -----------------------------------------------

      const blobUrl = window.URL.createObjectURL(blob);

      setPdfBlobUrl(blobUrl);

      setShowPdfModal(true);
    } catch (err) {
      console.error("UPTAC PDF view error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load PDF document.",
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownloadPdf = async () => {
    try {
      if (!counselling?.pdfFile) {
        setError("UPTAC counselling PDF is not available.");

        return;
      }

      setError("");

      setPdfLoading(true);

      const pdfUrl = getUptacPdfUrl(counselling.pdfFile);

      const blob = await getUptacPdfBlob(pdfUrl);

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = counselling.pdfOriginalName || "UPTAC-Counselling.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("UPTAC PDF download error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to download PDF.",
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // =====================================================
  // PUBLISH
  // =====================================================

  const handlePublish = async () => {
    if (!counselling?._id) {
      return;
    }

    try {
      setActionLoading(true);

      setError("");

      setMessage("");

      const response = await publishUptacCounselling(counselling._id);

      setMessage(
        response?.message || "UPTAC counselling published successfully.",
      );

      await loadCounselling();
    } catch (err) {
      console.error("UPTAC publish error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish UPTAC counselling.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // UNPUBLISH
  // =====================================================

  const handleUnpublish = async () => {
    if (!counselling?._id) {
      return;
    }

    try {
      setActionLoading(true);

      setError("");

      setMessage("");

      const response = await unpublishUptacCounselling(counselling._id);

      setMessage(
        response?.message || "UPTAC counselling unpublished successfully.",
      );

      await loadCounselling();
    } catch (err) {
      console.error("UPTAC unpublish error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish UPTAC counselling.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!counselling?._id) {
      return;
    }

    try {
      setActionLoading(true);

      setError("");

      setMessage("");

      const response = await deleteUptacCounselling(counselling._id);

      setMessage(
        response?.message || "UPTAC counselling deleted successfully.",
      );

      clearPdfBlob();

      setCounselling(null);

      setShowDeleteModal(false);
    } catch (err) {
      console.error("UPTAC delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete UPTAC counselling.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CLOSE PDF MODAL
  // =====================================================

  const handleClosePdfModal = () => {
    setShowPdfModal(false);

    clearPdfBlob();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="uptac-admin-page">
        <div className="uptac-loading">
          <Spinner animation="border" />

          <p>Loading UPTAC counselling...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="uptac-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="uptac-admin-header">
        <div>
          <span className="uptac-eyebrow">ADMISSIONS / COUNSELLING</span>

          <h2>UPTAC Counselling</h2>

          <p>
            Manage the current UPTAC counselling notification displayed on the
            public website.
          </p>
        </div>

        <Button
          type="button"
          className="uptac-upload-btn"
          onClick={handleOpenUpload}
        >
          + Upload PDF
        </Button>
      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!counselling ? (
        <div className="uptac-empty-card">
          <div className="uptac-empty-icon">📄</div>

          <h3>No UPTAC Counselling Available</h3>

          <p>Upload the current UPTAC counselling notification PDF.</p>

          <Button
            type="button"
            className="uptac-primary-btn"
            onClick={handleOpenUpload}
          >
            Upload Counselling PDF
          </Button>
        </div>
      ) : (
        /* =================================================
           RECORD
        ================================================= */

        <div className="uptac-record-card">
          {/* =============================================
              TOP
          ============================================= */}

          <div className="uptac-record-top">
            <div className="uptac-pdf-icon">PDF</div>

            <div className="uptac-record-info">
              <div className="uptac-record-title-row">
                <h3>{counselling.title || "UPTAC Counselling"}</h3>

                {counselling.isPublished ? (
                  <Badge bg="success">Published</Badge>
                ) : (
                  <Badge bg="secondary">Unpublished</Badge>
                )}
              </div>

              <p>
                Current Session: <strong>{counselling.session || "-"}</strong>
              </p>

              <p>
                PDF:{" "}
                <span>
                  {counselling.pdfOriginalName || "UPTAC Counselling PDF"}
                </span>
              </p>
            </div>
          </div>

          {/* =============================================
              DESCRIPTION
          ============================================= */}

          {counselling.description && (
            <div className="uptac-description">
              <strong>Description</strong>

              <p>{counselling.description}</p>
            </div>
          )}

          {/* =============================================
              ACTIONS
          ============================================= */}

          <div className="uptac-record-actions">
            <Button
              type="button"
              variant="outline-primary"
              disabled={pdfLoading || !counselling.pdfFile}
              onClick={handleViewPdf}
            >
              {pdfLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "👁 View PDF"
              )}
            </Button>

            <Button
              type="button"
              variant="outline-success"
              disabled={pdfLoading || !counselling.pdfFile}
              onClick={handleDownloadPdf}
            >
              ↓ Download PDF
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleOpenEdit}
            >
              ✎ Replace / Edit
            </Button>

            {counselling.isPublished ? (
              <Button
                type="button"
                variant="outline-warning"
                disabled={actionLoading}
                onClick={handleUnpublish}
              >
                {actionLoading ? "Please wait..." : "Unpublish"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline-success"
                disabled={actionLoading}
                onClick={handlePublish}
              >
                {actionLoading ? "Please wait..." : "Publish"}
              </Button>
            )}

            <Button
              type="button"
              variant="outline-danger"
              disabled={actionLoading}
              onClick={() => setShowDeleteModal(true)}
            >
              🗑 Delete
            </Button>
          </div>
        </div>
      )}

      {/* =================================================
          UPLOAD / EDIT MODAL
      ================================================= */}

      <Modal
        show={showUploadModal}
        onHide={() => {
          if (!saving) {
            setShowUploadModal(false);
          }
        }}
        centered
        size="lg"
      >
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode
                ? "Replace UPTAC Counselling PDF"
                : "Upload UPTAC Counselling PDF"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* ------------------------------------------
                ERROR
            ------------------------------------------ */}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* ------------------------------------------
                SESSION
            ------------------------------------------ */}

            <Form.Group className="mb-3">
              <Form.Label>Current Session</Form.Label>

              <Form.Control
                type="text"
                value={session}
                onChange={(event) => setSession(event.target.value)}
                placeholder="2026-27"
                required
              />
            </Form.Group>

            {/* ------------------------------------------
                TITLE
            ------------------------------------------ */}

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="UPTAC Counselling 2026-27"
                required
              />
            </Form.Group>

            {/* ------------------------------------------
                DESCRIPTION
            ------------------------------------------ */}

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="optional-text">(Optional)</span>
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter counselling information..."
              />
            </Form.Group>

            {/* ------------------------------------------
                PDF
            ------------------------------------------ */}

            <Form.Group className="mb-3">
              <Form.Label>UPTAC Counselling PDF</Form.Label>

              <Form.Control
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />

              <Form.Text>
                {editMode
                  ? "Select a new PDF only if you want to replace the existing PDF."
                  : "PDF only. Maximum size: 10 MB."}
              </Form.Text>

              {selectedFile && (
                <div className="uptac-selected-file">
                  <span>📄</span>

                  <strong>{selectedFile.name}</strong>

                  <span>
                    {" "}
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}

              {editMode && !selectedFile && counselling?.pdfOriginalName && (
                <div className="uptac-existing-file">
                  Current PDF:
                  <strong> {counselling.pdfOriginalName}</strong>
                </div>
              )}
            </Form.Group>

            {/* ------------------------------------------
                PUBLISH
            ------------------------------------------ */}

            <Form.Check
              type="switch"
              id="uptac-publish-switch"
              label="Publish on public website"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="uptac-save-btn" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />

                  {editMode ? "Updating..." : "Uploading..."}
                </>
              ) : editMode ? (
                "Replace PDF"
              ) : (
                "Upload PDF"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <Modal
        show={showDeleteModal}
        onHide={() => {
          if (!actionLoading) {
            setShowDeleteModal(false);
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete UPTAC Counselling</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you sure you want to delete the current UPTAC counselling PDF?
          </p>

          <p className="text-danger mb-0">
            The PDF will also be removed from Cloudinary.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            disabled={actionLoading}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={actionLoading}
            onClick={handleDelete}
          >
            {actionLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          PDF VIEW MODAL
      ================================================= */}

      <Modal
        show={showPdfModal}
        onHide={handleClosePdfModal}
        size="xl"
        centered
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>{counselling?.title || "UPTAC Counselling"}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="uptac-pdf-modal-body">
          {pdfBlobUrl ? (
            <iframe
              src={pdfBlobUrl}
              title="UPTAC Counselling PDF"
              className="uptac-pdf-frame"
            />
          ) : (
            <div className="uptac-pdf-error">
              <Spinner animation="border" />

              <span>Loading PDF...</span>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UPTACCounselling;
