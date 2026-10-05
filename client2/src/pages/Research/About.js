import React, { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import {
  FaFlask,
  FaLightbulb,
  FaBullseye,
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
   COMPONENT
===================================================== */

const ResearchAbout = () => {
  const [about, setAbout] = useState(null);

  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     FETCH DATA
  ===================================================== */

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setLoading(true);

        setError("");

        const [aboutResponse, partnersResponse] = await Promise.all([
          getResearchAbout(),
          getResearchPartners(),
        ]);

        /* ---------------------------------------------
           ABOUT
        --------------------------------------------- */

        setAbout(aboutResponse.data?.data || null);

        /* ---------------------------------------------
           PARTNERS
        --------------------------------------------- */

        const partnerData = partnersResponse.data?.data || [];

        /*
          Backend already sorts by priority.

          Public website should display only
          Active partners.
        */

        const activePartners = partnerData.filter(
          (partner) => partner.status === "Active",
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

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>Loading Research Information...</h4>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
      {/* =================================================
          HERO
      ================================================= */}

      <section className="research-hero">
        <Container>
          <div className="hero-content">
            <h1>Research @ IMSEC</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Research
              <span>/</span>
              About
            </p>
          </div>
        </Container>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="container py-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="research-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={12}>
              <h6 className="section-tag" style={{ color: "black" }}>
                RESEARCH & INNOVATION
              </h6>

              <h2 className="section-title">
                Building a<span> Research Culture</span>
              </h2>

              <p>
                IMS Engineering College is committed to fostering an ecosystem
                of innovation, interdisciplinary research and knowledge creation
                that addresses societal and industrial challenges.
              </p>

              <p>
                The institute actively encourages faculty members, researchers
                and students to undertake quality research, publish in reputed
                journals, file patents and collaborate with industries and
                academic institutions.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =================================================
          VISION & MISSION
      ================================================= */}

      {about && (
        <section className="vision-section py-5">
          <Container>
            <Row className="g-4">
              {/* VISION */}

              <Col lg={6}>
                <div className="vision-card">
                  <FaBullseye className="vision-icon" />

                  <h3>Our Vision</h3>

                  <p>{about.vision}</p>
                </div>
              </Col>

              {/* MISSION */}

              <Col lg={6}>
                <div className="vision-card">
                  <FaFlask className="vision-icon" />

                  <h3>Our Mission</h3>

                  <p>{about.mission}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* =================================================
          PHILOSOPHY
      ================================================= */}

      <section className="philosophy-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              Our
              <span> Philosophy</span>
            </h2>
          </div>

          <Row className="g-4">
            {philosophy.map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="philosophy-card">
                  <div className="philosophy-icon">{item.icon}</div>

                  <h5>{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =================================================
          RESEARCH ECOSYSTEM
      ================================================= */}

      <section className="ecosystem-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              ECOSYSTEM
            </h6>

            <h2 className="section-title">
              Research
              <span> Ecosystem</span>
            </h2>
          </div>

          <Row className="g-4">
            {ecosystem.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="ecosystem-card">
                  <div className="ecosystem-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =================================================
          RESEARCH FOCUS AREAS
      ================================================= */}

      <section className="focus-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              RESEARCH DOMAINS
            </h6>

            <h2 className="section-title">
              Focus
              <span> Areas</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
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
            ].map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="focus-card">
                  <div className="focus-icon">{item.icon}</div>

                  <h5>{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =================================================
          INDUSTRY & ACADEMIC PARTNERS
      ================================================= */}

      <section className="collaboration-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">COLLABORATIONS</h6>

            <h2 className="section-title">
              Industry & Academic
              <span> Partners</span>
            </h2>
          </div>

          <Row className="g-4">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <Col lg={3} md={6} key={partner._id}>
                  <div className="partner-card">
                    <h4>{partner.name}</h4>

                    {partner.type && <small>{partner.type}</small>}

                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center">
                  <p>No active research partners available at present.</p>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* =================================================
          SDGs
      ================================================= */}

      <section className="sdg-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              Sustainable Development
              <span> Goals</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Quality Education",
              "Good Health",
              "Affordable Clean Energy",
              "Industry Innovation",
              "Climate Action",
            ].map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="sdg-card">
                  <FaLeaf className="sdg-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ResearchAbout;
