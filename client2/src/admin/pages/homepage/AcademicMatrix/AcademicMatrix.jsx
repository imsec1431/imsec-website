import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";

import {
  getAcademicMatrixAdmin,
  createAcademicMatrix,
  updateAcademicMatrix,
  publishAcademicMatrix,
  unpublishAcademicMatrix,
  deleteAcademicMatrix,
} from "../../../services/academicMatrixAdminService";

import "./AcademicMatrix.css";

const DEFAULT_FORM = {
  type: "ug",
  code: "B.Tech",
  name: "",
  description: "",
  duration: "4 Years",
  basis: "JEE Main / CUET",
  icon: "Microchip",
  buttonText: "More Details",
  buttonLink: "#",
  isPublished: true,
  displayOrder: 0,
};

const AcademicMatrix = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAcademicMatrixAdmin();

      setPrograms(response?.data || []);
    } catch (err) {
      console.error("Error fetching Academic Matrix:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load Academic Matrix.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...formData,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editingId) {
        await updateAcademicMatrix(editingId, payload);
        setMessage("Academic Matrix program updated successfully.");
      } else {
        await createAcademicMatrix(payload);
        setMessage("Academic Matrix program created successfully.");
      }

      resetForm();
      await fetchPrograms();
    } catch (err) {
      console.error("Error saving Academic Matrix:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Academic Matrix program.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);

    setFormData({
      type: program.type || "ug",
      code: program.code || "",
      name: program.name || "",
      description: program.description || "",
      duration: program.duration || "",
      basis: program.basis || "",
      icon: program.icon || "Microchip",
      buttonText: program.buttonText || "More Details",
      buttonLink: program.buttonLink || "#",
      isPublished: Boolean(program.isPublished),
      displayOrder: program.displayOrder ?? 0,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePublishToggle = async (program) => {
    try {
      setError("");
      setMessage("");

      if (program.isPublished) {
        await unpublishAcademicMatrix(program._id);
        setMessage("Program unpublished successfully.");
      } else {
        await publishAcademicMatrix(program._id);
        setMessage("Program published successfully.");
      }

      await fetchPrograms();
    } catch (err) {
      console.error("Error changing publish status:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change publish status.",
      );
    }
  };

  const handleDelete = async (program) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.name}"?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteAcademicMatrix(program._id);

      setMessage("Program deleted successfully.");

      if (editingId === program._id) {
        resetForm();
      }

      await fetchPrograms();
    } catch (err) {
      console.error("Error deleting Academic Matrix:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete program.",
      );
    }
  };

  return (
    <div className="academic-matrix-admin">
      <Container fluid className="py-4">
        {/* PAGE HEADER */}
        <div className="academic-admin-header mb-4">
          <div>
            <h2 className="fw-bold mb-1">Academic Matrix</h2>

            <p className="text-muted mb-0">
              Manage Undergraduate and Postgraduate programs displayed on the
              Home page.
            </p>
          </div>
        </div>

        {/* ALERTS */}
        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* FORM */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1">
                  {editingId ? "Edit Academic Program" : "Add Academic Program"}
                </h4>

                <p className="text-muted small mb-0">
                  All fields control the content shown in the Home page Academic
                  Matrix section.
                </p>
              </div>

              {editingId && (
                <Button variant="outline-secondary" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* TYPE */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Program Type
                    </Form.Label>

                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="ug">Undergraduate</option>

                      <option value="pg">Postgraduate</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* CODE */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Program Code
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* ICON */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Program Icon
                    </Form.Label>

                    <Form.Select
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      required
                    >
                      <option value="Microchip">Microchip</option>

                      <option value="Gear">Gear</option>

                      <option value="Briefcase">Briefcase</option>

                      <option value="GraduationCap">Graduation Cap</option>

                      <option value="Building">Building</option>

                      <option value="Computer">Computer</option>

                      <option value="Database">Database</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* NAME */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Program Name
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter program name"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* DESCRIPTION */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter short program description"
                    />
                  </Form.Group>
                </Col>

                {/* DURATION */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Duration</Form.Label>

                    <Form.Control
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 4 Years"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* BASIS */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Admission Basis
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="basis"
                      value={formData.basis}
                      onChange={handleChange}
                      placeholder="e.g. JEE Main / CUET"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* BUTTON TEXT */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Button Text</Form.Label>

                    <Form.Control
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      placeholder="More Details"
                      required
                    />

                    <Form.Text className="text-muted">
                      Example: More Details, View Program, Explore Course
                    </Form.Text>
                  </Form.Group>
                </Col>

                {/* BUTTON LINK */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Button Link</Form.Label>

                    <Form.Control
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleChange}
                      placeholder="/academics/btech-cse"
                    />

                    <Form.Text className="text-muted">
                      Enter an internal or external URL.
                    </Form.Text>
                  </Form.Group>
                </Col>

                {/* DISPLAY ORDER */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Display Order
                    </Form.Label>

                    <Form.Control
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>

                {/* PUBLISHED */}
                <Col md={6} className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="academic-is-published"
                    name="isPublished"
                    label="Publish on Home page"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                </Col>

                {/* SUBMIT */}
                <Col md={12}>
                  <div className="d-flex gap-2 pt-2">
                    <Button
                      type="submit"
                      variant="dark"
                      disabled={saving}
                      className="px-4"
                    >
                      {saving ? (
                        <>
                          <Spinner
                            size="sm"
                            animation="border"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : editingId ? (
                        "Update Program"
                      ) : (
                        "Add Program"
                      )}
                    </Button>

                    {editingId && (
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* PROGRAM LIST */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1">Academic Programs</h4>

                <p className="text-muted small mb-0">
                  {programs.length} program
                  {programs.length !== 1 ? "s" : ""} configured.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <div className="mt-2 text-muted">
                  Loading Academic Matrix...
                </div>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No Academic Matrix programs found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle academic-matrix-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Type</th>
                      <th>Program</th>
                      <th>Duration</th>
                      <th>Basis</th>
                      <th>Button</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {programs.map((program) => (
                      <tr key={program._id}>
                        <td>
                          <span className="fw-semibold">
                            {program.displayOrder}
                          </span>
                        </td>

                        <td>
                          <Badge
                            bg={program.type === "ug" ? "primary" : "secondary"}
                          >
                            {program.type === "ug" ? "UG" : "PG"}
                          </Badge>
                        </td>

                        <td>
                          <div className="fw-bold">{program.code}</div>

                          <div className="text-muted small">{program.name}</div>
                        </td>

                        <td>{program.duration}</td>

                        <td>{program.basis}</td>

                        <td>
                          <div className="fw-semibold">
                            {program.buttonText}
                          </div>

                          <div
                            className="text-muted small text-truncate"
                            style={{ maxWidth: "180px" }}
                            title={program.buttonLink}
                          >
                            {program.buttonLink}
                          </div>
                        </td>

                        <td>
                          <Badge
                            bg={program.isPublished ? "success" : "secondary"}
                          >
                            {program.isPublished ? "Published" : "Unpublished"}
                          </Badge>
                        </td>

                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEdit(program)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant={
                                program.isPublished
                                  ? "outline-warning"
                                  : "outline-success"
                              }
                              onClick={() => handlePublishToggle(program)}
                            >
                              {program.isPublished ? "Unpublish" : "Publish"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(program)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AcademicMatrix;
