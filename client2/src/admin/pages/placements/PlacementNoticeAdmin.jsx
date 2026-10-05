import React, { useEffect, useState } from "react";

import {
  Button,
  Modal,
  Form,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaFilePdf,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import {
  fetchPlacementNoticesAdmin,
  createPlacementNotice,
  updatePlacementNotice,
  deletePlacementNotice,
  togglePlacementNoticeStatus,
} from "../../services/placementNoticeService";

import "./PlacementNoticeAdmin.css";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  title: "",
  description: "",
  noticeDate: "",
  documentLink: "",
  documentLabel: "View Notice",
  category: "placement",
  order: 0,
  isPublished: true,
};

/* =========================================================
   COMPONENT
========================================================= */

const PlacementNoticesAdmin = () => {
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingNotice, setEditingNotice] = useState(null);

  const [form, setForm] = useState(initialForm);

  /* =========================================================
     LOAD NOTICES
  ========================================================= */

  const loadNotices = async () => {
    try {
      setLoading(true);

      setError("");

      const result = await fetchPlacementNoticesAdmin();

      setNotices(result?.data || []);
    } catch (err) {
      console.error("Placement Notices Admin:", err);

      setError(err?.message || "Failed to load placement notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     ADD
  ========================================================= */

  const handleAdd = () => {
    setEditingNotice(null);

    setForm({
      ...initialForm,
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title || "",

      description: notice.description || "",

      noticeDate: notice.noticeDate
        ? new Date(notice.noticeDate).toISOString().split("T")[0]
        : "",

      documentLink: notice.documentLink || "",

      documentLabel: notice.documentLabel || "View Notice",

      category: notice.category || "placement",

      order: notice.order ?? 0,

      isPublished: notice.isPublished !== false,
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingNotice(null);

    setForm({
      ...initialForm,
    });

    setError("");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      /* =========================================
         VALIDATION
      ========================================= */

      if (!form.title.trim()) {
        setError("Notice title is required.");

        setSaving(false);

        return;
      }

      if (!form.noticeDate) {
        setError("Notice date is required.");

        setSaving(false);

        return;
      }

      /* =========================================
         DATA
      ========================================= */

      const data = {
        title: form.title.trim(),

        description: form.description.trim(),

        noticeDate: form.noticeDate,

        documentLink: form.documentLink.trim(),

        documentLabel: form.documentLabel.trim() || "View Notice",

        category: form.category,

        order: Number(form.order) || 0,

        isPublished: Boolean(form.isPublished),
      };

      /* =========================================
         CREATE
      ========================================= */

      if (!editingNotice) {
        await createPlacementNotice(data);

        setSuccess("Placement notice created successfully.");
      } else {

      /* =========================================
         UPDATE
      ========================================= */
        await updatePlacementNotice(editingNotice._id, data);

        setSuccess("Placement notice updated successfully.");
      }

      /* =========================================
         CLOSE
      ========================================= */

      setShowModal(false);

      setEditingNotice(null);

      setForm({
        ...initialForm,
      });

      await loadNotices();
    } catch (err) {
      console.error("Save placement notice:", err);

      setError(err?.message || "Failed to save placement notice.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (notice) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${notice.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setSuccess("");

      await deletePlacementNotice(notice._id);

      setSuccess("Placement notice deleted successfully.");

      await loadNotices();
    } catch (err) {
      console.error("Delete placement notice:", err);

      setError(err?.message || "Failed to delete placement notice.");
    }
  };

  /* =========================================================
     TOGGLE STATUS
  ========================================================= */

  const handleToggleStatus = async (notice) => {
    try {
      setError("");

      setSuccess("");

      await togglePlacementNoticeStatus(notice._id);

      setSuccess(
        notice.isPublished
          ? "Placement notice unpublished successfully."
          : "Placement notice published successfully.",
      );

      await loadNotices();
    } catch (err) {
      console.error("Toggle placement notice:", err);

      setError(err?.message || "Failed to update notice status.");
    }
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="placement-notices-admin">
        <div className="placement-admin-loading">
          <Spinner animation="border" variant="primary" />

          <p>Loading placement notices...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="placement-notices-admin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="placement-admin-header">
        <div>
          <span className="placement-admin-eyebrow">Placements</span>

          <h1>Placement Notices</h1>

          <p>
            Manage placement, internship, training and campus drive notices.
          </p>
        </div>

        <Button className="placement-add-button" onClick={handleAdd}>
          <FaPlus />

          <span>Add Notice</span>
        </Button>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="placement-notices-card">
        <div className="placement-table-wrapper">
          <Table hover className="placement-notices-table">
            <thead>
              <tr>
                <th>#</th>

                <th>Notice</th>

                <th>Date</th>

                <th>Category</th>

                <th>Document</th>

                <th>Status</th>

                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!notices.length ? (
                <tr>
                  <td colSpan="7" className="placement-empty">
                    <FaInfoCircle />

                    <span>No placement notices found.</span>
                  </td>
                </tr>
              ) : (
                notices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="notice-title-cell">
                        <strong>{notice.title}</strong>

                        {notice.description && (
                          <small>{notice.description}</small>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="notice-date-cell">
                        <FaCalendarAlt />

                        <span>{formatDate(notice.noticeDate)}</span>
                      </div>
                    </td>

                    <td>
                      <Badge className="notice-category">
                        {notice.category}
                      </Badge>
                    </td>

                    <td>
                      {notice.documentLink ? (
                        <a
                          href={notice.documentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="notice-document-link"
                        >
                          <FaFilePdf />

                          <span>{notice.documentLabel || "View Notice"}</span>

                          <FaExternalLinkAlt />
                        </a>
                      ) : (
                        <span className="no-document">No document</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`notice-status ${
                          notice.isPublished ? "published" : "unpublished"
                        }`}
                        onClick={() => handleToggleStatus(notice)}
                      >
                        {notice.isPublished ? (
                          <>
                            <FaEye />
                            Published
                          </>
                        ) : (
                          <>
                            <FaEyeSlash />
                            Unpublished
                          </>
                        )}
                      </button>
                    </td>

                    <td>
                      <div className="notice-actions">
                        <Button
                          className="notice-edit-button"
                          onClick={() => handleEdit(notice)}
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          className="notice-delete-button"
                          onClick={() => handleDelete(notice)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
        dialogClassName="placement-notice-modal"
      >
        <Form onSubmit={handleSubmit} className="placement-notice-form">
          <Modal.Header closeButton>
            <div>
              <small className="placement-modal-label">
                Placement Management
              </small>

              <Modal.Title>
                {editingNotice
                  ? "Edit Placement Notice"
                  : "Add Placement Notice"}
              </Modal.Title>
            </div>
          </Modal.Header>

          {/* =================================================
              SCROLLABLE MODAL CONTENT

              IMPORTANT:
              We deliberately use our own wrapper here.
          ================================================= */}

          <div className="placement-modal-scroll">
            <Modal.Body>
              {/* TITLE */}

              <Form.Group className="mb-3">
                <Form.Label>
                  Notice Title
                  <span className="required">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                />
              </Form.Group>

              {/* DESCRIPTION */}

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter short description"
                />
              </Form.Group>

              {/* DATE + CATEGORY */}

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Notice Date
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Control
                      type="date"
                      name="noticeDate"
                      value={form.noticeDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>

                    <Form.Select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="placement">Placement</option>

                      <option value="internship">Internship</option>

                      <option value="training">Training</option>

                      <option value="drive">Campus Drive</option>

                      <option value="general">General</option>

                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              {/* DOCUMENT LINK */}

              <Form.Group className="mb-3">
                <Form.Label>External PDF / Document Link</Form.Label>

                <Form.Control
                  type="url"
                  name="documentLink"
                  value={form.documentLink}
                  onChange={handleChange}
                  placeholder="https://example.com/placement-notice.pdf"
                />

                <Form.Text>
                  Enter the external PDF or document URL. No PDF will be
                  uploaded to the website server.
                </Form.Text>
              </Form.Group>

              {/* BUTTON LABEL */}

              <Form.Group className="mb-3">
                <Form.Label>Document Button Label</Form.Label>

                <Form.Control
                  type="text"
                  name="documentLabel"
                  value={form.documentLabel}
                  onChange={handleChange}
                  placeholder="View Notice"
                />
              </Form.Group>

              {/* ORDER */}

              <Form.Group className="mb-3">
                <Form.Label>Display Order</Form.Label>

                <Form.Control
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min="0"
                />

                <Form.Text>
                  Lower numbers appear first when the same date is used.
                </Form.Text>
              </Form.Group>

              {/* PUBLISH */}

              <Form.Check
                type="switch"
                id="placement-notice-published"
                name="isPublished"
                label="Publish this notice"
                checked={form.isPublished}
                onChange={handleChange}
                className="placement-publish-switch"
              />

              {/* EXTRA SPACE FOR SCROLL */}

              <div className="placement-modal-bottom-space" />
            </Modal.Body>
          </div>

          {/* =================================================
              FOOTER ALWAYS VISIBLE
          ================================================= */}

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="placement-save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Saving...
                </>
              ) : editingNotice ? (
                "Update Notice"
              ) : (
                "Create Notice"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PlacementNoticesAdmin;
