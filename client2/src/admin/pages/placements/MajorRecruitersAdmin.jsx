import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FaBuilding,
  FaEdit,
  FaEye,
  FaGlobe,
  FaImage,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import {
  fetchMajorRecruitersAdmin,
  createMajorRecruiter,
  updateMajorRecruiter,
  deleteMajorRecruiter,
} from "../../services/majorRecruiterService";

import "./MajorRecruitersAdmin.css";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  companyName: "",
  imageAlt: "",
  website: "",
  description: "",
  category: "major-recruiter",
  order: 0,
  isPublished: true,
};

/* =========================================================
   COMPONENT
========================================================= */

const MajorRecruitersAdmin = () => {
  const [recruiters, setRecruiters] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [editingRecruiter, setEditingRecruiter] = useState(null);

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  /* =========================================================
     LOAD RECRUITERS
  ========================================================= */

  const loadRecruiters = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchMajorRecruitersAdmin();

      setRecruiters(result?.data || []);
    } catch (err) {
      console.error("Major Recruiters loading error:", err);

      setError(err?.message || "Failed to load major recruiters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
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
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /* =========================================================
     OPEN CREATE MODAL
  ========================================================= */

  const handleCreate = () => {
    setEditingRecruiter(null);

    setSelectedRecruiter(null);

    setForm(initialForm);

    setImageFile(null);

    setImagePreview("");

    setError("");

    setSuccess("");

    setShowFormModal(true);
  };

  /* =========================================================
     OPEN EDIT MODAL
  ========================================================= */

  const handleEdit = (recruiter) => {
    setEditingRecruiter(recruiter);

    setSelectedRecruiter(null);

    setForm({
      companyName: recruiter.companyName || "",

      imageAlt: recruiter.imageAlt || "",

      website: recruiter.website || "",

      description: recruiter.description || "",

      category: recruiter.category || "major-recruiter",

      order: recruiter.order ?? 0,

      isPublished: recruiter.isPublished !== false,
    });

    setImageFile(null);

    setImagePreview(recruiter.image || "");

    setError("");

    setSuccess("");

    setShowFormModal(true);
  };

  /* =========================================================
     CLOSE FORM MODAL
  ========================================================= */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowFormModal(false);

    setEditingRecruiter(null);

    setForm(initialForm);

    setImageFile(null);

    setImagePreview("");

    setError("");
  };

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.companyName.trim()) {
      setError("Company name is required.");

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("companyName", form.companyName.trim());

      formData.append("imageAlt", form.imageAlt.trim());

      formData.append("website", form.website.trim());

      formData.append("description", form.description.trim());

      formData.append("category", form.category);

      formData.append("order", String(form.order));

      formData.append("isPublished", String(form.isPublished));

      /* =========================================
         IMAGE
      ========================================= */

      if (imageFile) {
        formData.append("image", imageFile);
      }

      /* =========================================
         UPDATE
      ========================================= */

      if (editingRecruiter) {
        await updateMajorRecruiter(editingRecruiter._id, formData);

        setSuccess("Major recruiter updated successfully.");
      } else {

      /* =========================================
         CREATE
      ========================================= */
        await createMajorRecruiter(formData);

        setSuccess("Major recruiter created successfully.");
      }

      /* =========================================
         REFRESH
      ========================================= */

      await loadRecruiters();

      setShowFormModal(false);

      setEditingRecruiter(null);

      setForm(initialForm);

      setImageFile(null);

      setImagePreview("");
    } catch (err) {
      console.error("Major Recruiter save error:", err);

      setError(err?.message || "Failed to save major recruiter.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (recruiter) => {
    setSelectedRecruiter(recruiter);

    setShowViewModal(true);
  };

  /* =========================================================
     CLOSE VIEW
  ========================================================= */

  const handleCloseView = () => {
    setShowViewModal(false);

    setSelectedRecruiter(null);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this major recruiter?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");

      setSuccess("");

      await deleteMajorRecruiter(id);

      setRecruiters((previous) => previous.filter((item) => item._id !== id));

      setSuccess("Major recruiter deleted successfully.");
    } catch (err) {
      console.error("Major Recruiter delete error:", err);

      setError(err?.message || "Failed to delete major recruiter.");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="major-recruiters-admin">
        <div className="major-admin-loading">
          <Spinner animation="border" variant="primary" />

          <h5>Loading Major Recruiters...</h5>

          <p>Please wait while the data is loading.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="major-recruiters-admin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="major-admin-page-header">
        <div>
          <span className="major-admin-eyebrow">Placements</span>

          <h1>Major Recruiters</h1>

          <p>Manage the major recruiters displayed on the public website.</p>
        </div>

        <Button className="major-add-button" onClick={handleCreate}>
          <FaPlus />

          <span>Add Recruiter</span>
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
          MAIN CARD
      ===================================================== */}

      <Card className="major-admin-card">
        <Card.Header className="major-admin-card-header">
          <div>
            <h4>Recruiter List</h4>

            <span>
              {recruiters.length} recruiter
              {recruiters.length === 1 ? "" : "s"}
            </span>
          </div>

          <Button className="major-header-add-button" onClick={handleCreate}>
            <FaPlus />
            Add Recruiter
          </Button>
        </Card.Header>

        {/* ===================================================
            EMPTY
        =================================================== */}

        {recruiters.length === 0 ? (
          <div className="major-admin-empty">
            <div className="major-empty-icon">
              <FaBuilding />
            </div>

            <h4>No Major Recruiters</h4>

            <p>Add your first recruiter to display it on the public website.</p>

            <Button className="major-add-button" onClick={handleCreate}>
              <FaPlus />
              Add Recruiter
            </Button>
          </div>
        ) : (
          /* =================================================
             TABLE
          ================================================= */

          <div className="table-responsive">
            <Table hover className="major-admin-table">
              <thead>
                <tr>
                  <th>#</th>

                  <th>Company</th>

                  <th>Website</th>

                  <th>Category</th>

                  <th>Order</th>

                  <th>Status</th>

                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {recruiters.map((recruiter, index) => (
                  <tr key={recruiter._id || recruiter.id}>
                    {/* NUMBER */}

                    <td>
                      <span className="major-row-number">{index + 1}</span>
                    </td>

                    {/* COMPANY */}

                    <td>
                      <div className="major-company-cell">
                        <div className="major-company-logo">
                          {recruiter.image ? (
                            <img
                              src={recruiter.image}
                              alt={recruiter.imageAlt || recruiter.companyName}
                            />
                          ) : (
                            <FaBuilding />
                          )}
                        </div>

                        <div className="major-company-info">
                          <strong>{recruiter.companyName}</strong>

                          {recruiter.description && (
                            <small>{recruiter.description}</small>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* WEBSITE */}

                    <td>
                      {recruiter.website ? (
                        <a
                          href={recruiter.website}
                          target="_blank"
                          rel="noreferrer"
                          className="major-website-link"
                        >
                          <FaGlobe />
                          Website
                        </a>
                      ) : (
                        <span className="major-empty-value">—</span>
                      )}
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="major-category-badge">
                        {recruiter.category || "major-recruiter"}
                      </span>
                    </td>

                    {/* ORDER */}

                    <td>
                      <span className="major-order">
                        {recruiter.order ?? 0}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      {recruiter.isPublished ? (
                        <Badge bg="success" className="major-status-badge">
                          Published
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="major-status-badge">
                          Draft
                        </Badge>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="major-action-buttons">
                        <Button
                          className="major-view-btn"
                          onClick={() => handleView(recruiter)}
                          title="View"
                        >
                          <FaEye />
                        </Button>

                        <Button
                          className="major-edit-btn"
                          onClick={() => handleEdit(recruiter)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          className="major-delete-btn"
                          disabled={deletingId === recruiter._id}
                          onClick={() => handleDelete(recruiter._id)}
                          title="Delete"
                        >
                          {deletingId === recruiter._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaTrash />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        show={showFormModal}
        onHide={handleCloseForm}
        size="lg"
        centered
        scrollable
        className="major-recruiter-modal"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <div>
              <small>Placements</small>

              <Modal.Title>
                {editingRecruiter
                  ? "Edit Major Recruiter"
                  : "Add Major Recruiter"}
              </Modal.Title>
            </div>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
              {/* =================================================
                  COMPANY
              ================================================= */}

              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Company Name
                    <span className="text-danger"> *</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>

              {/* =================================================
                  ORDER
              ================================================= */}

              <Col md={4}>
                <Form.Group className="mb-3">
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
            </Row>

            {/* =================================================
                IMAGE
            ================================================= */}

            <Form.Group className="mb-3">
              <Form.Label>Company Logo</Form.Label>

              <div className="major-upload-box">
                <div className="major-upload-icon">
                  <FaImage />
                </div>

                <div>
                  <Form.Control
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                  />

                  <small>Upload JPG, PNG or WEBP company logo.</small>
                </div>
              </div>
            </Form.Group>

            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            {imagePreview && (
              <div className="major-image-preview-wrapper">
                <span>Logo Preview</span>

                <div className="major-image-preview">
                  <img src={imagePreview} alt="Company logo preview" />
                </div>
              </div>
            )}

            {/* =================================================
                ALT
            ================================================= */}

            <Form.Group className="mb-3">
              <Form.Label>Image Alt Text</Form.Label>

              <Form.Control
                type="text"
                name="imageAlt"
                value={form.imageAlt}
                onChange={handleChange}
                placeholder="Example: TCS company logo"
              />
            </Form.Group>

            {/* =================================================
                WEBSITE
            ================================================= */}

            <Form.Group className="mb-3">
              <Form.Label>Company Website</Form.Label>

              <Form.Control
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
              />
            </Form.Group>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter short company description"
              />
            </Form.Group>

            <Row>
              {/* =================================================
                  CATEGORY
              ================================================= */}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>

                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="major-recruiter">Major Recruiter</option>

                    <option value="top-recruiter">Top Recruiter</option>

                    <option value="industry-partner">Industry Partner</option>

                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* =================================================
                  STATUS
              ================================================= */}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publishing</Form.Label>

                  <div className="major-publish-switch">
                    <Form.Check
                      type="switch"
                      id="major-published"
                      name="isPublished"
                      label={
                        form.isPublished
                          ? "Published on website"
                          : "Hidden from website"
                      }
                      checked={form.isPublished}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseForm}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              className="major-save-button"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>{editingRecruiter ? "Update Recruiter" : "Save Recruiter"}</>
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
        onHide={handleCloseView}
        centered
        size="lg"
        scrollable
      >
        {selectedRecruiter && (
          <>
            <Modal.Header closeButton>
              <div>
                <small>Major Recruiter</small>

                <Modal.Title>{selectedRecruiter.companyName}</Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Row>
                <Col md={5} className="text-center">
                  {selectedRecruiter.image ? (
                    <div className="major-view-image-box">
                      <img
                        src={selectedRecruiter.image}
                        alt={
                          selectedRecruiter.imageAlt ||
                          selectedRecruiter.companyName
                        }
                      />
                    </div>
                  ) : (
                    <div className="major-view-no-image">
                      <FaBuilding />

                      <span>No logo uploaded</span>
                    </div>
                  )}
                </Col>

                <Col md={7}>
                  <div className="major-view-information">
                    <h3>{selectedRecruiter.companyName}</h3>

                    <div className="major-view-row">
                      <strong>Category</strong>

                      <span>
                        {selectedRecruiter.category || "major-recruiter"}
                      </span>
                    </div>

                    <div className="major-view-row">
                      <strong>Display Order</strong>

                      <span>{selectedRecruiter.order ?? 0}</span>
                    </div>

                    <div className="major-view-row">
                      <strong>Status</strong>

                      <span>
                        {selectedRecruiter.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {selectedRecruiter.website && (
                      <div className="major-view-row">
                        <strong>Website</strong>

                        <a
                          href={selectedRecruiter.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedRecruiter.website}
                        </a>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              {selectedRecruiter.description && (
                <div className="major-view-description">
                  <h5>Description</h5>

                  <p>{selectedRecruiter.description}</p>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseView}>
                Close
              </Button>

              <Button
                className="major-save-button"
                onClick={() => {
                  handleCloseView();

                  handleEdit(selectedRecruiter);
                }}
              >
                <FaEdit /> Edit Recruiter
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MajorRecruitersAdmin;
