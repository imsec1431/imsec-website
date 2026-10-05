import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";

import HomepagePopup from "../components/HomepagePopup/HomepagePopup";

import { getUniversityRankHolders } from "../services/universityRankHolderService";
import { getAlumni } from "../services/alumniService";
import a1 from "./images/a1.jpg";
import a2 from "./images/a2.jpg";
import a3 from "./images/a3.jpg";
import a4 from "./images/a4.jpg";
import a5 from "./images/a5.jpg";
import a6 from "./images/a6.jpg";
import a7 from "./images/a7.jpg";
import a8 from "./images/a8.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getSlides } from "../admin/services/heroSliderService";
import { getCampusHighlights } from "../services/campusHighlightService";
import { getAchievements } from "../services/achievementService";

import { getPlacementStats } from "../services/placementStatService";
import { getPlacements } from "../services/placementService";
import sports from "./images/imsecsports.jpg";
import Hostel from "./images/Hostel.jpg";
import studenclubs from "./images/studentsclubs.png";
import ModernLibrary from "./images/ModernLibrary.jpg";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Badge,
  Nav,
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
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaDatabase,
  FaComputer,
} from "react-icons/fa6";

import "./home.css";
import Library from "./Library/Library";

// ==========================================
// STATIC DATA CONFIGURATIONS (CMS-Ready Arrays)
// ==========================================

// Static data for Testimonials

const campusLife = [
  {
    id: 1,
    title: "Modern Library",
    image: ModernLibrary,
  },
  {
    id: 2,
    title: "Sports Arena",
    image: sports,
  },
  {
    id: 3,
    title: "Cultural Fest",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80",
  },
  {
    id: 4,
    title: "Innovation Labs",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80",
  },
  {
    id: 5,
    title: "Student Clubs",
    image: studenclubs,
  },
  {
    id: 6,
    title: "Hostel Life",
    image: Hostel,
  },
];

const INDUSTRY_PARTNERS = [
  {
    id: 1,
    name: "AWS Academy",
    logo: a1,
  },
  {
    id: 2,
    name: "Cisco Networking",
    logo: a2,
  },
  {
    id: 3,
    name: "Oracle Academy",
    logo: a3,
  },
  {
    id: 4,
    name: "IBM SkillsBuild",
    logo: a4,
  },
  {
    id: 5,
    name: "Microsoft",
    logo: a5,
  },
  {
    id: 6,
    name: "IMSEC",
    logo: a6,
  },
  {
    id: 7,
    name: "IMSEC",
    logo: a7,
  },
  {
    id: 8,
    name: "IMSEC",
    logo: a8,
  },
];

// ==========================================
// MAIN HOMEPAGE COMPONENT
// ==========================================

const Home = () => {
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const [welcomeData, setWelcomeData] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ug");
  const [heroSlides, setHeroSlides] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [campusHighlights, setCampusHighlights] = useState([]);
  const [placementStats, setPlacementStats] = useState([]);
  const [placements, setPlacements] = useState([]);

  const placementLabels = {
    "highest-package": "Highest Package Offered",
    "average-ctc": "Average CTC",
    recruiters: "Corporate Recruiter Visits",
    placements: "Total Selective Placements",
  };

  const getPillarIcon = (icon) => {
    switch (icon) {
      case "GraduationCap":
        return <FaGraduationCap />;

      case "Briefcase":
        return <FaBriefcase />;

      case "Building":
        return <FaBuilding />;

      case "Microscope":
        return <FaMicroscope />;

      default:
        return <FaGraduationCap />;
    }
  };

  const fetchApprovals = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_BASE_URL}/api/approvals`);

      const data = (res.data.data || [])
        .filter((item) => item.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      setApprovals(data);
    } catch (error) {
      console.error("Error fetching approvals:", error);
      setApprovals([]);
    }
  };

  const fetchAcademicMatrix = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_BASE_URL}/api/academic-matrix`);

      const data = (res.data?.data || [])
        .filter((item) => item.isPublished)
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "ug" ? -1 : 1;
          }

          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });

      setAcademicPrograms(data);
    } catch (error) {
      console.error("Error fetching Academic Matrix:", error);
      setAcademicPrograms([]);
    }
  };

  const fetchWelcomeData = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_BASE_URL}/api/welcome-to-imsec`);

      const data = (res.data?.data || [])
        .filter((item) => item.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      setWelcomeData(data);
    } catch (error) {
      console.error("Error fetching Welcome to IMSEC:", error);
      setWelcomeData([]);
    }
  };

  const fetchPlacementStats = async () => {
    try {
      const res = await getPlacementStats();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setPlacementStats(data);
    } catch (error) {
      console.error("Error fetching placement stats:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const res = await getAchievements();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const [sortedRankers, setSortedRankers] = useState([]);

  const fetchRankHolders = async () => {
    try {
      const res = await getUniversityRankHolders();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setSortedRankers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlumni = async () => {
    try {
      const res = await getAlumni();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setAlumni(data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  const fetchCampusHighlights = async () => {
    try {
      const res = await getCampusHighlights();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setCampusHighlights(data);
    } catch (err) {
      console.error("Error fetching campus highlights:", err);
    }
  };

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setLoading(true);

        const res = await getSlides();

        const slides = res.data.data
          .filter((slide) => slide.isActive)
          .sort((a, b) => a.order - b.order);

        setHeroSlides(slides);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    fetchRankHolders();
    fetchAlumni();
    fetchAchievements();
    fetchCampusHighlights();
    fetchPlacementStats();
    fetchPlacements();
    fetchApprovals();
    fetchWelcomeData();
    fetchAcademicMatrix();
  }, []);

  const getAcademicIcon = (icon) => {
    switch (icon) {
      case "Microchip":
        return <FaMicrochip />;

      case "Gear":
        return <FaGear />;

      case "Briefcase":
        return <FaBriefcase />;

      case "GraduationCap":
        return <FaGraduationCap />;

      case "Building":
        return <FaBuilding />;

      case "Computer":
        return <FaComputer />;

      case "Database":
        return <FaDatabase />;

      default:
        return <FaMicrochip />;
    }
  };

  const fetchPlacements = async () => {
    try {
      const res = await getPlacements();

      const data = res.data.data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      setPlacements(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HomepagePopup />

      {/* HERO SECTION */}
      {loading ? (
        <div
          style={{
            height: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Loading...</h2>
        </div>
      ) : (
        <Carousel controls indicators fade interval={5000} className="w-100">
          {heroSlides.map((slide, index) => (
            <Carousel.Item key={slide._id}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="hero-overlay"></div>

                <Container
                  className="h-100 d-flex align-items-center"
                  style={{ position: "relative", zIndex: 5 }}
                >
                  {/* <div className="text-white">
                    <h1 className="hero-title">{slide.title}</h1>
                  </div> */}
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* ACCREDITATIONS & CREDENTIALS MATRIX */}
      <Container>
        <div className="accreditation-bar p-4">
          <Row className="align-items-center text-center g-3">
            {approvals.map((approval) => (
              <Col key={approval._id} lg={3} md={6} xs={12}>
                <div className="fw-bold brand-dark fs-5 mb-0">
                  {approval.title}
                </div>

                <div className="text-muted small">{approval.description}</div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* ABOUT SECTION */}
      {/* ABOUT SECTION */}
      {welcomeData.map((welcome) => (
        <Container className="py-5 my-4" key={welcome._id}>
          <Row className="g-4 align-items-center">
            <Col lg={5} md={12}>
              <div className="about-img-container">
                <img
                  src={welcome.imageUrl}
                  alt="IMSEC Campus Ecosystem"
                  className="about-premium-img"
                  loading="lazy"
                />
              </div>
            </Col>

            <Col lg={7} md={12}>
              <div className="accent-heading-box mb-3">
                <h6
                  className="text-uppercase fw-bold tracking-widest brand-gold mb-1"
                  style={{
                    letterSpacing: "1.5px",
                    fontSize: "0.85rem",
                  }}
                >
                  {welcome.label}
                </h6>

                <h2
                  className="fw-extrabold brand-dark m-0"
                  style={{
                    fontWeight: 800,
                    fontSize: "2.1rem",
                  }}
                >
                  {welcome.title}
                </h2>
              </div>

              <p
                className="text-muted mb-4"
                style={{
                  lineHeight: "1.6",
                  fontSize: "0.98rem",
                }}
              >
                {welcome.description}
              </p>

              <Row className="g-3">
                {(welcome.pillars || []).map((pillar) => (
                  <Col key={pillar._id} sm={6} xs={12}>
                    <div className="micro-stat-badge">
                      <div className="micro-badge-icon">
                        {getPillarIcon(pillar.icon)}
                      </div>

                      <div>
                        <div className="fw-bold brand-dark small">
                          {pillar.title}
                        </div>

                        <div
                          className="text-muted"
                          style={{
                            fontSize: "0.78rem",
                            lineHeight: "1.3",
                          }}
                        >
                          {pillar.description}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      ))}

      {/* ACADEMIC MATRIX */}
      <div className="bg-light py-5 border-top border-bottom">
        <Container className="my-3">
          <Row className="align-items-end mb-5">
            <Col lg={7} md={12}>
              <h6
                className="text-uppercase fw-bold tracking-widest brand-gold mb-2"
                style={{ letterSpacing: "2px" }}
              >
                Academic Matrix
              </h6>

              <h2
                className="fw-extrabold brand-dark m-0"
                style={{ fontWeight: 800, fontSize: "2.3rem" }}
              >
                Explore Global Academic Programs
              </h2>
            </Col>

            <Col lg={5} md={12} className="text-lg-end mt-4 mt-lg-0">
              <Nav className="programs-tabs justify-content-lg-end justify-content-start border-0">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "ug"}
                    onClick={() => setActiveTab("ug")}
                  >
                    Undergraduate
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "pg"}
                    onClick={() => setActiveTab("pg")}
                  >
                    Postgraduate
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Row className="g-4">
            {academicPrograms
              .filter((p) => p.type === activeTab)
              .map((program) => (
                <Col key={program._id} lg={4} md={12}>
                  <Card className="program-premium-card p-4 h-100">
                    <Card.Body
                      className="p-0 d-flex flex-column justify-content-between position-relative addhover"
                      style={{
                        zIndex: 2,
                        border: "1px solid black",
                        borderRadius: "20px",
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), url("https://res.cloudinary.com/dgdlwai9p/image/upload/v1788431807/images_2_gfn7tj.jpg")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div style={{ padding: "10px" }}>
                        <div className="program-top-bar">
                          <div className="program-badge-box">
                            {getAcademicIcon(program.icon)}
                          </div>

                          <Badge
                            bg="dark"
                            className="text-white px-3 py-2 rounded-pill fw-bold"
                            style={{
                              fontSize: "0.8rem",
                              backgroundColor: "#0A2E5C",
                            }}
                          >
                            {program.code}
                          </Badge>
                        </div>

                        <h4
                          className="fw-bold brand-dark mb-2"
                          style={{
                            fontSize: "1.35rem",
                            color: "#080808",
                          }}
                        >
                          {program.name}
                        </h4>

                        <p
                          className="text-muted small mb-0"
                          style={{
                            lineHeight: "1.6",
                            fontWeight: "500",
                          }}
                        >
                          {program.description}
                        </p>
                      </div>

                      <div style={{ padding: "10px" }}>
                        <Button
                          as="a"
                          href={program.buttonLink || "#"}
                          variant="dark"
                          className="px-4 brand-dark fw-bold d-inline-flex align-items-center gap-2 mt-3 custom-btn"
                          style={{
                            fontSize: "1rem",
                            color: "#fff",
                            textDecoration: "none",
                          }}
                        >
                          {program.buttonText || "More Details"}
                        </Button>
                      </div>
                    </Card.Body>

                    <div className="program-floating-shape">
                      {getAcademicIcon(program.icon)}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>

      {/* GLOBAL INDUSTRY PARTNERS SECTION */}
      <div className="partner-section py-5">
        <Container>
          <div className="text-center mb-4">
            <h2
              className="fw-extrabold brand-dark m-0"
              style={{
                fontWeight: 800,
                fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
                lineHeight: "1.2",
                color: "white",
              }}
            >
              Major Recruiters & Industry Partners
            </h2>
          </div>

          <div className="partner-slider-wrapper">
            <div className="partner-slider">
              {[...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS].map(
                (partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="partner-logo-box"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      title={partner.name}
                      loading="lazy"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* PLACEMENT PERFORMANCE DASHBOARD */}
      <Container className="py-5 mt-4">
        <Row className="align-items-center mb-4">
          <Col md={8}>
            <h2
              className="fw-extrabold display-6 brand-dark"
              style={{ fontWeight: 800 }}
            >
              Placement Achievements
            </h2>
          </Col>
        </Row>

        <Row className="g-4">
          {placementStats.map((stat) => (
            <Col key={stat._id} lg={3} md={6} xs={12}>
              <Card className="placement-card text-white p-4">
                <Card.Body className="p-0">
                  <div
                    className="display-6 fw-bold mb-2"
                    style={{ color: "#FDB913" }}
                  >
                    {stat.figure}
                  </div>

                  <div className="small opacity-75" style={{ color: "black" }}>
                    <strong>{placementLabels[stat.type]}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ==============================
            PLACEMENT SWIPER - FIXED
            ============================== */}
        {placements.length > 0 && (
          <Swiper
            key={`placement-swiper-${placements.length}`}
            style={{
              paddingTop: "25px",
              width: "87%",
            }}
            modules={[Navigation, Pagination, Autoplay]}
            navigation={placements.length > 1}
            pagination={placements.length > 1 ? { clickable: true } : false}
            loop={placements.length > 4}
            spaceBetween={1}
            autoplay={
              placements.length > 1
                ? {
                    delay: 2500,
                    disableOnInteraction: false,
                  }
                : false
            }
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 10,
              },
              576: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 18,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {placements.map((student) => (
              <SwiperSlide key={student._id}>
                <div className="placement-card">
                  <img
                    src={student.image}
                    alt={student.studentName}
                    className="placement-img"
                  />

                  <div className="placement-body">
                    <h5 style={{ color: "black" }}>{student.studentName}</h5>

                    <p style={{ color: "black" }}>
                      <strong>{student.course}</strong>
                    </p>

                    <p style={{ color: "black" }}>
                      <strong>Batch : {student.batch}</strong>
                    </p>

                    <div className="company-box">💼 {student.company}</div>

                    <div className="package-box">{student.package} LPA</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>

      {/* UNIVERSITY RANK HOLDERS */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h6
            style={{
              color: "#FDB913",
              letterSpacing: "2px",
              fontWeight: "700",
            }}
          >
            ACADEMIC EXCELLENCE
          </h6>

          <h2
            style={{
              color: "#0A2E5C",
              fontWeight: "800",
              fontSize: "clamp(2rem,4vw,3rem)",
            }}
          >
            University Rank Holders
          </h2>

          <p className="text-muted">
            Celebrating students who secured top ranks in AKTU University.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {sortedRankers.map((student) => (
            <SwiperSlide key={student._id}>
              <div className="rank-card">
                <img
                  src={student.image}
                  alt={student.studentName}
                  className="rank-photo"
                />

                <div className="rank-badge">🏆 Rank #{student.rank}</div>

                <h5>{student.studentName}</h5>

                <div className="rank-course">{student.course}</div>

                <div className="rank-batch">Batch {student.batch}</div>

                <div className="rank-cgpa">CGPA {student.cgpa}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* CAMPUS HIGHLIGHTS */}
      <Container
        fluid="xl"
        className="py-5"
        style={{
          backgroundColor: "rgb(20, 46, 80)",
          marginTop: "20px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <div>
            <h2
              style={{
                color: "#FDB913",
                fontWeight: "800",
                fontSize: "clamp(2rem,4vw,3rem)",
              }}
            >
              Campus Highlights
            </h2>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {campusHighlights.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="highlight-card bg-white p-3 rounded">
                <img
                  src={item.image}
                  alt={item.title}
                  className="highlight-img w-100 rounded mb-3"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <div className="highlight-body">
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      background:
                        item.eventType === "News" ? "#0A2E5C" : "#FDB913",
                      color: item.eventType === "News" ? "#fff" : "#0A2E5C",
                      fontWeight: "600",
                    }}
                  >
                    {item.eventType}
                  </span>

                  <h5
                    className="mt-3"
                    style={{
                      color: "#0A2E5C",
                      fontWeight: "700",
                      minHeight: "60px",
                    }}
                  >
                    {item.title}
                  </h5>

                  <small className="d-block mb-3" style={{ color: "#888" }}>
                    <strong style={{ color: "black" }}>
                      📅{" "}
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </small>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "15px",
                      lineHeight: "1.7",
                    }}
                  >
                    {item.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    {item.readMore ? (
                      <a
                        href={item.readMore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary rounded-pill px-4"
                        style={{
                          background: "#0A2E5C",
                          border: "none",
                          textDecoration: "none",
                        }}
                      >
                        More →
                      </a>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-4"
                        style={{
                          background: "#0A2E5C",
                          border: "none",
                        }}
                        disabled
                      >
                        More →
                      </button>
                    )}

                    <div className="d-flex gap-2">
                      {item.facebook && (
                        <a
                          href={item.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon facebook"
                        >
                          <FaFacebookF />
                        </a>
                      )}

                      {item.instagram && (
                        <a
                          href={item.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}

                      {item.linkedin && (
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon linkedin"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* LIFE @ IMSEC */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={12} className="text-center">
            <h6
              style={{
                color: "#FDB913",
                fontWeight: "700",
                letterSpacing: "2px",
              }}
            >
              CAMPUS EXPERIENCE
            </h6>

            <h2
              style={{
                fontSize: "clamp(2rem,5vw,3rem)",
                fontWeight: "800",
                color: "#0A2E5C",
              }}
            >
              Life <span style={{ color: "#FDB913" }}>@ IMSEC</span>
            </h2>

            <p
              className="text-muted mt-3"
              style={{ maxWidth: "700px", margin: "auto" }}
            >
              Discover innovation, sports, culture and unforgettable student
              experiences.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {campusLife.map((item) => (
            <Col xl={4} lg={4} md={6} sm={6} xs={12} key={item.id}>
              <div className="life-card">
                <img src={item.image} alt={item.title} className="life-img" />

                <div className="life-overlay">
                  <h5>{item.title}</h5>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ACHIEVEMENTS & RECOGNITION */}
      <Container fluid="xl" className="py-5">
        <div className="text-center mb-5">
          <h6
            style={{
              color: "#FDB913",
              fontWeight: "700",
              letterSpacing: "2px",
            }}
          >
            OUR PRIDE
          </h6>

          <h2
            style={{
              color: "#0A2E5C",
              fontWeight: "800",
              fontSize: "clamp(2rem,4vw,3rem)",
            }}
          >
            Achievements &<span style={{ color: "#FDB913" }}> Recognition</span>
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "700px",
              margin: "15px auto",
            }}
          >
            Celebrating excellence through awards, rankings, accreditations,
            research and student success.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={25}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
        >
          {achievements.map((item) => (
            <SwiperSlide key={item._id}>
              <Card className="achievement-card">
                <Card.Img variant="top" src={item.image} alt={item.title} />

                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* TESTIMONIALS / ALUMNI SPOTLIGHT */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h6
            className="text-uppercase fw-bold"
            style={{
              color: "#FDB913",
              letterSpacing: "2px",
            }}
          >
            ALUMNI SPOTLIGHT
          </h6>

          <h2
            style={{
              fontWeight: "800",
              fontSize: "clamp(2rem,4vw,3rem)",
              color: "#0A2E5C",
            }}
          >
            Our Proud Alumni
          </h2>

          <p className="text-muted">
            Our alumni are the driving force behind innovation and excellence.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {alumni.map((student) => (
            <SwiperSlide key={student._id}>
              <div className="student-card text-center p-3">
                <img
                  src={student.image}
                  alt={student.name}
                  className="student-img rounded-circle mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                <div className="student-info">
                  <div className="student-name fw-bold">{student.name}</div>

                  <div className="student-course text-muted">
                    {student.course}
                  </div>

                  <div
                    className="student-badge mt-2"
                    style={{
                      background: "#0A2E5C",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "30px",
                      display: "inline-block",
                      fontWeight: "600",
                    }}
                  >
                    💼 Placed at {student.company}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </>
  );
};

export default Home;
