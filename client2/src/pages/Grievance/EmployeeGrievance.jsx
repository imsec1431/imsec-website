import React, { useState } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaPaperclip,
} from "react-icons/fa";

import { addEmployeeGrievance } from "../../services/employeeGrievanceService";
import "./EmployeeGrievance.css";

const EmployeeGrievance = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    email: "",
    mobile: "",
    department: "",
    category: "",
    title: "",
    description: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===========================================
     Handle Input
  =========================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================================
     Validate Form
  =========================================== */

  const validateForm = () => {
    // Employee Name
    if (!formData.employeeName.trim()) {
      setError("Please enter Employee Name.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Employee Code
    if (!formData.employeeCode.toString().trim()) {
      setError("Please enter Employee Code.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Email
    if (!formData.email.trim()) {
      setError("Please enter IMSEC Email ID.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // IMSEC Email Validation
    if (!formData.email.toLowerCase().endsWith("@imsec.ac.in")) {
      setError("Only IMSEC Email ID is allowed.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Mobile
    if (!formData.mobile.trim()) {
      setError("Please enter Mobile Number.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Mobile Number Validation
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit Mobile Number.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Department
    if (!formData.department) {
      setError("Please select Department.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Category
    if (!formData.category) {
      setError("Please select Complaint Category.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Complaint Title
    if (!formData.title.trim()) {
      setError("Please enter Complaint Title.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    // Complaint Description
    if (!formData.description.trim()) {
      setError("Please enter Complaint Description.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  /* ===========================================
     Submit Grievance
  =========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("employeeName", formData.employeeName);
      data.append("employeeCode", formData.employeeCode);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("department", formData.department);
      data.append("category", formData.category);
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (attachment) {
        data.append("attachment", attachment);
      }

      const res = await addEmployeeGrievance(data);

      setSuccess(
        res.data.message || "Employee Grievance Submitted Successfully.",
      );
      setError("");
      setShowSuccessModal(true);

      /* Reset Form */
      setFormData({
        employeeName: "",
        employeeCode: "",
        email: "",
        mobile: "",
        department: "",
        category: "",
        title: "",
        description: "",
      });

      setAttachment(null);

      /* Reset file input */
      const fileInput = document.getElementById("employee-grievance-file");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(errorMessage);
      setSuccess("");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employeeGrievancePage">
      {/* ==================== HERO ==================== */}

      <section className="employeeGrievanceHero">
        <div className="employeeGrievanceHeroContainer">
          <div className="employeeGrievanceHeroContent">
            <span className="employeeGrievanceHeroTag">
              EMPLOYEE SUPPORT &amp; REDRESSAL
            </span>

            <h1>Employee Grievance Portal</h1>

            <p>
              Submit and track employee grievances with transparency, fairness,
              and timely resolution.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== COMPLAINT FORM ==================== */}

      <section className="complaint-section">
        <div className="employeeGrievanceContainer">
          <div className="employeeGrievanceSectionHeading">
            <span>REGISTER COMPLAINT</span>

            <h2>Employee Complaint Form</h2>
          </div>

          <Form onSubmit={handleSubmit} className="employeeGrievanceForm">
            <Row>
              {/* Employee Name */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Employee Name</Form.Label>

                  <Form.Control
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Employee Code */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Employee Code</Form.Label>

                  <Form.Control
                    type="number"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    placeholder="Enter Employee Code"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    IMSEC Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@imsec.ac.in"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Mobile */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaPhone className="me-2" />
                    Mobile Number
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Department */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Department</Form.Label>

                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="AIML">AIML</option>
                    <option value="CS">CS</option>
                    <option value="BT">BT</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="ASH">ASH</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="OTHER">OTHER</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Category */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Category</Form.Label>

                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Library">Library</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Transport">Transport</option>
                    <option value="Placement">Placement</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Title */}
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>Complaint Title</Form.Label>

                  <Form.Control
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Complaint Title"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Description */}
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaClipboardList className="me-2" />
                    Complaint Description
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your grievance clearly."
                    required
                  />
                </Form.Group>
              </Col>

              {/* Attachment */}
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaPaperclip className="me-2" />
                    Upload Attachment
                  </Form.Label>

                  <Form.Control
                    id="employee-grievance-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setAttachment(e.target.files[0])}
                  />

                  <small className="text-muted d-block mt-1">
                    JPG, JPEG, PNG or WEBP. Maximum size: 10 MB.
                  </small>
                </Form.Group>
              </Col>

              {/* Submit */}
              <Col md={12}>
                <Button
                  type="submit"
                  className="employeeGrievanceSubmitBtn"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </section>

      {/* ==================== STATUS GUIDE ==================== */}

      <section className="status-guide">
        <div className="employeeGrievanceContainer">
          <div className="employeeGrievanceSectionHeading">
            <span>STATUS GUIDE</span>

            <h2>Complaint Workflow</h2>
          </div>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="guide-card">
                <div className="guide-number">1</div>

                <h5>Submitted</h5>

                <p>Complaint received successfully in portal.</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="guide-card">
                <div className="guide-number">2</div>

                <h5>Under Review</h5>

                <p>Complaint assigned to concerned authority.</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="guide-card">
                <div className="guide-number">3</div>

                <h5>Processing</h5>

                <p>Necessary action is being investigated.</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="guide-card">
                <div className="guide-number">4</div>

                <h5>Resolved</h5>

                <p>Complaint successfully addressed &amp; resolved.</p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ==================== CTA ==================== */}

      <section className="employeeGrievanceCTA">
        <div className="employeeGrievanceContainer">
          <div className="employeeGrievanceCTABox">
            <h2>Your Voice Matters</h2>

            <p>
              We are committed to providing a transparent, fair and timely
              grievance redressal process for every employee.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== SUCCESS MODAL ==================== */}

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            Complaint Submitted
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <div className="success-popup-icon">✓</div>

          <h4 className="mt-3">Grievance Submitted Successfully</h4>

          <p className="text-muted mb-0">{success}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => setShowSuccessModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================== ERROR MODAL ==================== */}

      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            Submission Failed
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <div className="error-popup-icon">!</div>

          <h4 className="mt-3">Unable to Submit Grievance</h4>

          <p className="text-muted mb-0">{error}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowErrorModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeGrievance;
