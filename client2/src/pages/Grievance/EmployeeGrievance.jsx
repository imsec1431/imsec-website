import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
} from "react-bootstrap";

import {
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaPaperclip,
} from "react-icons/fa";

import { addEmployeeGrievance } from "../../services/employeeGrievanceService";

import "./StudentGrievance.css";

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
     Validate Email
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
  if (!formData.employeeCode.trim()) {
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

      data.append(
        "employeeName",
        formData.employeeName
      );

      data.append(
        "employeeCode",
        formData.employeeCode
      );

      data.append(
        "email",
        formData.email
      );

      data.append(
        "mobile",
        formData.mobile
      );

      data.append(
        "department",
        formData.department
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      if (attachment) {
        data.append(
          "attachment",
          attachment
        );
      }

      const res = await addEmployeeGrievance(data);

      setSuccess(
  res.data.message ||
    "Employee Grievance Submitted Successfully."
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

      const fileInput = document.getElementById(
  "employee-grievance-file"
);

if (fileInput) {
  fileInput.value = "";
}

    }catch (err) {
  console.error(err);

  const errorMessage =
    err.response?.data?.message ||
    "Something went wrong. Please try again.";

  setError(errorMessage);
  setSuccess("");

  // Open error modal
  setShowErrorModal(true);

} finally {setLoading(false);}
  };

  return (
    <>
      {/* ==================== HERO ==================== */}

      <section className="grievance-hero">

        <Container>

          <div className="hero-content">

            <h1>
              Employee Grievance Portal
            </h1>

          </div>

        </Container>

      </section>


      {/* ==================== COMPLAINT FORM ==================== */}

      <section className="complaint-section py-5">

        <Container>

          <div className="section-heading text-center">

            <h6>
              REGISTER COMPLAINT
            </h6>

            <h2>
              Employee Complaint Form
            </h2>

          </div>


          

         


          <Form onSubmit={handleSubmit}>

            <Row>

              {/* Employee Name */}

              <Col md={6}>

                <Form.Group className="mb-4">

                  <Form.Label>
                    Employee Name
                  </Form.Label>

                  <Form.Control
                    name="employeeName"
                    value={
                      formData.employeeName
                    }
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                    required
                  />

                </Form.Group>

              </Col>


              {/* Employee Code */}

              <Col md={6}>

                <Form.Group className="mb-4">

                  <Form.Label>
                    Employee Code
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="employeeCode"
                    value={
                      formData.employeeCode
                    }
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

                  <Form.Label>
                    Department
                  </Form.Label>

                  <Form.Select
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Department
                    </option>

                    <option>CSE</option>
                    <option>AIML</option>
                    <option>CS</option>
                    <option>BT</option>
                    <option>ECE</option>
                    <option>IT</option>
                    <option>ASH</option>
                    <option>MCA</option>
                    <option>MBA</option>
                    <option>M.Tech</option>
                    <option>OTHER</option>

                  </Form.Select>

                </Form.Group>

              </Col>


              {/* Category */}

              <Col md={6}>

                <Form.Group className="mb-4">

                  <Form.Label>
                    Category
                  </Form.Label>

                  <Form.Select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option>
                      Academic
                    </option>

                    <option>
                      Examination
                    </option>

                    <option>
                      Library
                    </option>

                    <option>
                      Hostel
                    </option>

                    <option>
                      Transport
                    </option>

                    <option>
                      Placement
                    </option>

                    <option>
                      Accounts
                    </option>

                    <option>
                      Other
                    </option>

                  </Form.Select>

                </Form.Group>

              </Col>


              {/* Title */}

              <Col md={12}>

                <Form.Group className="mb-4">

                  <Form.Label>
                    Complaint Title
                  </Form.Label>

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
                    value={
                      formData.description
                    }
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
                    onChange={(e) =>
                      setAttachment(
                        e.target.files[0]
                      )
                    }
                  />

                  <small className="text-muted">
                    JPG, JPEG, PNG or WEBP. Maximum
                    size: 10 MB.
                  </small>

                </Form.Group>

              </Col>


              {/* Submit */}

              <Col md={12}>

                <Button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Submitting..."
                    : "Submit Complaint"}

                </Button>

              </Col>

            </Row>

          </Form>

        </Container>

      </section>


      {/* ==================== STATUS GUIDE ==================== */}

      <section className="status-guide py-5">

        <Container>

          <div className="section-heading text-center">

            <h6>
              STATUS GUIDE
            </h6>

            <h2>
              Complaint Workflow
            </h2>

          </div>


          <Row className="g-4">

            <Col lg={3} md={6}>

              <div className="guide-card">

                <div className="guide-number">
                  1
                </div>

                <h5>
                  Submitted
                </h5>

                <p>
                  Complaint received successfully.
                </p>

              </div>

            </Col>


            <Col lg={3} md={6}>

              <div className="guide-card">

                <div className="guide-number">
                  2
                </div>

                <h5>
                  Under Review
                </h5>

                <p>
                  Complaint assigned to concerned
                  authority.
                </p>

              </div>

            </Col>


            <Col lg={3} md={6}>

              <div className="guide-card">

                <div className="guide-number">
                  3
                </div>

                <h5>
                  Processing
                </h5>

                <p>
                  Necessary action is being taken.
                </p>

              </div>

            </Col>


            <Col lg={3} md={6}>

              <div className="guide-card">

                <div className="guide-number">
                  4
                </div>

                <h5>
                  Resolved
                </h5>

                <p>
                  Complaint successfully resolved.
                </p>

              </div>

            </Col>

          </Row>

        </Container>

      </section>


      {/* ==================== CTA ==================== */}

      <section className="cta-section">

        <Container>

          <Row className="align-items-center">

            <Col lg={8}>

              <h2>
                Your Voice Matters
              </h2>

              <p>
                We are committed to providing a
                transparent, fair and timely grievance
                redressal process for every employee.
              </p>

            </Col>

          </Row>

        </Container>

      </section>
{/* ==================== ERROR MODAL ==================== */}
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

    <div className="success-popup-icon">
      ✓
    </div>

    <h4 className="mt-3">
      Grievance Submitted Successfully
    </h4>

    <p className="text-muted mb-0">
      {success}
    </p>

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

    <div className="error-popup-icon">
      !
    </div>

    <h4 className="mt-3">
      Unable to Submit Grievance
    </h4>

    <p className="text-muted mb-0">
      {error}
    </p>

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
    </>
  );
};

export default EmployeeGrievance;