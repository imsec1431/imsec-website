import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTrain,
  FaPlane,
  FaRoad,
  FaLocationCrosshairs,
} from "react-icons/fa6";

import "./location.css";

/* ===========================================
   Static Data
   Later this data will come from Admin Panel
=========================================== */

const locationData = {
  address: "NH-09, Adhyatmik Nagar, Ghaziabad, Uttar Pradesh - 201015",

  phone: "0120-4940000",

  email: "imsec@imsec.ac.in",

  officeHours: "Monday - Saturday : 08:40 AM - 04:40 PM",

  map: "https://www.google.com/maps?q=IMS+Engineering+College+Ghaziabad&output=embed",
};

const travelInfo = [
  {
    icon: <FaRoad />,
    title: "By Road",
    description:
      "Located on NH-09, IMSEC is easily accessible from Delhi, Noida and Ghaziabad via road transport.",
  },
  {
    icon: <FaTrain />,
    title: "By Railway",
    description: "Nearest Railway Station: Ghaziabad Junction (Approx. 12 km).",
  },

  {
    icon: <FaLocationCrosshairs />,
    title: "Nearby Metro",
    description:
      "Shaheed Sthal (New Bus Adda) Metro Station is the nearest metro connectivity.",
  },
];

const Location = () => {
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="location-hero">
        <Container>
          <div className="hero-content">
            <h1>Location</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Contact
              <span>/</span>
              Location
            </p>
          </div>
        </Container>
      </section>

      {/* ================= Contact Details ================= */}

      <section className="location-details py-5">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={5}>
              <div className="location-card">
                <h2>IMS Engineering College</h2>

                <div className="info-item">
                  <FaLocationDot />

                  <span>{locationData.address}</span>
                </div>

                <div className="info-item">
                  <FaPhone />

                  <span>{locationData.phone}</span>
                </div>

                <div className="info-item">
                  <FaEnvelope />

                  <span>{locationData.email}</span>
                </div>

                <div className="info-item">
                  <FaClock />

                  <span>{locationData.officeHours}</span>
                </div>

                <button
                  className="btn btn-warning rounded-pill mt-4"
                  onClick={() =>
                    window.open(
                      "https://maps.google.com/?q=IMS Engineering College Ghaziabad",
                      "_blank",
                    )
                  }
                >
                  Get Directions
                </button>
              </div>
            </Col>

            <Col lg={7}>
              <div className="map-wrapper">
                <iframe
                  title="IMSEC Map"
                  src={locationData.map}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= How To Reach ================= */}

      <section className="travel-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">HOW TO REACH</h6>

            <h2 className="section-title">
              Reach
              <span> IMSEC</span>
            </h2>
          </div>

          <Row className="g-4">
            {travelInfo.map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="travel-card">
                  <div className="travel-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Contact Information ================= */}

      <section className="contact-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">CONTACT INFORMATION</h6>

            <h2 className="section-title">
              Need <span>Assistance?</span>
            </h2>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="contact-card">
                <FaPhone className="contact-icon" />

                <h4 style={{ color: "white" }}>Call Us</h4>

                <p style={{ color: "white" }}>0120-4940000</p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="contact-card">
                <FaEnvelope className="contact-icon" />

                <h4 style={{ color: "white" }}>Email</h4>

                <p style={{ color: "white" }}>imsec@imsec.ac.in</p>
              </div>
            </Col>

            <Col lg={4} md={12}>
              <div className="contact-card">
                <FaLocationDot className="contact-icon" />

                <h4 style={{ color: "white" }}>Campus Address</h4>

                <p style={{ color: "white" }}>
                  NH-09, Adhyatmik Nagar, Ghaziabad, Uttar Pradesh
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Visit Our Campus</h2>

              <p>
                Experience world-class infrastructure, vibrant campus life,
                modern laboratories and excellent learning environment at IMSEC.
              </p>
            </Col>

            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <button
                className="btn btn-warning rounded-pill px-4 me-3"
                onClick={() =>
                  window.open(
                    "https://maps.google.com/?q=IMS Engineering College Ghaziabad",
                    "_blank",
                  )
                }
              >
                Get Directions
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Location;
