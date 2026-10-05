import React, { useState } from "react";
import { Container, Row, Col, Form, Accordion } from "react-bootstrap";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

import "./contact.css";
import { sendMessage } from "../../services/contactService";

/* ===================================================
          Static Data
          Later From Admin Panel
=================================================== */

const departments = [
  {
    id: 1,
    title: "Admissions",
    phone: "+91-120-4940001",
    email: "admission@imsec.ac.in",
  },
  {
    id: 2,
    title: "Training & Placement",
    phone: "+91-120-4940002",
    email: "placement@imsec.ac.in",
  },
  {
    id: 3,
    title: "Accounts",
    phone: "+91-120-4940003",
    email: "accounts@imsec.ac.in",
  },
  {
    id: 4,
    title: "Examination Cell",
    phone: "+91-120-4940004",
    email: "exam@imsec.ac.in",
  },
];

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return alert("Please enter your name");
    }

    if (!formData.email.trim()) {
      return alert("Please enter your email");
    }

    if (!formData.phone.trim()) {
      return alert("Please enter your phone number");
    }

    if (!formData.subject.trim()) {
      return alert("Please enter subject");
    }

    if (!formData.message.trim()) {
      return alert("Please enter message");
    }

    try {
      setLoading(true);

      await sendMessage(formData);

      alert("Message sent successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="contact-hero">
        <Container>
          <div className="hero-content">
            <h1>Contact Us</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Contact Us
            </p>
          </div>
        </Container>
      </section>
      {/* ================= CONTACT INFO ================= */}
      <section className="contact-info py-5">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="info-card">
                <FaLocationDot className="info-icon" />

                <h4>Address</h4>

                <p>NH-09, Adhyatmik Nagar, Ghaziabad, Uttar Pradesh</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="info-card">
                <FaPhone className="info-icon" />

                <h4>Phone</h4>

                <p>0120-4940000</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="info-card">
                <FaEnvelope className="info-icon" />

                <h4>Email</h4>

                <p> imsec@imsec.ac.in</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="info-card">
                <FaClock className="info-icon" />

                <h4>Office Hours</h4>

                <p>
                  Mon - Sat
                  <br />
                  08:40 AM - 04:40 PM
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= CONTACT FORM ================= */}
      <section className="contact-form-section py-5">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <h6 className="section-tag">SEND MESSAGE</h6>

              <h2 className="section-title">
                We'd Love to
                <span> Hear From You</span>
              </h2>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="message"
                    placeholder="Write Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <button
                  type="submit"
                  className="btn btn-warning rounded-pill px-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </Form>
            </Col>

            <Col lg={6}>
              <div className="map-box">
                <iframe
                  title="IMSEC"
                  src="https://www.google.com/maps?q=IMS+Engineering+College+Ghaziabad&output=embed"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= Department Contacts ================= */}
      {/* <section className="department-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">DEPARTMENT DIRECTORY</h6>

            <h2 className="section-title">
              Contact
              <span> Departments</span>
            </h2>
          </div>

          <Row className="g-4">
            {departments.map((dept) => (
              <Col lg={3} md={6} key={dept.id}>
                <div className="department-card">
                  <h4>{dept.title}</h4>

                  <div className="dept-item">
                    <FaPhone />

                    <span>{dept.phone}</span>
                  </div>

                  <div className="dept-item">
                    <FaEnvelope />

                    <span>{dept.email}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section> */}
      {/* ================= CTA ================= */}
      <section className="contact-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>Visit Our Campus Today</h2>

              <p style={{ color: "white" }}>
                We'd love to welcome you to IMSEC. Schedule a campus visit and
                experience our world-class infrastructure, faculty and vibrant
                student life.
              </p>
            </Col>

            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0"></Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ContactUs;
