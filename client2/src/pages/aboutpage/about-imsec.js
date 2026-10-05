import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaEye, FaBullseye } from "react-icons/fa6";

import { getAboutImsec } from "../../services/aboutImsecService";

import "./about-imsec.css";

const AboutImsec = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD ABOUT IMSEC
  ========================================================= */

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAboutImsec();

        if (response?.success && response?.data) {
          setAbout(response.data);
        } else {
          throw new Error(response?.message || "Failed to load About IMSEC.");
        }
      } catch (err) {
        console.error("About IMSEC Load Error:", err);

        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load About IMSEC.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="about-imsec-loading"
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Spinner animation="border" />

        <p className="mt-3">Loading About IMSEC...</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !about) {
    return (
      <div
        className="about-imsec-error"
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div>
          <h3>Unable to load About IMSEC</h3>

          <p>{error || "About IMSEC information is currently unavailable."}</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     SORT HELPERS
  ========================================================= */

  const highlights = [...(about.highlights || [])].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  const missionItems = [...(about.missionItems || [])].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  const whyChooseItems = [...(about.whyChooseItems || [])].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  const facilities = [...(about.facilities || [])].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  return (
    <>
      {/* =====================================================
          HERO BANNER
      ===================================================== */}

      <section className="overview-hero">
        <Container>
          <div className="hero-content">
            <h1>{about.heroTitle}</h1>

            <p
              style={{
                color: "white",
              }}
            >
              {about.heroBreadcrumb?.split("/").map((item, index, arr) => (
                <React.Fragment key={index}>
                  {item.trim()}

                  {index < arr.length - 1 && <span> / </span>}
                </React.Fragment>
              ))}
            </p>
          </div>
        </Container>
      </section>

      {/* =====================================================
          ABOUT IMSEC
      ===================================================== */}

      <section className="about-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={about.aboutImage}
                alt="IMSEC Campus"
                className="img-fluid rounded-4 shadow"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag">{about.aboutTag}</h6>

              <h2 className="section-title">{about.aboutTitle}</h2>

              <p className="section-text">{about.aboutDescription1}</p>

              <p className="section-text">{about.aboutDescription2}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =====================================================
          OVERVIEW HIGHLIGHTS
      ===================================================== */}

      <section className="highlight-section py-5">
        <Container>
          <Row>
            {highlights.map((item, index) => (
              <Col lg={4} md={6} key={item._id || index} className="mb-4">
                <Card className="highlight-card border-0">
                  <Card.Body>
                    <h4>{item.title}</h4>

                    <p>{item.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =====================================================
          VISION & MISSION
      ===================================================== */}

      <section className="vision-section py-5">
        <Container>
          <Row className="g-4">
            {/* VISION */}

            <Col lg={6}>
              <div className="vision-card">
                <div className="icon-box">
                  <FaEye />
                </div>

                <h3>{about.visionTitle}</h3>

                <p>{about.visionDescription}</p>
              </div>
            </Col>

            {/* MISSION */}

            <Col lg={6}>
              <div className="vision-card">
                <div className="icon-box">
                  <FaBullseye />
                </div>

                <h3>{about.missionTitle}</h3>

                <ul>
                  {missionItems.map((item, index) => (
                    <li key={item._id || index}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =====================================================
          WHY CHOOSE IMSEC
      ===================================================== */}

      <section className="why-imsec py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">{about.whyChooseTitle}</h2>

            <p
              className="section-text mx-auto"
              style={{
                maxWidth: "750px",
              }}
            >
              {about.whyChooseDescription}
            </p>
          </div>

          <Row className="g-4">
            {whyChooseItems.map((item, index) => (
              <Col lg={4} md={6} key={item._id || index}>
                <div className="feature-card">
                  <div className="feature-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =====================================================
          CAMPUS FACILITIES
      ===================================================== */}

      <section className="facility-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              {about.facilityTag}
            </h6>

            <h2 className="section-title">{about.facilityTitle}</h2>

            <p
              className="section-text mx-auto"
              style={{
                maxWidth: "750px",
              }}
            >
              {about.facilityDescription}
            </p>
          </div>

          <Row className="g-4">
            {facilities.map((item, index) => (
              <Col lg={4} md={6} key={item._id || index}>
                <div className="facility-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="facility-img"
                  />

                  <div className="facility-overlay">
                    <h4
                      style={{
                        color: "white",
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>{about.ctaTitle}</h2>

              <p>{about.ctaDescription}</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AboutImsec;
