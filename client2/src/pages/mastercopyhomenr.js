import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Badge,
} from "react-bootstrap";
import {
  FaGraduationCap,
  FaBriefcase,
  FaBuilding,
  FaMicroscope,
  FaArrowRight,
  FaGear,
  FaShieldHalved,
  FaMicrochip,
} from "react-icons/fa6";

// ==========================================
// STATIC DATA CONFIGURATIONS (CMS-Ready Arrays)
// ==========================================

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1920",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
];

const ACCREDITATIONS = [
  {
    id: 1,
    title: "NAAC A+ Rated",
    desc: "Institutional Excellence Recognition",
  },
  { id: 2, title: "NBA Accredited", desc: "Core Engineering Programs" },
  {
    id: 3,
    title: "NIRF Innovation Rank",
    desc: "Top Band Innovation Catalyst",
  },
  { id: 4, title: "QS I-GAUGE", desc: "Diamond Rating Framework" },
];
const ABOUT_PILLARS = [
  {
    id: 1,
    icon: <FaGraduationCap />,
    title: "Academic Excellence",
    desc: "Outcome-based curriculum mapped directly to futuristic industry trends.",
  },
  {
    id: 2,
    icon: <FaBriefcase />,
    title: "Elite Placements",
    desc: "Dedicated placement cell tracking multi-national opportunities globally.",
  },
  {
    id: 3,
    icon: <FaBuilding />,
    title: "Modern Ecosystem",
    desc: "State-of-the-art residential campus equipped with ultra-fast smart infrastructure.",
  },
  {
    id: 4,
    icon: <FaMicroscope />,
    title: "Research Driven",
    desc: "Incubating dynamic student startups and handling real-world global patents.",
  },
];
const PLACEMENT_STATS = [
  { id: 1, figure: "₹50.0 LPA", label: "Highest Package Offered" },
  { id: 2, figure: "₹6.2 LPA", label: "Average CTC (CSE/IT)" },
  { id: 3, figure: "320+", label: "Corporate Recruiter Visits" },
  { id: 4, figure: "94.6%", label: "Total Selective Placements" },
];

const INDUSTRIAL_CENTERS = [
  {
    id: 1,
    name: "Center of Excellence in Automation & Robotics",
    partner: "KUKA Alliance",
    icon: <FaGear />,
    desc: "Equipped with advanced multi-axis industrial arms for robotic arc welding and automation simulation systems.",
  },
  {
    id: 2,
    name: "Advanced Software Innovation Lab",
    partner: "Microsoft Innovation Hub",
    icon: <FaMicrochip />,
    desc: "Configured for next-generation enterprise development, secure cloud architectures, and machine learning models.",
  },
  {
    id: 3,
    name: "Virtual Instrumentation Competency Lab",
    partner: "NI LabVIEW System",
    icon: <FaShieldHalved />,
    desc: "Enabling high-end signal acquisition, real-time measurements, and embedded system design testing.",
  },
];

const RECRUITERS = [
  {
    id: 1,
    name: "TCS",
    logo: "https://placehold.co/150x80/0A2E5C/ffffff?text=TCS",
  },
  {
    id: 2,
    name: "Infosys",
    logo: "https://placehold.co/150x80/0A2E5C/ffffff?text=Infosys",
  },
  {
    id: 3,
    name: "Capgemini",
    logo: "https://placehold.co/150x80/0A2E5C/ffffff?text=Capgemini",
  },
  {
    id: 4,
    name: "Wipro",
    logo: "https://placehold.co/150x80/0A2E5C/ffffff?text=Wipro",
  },
  {
    id: 5,
    name: "Amazon",
    logo: "https://placehold.co/150x80/0A2E5C/ffffff?text=Amazon",
  },
];

// ==========================================
// MAIN HOMEPAGE COMPONENT
// ==========================================

const Home = () => {
  return (
    <>
      <style>{`
        .brand-dark { color: #0A2E5C; }
        .brand-gold { color: #FDB913; }
        
      /* Desktop View */
        .hero-slide {
  height: 85vh;
  min-height: 550px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* Mobile View */

@media (max-width: 768px) {
  .hero-slide {
    height: 35vh;          /* You can use 40vh or 45vh if you prefer */
    min-height: 220px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .accreditation-bar {
    margin-top: 20px;
  }
}
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(10, 46, 92, 0.9) 0%, rgba(17, 24, 39, 0.6) 100%);
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
        }

        /* Trust Accreditations Badges */
        .accreditation-bar {
          background: #FFFFFF;
          border-bottom: 4px solid #FDB913;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-radius: 12px;
          margin-top: -40px;
          position: relative;
          z-index: 10;
        }

        /* Placement Dashboard Blocks */
        .placement-card {
          background: #111827;
          border: 1px solid #1F2937;
          border-radius: 16px;
          transition: transform 0.3s ease;
        }
        .placement-card:hover {
          transform: translateY(-5px);
        }

        /* Industrial Excellence Infrastructure Cards */
        .industry-card {
          border: none;
          background: #F9FAFB;
          border-left: 5px solid #0A2E5C;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .industry-card:hover {
          background: #FFFFFF;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
          transform: translateX(5px);
        }
        .industry-icon-box {
          font-size: 2.2rem;
          color: #FDB913;
          background: #0A2E5C;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        /* Recruiter Loop Layout */
        .logo-track {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          padding: 20px 0;
        }
        .logo-card {
          min-width: 160px;
          filter: grayscale(1);
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .logo-card:hover {
          filter: grayscale(0);
          opacity: 1;
        }
            /* COMPACT & IMPACTFUL ABOUT SECTION STYLES */Nakul rana//////////////////////
        .about-img-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }
        .about-premium-img {
          width: 100%;
          height: auto;
          aspect-ratio: 4/3;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(10, 46, 92, 0.12);
        }
        .accent-heading-box {
          border-left: 5px solid #FDB913;
          padding-left: 15px;
        }
        .micro-stat-badge {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 100%;
          transition: all 0.2s ease;
        }
        .micro-stat-badge:hover {
          background: #FFFFFF;
          border-color: #0A2E5C;
          box-shadow: 0 8px 20px rgba(10, 46, 92, 0.05);
          transform: translateY(-2px);
        }
        .micro-badge-icon {
          color: #0A2E5C;
          font-size: 1.3rem;
          background: rgba(10, 46, 92, 0.05);
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        // @media (max-width: 768px) {
        //   .hero-title { font-size: 2.3rem; }
        //   .hero-slide { height: 70vh; }
        //   .accreditation-bar { margin-top: 20px; }
        // }
      `}</style>

      {/* HERO SECTION WITH 5 AUTO-ROTATING PHOTO SLIDES */}
      <Carousel
        controls={true}
        indicators={true}
        fade
        interval={5000}
        className="w-100"
      >
        {HERO_SLIDES.map((slide, index) => (
          <Carousel.Item key={slide.id}>
            <div
              className="hero-slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay mask only runs on the initial slide info panel */}
              {index === 0 && <div className="hero-overlay" />}

              {/* Context headers only inject structural tags over slide 1 */}
              {index === 0 && (
                <Container
                  className="h-100 d-flex align-items-center"
                  style={{ position: "relative", zIndex: 5 }}
                >
                  <div className="text-white max-w-xl px-3">
                    <h1 className="hero-title mb-3">{slide.title}</h1>
                    <p className="fs-5 opacity-90 mb-4">{slide.subtitle}</p>
                    <div className="d-flex gap-3 flex-wrap">
                      <Button
                        variant="warning"
                        className="px-4 py-2.5 fw-bold rounded-pill"
                        style={{
                          backgroundColor: "#FDB913",
                          color: "#0A2E5C",
                          border: "none",
                        }}
                      >
                        {slide.primaryCta}
                      </Button>
                      <Button
                        variant="outline-light"
                        className="px-4 py-2.5 fw-bold rounded-pill"
                      >
                        {slide.secondaryCta}
                      </Button>
                    </div>
                  </div>
                </Container>
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ACCREDITATIONS & CREDENTIALS MATRIX */}
      <Container>
        <div className="accreditation-bar p-4">
          <Row className="align-items-center text-center g-3">
            {ACCREDITATIONS.map((badge) => (
              <Col key={badge.id} lg={3} md={6} xs={12}>
                <div className="fw-bold brand-dark fs-5 mb-0">
                  {badge.title}
                </div>
                <div className="text-muted small">{badge.desc}</div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      {/* SLEEK & IMPACTFUL ABOUT IMSEC SECTION */}
      <Container className="py-5 my-4">
        <Row className="g-4 align-items-center">
          {/* Left Side: Clean Image Layout */}
          <Col lg={5} md={12}>
            <div className="about-img-container">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224b94?q=80&w=800"
                alt="IMSEC Campus Ecosystem"
                className="about-premium-img"
                loading="lazy"
              />
            </div>
          </Col>

          {/* Right Side: High Impact Text & Mini Badges */}
          <Col lg={7} md={12}>
            <div className="accent-heading-box mb-3">
              <h6
                className="text-uppercase fw-bold tracking-widest brand-gold mb-1"
                style={{ letterSpacing: "1.5px", fontSize: "0.85rem" }}
              >
                Welcome to IMSEC
              </h6>
              <h2
                className="fw-extrabold brand-dark m-0"
                style={{ fontWeight: 800, fontSize: "2.1rem" }}
              >
                Nurturing Innovations, Engineering Futures
              </h2>
            </div>

            <p
              className="text-muted mb-4"
              style={{ lineHeight: "1.6", fontSize: "0.98rem" }}
            >
              IMS Engineering College stands as a premier institution of
              technology learning in Northern India. We merge rigorous industry
              frameworks with forward-thinking research, preparing engineered
              minds to lead corporate tech landscapes.
            </p>

            {/* Low-Profile Micro Grid Block */}
            <Row className="g-3">
              {ABOUT_PILLARS.map((pillar) => (
                <Col key={pillar.id} sm={6} xs={12}>
                  <div className="micro-stat-badge">
                    <div className="micro-badge-icon">{pillar.icon}</div>
                    <div>
                      <div className="fw-bold brand-dark small">
                        {pillar.title}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.78rem", lineHeight: "1.3" }}
                      >
                        {pillar.desc}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="mt-4 pt-1">
              <Button
                className="px-4 py-2 fw-bold rounded-pill border-0 d-inline-flex align-items-center gap-2"
                style={{
                  backgroundColor: "#0A2E5C",
                  color: "#fff",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 12px rgba(10, 46, 92, 0.15)",
                }}
              >
                Explore Campus Identity <FaArrowRight size={12} />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* PLACEMENT PERFORMANCE DASHBOARD */}
      <Container className="py-5 mt-4">
        <Row className="align-items-center mb-4">
          <Col md={8}>
            <h6 className="text-uppercase fw-bold tracking-widest brand-gold mb-1">
              Corporate Relations
            </h6>
            <h2
              className="fw-extrabold display-6 brand-dark"
              style={{ fontWeight: 800 }}
            >
              Placement Achievements
            </h2>
          </Col>
          <Col md={4} className="text-md-end">
            <Button
              variant="outline-primary"
              className="rounded-pill fw-bold border-2"
            >
              View Detailed Records <FaArrowRight className="ms-1" />
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          {PLACEMENT_STATS.map((stat) => (
            <Col key={stat.id} lg={3} md={6} xs={12}>
              <Card className="placement-card text-white p-4">
                <Card.Body className="p-0">
                  <div
                    className="display-6 fw-bold mb-2"
                    style={{ color: "#FDB913" }}
                  >
                    {stat.figure}
                  </div>
                  <div className="small opacity-75">{stat.label}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* INDUSTRIAL CENTERS OF EXCELLENCE */}
      <div className="bg-white py-5 border-top border-bottom">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h6 className="text-uppercase fw-bold tracking-widest text-secondary mb-1">
              Infrastructure Hub
            </h6>
            <h2 className="fw-extrabold brand-dark" style={{ fontWeight: 800 }}>
              Industrial Centers of Excellence
            </h2>
            <p className="text-muted">
              Direct institutional training structures matching corporate
              engineering requirements.
            </p>
          </div>

          <Row className="g-4">
            {INDUSTRIAL_CENTERS.map((hub) => (
              <Col key={hub.id} lg={4} md={12}>
                <Card className="industry-card p-4 h-100">
                  <Card.Body className="p-0 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="industry-icon-box">{hub.icon}</div>
                        <Badge
                          bg="warning"
                          className="text-dark fw-bold px-3 py-2 rounded-pill"
                        >
                          {hub.partner}
                        </Badge>
                      </div>
                      <h5 className="fw-bold brand-dark mb-3">{hub.name}</h5>
                      <p className="text-muted small mb-4">{hub.desc}</p>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 brand-dark fw-bold text-decoration-none d-inline-flex align-items-center gap-2 mt-auto"
                    >
                      Explore Infrastructure Modules <FaArrowRight size={14} />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* CORPORATE RECRUITER MARQUEE TRACK */}
      <Container className="py-5 text-center">
        <h6 className="text-muted text-uppercase tracking-widest small mb-4">
          Trusted Across the Tech Market
        </h6>
        <div className="logo-track justify-content-center align-items-center">
          {RECRUITERS.map((logo) => (
            <div key={logo.id} className="logo-card">
              <img
                src={logo.logo}
                alt={logo.name}
                className="img-fluid rounded"
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default Home;
