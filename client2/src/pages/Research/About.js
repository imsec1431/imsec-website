import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  FaFlask,
  FaLightbulb,
  FaUniversity,
  FaMicroscope,
  FaUsers,
  FaAtom,
  FaLaptopCode,
  FaLeaf,
  FaCogs,
} from "react-icons/fa";

import { getResearchAbout } from "../../services/researchAboutService";
import { getResearchPartners } from "../../services/researchPartnerPublicService";
import "./About.css";

/* =====================================================
   STATIC RESEARCH ECOSYSTEM
===================================================== */
const ecosystem = [
  {
    id: 1,
    title: "Research Centers",
    icon: <FaMicroscope />,
    description:
      "Advanced interdisciplinary research centers promoting innovation and scientific excellence.",
  },
  {
    id: 2,
    title: "Innovation Cell",
    icon: <FaLightbulb />,
    description:
      "Encouraging innovative ideas, startups, product development and entrepreneurship.",
  },
  {
    id: 3,
    title: "Industry Collaboration",
    icon: <FaUsers />,
    description:
      "Strong collaborations with industries for consultancy, funded research and projects.",
  },
  {
    id: 4,
    title: "Sponsored Projects",
    icon: <FaUniversity />,
    description:
      "Faculty members actively participate in government and industry funded research.",
  },
];

/* =====================================================
   STATIC PHILOSOPHY
===================================================== */
const philosophy = [
  {
    title: "Innovation",
    icon: <FaLightbulb />,
  },
  {
    title: "Research Ethics",
    icon: <FaFlask />,
  },
  {
    title: "Collaboration",
    icon: <FaUsers />,
  },
  {
    title: "Technology",
    icon: <FaLaptopCode />,
  },
];

/* =====================================================
   STATIC FOCUS AREAS
===================================================== */
const focusAreas = [
  {
    title: "Artificial Intelligence",
    icon: <FaAtom />,
  },
  {
    title: "Machine Learning",
    icon: <FaLaptopCode />,
  },
  {
    title: "Data Science",
    icon: <FaLaptopCode />,
  },
  {
    title: "Cyber Security",
    icon: <FaCogs />,
  },
  {
    title: "Internet of Things",
    icon: <FaMicroscope />,
  },
  {
    title: "Cloud Computing",
    icon: <FaUniversity />,
  },
  {
    title: "Robotics",
    icon: <FaCogs />,
  },
  {
    title: "Renewable Energy",
    icon: <FaLeaf />,
  },
];

/* =====================================================
   STATIC SDGS
===================================================== */
const sdgs = [
  "Quality Education",
  "Good Health",
  "Affordable Clean Energy",
  "Industry Innovation",
  "Climate Action",
];

const ResearchAbout = () => {
  const [about, setAbout] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [aboutResponse, partnersResponse] = await Promise.all([
          getResearchAbout(),
          getResearchPartners(),
        ]);

        setAbout(aboutResponse.data?.data || null);

        const partnerData = partnersResponse.data?.data || [];
        const activePartners = partnerData.filter(
          (partner) => partner.status === "Active"
        );
        setPartners(activePartners);
      } catch (err) {
        console.error("Research About Error:", err);
        setError("Unable to load research information.");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  const renderParagraphs = (text) => {
    if (!text) return null;
    const normalized = text.replace(/\r\n/g, "\n");
    const hasDoubleNewline = /\n\s*\n/.test(normalized);

    const paragraphs = hasDoubleNewline
      ? normalized.split(/\n\s*\n/)
      : normalized.split("\n");

    return paragraphs
      .map((p) => (hasDoubleNewline ? p.replace(/\n/g, " ") : p).trim())
      .filter((p) => p.length > 0)
      .map((paragraph, index) => (
        <p key={index} style={{ textAlign: "justify" }}>
          {paragraph}
        </p>
      ));
  };

  if (loading) {
    return (
      <div className="research-about-page">
        <div className="research-about-status">
          Loading Research Information...
        </div>
      </div>
    );
  }

  return (
    <main className="research-about-page">
      {/* Hero Banner */}
      <section className="research-about-hero">
        <div className="research-about-hero-content">
          <h1>Research @ IMSEC</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="research-about-content">
        <div className="research-about-container">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {/* Introduction Box */}
          <div
            className="research-about-introduction"
            style={{ textAlign: "justify" }}
          >
            <p style={{ textAlign: "justify" }}>
              IMS Engineering College is committed to fostering an ecosystem of
              innovation, interdisciplinary research and knowledge creation
              that addresses societal and industrial challenges. The institute
              actively encourages faculty members, researchers and students to
              undertake quality research, publish in reputed journals, file
              patents and collaborate with industries and academic
              institutions.
            </p>
          </div>

          {/* Vision & Mission */}
          {about && (about.vision || about.mission) && (
            <Row className="g-4 mb-4">
              {about.vision && (
                <Col lg={about.mission ? 6 : 12}>
                  <section className="research-about-section h-100">
                    <h2>Our Vision</h2>
                    <div
                      className="research-about-text"
                      style={{ textAlign: "justify" }}
                    >
                      {renderParagraphs(about.vision)}
                    </div>
                  </section>
                </Col>
              )}
              {about.mission && (
                <Col lg={about.vision ? 6 : 12}>
                  <section className="research-about-section h-100">
                    <h2>Our Mission</h2>
                    <div
                      className="research-about-text"
                      style={{ textAlign: "justify" }}
                    >
                      {renderParagraphs(about.mission)}
                    </div>
                  </section>
                </Col>
              )}
            </Row>
          )}

          {/* Philosophy */}
          <section className="research-about-section">
            <h2>Our Philosophy</h2>
            <Row className="g-3 mt-1">
              {philosophy.map((item, idx) => (
                <Col lg={3} sm={6} key={idx}>
                  <div className="research-grid-card text-center">
                    <div className="research-card-icon">{item.icon}</div>
                    <h5>{item.title}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Research Ecosystem */}
          <section className="research-about-section">
            <h2>Research Ecosystem</h2>
            <Row className="g-3 mt-1">
              {ecosystem.map((item) => (
                <Col lg={3} sm={6} key={item.id}>
                  <div className="research-grid-card">
                    <div className="research-card-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Research Focus Areas */}
          <section className="research-about-section">
            <h2>Research Focus Areas</h2>
            <Row className="g-3 mt-1">
              {focusAreas.map((item, idx) => (
                <Col lg={3} sm={6} key={idx}>
                  <div className="research-grid-card text-center">
                    <div className="research-card-icon">{item.icon}</div>
                    <h5>{item.title}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Industry & Academic Partners */}
          <section className="research-about-section">
            <h2>Industry &amp; Academic Partners</h2>
            <Row className="g-3 mt-1">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <Col lg={3} sm={6} key={partner._id}>
                    <div className="research-partner-card">
                      <h4>{partner.name}</h4>
                      {partner.type && (
                        <span className="partner-type-badge">
                          {partner.type}
                        </span>
                      )}
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="partner-link"
                        >
                          Visit Website &rarr;
                        </a>
                      )}
                    </div>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <p className="text-muted mb-0">
                    No active research partners available at present.
                  </p>
                </Col>
              )}
            </Row>
          </section>

          {/* Sustainable Development Goals */}
          <section className="research-about-section">
            <h2>Sustainable Development Goals</h2>
            <Row className="g-3 mt-1">
              {sdgs.map((item, idx) => (
                <Col lg={4} sm={6} key={idx}>
                  <div className="research-sdg-card">
                    <FaLeaf className="sdg-icon" />
                    <h5>{item}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ResearchAbout;
