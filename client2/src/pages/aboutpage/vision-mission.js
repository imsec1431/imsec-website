import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "./vision-mission.css";
import { FaEye, FaBullseye } from "react-icons/fa6";

import { getVisionMission } from "../../services/visionMissionService";

const VisionMission = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVisionMission = async () => {
      try {
        setLoading(true);

        const response = await getVisionMission();

        // console.log("VISION MISSION API DATA:", response);

        if (response?.success) {
          setData(response.data);
        } else {
          setError(
            response?.message || "Unable to load Vision & Mission information.",
          );
        }
      } catch (err) {
        console.error("Vision Mission API Error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load Vision & Mission information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadVisionMission();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{ minHeight: "60vh" }}
      >
        <Container>
          <h4>{error || "Vision & Mission information is unavailable."}</h4>
        </Container>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * NORMALIZE API DATA
   * ---------------------------------------------------------
   *
   * Supports:
   * data.missionItems
   * data.mission.items
   *
   * data.missionCards
   * data.mission.cards
   *
   * data.values
   * data.coreValues
   */

  const missionItems = [
    ...(Array.isArray(data.missionItems)
      ? data.missionItems
      : Array.isArray(data.mission?.items)
        ? data.mission.items
        : []),
  ].sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  const missionCards = [
    ...(Array.isArray(data.missionCards)
      ? data.missionCards
      : Array.isArray(data.mission?.cards)
        ? data.mission.cards
        : []),
  ].sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  const values = [
    ...(Array.isArray(data.values)
      ? data.values
      : Array.isArray(data.coreValues)
        ? data.coreValues
        : []),
  ].sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  /*
   * Helper functions
   * These make the page compatible with slightly
   * different MongoDB field structures.
   */

  const getMissionItemText = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.text || item?.description || item?.title || item?.value || "";
  };

  const getMissionCardDescription = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.desc || item?.description || item?.text || "";
  };

  const getValueText = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.text || item?.value || item?.title || item?.name || "";
  };

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="vm-hero">
        <Container>
          <h1>{data.heroTitle || "Vision & Mission"}</h1>

          <p style={{ color: "white" }}>
            {data.heroBreadcrumb || "Home / About / Vision & Mission"}
          </p>
        </Container>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              {data.introImage && (
                <img
                  src={data.introImage}
                  alt={data.introTitle || "Vision and Mission"}
                  className="img-fluid rounded-4 shadow"
                />
              )}
            </Col>

            <Col lg={6}>
              <h2 className="section-title">
                {data.introTitle || "Inspiring Future Leaders"}{" "}
                {data.introTitleHighlight && (
                  <span>{data.introTitleHighlight}</span>
                )}
              </h2>

              <p className="section-text">{data.introDescription}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =====================================================
          VISION & MISSION
      ====================================================== */}

      <section className="vision-section py-5">
        <Container>
          <Row className="g-4">
            {/* VISION */}

            <Col lg={6}>
              <div className="vision-card">
                <div className="icon-box">
                  <FaEye />
                </div>

                <h3>{data.visionTitle || "Our Vision"}</h3>

                <p>{data.visionDescription}</p>
              </div>
            </Col>

            {/* MISSION */}

            <Col lg={6}>
              <div className="vision-card">
                <div className="icon-box">
                  <FaBullseye />
                </div>

                <h3>{data.missionTitle || "Our Mission"}</h3>

                {missionItems.length > 0 ? (
                  <ul>
                    {missionItems.map((item, index) => (
                      <li key={item?._id || item?.id || index}>
                        {getMissionItemText(item)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    {data.missionDescription ||
                      "Provide quality technical education, develop leadership and innovation, promote industry collaboration, encourage research and entrepreneurship, and build ethical and responsible professionals."}
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =====================================================
          MISSION CARDS
      ====================================================== */}

      <section className="mission-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              {data.missionSectionTag || "OUR MISSION"}
            </h6>

            <h2 className="section-title">
              {data.missionSectionTitle || "What We"}{" "}
              {data.missionSectionHighlight && (
                <span>{data.missionSectionHighlight}</span>
              )}
            </h2>
          </div>

          {missionCards.length > 0 ? (
            <Row className="g-4">
              {missionCards.map((item, index) => (
                <Col lg={4} md={6} key={item?._id || item?.id || index}>
                  <div className="mission-card">
                    <div className="mission-icon">{item?.icon || "🎓"}</div>

                    <h4>{item?.title || item?.name || ""}</h4>

                    <p>{getMissionCardDescription(item)}</p>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="g-4">
              {/* Default Mission Cards */}

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">🎓</div>

                  <h4>Quality Education</h4>

                  <p>Provide outcome-based quality technical education.</p>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">🔬</div>

                  <h4>Research</h4>

                  <p>Promote innovation and interdisciplinary research.</p>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">🏢</div>

                  <h4>Industry Connect</h4>

                  <p>Build strong collaboration with industries.</p>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">👨‍💼</div>

                  <h4>Leadership</h4>

                  <p>Develop ethical and responsible leaders.</p>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">🚀</div>

                  <h4>Entrepreneurship</h4>

                  <p>Encourage startup culture and innovation.</p>
                </div>
              </Col>

              <Col lg={4} md={6}>
                <div className="mission-card">
                  <div className="mission-icon">🌎</div>

                  <h4>Global Exposure</h4>

                  <p>Prepare students for global opportunities.</p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* =====================================================
          CORE VALUES
      ====================================================== */}

      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              {data.valuesSectionTitle || "Core Values"}{" "}
              {data.valuesSectionHighlight && (
                <span>{data.valuesSectionHighlight}</span>
              )}
            </h2>
          </div>

          {values.length > 0 ? (
            <Row className="g-4">
              {values.map((item, index) => (
                <Col lg={2} md={4} xs={6} key={item?._id || item?.id || index}>
                  <div className="value-card">{getValueText(item)}</div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="g-4">
              {/* Default Core Values */}

              {[
                "Integrity",
                "Innovation",
                "Leadership",
                "Excellence",
                "Research",
                "Team Work",
              ].map((item, index) => (
                <Col lg={2} md={4} xs={6} key={index}>
                  <div className="value-card">{item}</div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* =====================================================
          EDUCATIONAL PHILOSOPHY
      ====================================================== */}

      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="section-title">
                {data.philosophyTitle || "Our Educational Philosophy"}{" "}
                {data.philosophyHighlight && (
                  <span>{data.philosophyHighlight}</span>
                )}
              </h2>

              <p className="section-text">{data.philosophyDescription}</p>
            </Col>

            <Col lg={6}>
              {data.philosophyImage && (
                <img
                  src={data.philosophyImage}
                  alt={data.philosophyTitle || "Educational Philosophy"}
                  className="img-fluid rounded-4 shadow"
                />
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="cta-section">
        <Container className="text-center">
          <h2>{data.ctaTitle || "Shape Your Future With IMSEC"}</h2>

          <p>
            {data.ctaDescription ||
              "Join one of the leading engineering institutions committed to academic excellence and innovation."}
          </p>
        </Container>
      </section>
    </>
  );
};

export default VisionMission;
