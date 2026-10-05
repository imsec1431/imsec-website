import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";

import {
  getResearchPartners,
  addResearchPartner,
  updateResearchPartner,
  deleteResearchPartner,
} from "../../../services/researchPartnerService";

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingPartner, setEditingPartner] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    website: "",
    priority: 1,
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================
     FETCH
  ========================================= */

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getResearchPartners();

      setPartners(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load research partners."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  /* =========================================
     INPUT
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     ADD
  ========================================= */

  const handleAdd = () => {
    setEditingPartner(null);

    setFormData({
      name: "",
      type: "",
      description: "",
      website: "",
      priority: 1,
      status: "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (partner) => {
    setEditingPartner(partner);

    setFormData({
      name: partner.name || "",
      type: partner.type || "",
      description: partner.description || "",
      website: partner.website || "",
      priority: partner.priority || 1,
      status: partner.status || "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Partner name is required.");
      return false;
    }

    if (!formData.type) {
      setError("Please select partner type.");
      return false;
    }

    if (!formData.priority) {
      setError("Priority is required.");
      return false;
    }

    return true;
  };

  /* =========================================
     SAVE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...formData,
        priority: Number(formData.priority),
      };

      if (editingPartner) {
        await updateResearchPartner(
          editingPartner._id,
          data
        );

        setSuccess(
          "Research partner updated successfully."
        );
      } else {
        await addResearchPartner(data);

        setSuccess(
          "Research partner added successfully."
        );
      }

      setShowModal(false);

      await fetchPartners();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save research partner."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this partner?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteResearchPartner(id);

      setSuccess(
        "Research partner deleted successfully."
      );

      await fetchPartners();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete research partner."
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="text-center py-5">

        <Spinner animation="border" />

        <p className="mt-3">
          Loading Research Partners...
        </p>

      </div>
    );
  }

  return (
    <div className="research-management-section">

      {/* HEADER */}

      <div className="research-section-header">

        <div>
          <h4>
            Industry & Academic Partners
          </h4>

          <p>
            Manage research collaborations and
            institutional partners.
          </p>
        </div>

        <button
          type="button"
          className="research-primary-btn"
          onClick={handleAdd}
        >
          + Add Partner
        </button>

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

      {/* TABLE */}

      {partners.length === 0 ? (

        <div className="research-empty-state">

          <div className="research-empty-icon">
            🤝
          </div>

          <h5>
            No Partners Added
          </h5>

          <p>
            Add industry or academic research
            partners.
          </p>

        </div>

      ) : (

        <div className="table-responsive">

          <Table
            bordered
            hover
            className="align-middle"
          >

            <thead>

              <tr>
                <th>Priority</th>
                <th>S.N.</th>
                <th>Partner Name</th>
                <th>Type</th>
                <th>Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {partners.map(
                (partner, index) => (

                  <tr key={partner._id}>

                    <td>
                      <strong>
                        {partner.priority}
                      </strong>
                    </td>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {partner.name}
                      </strong>
                    </td>

                    <td>
                      {partner.type}
                    </td>

                    <td>
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>

                      <Badge
                        bg={
                          partner.status ===
                          "Active"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {partner.status}
                      </Badge>

                    </td>

                    <td>

                      <div className="d-flex gap-2">

                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            handleEdit(
                              partner
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleDelete(
                              partner._id
                            )
                          }
                        >
                          Delete
                        </Button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </Table>

        </div>

      )}

      {/* =========================================
          MODAL
      ========================================= */}

      <Modal
        show={showModal}
        onHide={() =>
          !saving && setShowModal(false)
        }
        centered
        size="lg"
      >

        <Modal.Header
          closeButton={!saving}
        >

          <Modal.Title>
            {editingPartner
              ? "Edit Research Partner"
              : "Add Research Partner"}
          </Modal.Title>

        </Modal.Header>

        <Form onSubmit={handleSubmit}>

          <Modal.Body>

            <Form.Group className="mb-3">

              <Form.Label>
                Partner Name
              </Form.Label>

              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter partner name"
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Partner Type
              </Form.Label>

              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >

                <option value="">
                  Select Type
                </option>

                <option value="Industry">
                  Industry
                </option>

                <option value="Academic">
                  Academic
                </option>

              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Description
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter short description"
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Website
              </Form.Label>

              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

            </Form.Group>

            <div className="row">

              <div className="col-md-6">

                <Form.Group className="mb-3">

                  <Form.Label>
                    Priority
                  </Form.Label>

                  <Form.Control
                    type="number"
                    min="1"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  />

                  <Form.Text>
                    Lower number = higher priority.
                  </Form.Text>

                </Form.Group>

              </div>

              <div className="col-md-6">

                <Form.Group className="mb-3">

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

              </div>

            </div>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              type="button"
              disabled={saving}
              onClick={() =>
                setShowModal(false)
              }
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
              ) : editingPartner ? (
                "Update Partner"
              ) : (
                "Add Partner"
              )}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </div>
  );
};

export default PartnerManagement;