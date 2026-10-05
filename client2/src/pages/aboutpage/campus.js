import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

import {
  FaBookOpen,
  FaComputer,
  FaBuilding,
  FaFutbol,
  FaWifi,
  FaLaptop,
  FaPlay,
  FaArrowRight,
  FaLeaf,
} from "react-icons/fa6";

import { getCampus } from "../../services/campusService";

import "./campus.css";

const Campus = () => {
  const [campus, setCampus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PUBLIC CAMPUS
  ===================================================== */

  useEffect(() => {
    const loadCampus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCampus();

        if (response?.data) {
          setCampus(response.data);
        } else {
          setError("Campus information is not available.");
        }
      } catch (err) {
        console.error("Failed to load campus:", err);

        setError(
          err?.response?.data?.message || "Failed to load campus information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCampus();
  }, []);

  /* =====================================================
     FACILITY ICON
  ===================================================== */

  const getFacilityIcon = (icon) => {
    switch (icon) {
      case "BookOpen":
        return <FaBookOpen />;

      case "Computer":
        return <FaComputer />;

      case "Building":
        return <FaBuilding />;

      case "Futbol":
        return <FaFutbol />;

      case "Wifi":
        return <FaWifi />;

      case "Laptop":
        return <FaLaptop />;

      default:
        return <FaBuilding />;
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="campus-page-loading">
        <Spinner animation="border" />
        <p>Loading Campus...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !campus) {
    return (
      <div className="campus-page-error">
        <Container>
          <h3>Campus information unavailable</h3>

          <p>{error || "Unable to load campus information."}</p>
        </Container>
      </div>
    );
  }

  return (
    <main className="campus-public-page">
      {/* =================================================
          CAMPUS HERO
      ================================================= */}

      <section className="campus-hero-section">
        <div className="campus-hero-overlay">
          <Container>
            <div className="campus-hero-content">
              <span className="campus-hero-tag">
                CAMPUS &amp; INFRASTRUCTURE
              </span>

              <h1>
                Experience the
                <span> IMSEC Campus</span>
              </h1>

              <p style={{ color: "white" }}>
                Discover a vibrant, technology-enabled campus designed to
                inspire learning, innovation and an enriching student
                experience.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* =================================================
          CAMPUS OVERVIEW
      ================================================= */}

      <section id="campus-overview" className="campus-overview-section">
        <Container>
          <Row className="align-items-center g-5">
            {/* IMAGE */}

            <Col lg={6} className="campus-overview-image-col">
              {campus.overviewImage && (
                <div className="campus-overview-image-wrapper">
                  <img
                    src={campus.overviewImage}
                    alt={campus.overviewTitle || "IMSEC Campus"}
                    className="campus-overview-image"
                  />
                </div>
              )}
            </Col>

            {/* CONTENT */}

            <Col lg={6}>
              <div className="campus-section-content">
                <span className="campus-section-tag">{campus.overviewTag}</span>

                <h1>{campus.overviewTitle}</h1>

                <p className="campus-section-description">
                  {campus.overviewDescription}
                </p>

                {/* STATS */}

                {campus.overviewStats?.length > 0 && (
                  <Row className="campus-stats-row">
                    {[...campus.overviewStats]
                      .sort(
                        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
                      )
                      .map((stat, index) => (
                        <Col xs={4} key={`${stat.label}-${index}`}>
                          <div className="campus-stat">
                            <strong>{stat.value}</strong>

                            <span>{stat.label}</span>
                          </div>
                        </Col>
                      ))}
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      {campus.gallery?.length > 0 && (
        <section className="campus-gallery-section">
          <Container>
            <div className="campus-section-heading text-center">
              <span className="campus-section-tag">CAMPUS GALLERY</span>

              <h2>Explore Our Campus</h2>

              <p>
                Take a glimpse at the vibrant learning environment at IMSEC.
              </p>
            </div>

            <Row className="g-4">
              {[...campus.gallery]
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((item, index) => (
                  <Col md={6} lg={4} key={`${item.title}-${index}`}>
                    <div className="campus-gallery-card">
                      {item.image && (
                        <div className="campus-gallery-image-wrapper">
                          <img
                            src={item.image}
                            alt={item.title || "IMSEC Campus"}
                            className="campus-gallery-image"
                          />
                        </div>
                      )}

                      <div className="campus-gallery-content">
                        <h4>{item.title}</h4>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
        </section>
      )}

      {/* =================================================
          FACILITIES
      ================================================= */}

      {campus.facilities?.length > 0 && (
        <section className="campus-facilities-section">
          <Container>
            <div className="campus-section-heading text-center">
              <span className="campus-section-tag">CAMPUS FACILITIES</span>

              <h2>Everything You Need to Learn</h2>

              <p>
                Modern facilities designed to support academic excellence and
                student life.
              </p>
            </div>

            <Row className="g-4">
              {[...campus.facilities]
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((facility, index) => (
                  <Col sm={6} lg={4} key={`${facility.title}-${index}`}>
                    <div className="campus-facility-card">
                      <div className="campus-facility-icon">
                        {getFacilityIcon(facility.icon)}
                      </div>

                      <h4>{facility.title}</h4>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
        </section>
      )}

      {/* =================================================
          VIRTUAL CAMPUS TOUR
      ================================================= */}

      <section className="campus-tour-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              {campus.tourImage && (
                <div className="campus-tour-image-wrapper">
                  <img
                    src={campus.tourImage}
                    alt={campus.tourTitle || "Virtual Campus Tour"}
                    className="campus-tour-image"
                  />

                  {campus.tourVideoLink && (
                    <a
                      href={campus.tourVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="campus-tour-play-button"
                      aria-label="Watch Virtual Campus Tour"
                    >
                      <FaPlay />
                    </a>
                  )}
                </div>
              )}
            </Col>

            <Col lg={6}>
              <div className="campus-section-content">
                <span className="campus-section-tag">{campus.tourTag}</span>

                <h2>{campus.tourTitle}</h2>

                <p className="campus-section-description">
                  {campus.tourDescription}
                </p>

                {campus.tourVideoLink && (
                  <Button
                    href={campus.tourVideoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="campus-primary-button"
                  >
                    {campus.tourButtonText || "Watch Tour"}

                    <FaArrowRight />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =================================================
          GREEN CAMPUS
      ================================================= */}

      <section className="campus-green-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              <div className="campus-green-content text-center">
                <div className="campus-green-icon">
                  <FaLeaf />
                </div>

                <span className="campus-section-tag">{campus.greenTag}</span>

                <h2>{campus.greenTitle}</h2>

                <p>{campus.greenDescription}</p>

                <div className="campus-green-card">
                  <h3>{campus.greenCardTitle}</h3>

                  <p>{campus.greenCardDescription}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =================================================
          STUDENT LIFE
      ================================================= */}

      {campus.studentLife?.length > 0 && (
        <section className="campus-student-life-section">
          <Container>
            <div className="campus-section-heading text-center">
              <span className="campus-section-tag">
                {campus.studentLifeTag}
              </span>

              <h2>{campus.studentLifeTitle}</h2>
            </div>

            <Row className="g-4 justify-content-center">
              {[...campus.studentLife]
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((activity, index) => (
                  <Col sm={6} md={4} key={`${activity.title}-${index}`}>
                    <div className="campus-student-life-card">
                      <span>{String(index + 1).padStart(2, "0")}</span>

                      <h4>{activity.title}</h4>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
        </section>
      )}

      {/* =================================================
          CTA
      ================================================= */}

      <section
        className="campus-cta-section"
        style={{
          backgroundColor: "#FDB913",
        }}
      >
        <Container>
          <div className="campus-cta-content text-center">
            <h2>{campus.ctaTitle}</h2>

            <p>{campus.ctaDescription}</p>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Campus;
