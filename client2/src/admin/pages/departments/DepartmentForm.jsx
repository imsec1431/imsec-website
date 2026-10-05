import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { FaBuilding, FaSave, FaArrowLeft } from "react-icons/fa";

import {
  createDepartment,
  getDepartment,
  updateDepartment,
} from "../../services/departmentService";

import "./department-management.css";

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    shortName: "",
    type: "Engineering",
    slug: "",
    publicPath: "",
    description: "",
    priority: 1,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     FETCH DEPARTMENT FOR EDIT
  ===================================================== */

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchDepartment = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await getDepartment(id);

        const department = response.data?.data;

        if (!department) {
          setError("Department not found.");
          return;
        }

        setFormData({
          name: department.name || "",
          code: department.code || "",

          shortName: department.shortName || "",

          type: department.type || "Engineering",

          slug: department.slug || "",

          publicPath: department.publicPath || "",

          description: department.description || "",

          priority: department.priority || 1,

          status: department.status || "Active",
        });
      } catch (error) {
        console.error("Fetch Department Error:", error);

        setError("Failed to load department.");
      } finally {
        setFetching(false);
      }
    };

    fetchDepartment();
  }, [id, isEditMode]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  /* =====================================================
     AUTO SLUG
  ===================================================== */

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Department name is required.");
      return;
    }
    if (!formData.code.trim()) {
      setError("Department code is required.");
      return;
    }
    if (!formData.type) {
      setError("Department type is required.");
      return;
    }

    if (!formData.publicPath.trim()) {
      setError("Public page path is required.");
      return;
    }

    if (!formData.priority || Number(formData.priority) < 1) {
      setError("Priority must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await updateDepartment(id, formData);

        setSuccess("Department updated successfully.");
      } else {
        await createDepartment(formData);

        setSuccess("Department added successfully.");

        setFormData({
          name: "",
          code: "",
          shortName: "",
          type: "Engineering",
          slug: "",
          publicPath: "",
          description: "",
          priority: 1,
          status: "Active",
        });
      }

      setTimeout(() => {
        navigate("/imsec-control-center/departments");
      }, 700);
    } catch (error) {
      console.error("Save Department Error:", error);

      setError(error.response?.data?.message || "Failed to save department.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (fetching) {
    return <div className="department-form-loading">Loading department...</div>;
  }

  return (
    <div className="department-form-page">
      <Container fluid>
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="department-form-header">
          <div>
            <div className="department-form-title">
              <div className="department-title-icon">
                <FaBuilding />
              </div>

              <div>
                <h2>{isEditMode ? "Edit Department" : "Add Department"}</h2>

                <p>
                  {isEditMode
                    ? "Update department information."
                    : "Add a new department or academic programme."}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="department-back-btn"
            onClick={() => navigate("/imsec-control-center/departments")}
          >
            <FaArrowLeft />
            Back to Departments
          </Button>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <Alert variant="danger" className="department-form-alert">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="department-form-alert">
            {success}
          </Alert>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <Card className="department-form-card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                {/* NAME */}

                <Col md={8}>
                  <Form.Group>
                    <Form.Label>
                      Department / Programme Name
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science & Engineering"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Department Code
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="MCA"
                      maxLength={20}
                    />

                    <Form.Text>
                      Unique code such as MCA, MBA, MTECH or CSE.
                    </Form.Text>
                  </Form.Group>
                </Col>
                {/* SHORT NAME */}

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Short Name</Form.Label>

                    <Form.Control
                      type="text"
                      name="shortName"
                      value={formData.shortName}
                      onChange={handleChange}
                      placeholder="e.g. CSE"
                    />
                  </Form.Group>
                </Col>

                {/* TYPE */}

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Type
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="Engineering">Engineering</option>

                      <option value="Postgraduate">Postgraduate</option>

                      <option value="Applied Science">Applied Science</option>

                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* PRIORITY */}

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Priority
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Control
                      type="number"
                      name="priority"
                      min="1"
                      value={formData.priority}
                      onChange={handleChange}
                    />

                    <Form.Text>Lower number appears first.</Form.Text>
                  </Form.Group>
                </Col>

                {/* STATUS */}

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>

                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>

                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* SLUG */}

                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Public URL Slug</Form.Label>

                    <div className="department-slug-row">
                      <Form.Control
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="computer-science-engineering"
                      />

                      <Button
                        type="button"
                        className="department-generate-btn"
                        onClick={generateSlug}
                      >
                        Generate
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                {/* PUBLIC PAGE PATH */}

                <Col md={8}>
                  <Form.Group>
                    <Form.Label>
                      Public Page Path
                      <span className="required">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="publicPath"
                      value={formData.publicPath}
                      onChange={handleChange}
                      placeholder="/Departments/MCA"
                    />

                    <Form.Text>
                      Enter the existing public page route for this department.
                    </Form.Text>
                  </Form.Group>
                </Col>

                {/* DESCRIPTION */}

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter department description..."
                    />
                  </Form.Group>
                </Col>

                {/* ACTIONS */}

                <Col xs={12}>
                  <div className="department-form-actions">
                    <Button
                      type="button"
                      className="department-cancel-btn"
                      onClick={() =>
                        navigate("/imsec-control-center/departments")
                      }
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="department-save-btn"
                      disabled={loading}
                    >
                      <FaSave />

                      {loading
                        ? "Saving..."
                        : isEditMode
                          ? "Update Department"
                          : "Save Department"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DepartmentForm;
