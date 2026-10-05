import React, { useEffect, useState } from "react";

import {
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
  FaEdit,
  FaEye,
  FaImage,
  FaPlus,
  FaTrash,
  FaExternalLinkAlt,
  FaSave,
  FaTimes,
  FaStar,
  FaSortNumericDown,
} from "react-icons/fa";

import {
  getShiningStars,
  createShiningStar,
  updateShiningStar,
  deleteShiningStar,
  toggleShiningStarStatus,
} from "../../services/shiningStarService.js";

import "./ShiningStarsAdmin.css";

const ShiningStarsAdmin = () => {
  const [stars, setStars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingStar, setEditingStar] = useState(null);

  const [selectedStar, setSelectedStar] = useState(null);

  const [deleteStar, setDeleteStar] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({
    image: null,
    imageAlt: "",
    batch: "",
    order: 0,
    isPublished: true,
  });

  /* =======================================================
     LOAD
  ======================================================= */

  const loadStars = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getShiningStars();

      const data = response?.data || [];

      data.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

      setStars(data);
    } catch (err) {
      console.error("Load shining stars error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load shining stars.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStars();
  }, []);

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    setForm({
      image: null,
      imageAlt: "",
      batch: "",
      order: 0,
      isPublished: true,
    });

    setImagePreview("");

    setEditingStar(null);
  };

  /* =======================================================
     CREATE
  ======================================================= */

  const handleCreate = () => {
    resetForm();

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (star) => {
    setEditingStar(star);

    setForm({
      image: null,

      imageAlt: star.imageAlt || "",

      batch: star.batch || "",

      order: star.order || 0,

      isPublished: star.isPublished !== false,
    });

    setImagePreview(star.image || "");

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     IMAGE
  ======================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      event.target.value = "";

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      event.target.value = "";

      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));

    setError("");
  };

  /* =======================================================
     INPUT
  ======================================================= */

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!editingStar && !form.image) {
        setError("Please select a Shining Star photo.");

        setSaving(false);

        return;
      }

      const formData = new FormData();

      if (form.image) {
        formData.append("image", form.image);
      }

      formData.append("imageAlt", form.imageAlt);

      formData.append("batch", form.batch);

      formData.append("order", String(Number(form.order) || 0));

      formData.append("isPublished", String(form.isPublished));

      if (editingStar) {
        await updateShiningStar(editingStar._id, formData);

        setSuccess("Shining Star updated successfully.");
      } else {
        await createShiningStar(formData);

        setSuccess("Shining Star created successfully.");
      }

      setShowModal(false);

      resetForm();

      await loadStars();
    } catch (err) {
      console.error("Save shining star error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save Shining Star.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     VIEW
  ======================================================= */

  const handleView = (star) => {
    setSelectedStar(star);

    setShowViewModal(true);
  };

  /* =======================================================
     DELETE CONFIRM
  ======================================================= */

  const handleDeleteConfirm = (star) => {
    setDeleteStar(star);

    setShowDeleteModal(true);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    if (!deleteStar) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await deleteShiningStar(deleteStar._id);

      setShowDeleteModal(false);

      setDeleteStar(null);

      setSuccess("Shining Star deleted successfully.");

      await loadStars();
    } catch (err) {
      console.error("Delete shining star error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete Shining Star.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const handleStatusToggle = async (star) => {
    try {
      setError("");
      setSuccess("");

      await toggleShiningStarStatus(star._id);

      setSuccess(
        star.isPublished
          ? "Shining Star moved to Draft."
          : "Shining Star published successfully.",
      );

      await loadStars();
    } catch (err) {
      console.error("Toggle status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update status.",
      );
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="shining-stars-loading">
        <Spinner animation="border" />

        <h5>Loading Shining Stars...</h5>

        <p>Please wait.</p>
      </div>
    );
  }

  return (
    <div className="shining-stars-admin">
      {/* HEADER */}

      <div className="shining-stars-page-header">
        <div>
          <span>Placements</span>

          <h1>Shining Stars</h1>

          <p>Manage placement achiever photos and their batch information.</p>
        </div>

        <Button className="shining-stars-add-btn" onClick={handleCreate}>
          <FaPlus />
          Add Shining Star
        </Button>
      </div>

      {/* ALERTS */}

      {error && <div className="shining-stars-alert error">{error}</div>}

      {success && <div className="shining-stars-alert success">{success}</div>}

      {/* TABLE */}

      <Card className="shining-stars-card">
        <Card.Header>
          <div>
            <h4>Shining Star Photos</h4>

            <span>Lower priority number appears first</span>
          </div>

          <Button className="shining-stars-refresh-btn" onClick={loadStars}>
            Refresh
          </Button>
        </Card.Header>

        <div className="table-responsive">
          <Table hover className="shining-stars-table">
            <thead>
              <tr>
                <th>Photo</th>

                <th>Batch</th>

                <th>Alt Text</th>

                <th>Priority</th>

                <th>Status</th>

                <th>Created</th>

                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stars.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-0">
                    <div className="shining-stars-empty">
                      <div className="shining-stars-empty-icon">
                        <FaStar />
                      </div>

                      <h4>No Shining Stars</h4>

                      <p>
                        Add the first Shining Star photo to display it on the
                        public website.
                      </p>

                      <Button
                        onClick={handleCreate}
                        className="shining-stars-add-btn"
                      >
                        <FaPlus />
                        Add Photo
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                stars.map((star) => (
                  <tr key={star._id}>
                    <td>
                      <div className="shining-stars-photo-cell">
                        <img
                          src={star.image}
                          alt={star.imageAlt || "Shining Star"}
                        />

                        <div>
                          <strong>Shining Star</strong>

                          <small>ID: {star._id?.slice(-8)}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="shining-stars-batch">
                        {star.batch || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="shining-stars-alt">
                        {star.imageAlt || "No alt text"}
                      </span>
                    </td>

                    <td>
                      <span className="shining-stars-order">
                        <FaSortNumericDown />

                        {star.order ?? 0}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`shining-stars-status ${
                          star.isPublished ? "published" : "draft"
                        }`}
                        onClick={() => handleStatusToggle(star)}
                      >
                        <span />

                        {star.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td>
                      <span className="shining-stars-date">
                        {star.createdAt
                          ? new Date(star.createdAt).toLocaleDateString("en-IN")
                          : "-"}
                      </span>
                    </td>

                    <td>
                      <div className="shining-stars-actions">
                        <Button
                          className="star-action-view"
                          onClick={() => handleView(star)}
                          title="View"
                        >
                          <FaEye />
                        </Button>

                        <Button
                          className="star-action-edit"
                          onClick={() => handleEdit(star)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          className="star-action-delete"
                          onClick={() => handleDeleteConfirm(star)}
                          title="Delete"
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
      </Card>

      {/* CREATE / EDIT MODAL */}

      <Modal
        show={showModal}
        onHide={() => {
          if (!saving) {
            setShowModal(false);

            resetForm();
          }
        }}
        centered
        className="shining-stars-modal"
      >
        <Modal.Header closeButton>
          <div>
            <small>Placements</small>

            <Modal.Title>
              {editingStar ? "Edit Shining Star" : "Add Shining Star"}
            </Modal.Title>
          </div>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* PHOTO */}

            <div className="shining-stars-form-section">
              <h5>Star Photo</h5>

              <div className="shining-stars-upload">
                {imagePreview ? (
                  <div className="shining-stars-preview">
                    <img src={imagePreview} alt="Preview" />

                    <label>
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="shining-stars-upload-box">
                    <FaImage />

                    <strong>Select Photo</strong>

                    <span>JPG, PNG, WEBP up to 10 MB</span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* INFORMATION */}

            <div className="shining-stars-form-section">
              <h5>Star Information</h5>

              <Form.Group className="mb-3">
                <Form.Label>Batch</Form.Label>

                <Form.Control
                  type="text"
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  placeholder="Example: 2021-2025"
                />

                <Form.Text>Enter the student's batch.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image Alt Text</Form.Label>

                <Form.Control
                  type="text"
                  name="imageAlt"
                  value={form.imageAlt}
                  onChange={handleChange}
                  placeholder="Example: IMSEC Shining Star"
                />

                <Form.Text>
                  Describe the image for accessibility and SEO.
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Priority / Display Order</Form.Label>

                    <Form.Control
                      type="number"
                      name="order"
                      min="0"
                      value={form.order}
                      onChange={handleChange}
                    />

                    <Form.Text>Lower number appears first.</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <div className="shining-stars-publish-box">
                    <Form.Check
                      type="switch"
                      id="shining-star-published"
                      name="isPublished"
                      label="Publish on website"
                      checked={form.isPublished}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="light"
              onClick={() => {
                setShowModal(false);

                resetForm();
              }}
              disabled={saving}
            >
              <FaTimes />
              Cancel
            </Button>

            <Button
              type="submit"
              className="shining-stars-save-btn"
              disabled={saving}
            >
              {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}

              {editingStar ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* VIEW MODAL */}

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        size="lg"
        className="shining-stars-view-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Shining Star</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedStar && (
            <div className="shining-stars-view">
              <img
                src={selectedStar.image}
                alt={selectedStar.imageAlt || "Shining Star"}
              />

              <div className="shining-stars-view-info">
                <strong>{selectedStar.imageAlt || "IMSEC Shining Star"}</strong>

                <span>Batch: {selectedStar.batch || "-"}</span>

                <span>Priority: {selectedStar.order ?? 0}</span>

                <span>
                  Status: {selectedStar.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {selectedStar?.image && (
            <Button
              as="a"
              href={selectedStar.image}
              target="_blank"
              rel="noopener noreferrer"
              className="shining-stars-open-btn"
            >
              <FaExternalLinkAlt />
              Open Image
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* DELETE MODAL */}

      <Modal
        show={showDeleteModal}
        onHide={() => !saving && setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Shining Star</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="shining-stars-delete">
            <div className="shining-stars-delete-icon">
              <FaTrash />
            </div>

            <h5>Delete this photo?</h5>

            <p>
              This will permanently remove the Shining Star from the website.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowDeleteModal(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : <FaTrash />}
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShiningStarsAdmin;
