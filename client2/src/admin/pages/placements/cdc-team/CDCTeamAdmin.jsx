import React, { useEffect, useState } from "react";

import "./CDCTeamAdmin.css";

import { Modal, Button, Form, Row, Col, Badge, Alert } from "react-bootstrap";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserTie,
  FaBriefcase,
  FaEnvelope,
  FaPhoneAlt,
  FaLinkedin,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaImage,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import {
  fetchCDCTeamAdmin,
  createCDCTeamMember,
  updateCDCTeamMember,
  deleteCDCTeamMember,
} from "../../../services/cdcTeamService";

/* =========================================
   INITIAL FORM
========================================= */

const INITIAL_FORM = {
  name: "",
  designation: "",
  role: "Sr. Head - CDC",
  qualification: "",
  experience: "",
  email: "",
  phone: "",
  linkedin: "",
  imageAlt: "",
  message: "",
  description: "",
  order: 0,
  isPublished: true,
};

/* =========================================
   ROLE LABEL
========================================= */

const getRoleLabel = (role) => {
  switch (role) {
    case "Sr. Head - CDC":
      return "Sr. Head - CDC";

    case "Head - CDC":
      return "Head - CDC";

    case "Sr. Manager":
      return "Sr. Manager";

    case "Manager":
      return "Manager";

    case "placement-officer":
      return "Placement Officer";

    case "other":
      return "Other";

    default:
      return "Team Member";
  }
};

/* =========================================
   CDC TEAM ADMIN
========================================= */

const CDCTeamAdmin = () => {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedMember, setSelectedMember] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  /* =========================================
     LOAD MEMBERS
  ========================================= */

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchCDCTeamAdmin();

      setMembers(result?.data || []);
    } catch (err) {
      console.error("CDC Team Admin Error:", err);

      setError(err?.message || "Failed to load CDC Team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  /* =========================================
     CLEAR MESSAGES
  ========================================= */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================
     IMAGE CHANGE
  ========================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

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

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setForm({
      ...INITIAL_FORM,
    });

    setEditingId(null);

    setImageFile(null);

    setImagePreview("");
  };

  /* =========================================
     ADD
  ========================================= */

  const handleAdd = () => {
    clearMessages();

    resetForm();

    setForm({
      ...INITIAL_FORM,
      order: members.length + 1,
    });

    setShowFormModal(true);
  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (member) => {
    clearMessages();

    setEditingId(member._id);

    setForm({
      name: member.name || "",

      designation: member.designation || "",

      role: member.role || "Sr. Head - CDC",

      qualification: member.qualification || "",

      experience: member.experience || "",

      email: member.email || "",

      phone: member.phone || "",

      linkedin: member.linkedin || "",

      imageAlt: member.imageAlt || "",

      message: member.message || "",

      description: member.description || "",

      order: member.order ?? 0,

      isPublished: member.isPublished !== false,
    });

    setImageFile(null);

    setImagePreview(member.image || "");

    setShowFormModal(true);
  };

  /* =========================================
     CLOSE FORM
  ========================================= */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowFormModal(false);

    resetForm();
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      clearMessages();

      const formData = new FormData();

      formData.append("name", form.name.trim());

      formData.append("designation", form.designation.trim());

      formData.append("role", form.role);

      formData.append("qualification", form.qualification.trim());

      formData.append("experience", form.experience.trim());

      formData.append("email", form.email.trim());

      formData.append("phone", form.phone.trim());

      formData.append("linkedin", form.linkedin.trim());

      formData.append("imageAlt", form.imageAlt.trim());

      formData.append("message", form.message.trim());

      formData.append("description", form.description.trim());

      formData.append("order", String(Number(form.order || 0)));

      formData.append("isPublished", String(form.isPublished));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let result;

      if (editingId) {
        result = await updateCDCTeamMember(editingId, formData);
      } else {
        result = await createCDCTeamMember(formData);
      }

      setSuccess(result?.message || "CDC Team member saved successfully.");

      setShowFormModal(false);

      resetForm();

      await loadMembers();
    } catch (err) {
      console.error("CDC Team Save Error:", err);

      setError(err?.message || "Failed to save CDC Team member.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     VIEW
  ========================================= */

  const handleView = (member) => {
    setSelectedMember(member);

    setShowInfoModal(true);
  };

  /* =========================================
     DELETE CLICK
  ========================================= */

  const handleDeleteClick = (member) => {
    setSelectedMember(member);

    setShowDeleteModal(true);
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setDeleting(true);

      clearMessages();

      const result = await deleteCDCTeamMember(selectedMember._id);

      setSuccess(result?.message || "CDC Team member deleted successfully.");

      setShowDeleteModal(false);

      setSelectedMember(null);

      await loadMembers();
    } catch (err) {
      console.error("CDC Team Delete Error:", err);

      setError(err?.message || "Failed to delete CDC Team member.");
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================
     ROLE GROUPS
  ========================================= */

  const srHeadCDC = members.filter(
    (member) => member.role === "Sr. Head - CDC",
  );

  const headCDC = members.filter((member) => member.role === "Head - CDC");

  const srManagers = members.filter((member) => member.role === "Sr. Manager");

  const managers = members.filter((member) => member.role === "Manager");

  const placementOfficers = members.filter(
    (member) => member.role === "placement-officer",
  );

  const otherMembers = members.filter((member) => member.role === "other");

  /* =========================================
     MEMBER CARD
  ========================================= */

  const renderMember = (member) => (
    <Col lg={6} xl={4} key={member._id}>
      <div className="cdc-admin-member-card">
        <div className="cdc-admin-member-image">
          {member.image ? (
            <img src={member.image} alt={member.imageAlt || member.name} />
          ) : (
            <div className="cdc-admin-no-image">
              <FaUsers />
            </div>
          )}
        </div>

        <div className="cdc-admin-member-content">
          <div className="cdc-admin-member-top">
            <div>
              <Badge bg="primary" className="cdc-role-badge">
                {getRoleLabel(member.role)}
              </Badge>

              <h3>{member.name}</h3>

              <p>{member.designation}</p>
            </div>

            <span
              className={member.isPublished ? "cdc-published" : "cdc-hidden"}
            >
              {member.isPublished ? (
                <>
                  <FaEye />
                  Published
                </>
              ) : (
                <>
                  <FaEyeSlash />
                  Hidden
                </>
              )}
            </span>
          </div>

          <div className="cdc-admin-member-details">
            {member.qualification && (
              <span>
                <FaGraduationCap />
                {member.qualification}
              </span>
            )}

            {member.experience && (
              <span>
                <FaBriefcase />
                {member.experience}
              </span>
            )}

            {member.email && (
              <span>
                <FaEnvelope />
                {member.email}
              </span>
            )}
          </div>

          <div className="cdc-admin-card-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleView(member)}
            >
              <FaInfoCircle />
              View
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(member)}
            >
              <FaEdit />
              Edit
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(member)}
            >
              <FaTrash />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Col>
  );

  /* =========================================
     GROUP
  ========================================= */

  const renderGroup = (title, icon, group) => {
    if (!group.length) {
      return null;
    }

    return (
      <section className="cdc-admin-group">
        <div className="cdc-admin-group-title">
          {icon}

          <h2>{title}</h2>
        </div>

        <Row className="g-4">{group.map(renderMember)}</Row>
      </section>
    );
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="cdc-team-admin-page">
        <div className="cdc-admin-loading">
          <div className="spinner-border text-primary" role="status" />

          <h4>Loading CDC Team...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="cdc-team-admin-page">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="cdc-admin-page-header">
        <div>
          <div className="cdc-admin-eyebrow">
            <FaUsers />
            PLACEMENTS
          </div>

          <h1>CDC Team</h1>

          <p>Manage Corporate Development Cell team members.</p>
        </div>

        <Button
          variant="primary"
          className="cdc-add-button"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Team Member
        </Button>
      </div>

      {/* =====================================
          ALERTS
      ===================================== */}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* =====================================
          GROUPS
      ===================================== */}

      {renderGroup("Sr. Head - CDC", <FaUserTie />, srHeadCDC)}

      {renderGroup("Head - CDC", <FaUserTie />, headCDC)}

      {renderGroup("Sr. Manager", <FaBriefcase />, srManagers)}

      {renderGroup("Manager", <FaBriefcase />, managers)}

      {renderGroup("Placement Officers", <FaBriefcase />, placementOfficers)}

      {renderGroup("Other Team Members", <FaUsers />, otherMembers)}

      {/* =====================================
          EMPTY
      ===================================== */}

      {!members.length && (
        <div className="cdc-admin-empty">
          <FaUsers />

          <h3>No CDC Team Members</h3>

          <p>No team members have been added yet.</p>

          <Button variant="primary" onClick={handleAdd}>
            <FaPlus />
            Add Team Member
          </Button>
        </div>
      )}

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      <Modal
        show={showFormModal}
        onHide={handleCloseForm}
        size="xl"
        centered
        backdrop="static"
        dialogClassName="cdc-form-modal-dialog"
        contentClassName="cdc-form-modal-content"
      >
        <Form onSubmit={handleSubmit} className="cdc-form-modal-form">
          <Modal.Header closeButton className="cdc-form-modal-header">
            <Modal.Title>
              {editingId ? "Edit CDC Team Member" : "Add CDC Team Member"}
            </Modal.Title>
          </Modal.Header>

          {/* THIS IS THE ONLY SCROLLING AREA */}

          <Modal.Body className="cdc-form-modal-body">
            <Row className="g-3">
              {/* NAME */}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name *</Form.Label>

                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                  />
                </Form.Group>
              </Col>

              {/* DESIGNATION */}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Designation *</Form.Label>

                  <Form.Control
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    required
                    placeholder="Enter designation"
                  />
                </Form.Group>
              </Col>

              {/* ROLE */}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>

                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="Sr. Head - CDC">Sr. Head - CDC</option>

                    <option value="Head - CDC">Head - CDC</option>

                    <option value="Sr. Manager">Sr. Manager</option>

                    <option value="Manager">Manager</option>

                    <option value="placement-officer">Placement Officer</option>

                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* QUALIFICATION */}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Qualification</Form.Label>

                  <Form.Control
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="Ph.D. / MBA"
                  />
                </Form.Group>
              </Col>

              {/* EXPERIENCE */}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Experience</Form.Label>

                  <Form.Control
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="18+ Years"
                  />
                </Form.Group>
              </Col>

              {/* EMAIL */}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@imsec.ac.in"
                  />
                </Form.Group>
              </Col>

              {/* PHONE */}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>

                  <Form.Control
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </Form.Group>
              </Col>

              {/* LINKEDIN */}

              <Col md={8}>
                <Form.Group>
                  <Form.Label>LinkedIn</Form.Label>

                  <Form.Control
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/..."
                  />
                </Form.Group>
              </Col>

              {/* ORDER */}

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

              {/* IMAGE */}

              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    <FaImage className="me-1" />
                    Profile Image
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                  />

                  <Form.Text>Maximum 10 MB.</Form.Text>
                </Form.Group>

                {imagePreview && (
                  <div className="cdc-admin-image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </Col>

              {/* IMAGE ALT */}

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Image Alt Text</Form.Label>

                  <Form.Control
                    name="imageAlt"
                    value={form.imageAlt}
                    onChange={handleChange}
                    placeholder="Profile photo of..."
                  />
                </Form.Group>
              </Col>

              {/* MESSAGE */}

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Message</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Enter message..."
                  />
                </Form.Group>
              </Col>

              {/* DESCRIPTION */}

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description..."
                  />
                </Form.Group>
              </Col>

              {/* PUBLISH */}

              <Col md={12}>
                <Form.Check
                  type="switch"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  label="Publish this team member"
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="cdc-form-modal-footer">
            <Button
              variant="secondary"
              onClick={handleCloseForm}
              disabled={saving}
            >
              <FaTimes className="me-1" />
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={saving}>
              <FaSave className="me-1" />

              {saving
                ? "Saving..."
                : editingId
                  ? "Update Member"
                  : "Save Member"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* =====================================
          INFORMATION MODAL
      ===================================== */}

      <Modal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        size="lg"
        centered
        dialogClassName="cdc-info-modal-dialog"
        contentClassName="cdc-info-modal-content"
      >
        {selectedMember && (
          <>
            <Modal.Header closeButton className="cdc-info-modal-header">
              <Modal.Title>
                <FaInfoCircle className="me-2 text-primary" />
                Team Member Information
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="cdc-info-modal-body">
              <Row className="g-4">
                <Col md={4} className="text-center">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.imageAlt || selectedMember.name}
                      className="cdc-info-image"
                    />
                  ) : (
                    <div className="cdc-info-no-image">
                      <FaUsers />
                    </div>
                  )}
                </Col>

                <Col md={8}>
                  <Badge bg="primary" className="mb-2">
                    {getRoleLabel(selectedMember.role)}
                  </Badge>

                  <h3 className="cdc-info-name">{selectedMember.name}</h3>

                  <p className="cdc-info-designation">
                    {selectedMember.designation}
                  </p>

                  <div className="cdc-info-list">
                    {selectedMember.qualification && (
                      <div>
                        <FaGraduationCap />

                        <span>
                          <strong>Qualification</strong>

                          {selectedMember.qualification}
                        </span>
                      </div>
                    )}

                    {selectedMember.experience && (
                      <div>
                        <FaBriefcase />

                        <span>
                          <strong>Experience</strong>

                          {selectedMember.experience}
                        </span>
                      </div>
                    )}

                    {selectedMember.email && (
                      <div>
                        <FaEnvelope />

                        <span>
                          <strong>Email</strong>

                          {selectedMember.email}
                        </span>
                      </div>
                    )}

                    {selectedMember.phone && (
                      <div>
                        <FaPhoneAlt />

                        <span>
                          <strong>Phone</strong>

                          {selectedMember.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              {selectedMember.message && (
                <div className="cdc-info-section">
                  <h5>Message</h5>

                  <p>{selectedMember.message}</p>
                </div>
              )}

              {selectedMember.description && (
                <div className="cdc-info-section">
                  <h5>Description</h5>

                  <p>{selectedMember.description}</p>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              {selectedMember.linkedin && (
                <Button
                  variant="outline-primary"
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin className="me-1" />
                  LinkedIn
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* =====================================
          DELETE MODAL
      ===================================== */}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" />
            Delete CDC Team Member
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedMember && (
            <p className="mb-0">
              Are you sure you want to delete{" "}
              <strong>{selectedMember.name}</strong>
              ?
              <br />
              <small className="text-muted">
                The member and associated profile image will be removed.
              </small>
            </p>
          )}
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
            <FaTrash className="me-1" />

            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CDCTeamAdmin;
