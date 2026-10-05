import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FaEdit,
  FaEye,
  FaFilePdf,
  FaPlus,
  FaSave,
  FaTrash,
  FaExternalLinkAlt,
  FaSortNumericDown,
} from "react-icons/fa";

import {
  getPlacementPolicies,
  createPlacementPolicy,
  updatePlacementPolicy,
  deletePlacementPolicy,
  togglePlacementPolicyStatus,
} from "../../services/placementPolicyService";

import "./PlacementPolicyAdmin.css";

/* =========================================================
   DEFAULT FORM
========================================================= */

const initialForm = {
  title: "",
  shortDescription: "",
  content: "",
  pdfLink: "",
  documentTitle: "",
  order: 0,
  isPublished: true,
};

/* =========================================================
   COMPONENT
========================================================= */

const PlacementPolicyAdmin = () => {
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [editingPolicy, setEditingPolicy] = useState(null);

  const [viewingPolicy, setViewingPolicy] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /* =========================================================
   LOAD POLICIES
========================================================= */

  const loadPolicies = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPlacementPolicies();

      setPolicies(response?.data || []);
    } catch (err) {
      console.error("Load placement policies error:", err);

      setError(
        err?.response?.data?.message || "Unable to load placement policies.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
   INITIAL LOAD
========================================================= */

  useEffect(() => {
    loadPolicies();
  }, []);

  /* =========================================================
   FORM CHANGE
========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
   OPEN CREATE MODAL
========================================================= */

  const handleCreate = () => {
    setEditingPolicy(null);

    setForm({
      ...initialForm,
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =========================================================
   OPEN EDIT MODAL
========================================================= */

  const handleEdit = (policy) => {
    setEditingPolicy(policy);

    setForm({
      title: policy.title || "",

      shortDescription: policy.shortDescription || "",

      content: policy.content || "",

      pdfLink: policy.pdfLink || "",

      documentTitle: policy.documentTitle || "",

      order: policy.order ?? 0,

      isPublished: Boolean(policy.isPublished),
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =========================================================
   CLOSE FORM MODAL
========================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingPolicy(null);

    setForm({
      ...initialForm,
    });
  };

  /* =========================================================
   SUBMIT
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
        setError("Policy title is required.");

        setSaving(false);

        return;
      }

      const payload = {
        title: form.title.trim(),

        shortDescription: form.shortDescription.trim(),

        content: form.content.trim(),

        pdfLink: form.pdfLink.trim(),

        documentTitle: form.documentTitle.trim(),

        order: Number(form.order) || 0,

        isPublished: Boolean(form.isPublished),
      };

      /* =========================================
         UPDATE
      ========================================= */

      if (editingPolicy) {
        await updatePlacementPolicy(editingPolicy._id, payload);

        setSuccess("Placement policy updated successfully.");
      } else {
        /* =========================================
         CREATE
      ========================================= */
        await createPlacementPolicy(payload);

        setSuccess("Placement policy created successfully.");
      }

      await loadPolicies();

      setShowModal(false);

      setEditingPolicy(null);

      setForm({
        ...initialForm,
      });
    } catch (err) {
      console.error("Save placement policy error:", err);

      setError(
        err?.response?.data?.message || "Unable to save placement policy.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
   VIEW
========================================================= */

  const handleView = (policy) => {
    setViewingPolicy(policy);

    setShowViewModal(true);
  };

  /* =========================================================
   DELETE CONFIRM
========================================================= */

  const handleDeleteClick = (policy) => {
    setDeleteTarget(policy);

    setShowDeleteModal(true);
  };

  /* =========================================================
   DELETE
========================================================= */

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      setError("");

      await deletePlacementPolicy(deleteTarget._id);

      setSuccess("Placement policy deleted successfully.");

      setShowDeleteModal(false);

      setDeleteTarget(null);

      await loadPolicies();
    } catch (err) {
      console.error("Delete placement policy error:", err);

      setError(
        err?.response?.data?.message || "Unable to delete placement policy.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
   TOGGLE STATUS
========================================================= */

  const handleToggleStatus = async (policy) => {
    try {
      setError("");

      await togglePlacementPolicyStatus(policy._id);

      setSuccess(
        policy.isPublished
          ? "Policy moved to draft."
          : "Policy published successfully.",
      );

      await loadPolicies();
    } catch (err) {
      console.error("Toggle placement policy status error:", err);

      setError(
        err?.response?.data?.message || "Unable to change policy status.",
      );
    }
  };

  /* =========================================================
   FORMAT DATE
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
      <div className="placement-policy-loading">
        <Spinner animation="border" />

        <h5>Loading Placement Policies</h5>

        <p>Please wait...</p>
      </div>
    );
  }

  /* =========================================================
   RENDER
========================================================= */

  return (
    <div className="placement-policy-admin">
      <Container fluid>
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="placement-policy-page-header">
          <div>
            <span>Placements</span>

            <h1>Placement Policy</h1>

            <p>
              Manage placement policies and provide the external PDF link for
              students.
            </p>
          </div>

          <Button
            className="placement-policy-add-button"
            onClick={handleCreate}
          >
            <FaPlus />
            Add Placement Policy
          </Button>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

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

        {/* =================================================
            TABLE CARD
        ================================================= */}

        <Card className="placement-policy-card">
          <Card.Header>
            <div>
              <h4>Placement Policies </h4>

              <span>
                {policies.length}{" "}
                {policies.length === 1 ? "policy" : "policies"} available
              </span>
            </div>

            <Button
              className="placement-policy-refresh-button"
              onClick={loadPolicies}
            >
              Refresh
            </Button>
          </Card.Header>

          <Card.Body className="p-0">
            {policies.length === 0 ? (
              <div className="placement-policy-empty">
                <div className="placement-policy-empty-icon">
                  <FaFilePdf />
                </div>

                <h4>No Placement Policies</h4>

                <p>
                  Create your first placement policy to display it on the public
                  website.
                </p>

                <Button
                  className="placement-policy-add-button"
                  onClick={handleCreate}
                >
                  <FaPlus />
                  Add Policy
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="placement-policy-table">
                  <thead>
                    <tr>
                      <th>#</th>

                      <th>Policy</th>

                      <th>Document</th>

                      <th>Order</th>

                      <th>Status</th>

                      <th>Updated</th>

                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {policies.map((policy, index) => (
                      <tr key={policy._id}>
                        <td>{index + 1}</td>

                        {/* POLICY */}

                        <td>
                          <div className="placement-policy-title-cell">
                            <div className="placement-policy-pdf-icon">
                              <FaFilePdf />
                            </div>

                            <div>
                              <strong>{policy.title}</strong>

                              {policy.shortDescription && (
                                <small>{policy.shortDescription}</small>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* DOCUMENT */}

                        <td>
                          {policy.pdfLink ? (
                            <a
                              href={policy.pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="placement-policy-pdf-link"
                            >
                              <FaFilePdf />

                              {policy.documentTitle || "View PDF"}

                              <FaExternalLinkAlt />
                            </a>
                          ) : (
                            <span className="placement-policy-no-pdf">
                              No PDF link
                            </span>
                          )}
                        </td>

                        {/* ORDER */}

                        <td>
                          <span className="placement-policy-order">
                            <FaSortNumericDown />

                            {policy.order}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <button
                            type="button"
                            className={
                              policy.isPublished
                                ? "placement-policy-status published"
                                : "placement-policy-status draft"
                            }
                            onClick={() => handleToggleStatus(policy)}
                          >
                            <span />

                            {policy.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>

                        {/* UPDATED */}

                        <td>
                          <span className="placement-policy-date">
                            {formatDate(policy.updatedAt)}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="placement-policy-actions">
                            <Button
                              className="policy-action-view"
                              title="View"
                              onClick={() => handleView(policy)}
                            >
                              <FaEye />
                            </Button>

                            <Button
                              className="policy-action-edit"
                              title="Edit"
                              onClick={() => handleEdit(policy)}
                            >
                              <FaEdit />
                            </Button>

                            <Button
                              className="policy-action-delete"
                              title="Delete"
                              onClick={() => handleDeleteClick(policy)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        className="placement-policy-modal"
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <div>
              <small>Placement Management</small>

              <Modal.Title>
                {editingPolicy
                  ? "Edit Placement Policy"
                  : "Add Placement Policy"}
              </Modal.Title>
            </div>
          </Modal.Header>

          <Modal.Body>
            {/* =============================================
                BASIC INFORMATION
            ============================================= */}

            <div className="placement-policy-form-section">
              <div className="placement-policy-form-section-title">
                Basic Information
              </div>

              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>
                      Policy Title
                      <span>*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter placement policy title"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Short Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleChange}
                      placeholder="Enter a short description"
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Policy Content</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={8}
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Enter placement policy content"
                    />

                    <Form.Text>
                      You can enter the complete policy text here.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* =============================================
                PDF LINK
            ============================================= */}

            <div className="placement-policy-form-section">
              <div className="placement-policy-form-section-title">
                Policy Document
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Document Title</Form.Label>

                    <Form.Control
                      type="text"
                      name="documentTitle"
                      value={form.documentTitle}
                      onChange={handleChange}
                      placeholder="e.g. Placement Policy 2026"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Display Order</Form.Label>

                    <Form.Control
                      type="number"
                      name="order"
                      min="0"
                      value={form.order}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>PDF Link</Form.Label>

                    <Form.Control
                      type="url"
                      name="pdfLink"
                      value={form.pdfLink}
                      onChange={handleChange}
                      placeholder="https://example.com/placement-policy.pdf"
                    />

                    <Form.Text>
                      Paste the complete public PDF URL. No file upload is
                      required.
                    </Form.Text>
                  </Form.Group>
                </Col>

                {form.pdfLink && (
                  <Col md={12}>
                    <div className="placement-policy-link-preview">
                      <FaFilePdf />

                      <div>
                        <strong>PDF link added</strong>

                        <small>{form.pdfLink}</small>
                      </div>

                      <a
                        href={form.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkAlt />
                        Test Link
                      </a>
                    </div>
                  </Col>
                )}
              </Row>
            </div>

            {/* =============================================
                PUBLISH
            ============================================= */}

            <div className="placement-policy-publish-box">
              <Form.Check
                type="switch"
                id="placement-policy-published"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                label={
                  form.isPublished
                    ? "Published - visible on public website"
                    : "Draft - hidden from public website"
                }
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="placement-policy-save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" animation="border" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />

                  {editingPolicy ? "Update Policy" : "Save Policy"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        size="lg"
        className="placement-policy-view-modal"
      >
        {viewingPolicy && (
          <>
            <Modal.Header closeButton>
              <div>
                <small>Placement Policy</small>

                <Modal.Title>{viewingPolicy.title}</Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              <div className="placement-policy-view-content">
                {/* STATUS */}

                <div className="placement-policy-view-status-row">
                  <span
                    className={
                      viewingPolicy.isPublished
                        ? "placement-policy-status published"
                        : "placement-policy-status draft"
                    }
                  >
                    <span />

                    {viewingPolicy.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* DESCRIPTION */}

                {viewingPolicy.shortDescription && (
                  <div className="placement-policy-view-description">
                    <h5>Description</h5>

                    <p>{viewingPolicy.shortDescription}</p>
                  </div>
                )}

                {/* CONTENT */}

                {viewingPolicy.content && (
                  <div className="placement-policy-view-content-text">
                    <h5>Policy</h5>

                    <p>{viewingPolicy.content}</p>
                  </div>
                )}

                {/* PDF */}

                <div className="placement-policy-view-pdf">
                  <div className="placement-policy-view-pdf-icon">
                    <FaFilePdf />
                  </div>

                  <div>
                    <strong>
                      {viewingPolicy.documentTitle || "Placement Policy PDF"}
                    </strong>

                    <small>
                      {viewingPolicy.pdfLink
                        ? "External PDF document"
                        : "No PDF link provided"}
                    </small>
                  </div>

                  {viewingPolicy.pdfLink && (
                    <a
                      href={viewingPolicy.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt />
                      View PDF
                    </a>
                  )}
                </div>

                {/* META */}

                <div className="placement-policy-view-meta">
                  <div>
                    <strong>Display Order</strong>

                    <span>{viewingPolicy.order}</span>
                  </div>

                  <div>
                    <strong>Created</strong>

                    <span>{formatDate(viewingPolicy.createdAt)}</span>
                  </div>

                  <div>
                    <strong>Updated</strong>

                    <span>{formatDate(viewingPolicy.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>

              {viewingPolicy.pdfLink && (
                <Button
                  className="placement-policy-save-button"
                  href={viewingPolicy.pdfLink}
                  target="_blank"
                >
                  <FaFilePdf />
                  Open PDF
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <Modal
        show={showDeleteModal}
        onHide={() => !deleting && setShowDeleteModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton={!deleting}>
          <Modal.Title>Delete Policy</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="placement-policy-delete-content">
            <div className="placement-policy-delete-icon">
              <FaTrash />
            </div>

            <h5>Delete this policy?</h5>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.title}</strong>?
            </p>

            <small>This action cannot be undone.</small>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner size="sm" animation="border" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlacementPolicyAdmin;
