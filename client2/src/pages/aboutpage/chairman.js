import React from "react";
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

import { useEffect, useState } from "react";
import { getChairman } from "../../services/chairmanService";

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

const ChairmanMessage = () => {
  const [chairman, setChairman] = useState(null);

  const [loading, setLoading] = useState(true);
  const fetchChairman = async () => {
    try {
      const res = await getChairman();

      setChairman(res.data.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChairman();
  }, []);
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
          <div className="hero-content">
            <h1>Chairman's Message</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              About
              <span>/</span>
              Chairman's Message
            </p>
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
                    chairman?.imageUrl ||
                    "https://via.placeholder.com/350x400?text=Chairman"
                  }
                  alt={chairman?.chairmanName}
                  className="chairman-photo"
                />

                <div className="chairman-info">
                  <h3>{chairman?.chairmanName}</h3>

                  <h5>Chairman</h5>

                  <p style={{ color: "white" }}>IMS Engineering College</p>
                </div>

                <hr />

                <div className="experience-box">
                  <FaAward />
                </div>
              </div>
            </Col>

            {/* Right */}

            <Col lg={8}>
              <div className="message-box">
                <h6 className="section-tag">CHAIRMAN'S MESSAGE</h6>

                <h2 className="section-title">
                  Building Future
                  <span> Leaders</span>
                </h2>

                {chairman?.message?.split("\n").map((para, index) => (
                  <p key={index} className="section-text">
                    {para}
                  </p>
                ))}
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
              <span> Principles</span>
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
              Education is the foundation of a better tomorrow. Our
              responsibility is to inspire students to become lifelong learners,
              ethical leaders and innovators who contribute positively to
              society.
            </h2>

            <h5>— {chairman?.chairmanName}</h5>
          </div>
        </Container>
      </section>

      {/* ================= Call To Action ================= */}

      <section className="cta-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Become a Part of IMSEC</h2>

              <p>
                Join one of India's leading engineering institutions and start
                your journey toward academic excellence, innovation and
                successful careers.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ChairmanMessage;
