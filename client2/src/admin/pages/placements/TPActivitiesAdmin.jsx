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
  FaEdit,
  FaEye,
  FaFacebookF,
  FaFileImage,
  FaInstagram,
  FaLinkedinIn,
  FaPlus,
  FaTrash,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import {
  fetchTPActivitiesAdmin,
  createTPActivity,
  updateTPActivity,
  deleteTPActivity,
} from "../../services/tpActivityService";

import "./TPActivitiesAdmin.css";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  title: "",
  description: "",
  activityDate: "",
  category: "placement-drive",
  venue: "",
  organization: "",
  imageAlt: "",
  order: 0,
  isPublished: true,

  socialMedia: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

const TPActivitiesAdmin = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [editingActivity, setEditingActivity] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [mainImage, setMainImage] = useState(null);

  const [mainImagePreview, setMainImagePreview] = useState("");

  const [galleryFiles, setGalleryFiles] = useState([]);

  const [galleryPreviews, setGalleryPreviews] = useState([]);

  /* =========================================================
     LOAD ACTIVITIES
  ========================================================= */

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchTPActivitiesAdmin();

      setActivities(result?.data || []);
    } catch (err) {
      console.error("T&P activities loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load T&P activities.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  /* =========================================================
     NORMALIZE SOCIAL MEDIA
  ========================================================= */

  const getSocialMedia = (activity) => {
    return {
      facebook: activity?.socialMedia?.facebook || "",

      instagram: activity?.socialMedia?.instagram || "",

      linkedin: activity?.socialMedia?.linkedin || "",

      youtube: activity?.socialMedia?.youtube || "",

      twitter: activity?.socialMedia?.twitter || "",
    };
  };

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
     SOCIAL CHANGE
  ========================================================= */

  const handleSocialChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      socialMedia: {
        ...previous.socialMedia,

        [name]: value,
      },
    }));
  };

  /* =========================================================
     MAIN IMAGE CHANGE
  ========================================================= */

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setError("Please select JPG, PNG or WEBP image.");

      event.target.value = "";

      return;
    }

    if (file.size === 0) {
      setError("The selected image is empty.");

      event.target.value = "";

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Main image must be less than 10 MB.");

      event.target.value = "";

      return;
    }

    setMainImage(file);

    setMainImagePreview(URL.createObjectURL(file));
  };

  /* =========================================================
     GALLERY CHANGE
  ========================================================= */

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setError("");

    if (files.length > 10) {
      setError("You can select a maximum of 10 gallery images.");

      event.target.value = "";

      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const invalidFile = files.find((file) => !validTypes.includes(file.type));

    if (invalidFile) {
      setError("Gallery images must be JPG, PNG or WEBP.");

      event.target.value = "";

      return;
    }

    const emptyFile = files.find((file) => file.size === 0);

    if (emptyFile) {
      setError("One of the selected gallery images is empty.");

      event.target.value = "";

      return;
    }

    const oversizedFile = files.find((file) => file.size > 10 * 1024 * 1024);

    if (oversizedFile) {
      setError("Each gallery image must be less than 10 MB.");

      event.target.value = "";

      return;
    }

    setGalleryFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setGalleryPreviews(previews);
  };

  /* =========================================================
     REMOVE NEW GALLERY IMAGE
  ========================================================= */

  const removeGalleryFile = (index) => {
    setGalleryFiles((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );

    setGalleryPreviews((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  /* =========================================================
     OPEN CREATE
  ========================================================= */

  const handleCreate = () => {
    setEditingActivity(null);

    setSelectedActivity(null);

    setForm({
      ...initialForm,

      activityDate: new Date().toISOString().split("T")[0],

      socialMedia: {
        ...initialForm.socialMedia,
      },
    });

    setMainImage(null);

    setMainImagePreview("");

    setGalleryFiles([]);

    setGalleryPreviews([]);

    setError("");

    setSuccess("");

    setShowFormModal(true);
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleEdit = (activity) => {
    setEditingActivity(activity);

    setSelectedActivity(null);

    let activityDate = "";

    if (activity.activityDate) {
      activityDate = new Date(activity.activityDate)
        .toISOString()
        .split("T")[0];
    }

    setForm({
      title: activity.title || "",

      description: activity.description || "",

      activityDate,

      category: activity.category || "placement-drive",

      venue: activity.venue || "",

      organization: activity.organization || "",

      imageAlt: activity.imageAlt || "",

      order: activity.order ?? 0,

      isPublished: activity.isPublished !== false,

      socialMedia: getSocialMedia(activity),
    });

    setMainImage(null);

    setMainImagePreview(activity.image || "");

    setGalleryFiles([]);

    setGalleryPreviews([]);

    setError("");

    setSuccess("");

    setShowFormModal(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowFormModal(false);

    setEditingActivity(null);

    setForm({
      ...initialForm,
      socialMedia: {
        ...initialForm.socialMedia,
      },
    });

    setMainImage(null);

    setMainImagePreview("");

    setGalleryFiles([]);

    setGalleryPreviews([]);

    setError("");
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* =========================================
       VALIDATION
    ========================================= */

    if (!form.title.trim()) {
      setError("Activity title is required.");

      return;
    }

    if (!form.activityDate) {
      setError("Activity date is required.");

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      /* =========================================
         BASIC FIELDS
      ========================================= */

      formData.append("title", form.title.trim());

      formData.append("description", form.description.trim());

      formData.append("activityDate", form.activityDate);

      formData.append("category", form.category);

      formData.append("venue", form.venue.trim());

      formData.append("organization", form.organization.trim());

      formData.append("imageAlt", form.imageAlt.trim());

      formData.append("order", String(Number(form.order || 0)));

      formData.append("isPublished", String(form.isPublished));

      /* =========================================
         SOCIAL MEDIA
      ========================================= */

      formData.append("socialMedia", JSON.stringify(form.socialMedia));

      /* =========================================
         MAIN IMAGE
      ========================================= */

      if (mainImage) {
        formData.append("image", mainImage, mainImage.name);
      }

      /* =========================================
         GALLERY
      ========================================= */

      galleryFiles.forEach((file) => {
        formData.append("gallery", file, file.name);
      });

      /* =========================================
         CREATE
      ========================================= */

      if (!editingActivity) {
        await createTPActivity(formData);

        setSuccess("T&P activity created successfully.");
      } else {
        /* =========================================
         UPDATE
      ========================================= */
        await updateTPActivity(editingActivity._id, formData);

        setSuccess("T&P activity updated successfully.");
      }

      /* =========================================
         REFRESH
      ========================================= */

      await loadActivities();

      setShowFormModal(false);

      setEditingActivity(null);

      setMainImage(null);

      setMainImagePreview("");

      setGalleryFiles([]);

      setGalleryPreviews([]);
    } catch (err) {
      console.error("T&P activity save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save T&P activity.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (activity) => {
    setSelectedActivity(activity);

    setShowViewModal(true);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this T&P activity?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");

      setSuccess("");

      await deleteTPActivity(id);

      setActivities((previous) => previous.filter((item) => item._id !== id));

      setSuccess("T&P activity deleted successfully.");
    } catch (err) {
      console.error("T&P activity delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete T&P activity.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     CATEGORY LABEL
  ========================================================= */

  const categoryLabel = (value) => {
    if (!value) {
      return "Placement Drive";
    }

    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="tp-activities-admin">
        <div className="tp-activities-loading">
          <Spinner animation="border" variant="primary" />

          <h5>Loading T&P Activities...</h5>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="tp-activities-admin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="tp-activities-page-header">
        <div>
          <span>Placements</span>

          <h1>T&amp;P Activities</h1>

          <p>
            Create and manage Training & Placement activities displayed on the
            public website.
          </p>
        </div>

        <Button className="tp-activity-add-button" onClick={handleCreate}>
          <FaPlus />
          Add Activity
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
          CARD
      ===================================================== */}

      <Card className="tp-activities-card">
        <Card.Header>
          <div>
            <h4>Activity List</h4>

            <span>
              {activities.length} activit
              {activities.length === 1 ? "y" : "ies"}
            </span>
          </div>

          <Button className="tp-activity-header-button" onClick={handleCreate}>
            <FaPlus />
            Add Activity
          </Button>
        </Card.Header>

        {/* =================================================
            EMPTY
        ================================================= */}

        {activities.length === 0 ? (
          <div className="tp-activities-empty">
            <div className="tp-activities-empty-icon">
              <FaFileImage />
            </div>

            <h4>No T&amp;P Activities</h4>

            <p>Create your first Training & Placement activity.</p>

            <Button className="tp-activity-add-button" onClick={handleCreate}>
              <FaPlus />
              Add Activity
            </Button>
          </div>
        ) : (
          /* =================================================
             TABLE
          ================================================= */

          <div className="table-responsive">
            <Table hover className="tp-activities-table">
              <thead>
                <tr>
                  <th>#</th>

                  <th>Activity</th>

                  <th>Date</th>

                  <th>Category</th>

                  <th>Organization</th>

                  <th>Status</th>

                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity._id}>
                    <td>{index + 1}</td>

                    {/* ACTIVITY */}

                    <td>
                      <div className="tp-activity-title-cell">
                        <div className="tp-activity-thumb">
                          {activity.image ? (
                            <img
                              src={activity.image}
                              alt={activity.imageAlt || activity.title}
                            />
                          ) : (
                            <FaFileImage />
                          )}
                        </div>

                        <div>
                          <strong>{activity.title}</strong>

                          <small>
                            {activity.venue || "Venue not specified"}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* DATE */}

                    <td>{formatDate(activity.activityDate)}</td>

                    {/* CATEGORY */}

                    <td>
                      <span className="tp-activity-category">
                        {categoryLabel(activity.category)}
                      </span>
                    </td>

                    {/* ORGANIZATION */}

                    <td>{activity.organization || "—"}</td>

                    {/* STATUS */}

                    <td>
                      {activity.isPublished ? (
                        <Badge bg="success">Published</Badge>
                      ) : (
                        <Badge bg="secondary">Draft</Badge>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="tp-activity-actions">
                        <Button
                          className="tp-activity-view"
                          title="View"
                          onClick={() => handleView(activity)}
                        >
                          <FaEye />
                        </Button>

                        <Button
                          className="tp-activity-edit"
                          title="Edit"
                          onClick={() => handleEdit(activity)}
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          className="tp-activity-delete"
                          title="Delete"
                          disabled={deletingId === activity._id}
                          onClick={() => handleDelete(activity._id)}
                        >
                          {deletingId === activity._id ? (
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
        size="xl"
        centered
        scrollable
        className="tp-activity-modal"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <div>
              <small>Training &amp; Placement</small>

              <Modal.Title>
                {editingActivity ? "Edit T&P Activity" : "Add T&P Activity"}
              </Modal.Title>
            </div>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="tp-activity-form-section">
              <div className="tp-activity-form-section-title">
                Activity Information
              </div>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Activity Title
                      <span className="text-danger"> *</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter activity title"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Activity Date
                      <span className="text-danger"> *</span>
                    </Form.Label>

                    <Form.Control
                      type="date"
                      name="activityDate"
                      value={form.activityDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>

                    <Form.Select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="placement-drive">Placement Drive</option>

                      <option value="pre-placement-talk">
                        Pre-Placement Talk
                      </option>

                      <option value="training">Training</option>

                      <option value="workshop">Workshop</option>

                      <option value="seminar">Seminar</option>

                      <option value="internship">Internship</option>

                      <option value="career-guidance">Career Guidance</option>

                      <option value="industry-interaction">
                        Industry Interaction
                      </option>

                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Venue</Form.Label>

                    <Form.Control
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="e.g. Seminar Hall"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Organization / Company</Form.Label>

                    <Form.Control
                      type="text"
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="e.g. TCS"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter activity description"
                />
              </Form.Group>
            </div>

            {/* =================================================
                MAIN IMAGE
            ================================================= */}

            <div className="tp-activity-form-section">
              <div className="tp-activity-form-section-title">
                Main Activity Image
              </div>

              <Row>
                <Col md={7}>
                  <Form.Group className="mb-3">
                    <Form.Label>Main Image</Form.Label>

                    <Form.Control
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleMainImageChange}
                    />

                    <Form.Text>JPG, PNG or WEBP. Maximum 10 MB.</Form.Text>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Image Alt Text</Form.Label>

                    <Form.Control
                      type="text"
                      name="imageAlt"
                      value={form.imageAlt}
                      onChange={handleChange}
                      placeholder="Describe the activity image"
                    />
                  </Form.Group>
                </Col>

                <Col md={5}>
                  {mainImagePreview ? (
                    <div className="tp-main-image-preview">
                      <img
                        src={mainImagePreview}
                        alt={form.imageAlt || "Activity preview"}
                      />

                      <span>Main Image Preview</span>
                    </div>
                  ) : (
                    <div className="tp-main-image-empty">
                      <FaFileImage />

                      <span>No image selected</span>
                    </div>
                  )}
                </Col>
              </Row>
            </div>

            {/* =================================================
                GALLERY
            ================================================= */}

            <div className="tp-activity-form-section">
              <div className="tp-activity-form-section-title">
                Gallery Images
              </div>

              <Form.Group>
                <Form.Label>Select Gallery Images</Form.Label>

                <Form.Control
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleGalleryChange}
                />

                <Form.Text>
                  Select up to 10 images. JPG, PNG or WEBP. Maximum 10 MB per
                  image.
                </Form.Text>
              </Form.Group>

              {/* NEW GALLERY PREVIEW */}

              {galleryPreviews.length > 0 && (
                <div className="tp-gallery-preview-grid">
                  {galleryPreviews.map((preview, index) => (
                    <div className="tp-gallery-preview-item" key={preview}>
                      <img src={preview} alt={`Gallery ${index + 1}`} />

                      <button
                        type="button"
                        onClick={() => removeGalleryFile(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* EXISTING GALLERY */}

              {editingActivity &&
                Array.isArray(editingActivity.gallery) &&
                editingActivity.gallery.length > 0 && (
                  <div className="tp-existing-gallery">
                    <div className="tp-existing-gallery-title">
                      Existing Gallery
                    </div>

                    <div className="tp-gallery-preview-grid">
                      {editingActivity.gallery.map((item, index) => (
                        <div
                          className="tp-gallery-preview-item"
                          key={item.publicId || `${item.url}-${index}`}
                        >
                          <img
                            src={item.url}
                            alt={item.alt || `Gallery ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <small>
                      New gallery images will be added to the existing gallery.
                    </small>
                  </div>
                )}
            </div>

            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}

            <div className="tp-activity-form-section">
              <div className="tp-activity-form-section-title">Social Media</div>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaFacebookF className="tp-social-facebook" /> Facebook
                    </Form.Label>

                    <Form.Control
                      type="url"
                      name="facebook"
                      value={form.socialMedia.facebook}
                      onChange={handleSocialChange}
                      placeholder="https://facebook.com/..."
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaInstagram className="tp-social-instagram" /> Instagram
                    </Form.Label>

                    <Form.Control
                      type="url"
                      name="instagram"
                      value={form.socialMedia.instagram}
                      onChange={handleSocialChange}
                      placeholder="https://instagram.com/..."
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaLinkedinIn className="tp-social-linkedin" /> LinkedIn
                    </Form.Label>

                    <Form.Control
                      type="url"
                      name="linkedin"
                      value={form.socialMedia.linkedin}
                      onChange={handleSocialChange}
                      placeholder="https://linkedin.com/..."
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaYoutube className="tp-social-youtube" /> YouTube
                    </Form.Label>

                    <Form.Control
                      type="url"
                      name="youtube"
                      value={form.socialMedia.youtube}
                      onChange={handleSocialChange}
                      placeholder="https://youtube.com/..."
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <FaXTwitter className="tp-social-twitter" /> X / Twitter
                    </Form.Label>

                    <Form.Control
                      type="url"
                      name="twitter"
                      value={form.socialMedia.twitter}
                      onChange={handleSocialChange}
                      placeholder="https://x.com/..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* =================================================
                SETTINGS
            ================================================= */}

            <div className="tp-activity-form-section">
              <div className="tp-activity-form-section-title">
                Display Settings
              </div>

              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Display Order</Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <div className="tp-publish-box">
                    <Form.Check
                      type="switch"
                      id="tp-activity-published"
                      name="isPublished"
                      checked={form.isPublished}
                      onChange={handleChange}
                      label={
                        form.isPublished
                          ? "Published on public website"
                          : "Hidden from public website"
                      }
                    />
                  </div>
                </Col>
              </Row>
            </div>
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
              className="tp-activity-save-button"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : editingActivity ? (
                "Update Activity"
              ) : (
                "Save Activity"
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
        size="xl"
        centered
        scrollable
        className="tp-activity-view-modal"
      >
        {selectedActivity && (
          <>
            <Modal.Header closeButton>
              <div>
                <small>Training &amp; Placement</small>

                <Modal.Title>{selectedActivity.title}</Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Row>
                <Col lg={5}>
                  {selectedActivity.image ? (
                    <img
                      className="tp-view-main-image"
                      src={selectedActivity.image}
                      alt={selectedActivity.imageAlt || selectedActivity.title}
                    />
                  ) : (
                    <div className="tp-view-no-image">
                      <FaFileImage />

                      <span>No Main Image</span>
                    </div>
                  )}
                </Col>

                <Col lg={7}>
                  <div className="tp-view-content">
                    <div className="tp-view-category">
                      {categoryLabel(selectedActivity.category)}
                    </div>

                    <h2>{selectedActivity.title}</h2>

                    <div className="tp-view-meta">
                      <div>
                        <strong>Date</strong>

                        <span>{formatDate(selectedActivity.activityDate)}</span>
                      </div>

                      <div>
                        <strong>Venue</strong>

                        <span>{selectedActivity.venue || "—"}</span>
                      </div>

                      <div>
                        <strong>Organization</strong>

                        <span>{selectedActivity.organization || "—"}</span>
                      </div>
                    </div>

                    {selectedActivity.description && (
                      <div className="tp-view-description">
                        <h5>Description</h5>

                        <p>{selectedActivity.description}</p>
                      </div>
                    )}

                    <div className="tp-view-status">
                      {selectedActivity.isPublished ? (
                        <Badge bg="success">Published</Badge>
                      ) : (
                        <Badge bg="secondary">Draft</Badge>
                      )}
                    </div>

                    {/* SOCIAL ICONS */}

                    <div className="tp-view-social">
                      {selectedActivity.socialMedia?.facebook && (
                        <a
                          href={selectedActivity.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="facebook"
                        >
                          <FaFacebookF />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.instagram && (
                        <a
                          href={selectedActivity.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.linkedin && (
                        <a
                          href={selectedActivity.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="linkedin"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.youtube && (
                        <a
                          href={selectedActivity.socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="youtube"
                        >
                          <FaYoutube />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.twitter && (
                        <a
                          href={selectedActivity.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="twitter"
                        >
                          <FaXTwitter />
                        </a>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* =================================================
                  GALLERY
              ================================================= */}

              {Array.isArray(selectedActivity.gallery) &&
                selectedActivity.gallery.length > 0 && (
                  <div className="tp-view-gallery">
                    <h4>Activity Gallery</h4>

                    <div className="tp-view-gallery-grid">
                      {selectedActivity.gallery.map((item, index) => (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item.publicId || `${item.url}-${index}`}
                        >
                          <img
                            src={item.url}
                            alt={
                              item.alt ||
                              `${selectedActivity.title} gallery ${index + 1}`
                            }
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>

              <Button
                className="tp-activity-save-button"
                onClick={() => {
                  setShowViewModal(false);

                  handleEdit(selectedActivity);
                }}
              >
                <FaEdit /> Edit Activity
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TPActivitiesAdmin;
