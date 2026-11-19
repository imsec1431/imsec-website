import React, { useState } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaPaperclip,
} from "react-icons/fa";

import { addStudentGrievance } from "../../services/studentGrievanceService";
import "./StudentGrievance.css";

const StudentGrievance = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    enrollmentNo: "",
    email: "",
    mobile: "",
    department: "",
    category: "",
    title: "",
    description: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = () => {
    if (!formData.email.endsWith("@imsec.ac.in")) {
      setError("Only IMSEC Email ID is allowed.");
      setSuccess("");
      setShowErrorModal(true);
      return false;
    }

    setError("");
    setSuccess("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      const data = new FormData();

      data.append("studentName", formData.studentName);
      data.append("enrollmentNo", formData.enrollmentNo);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("department", formData.department);
      data.append("category", formData.category);
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (attachment) {
        data.append("attachment", attachment);
      }

      const res = await addStudentGrievance(data);

      setSuccess(
        res.data.message || "Student Grievance Submitted Successfully.",
      );
      setError("");

      // Show success popup
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        studentName: "",
        enrollmentNo: "",
        email: "",
        mobile: "",
        department: "",
        category: "",
        title: "",
        description: "",
      });

      setAttachment(null);

      // Reset file input
      const fileInput = document.getElementById("student-grievance-file");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(errorMessage);
      setSuccess("");

      // Show error popup
      setShowErrorModal(true);
    }
  };

  return (
    <div className="studentGrievancePage">
      {/*==================== HERO ====================*/}

      <section className="studentGrievanceHero">
        <div className="studentGrievanceHeroContainer">
          <div className="studentGrievanceHeroContent">
            <span className="studentGrievanceHeroTag">
              STUDENT SUPPORT &amp; REDRESSAL
            </span>

            <h1>Student Grievance Portal</h1>

            <p>
              Submit and track grievances with transparency, fairness, and
              timely resolution.
            </p>
          </div>
        </div>
      </section>

      {/*==================== COMPLAINT FORM ====================*/}

      <section className="complaint-section">
        <div className="studentGrievanceContainer">
          <div className="studentGrievanceSectionHeading">
            <span>REGISTER COMPLAINT</span>

            <h2>Student Complaint Form</h2>
          </div>

          <Form onSubmit={handleSubmit} className="studentGrievanceForm">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Student Name</Form.Label>

                  <Form.Control
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Enrollment Number</Form.Label>

                  <Form.Control
                    name="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleChange}
                    placeholder="Enter Enrollment No."
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    IMSEC Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="student@imsec.ac.in"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaPhone className="me-2" />
                    Mobile Number
                  </Form.Label>

                  <Form.Control
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                    required
                  />
                </Form.Group>
              </Col>

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

              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaPaperclip className="me-2" />
                    Upload Attachment
                  </Form.Label>

                  <Form.Control
                    id="student-grievance-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setAttachment(e.target.files[0])}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Button type="submit" className="studentGrievanceSubmitBtn">
                  Submit Complaint
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </section>

      {/*==================== STATUS GUIDE ====================*/}

      <section className="status-guide">
        <div className="studentGrievanceContainer">
          <div className="studentGrievanceSectionHeading">
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

      {/*==================== CTA ====================*/}

      <section className="studentGrievanceCTA">
        <div className="studentGrievanceContainer">
          <div className="studentGrievanceCTABox">
            <h2>Your Voice Matters</h2>

            <p>
              We are committed to providing a transparent, fair and timely
              grievance redressal process for every student.
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
          <Modal.Title>Complaint Submitted</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <div className="success-popup-icon">✓</div>

          <h4 className="mt-3">Grievance Submitted Successfully</h4>

          <p className="text-muted mb-0">
            Your student grievance has been submitted successfully. The
            concerned authority will review your complaint.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
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
          <Modal.Title>Submission Failed</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4">
          <div className="error-popup-icon">!</div>

          <h4 className="mt-3">Unable to Submit Grievance</h4>

          <p className="text-muted mb-0">{error}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentGrievance;
