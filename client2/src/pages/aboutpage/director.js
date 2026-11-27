import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaGraduationCap,
  FaLightbulb,
  FaHandshake,
  FaGlobe,
  FaUsers,
  FaAward,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { getDirector } from "../../services/directorService";

import "./chairman.css";

/* ============================================
   Static Data
   Later this will come from Admin Panel
============================================ */

const leadership = [
  {
    icon: <FaGraduationCap />,
    title: "Quality Education",
  },
  {
    icon: <FaLightbulb />,
    title: "Innovation",
  },
  {
    icon: <FaHandshake />,
    title: "Integrity",
  },
  {
    icon: <FaGlobe />,
    title: "Global Vision",
  },
  {
    icon: <FaUsers />,
    title: "Student Success",
  },
  {
    icon: <FaAward />,
    title: "Leadership",
  },
];

const DirectorMessage = () => {
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDirector = async () => {
    try {
      const res = await getDirector();

      if (res.data?.data) {
        setDirector(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirector();
  }, []);

  const renderMessage = (text) => {
    if (!text) return null;
    const normalized = text.replace(/\r\n/g, "\n");
    const hasDoubleNewline = /\n\s*\n/.test(normalized);

    const paragraphs = hasDoubleNewline
      ? normalized.split(/\n\s*\n/)
      : normalized.split("\n");

    return paragraphs
      .map((p) => (hasDoubleNewline ? p.replace(/\n/g, " ") : p).trim())
      .filter((p) => p.length > 0)
      .map((para, index) => (
        <p key={index} className="section-text" style={{ textAlign: "justify" }}>
          {para}
        </p>
      ));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="chairman-hero">
        <Container>
          <div className="hero-content text-center">
            <h1 className="text-center">Director's Message</h1>
          </div>
        </Container>
      </section>

      {/* ================= Chairman Section ================= */}

      <section className="chairman-wrapper py-5">
        <Container>
          <Row className="align-items-center g-5">
            {/* Left Card */}

            <Col lg={4}>
              <div className="chairman-card">
                <img
                  src={
                    director?.imageUrl ||
                    "https://via.placeholder.com/350x400?text=Director"
                  }
                  alt={director?.directorName}
                  className="chairman-photo"
                />

                <div className="chairman-info">
                  <h3>{director?.directorName}</h3>

                  <h5>Director</h5>

                  <p style={{ color: "white" }}>IMS Engineering College</p>
                </div>

                <hr />

                <div className="experience-box">
                  <FaAward />

                  <span>Director, IMS Engineering College</span>
                </div>

                <div className="social-icons">
                  {director?.linkedin && (
                    <a
                      href={director.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn />
                    </a>
                  )}
                </div>
              </div>
            </Col>

            {/* Right */}

            <Col lg={8}>
              <div className="message-box" style={{ textAlign: "justify" }}>

                <h2 className="section-title">
                  Building Future
                </h2>

                {renderMessage(director?.message)}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Leadership Principles ================= */}

      <section className="principle-section py-5">
        <Container>
          <div className="text-center mb-5">

            <h2 className="section-title">
              Our Guiding
              {/* <span> Principles</span> */}
            </h2>
          </div>

          <Row className="g-4">
            {leadership.map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="principle-card">
                  <div className="principle-icon">{item.icon}</div>

                  <h4>{item.title}</h4>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Quote Section ================= */}

      <section className="quote-section">
        <Container>
          <div className="quote-box">
            <span className="quote-icon">"</span>

            <h2 style={{ color: "white" }}>
              At our institution, education goes beyond classrooms—it fosters
              innovation, critical thinking, ethical leadership, and a lifelong
              passion for learning.
            </h2>

            <h5>— {director?.directorName}</h5>
          </div>
        </Container>
      </section>

      {/* ================= Call To Action ================= */}


    </>
  );
};

export default DirectorMessage;
