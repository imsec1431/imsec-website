import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  getResearchAbout,
  addResearchAbout,
  updateResearchAbout,
  deleteResearchAbout,
} from "../../../services/researchAboutService";

const VisionMissionManagement = () => {
  const [about, setAbout] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    vision: "",
    mission: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH
  // ==========================================

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getResearchAbout();

      setAbout(response.data.data || null);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load Research Vision & Mission."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditing(false);

    setFormData({
      vision: "",
      mission: "",
      status: "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = () => {
    if (!about) return;

    setEditing(true);

    setFormData({
      vision: about.vision || "",
      mission: about.mission || "",
      status: about.status || "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.vision.trim()) {
      setError("Vision is required.");
      return false;
    }

    if (!formData.mission.trim()) {
      setError("Mission is required.");
      return false;
    }

    return true;
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editing && about?._id) {
        await updateResearchAbout(
          about._id,
          formData
        );

        setSuccess(
          "Vision & Mission updated successfully."
        );
      } else {
        await addResearchAbout(formData);

        setSuccess(
          "Vision & Mission added successfully."
        );
      }

      setShowModal(false);

      await fetchAbout();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save Vision & Mission."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!about?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete Vision & Mission?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteResearchAbout(about._id);

      setAbout(null);

      setSuccess(
        "Vision & Mission deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete Vision & Mission."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />

        <p className="mt-3">
          Loading Vision & Mission...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="research-management-section">

      {/* HEADER */}

      <div className="research-section-header">

        <div>
          <h4>Vision & Mission</h4>

          <p>
            Manage the research vision and mission of IMSEC.
          </p>
        </div>

        {!about && (
          <button
            type="button"
            className="research-primary-btn"
            onClick={handleAdd}
          >
            + Add Content
          </button>
        )}

      </div>

      {/* ALERTS */}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* CONTENT */}

      {!about ? (

        <div className="research-empty-state">

          <div className="research-empty-icon">
            📝
          </div>

          <h5>
            No Vision & Mission Added
          </h5>

          <p>
            Add the research vision and mission to
            display them on the website.
          </p>

          <button
            type="button"
            className="research-primary-btn mt-3"
            onClick={handleAdd}
          >
            + Add Vision & Mission
          </button>

        </div>

      ) : (

        <div className="research-about-box">

          {/* VISION */}

          <div className="research-content-block">

            <h5>
              Vision
            </h5>

            <p>
              {about.vision}
            </p>

          </div>

          {/* MISSION */}

          <div className="research-content-block">

            <h5>
              Mission
            </h5>

            <p>
              {about.mission}
            </p>

          </div>

          {/* STATUS */}

          <div className="research-content-block">

            <h5>
              Status
            </h5>

            <span
              className={
                about.status === "Active"
                  ? "badge bg-success"
                  : "badge bg-secondary"
              }
            >
              {about.status}
            </span>

          </div>

          {/* ACTIONS */}

          <div className="research-actions">

            <button
              type="button"
              className="research-edit-btn"
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              type="button"
              className="research-delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>

          </div>

        </div>

      )}

      {/* =========================================
          ADD / EDIT MODAL
      ========================================= */}

      <Modal
        show={showModal}
        onHide={() => !saving && setShowModal(false)}
        centered
        size="lg"
      >

        <Modal.Header closeButton={!saving}>

          <Modal.Title>
            {editing
              ? "Edit Vision & Mission"
              : "Add Vision & Mission"}
          </Modal.Title>

        </Modal.Header>

        <Form onSubmit={handleSubmit}>

          <Modal.Body>

            {/* VISION */}

            <Form.Group className="mb-4">

              <Form.Label>
                Vision
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={5}
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                placeholder="Enter research vision"
              />

            </Form.Group>

            {/* MISSION */}

            <Form.Group className="mb-4">

              <Form.Label>
                Mission
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={7}
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Enter research mission"
              />

            </Form.Group>

            {/* STATUS */}

            <Form.Group>

              <Form.Label>
                Status
              </Form.Label>

              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </Form.Select>

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              type="button"
              disabled={saving}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner
                    size="sm"
                    className="me-2"
                  />

                  Saving...
                </>
              ) : (
                editing
                  ? "Update"
                  : "Save"
              )}
            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </div>
  );
};

export default VisionMissionManagement;