import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";

import {
  FaUsers,
  FaMicrophone,
  FaVideo,
  FaLightbulb,
  FaChair,
  FaDesktop,
  FaFan,
  FaShieldAlt,
  FaCalendarAlt,
  FaHeadset,
  FaBuilding,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import { getAuditorium } from "../../services/auditoriumService";

import "./Auditorium.css";

/*
|--------------------------------------------------------------------------
| Default Fallback Data
|--------------------------------------------------------------------------
*/

const DEFAULT_DATA = {
  hero: {
    title: "Auditorium",
    breadcrumb: "Home / Life @ IMSEC / Auditorium",
    image: {
      url: "",
    },
  },

  introduction: {
    tag: "LIFE @ IMSEC",
    title: "A Space for",
    highlight: "Ideas & Events",
    description1:
      "The auditorium at IMS Engineering College provides a modern and well-equipped venue for academic, cultural and institutional events.",
    description2:
      "It serves as a central gathering space for students, faculty and guests for seminars, conferences, workshops, cultural programmes and other important events.",
    image: {
      url: "",
    },
  },

  features: [
    {
      icon: "FaUsers",
      title: "Spacious Seating",
      description:
        "A comfortable seating arrangement designed to accommodate large gatherings and institutional programmes.",
    },
    {
      icon: "FaMicrophone",
      title: "Modern Audio System",
      description:
        "Audio facilities support lectures, seminars, conferences, cultural programmes and presentations.",
    },
    {
      icon: "FaVideo",
      title: "Visual Presentation",
      description:
        "Presentation and display facilities help deliver engaging academic and professional programmes.",
    },
    {
      icon: "FaLightbulb",
      title: "Stage Lighting",
      description:
        "Professional lighting arrangements enhance academic, cultural and ceremonial events.",
    },
  ],

  facilities: [
    {
      icon: "FaChair",
      title: "Comfortable Seating",
      description:
        "Well-arranged seating provides a comfortable experience for students, faculty members and guests.",
    },
    {
      icon: "FaMicrophone",
      title: "Sound System",
      description:
        "Suitable audio equipment supports speeches, lectures, performances and presentations.",
    },
    {
      icon: "FaDesktop",
      title: "Presentation Support",
      description:
        "Presentation facilities are available for seminars, workshops, conferences and academic activities.",
    },
    {
      icon: "FaLightbulb",
      title: "Stage Lighting",
      description:
        "Lighting facilities provide suitable illumination for different types of programmes.",
    },
    {
      icon: "FaFan",
      title: "Air Conditioned",
      description:
        "A comfortable indoor environment supports long-duration academic and institutional programmes.",
    },
    {
      icon: "FaShieldAlt",
      title: "Safe Environment",
      description:
        "The venue is maintained to provide a safe and organized environment for institutional activities.",
    },
  ],

  gallery: [],

  statistics: [
    {
      value: "500+",
      label: "Seating Capacity",
      icon: "FaUsers",
    },
    {
      value: "100+",
      label: "Events Every Year",
      icon: "FaCalendarAlt",
    },
    {
      value: "24×7",
      label: "Institutional Support",
      icon: "FaHeadset",
    },
    {
      value: "1",
      label: "Central Auditorium",
      icon: "FaBuilding",
    },
  ],

  uses: [
    "Seminars and Conferences",
    "Technical Workshops",
    "Guest Lectures",
    "Cultural Programmes",
    "Annual Functions",
    "Orientation Programmes",
    "Convocation Events",
    "Student Activities",
    "Faculty Development Programmes",
    "Institutional Meetings",
  ],

  rules: [
    "The auditorium should be booked in advance through the designated authority.",
    "Users must maintain cleanliness and discipline inside the auditorium.",
    "Food and beverages should not be consumed inside the auditorium unless specifically permitted.",
    "Audio and visual equipment should be operated only by authorized personnel.",
    "Any damage to auditorium property may be subject to institutional recovery procedures.",
    "Students must follow the instructions of faculty coordinators during events.",
    "The auditorium should be left clean and organized after every programme.",
    "Emergency exits and safety equipment must remain accessible at all times.",
  ],

  faqs: [
    {
      question: "What type of events can be organized in the auditorium?",
      answer:
        "The auditorium can be used for seminars, conferences, workshops, cultural programmes, orientation programmes, guest lectures, meetings and other institutional activities.",
    },
    {
      question: "Can students use the auditorium?",
      answer:
        "Yes. Students can use the auditorium for approved academic, cultural and institutional activities under the guidance of the concerned faculty or coordinator.",
    },
    {
      question: "Is advance booking required?",
      answer:
        "Yes. Events should be scheduled and the auditorium should be booked in advance through the appropriate institutional authority.",
    },
    {
      question: "Are audio and presentation facilities available?",
      answer:
        "The auditorium provides facilities to support audio communication and visual presentations for institutional programmes.",
    },
  ],

  cta: {
    title: "A Venue for Every Occasion",
    description:
      "The IMSEC auditorium provides the perfect environment for learning, collaboration, celebration and memorable institutional events.",
  },
};

/*
|--------------------------------------------------------------------------
| Icon Map
|--------------------------------------------------------------------------
*/

const ICONS = {
  FaUsers,
  FaMicrophone,
  FaVideo,
  FaLightbulb,
  FaChair,
  FaDesktop,
  FaFan,
  FaShieldAlt,
  FaCalendarAlt,
  FaHeadset,
  FaBuilding,
  FaCheckCircle,
  FaArrowRight,
};

/*
|--------------------------------------------------------------------------
| Get Icon
|--------------------------------------------------------------------------
*/

const getIcon = (iconName, fallback = FaCheckCircle) => {
  return ICONS[iconName] || fallback;
};

/*
|--------------------------------------------------------------------------
| Image Helper
|--------------------------------------------------------------------------
*/

const getImageUrl = (image, fallback = "") => {
  if (typeof image === "string") {
    return image || fallback;
  }

  return image?.url || fallback;
};

/*
|--------------------------------------------------------------------------
| Normalize API Data
|--------------------------------------------------------------------------
*/

const normalizeData = (apiData) => {
  if (!apiData) {
    return DEFAULT_DATA;
  }

  return {
    ...DEFAULT_DATA,
    ...apiData,

    hero: {
      ...DEFAULT_DATA.hero,
      ...(apiData.hero || {}),
    },

    introduction: {
      ...DEFAULT_DATA.introduction,
      ...(apiData.introduction || {}),
    },

    features:
      Array.isArray(apiData.features) && apiData.features.length
        ? apiData.features
        : DEFAULT_DATA.features,

    facilities:
      Array.isArray(apiData.facilities) && apiData.facilities.length
        ? apiData.facilities
        : DEFAULT_DATA.facilities,

    gallery: Array.isArray(apiData.gallery)
      ? apiData.gallery
      : DEFAULT_DATA.gallery,

    statistics:
      Array.isArray(apiData.statistics) && apiData.statistics.length
        ? apiData.statistics
        : DEFAULT_DATA.statistics,

    uses:
      Array.isArray(apiData.uses) && apiData.uses.length
        ? apiData.uses
        : DEFAULT_DATA.uses,

    rules:
      Array.isArray(apiData.rules) && apiData.rules.length
        ? apiData.rules
        : DEFAULT_DATA.rules,

    faqs:
      Array.isArray(apiData.faqs) && apiData.faqs.length
        ? apiData.faqs
        : DEFAULT_DATA.faqs,

    cta: {
      ...DEFAULT_DATA.cta,
      ...(apiData.cta || {}),
    },
  };
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const Auditorium = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Fetch Auditorium
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchAuditorium = async () => {
      try {
        const response = await getAuditorium();

        const auditoriumData = response?.data || response;

        setData(normalizeData(auditoriumData));
      } catch (error) {
        console.error("Auditorium API Error:", error);

        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditorium();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="auditorium-loading">
        <div className="auditorium-loading-spinner" />
        <p>Loading Auditorium...</p>
      </div>
    );
  }

  return (
    <>
      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}

      <section className="auditorium-hero">
        <div className="auditorium-hero-overlay" />

        <Container>
          <div className="auditorium-hero-content">
            <span className="auditorium-hero-tag">LIFE @ IMSEC</span>

            <h1>{data.hero?.title || "Auditorium"}</h1>

            <div className="auditorium-hero-line" />

            <p style={{ color: "white" }}>
              {data.hero?.breadcrumb || "Home / Life @ IMSEC / Auditorium"}
            </p>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* INTRODUCTION */}
      {/* ================================================================ */}

      <section className="auditorium-introduction">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="order-2 order-lg-1">
              <div className="auditorium-intro-content">
                <span className="auditorium-section-tag">
                  {data.introduction?.tag || "LIFE @ IMSEC"}
                </span>

                <h2>
                  {data.introduction?.title || "A Space for"}{" "}
                  <span>
                    {data.introduction?.highlight || "Ideas & Events"}
                  </span>
                </h2>

                <div className="auditorium-title-line" />

                <p>{data.introduction?.description1 || ""}</p>

                <p>{data.introduction?.description2 || ""}</p>

                <div className="auditorium-intro-points">
                  <div>
                    <FaCheckCircle />
                    <span>Academic Events</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Cultural Programmes</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Conferences & Workshops</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6} className="order-1 order-lg-2">
              <div className="auditorium-intro-image-wrapper">
                <img
                  src={getImageUrl(data.introduction?.image)}
                  alt="IMSEC Auditorium"
                  className="auditorium-intro-image"
                />

                <div className="auditorium-image-badge">
                  <strong>IMSEC</strong>

                  <span>Auditorium</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* FEATURES */}
      {/* ================================================================ */}

      <section className="auditorium-features">
        <Container>
          <div className="auditorium-section-heading text-center">
            <span className="auditorium-section-tag">WHY OUR AUDITORIUM</span>

            <h2>
              Designed for
              <span>Meaningful Experiences</span>
            </h2>

            <p>
              A well-equipped environment designed to support academic, cultural
              and institutional activities.
            </p>
          </div>

          <Row className="g-4">
            {data.features.map((feature, index) => {
              const Icon = getIcon(feature.icon, FaCheckCircle);

              return (
                <Col lg={3} md={6} key={`feature-${index}`}>
                  <div className="auditorium-feature-card">
                    <div className="auditorium-feature-icon">
                      <Icon />
                    </div>

                    <h4>{feature.title}</h4>

                    <p>{feature.description}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* STATISTICS */}
      {/* ================================================================ */}

      <section className="auditorium-statistics">
        <Container>
          <Row className="g-4">
            {data.statistics.map((stat, index) => {
              const Icon = getIcon(stat.icon, FaBuilding);

              return (
                <Col lg={3} md={6} key={`stat-${index}`}>
                  <div className="auditorium-stat-card">
                    <div className="auditorium-stat-icon">
                      <Icon />
                    </div>

                    <strong>{stat.value}</strong>

                    <span>{stat.label}</span>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* FACILITIES */}
      {/* ================================================================ */}

      <section className="auditorium-facilities">
        <Container>
          <div className="auditorium-section-heading text-center">
            <span className="auditorium-section-tag">FACILITIES</span>

            <h2>
              Everything You
              <span>Need for an Event</span>
            </h2>
          </div>

          <Row className="g-4">
            {data.facilities.map((facility, index) => {
              const Icon = getIcon(facility.icon, FaCheckCircle);

              return (
                <Col lg={4} md={6} key={`facility-${index}`}>
                  <div className="auditorium-facility-card">
                    <div className="auditorium-facility-icon">
                      <Icon />
                    </div>

                    <div>
                      <h4>{facility.title}</h4>

                      <p>{facility.description}</p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* USES */}
      {/* ================================================================ */}

      <section className="auditorium-uses">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <div className="auditorium-section-heading">
                <span className="auditorium-section-tag">
                  MULTI-PURPOSE VENUE
                </span>

                <h2>
                  Ideal for
                  <span>Every Occasion</span>
                </h2>

                <p>
                  The auditorium provides a versatile environment for a wide
                  range of academic, cultural and institutional programmes.
                </p>
              </div>
            </Col>

            <Col lg={7}>
              <div className="auditorium-uses-grid">
                {data.uses.map((use, index) => (
                  <div className="auditorium-use-item" key={`use-${index}`}>
                    <FaCheckCircle />

                    <span>{use}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* GALLERY */}
      {/* ================================================================ */}

      {data.gallery.length > 0 && (
        <section className="auditorium-gallery">
          <Container>
            <div className="auditorium-section-heading text-center">
              <span className="auditorium-section-tag">GALLERY</span>

              <h2>
                Explore Our
                <span>Auditorium</span>
              </h2>
            </div>

            <div className="auditorium-gallery-grid">
              {data.gallery.map((image, index) => (
                <div
                  className="auditorium-gallery-item"
                  key={`gallery-${index}`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Auditorium ${index + 1}`}
                  />

                  <div className="auditorium-gallery-overlay">
                    <span>View</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ================================================================ */}
      {/* RULES */}
      {/* ================================================================ */}

      <section className="auditorium-rules">
        <Container>
          <Row className="g-5">
            <Col lg={5}>
              <div className="auditorium-section-heading">
                <span className="auditorium-section-tag">GUIDELINES</span>

                <h2>
                  Auditorium
                  <span>Rules</span>
                </h2>

                <p>
                  Please follow the guidelines to ensure a safe, comfortable and
                  well-maintained environment for everyone.
                </p>
              </div>
            </Col>

            <Col lg={7}>
              <div className="auditorium-rules-list">
                {data.rules.map((rule, index) => (
                  <div className="auditorium-rule-item" key={`rule-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>

                    <p>{rule}</p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* FAQ */}
      {/* ================================================================ */}

      {data.faqs.length > 0 && (
        <section className="auditorium-faq">
          <Container>
            <div className="auditorium-section-heading text-center">
              <span className="auditorium-section-tag">FAQ</span>

              <h2>
                Frequently Asked
                <span>Questions</span>
              </h2>
            </div>

            <Row className="justify-content-center">
              <Col lg={9}>
                <Accordion flush>
                  {data.faqs.map((faq, index) => (
                    <Accordion.Item
                      eventKey={String(index)}
                      key={`faq-${index}`}
                    >
                      <Accordion.Header>{faq.question}</Accordion.Header>

                      <Accordion.Body>{faq.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* ================================================================ */}
      {/* CTA */}
      {/* ================================================================ */}

      <section className="auditorium-cta">
        <Container>
          <div className="auditorium-cta-inner">
            <div>
              <span className="auditorium-cta-label">LIFE @ IMSEC</span>

              <h2 style={{ color: "white" }}>
                {data.cta?.title || "A Venue for Every Occasion"}
              </h2>

              <p style={{ color: "white" }}>{data.cta?.description || ""}</p>
            </div>

            <div className="auditorium-cta-icon">
              <FaArrowRight />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Auditorium;
