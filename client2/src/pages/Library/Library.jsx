import React, { useEffect, useState } from "react";

import { getLibraryStatistics } from "../../services/libraryStatisticPublicService";
import { getLibraryGallery } from "../../services/libraryGalleryPublicService";
import { getLibraryGuidelines } from "../../services/libraryGuidelinePublicService";
import { getLibraryTiming } from "../../services/libraryTimingPublicService";
import { getLibrarianProfile } from "../../services/librarianProfilePublicService";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Library.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const Library = () => {
  const [statistics, setStatistics] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [timings, setTimings] = useState(null);
  const [librarian, setLibrarian] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      const [statisticsRes, galleryRes, guidelineRes, timingRes, librarianRes] =
        await Promise.all([
          getLibraryStatistics(),
          getLibraryGallery(),
          getLibraryGuidelines(),
          getLibraryTiming(),
          getLibrarianProfile(),
        ]);

      setStatistics(statisticsRes.data.data.filter((item) => item.active));

      setGallery(galleryRes.data.data.filter((item) => item.active));

      setGuidelines(guidelineRes.data.data.filter((item) => item.active));

      if (timingRes.data.success) {
        setTimings(timingRes.data.data);
      }

      setLibrarian(librarianRes.data.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const LIBRARY_FEATURES = [
    {
      id: 1,
      title: "Extensive Collection",
      desc: "A rich collection of engineering, management, science and humanities books.",
      icon: "📚",
    },
    {
      id: 2,
      title: "Reference Section",
      desc: "Reference books, encyclopedias, handbooks and dictionaries for academic support.",
      icon: "📖",
    },
    {
      id: 3,
      title: "Reading Hall",
      desc: "A spacious and peaceful reading environment for students and faculty members.",
      icon: "🏛️",
    },
    {
      id: 4,
      title: "Journals & Magazines",
      desc: "National journals, magazines and newspapers for continuous learning.",
      icon: "📰",
    },
  ];

  const LIBRARY_FACILITIES = [
    {
      id: 1,
      icon: "📚",
      title: "Book Collection",
      desc: "Extensive collection of engineering, management and general books.",
    },
    {
      id: 2,
      icon: "📖",
      title: "Reference Section",
      desc: "Reference books, encyclopedias, dictionaries and handbooks.",
    },
    {
      id: 3,
      icon: "📰",
      title: "Journals & Magazines",
      desc: "National journals, magazines and newspapers for academic enrichment.",
    },
    {
      id: 4,
      icon: "🏛️",
      title: "Reading Hall",
      desc: "Comfortable and peaceful reading environment with spacious seating.",
    },
    {
      id: 5,
      icon: "🎓",
      title: "Book Bank",
      desc: "Book Bank facility available for eligible students.",
    },
    {
      id: 6,
      icon: "💻",
      title: "Internet Facility",
      desc: "Internet-enabled systems for academic learning and research.",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }
  return (
    <>
      {/* Hero Section */}
      <section
        className="library-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80')",
        }}
      >
        <div className="library-overlay">
          <Container>
            <Row className="align-items-center min-vh-100">
              <Col lg={7}>
                <span className="library-tag">IMS Engineering College</span>

                <h1 className="library-title">
                  Central <span>Library</span>
                </h1>

                <p className="library-subtitle" style={{ color: "white" }}>
                  The Central Library is the academic knowledge hub of IMS
                  Engineering College, providing students and faculty with
                  extensive collections of books, journals, reference materials,
                  newspapers and a peaceful learning environment.
                </p>

                <div className="mt-4">
                  <Button size="lg" className="library-btn">
                    Explore Library
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
      {/* ABOUT LIBRARY */}

      <section className="library-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80"
                alt="Library"
                className="img-fluid library-image"
              />
            </Col>

            <Col lg={7}>
              <span className="section-tag" style={{ color: "black" }}>
                ABOUT LIBRARY
              </span>

              <h2 className="section-title">A Knowledge Resource Centre</h2>

              <p className="section-text">
                The Central Library of IMS Engineering College serves as the
                academic knowledge centre of the institution. It provides
                students and faculty members with a wide range of textbooks,
                reference books, journals, magazines and newspapers to support
                teaching, learning and research.
              </p>

              <p className="section-text">
                Designed to provide a quiet and comfortable learning atmosphere,
                the library encourages self-study, innovation and lifelong
                learning.
              </p>

              <Row className="mt-4 g-3">
                {LIBRARY_FEATURES.map((item) => (
                  <Col md={6} key={item._id}>
                    <div className="library-feature">
                      <div className="feature-icon">{item.icon}</div>

                      <div>
                        <h5>{item.title}</h5>

                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= LIBRARY AT A GLANCE ================= */}

      <section className="library-stats-section py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag" style={{ color: "black" }}>
              LIBRARY AT A GLANCE
            </span>

            <h2 className="section-title">Knowledge in Numbers</h2>

            <p className="section-text mx-auto stats-text">
              Our library provides an extensive collection of academic resources
              to support teaching, learning and research.
            </p>
          </div>

          <Row className="g-4">
            {statistics.map((item) => (
              <Col lg={3} md={6} key={item._id}>
                <div className="library-stat-card">
                  {/* <div className="stat-icon">{item.icon}</div> */}

                  <h2>{item.value}</h2>

                  <p>{item.title}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= LIBRARY FACILITIES ================= */}

      <section className="library-facilities py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag" style={{ color: "black" }}>
              OUR FACILITIES
            </span>

            <h2 className="section-title">Library Facilities</h2>

            <p className="section-text mx-auto stats-text">
              The Central Library provides a comfortable learning environment
              with modern facilities that support academic excellence.
            </p>
          </div>

          <Row className="g-4">
            {LIBRARY_FACILITIES.map((item) => (
              <Col lg={4} md={6} key={item._id}>
                <div className="facility-card">
                  <div className="facility-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= LIBRARY GALLERY ================= */}

      <section className="library-gallery py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag" style={{ color: "black" }}>
              PHOTO GALLERY
            </span>

            <h2 className="section-title">Explore Our Library</h2>

            <p className="section-text mx-auto stats-text">
              Take a glimpse into the Central Library and its learning
              environment.
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            loop
            spaceBetween={20}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1 },

              576: { slidesPerView: 2 },

              992: { slidesPerView: 3 },

              1200: { slidesPerView: 4 },
            }}
          >
            {gallery.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="gallery-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="gallery-image"
                  />

                  <div className="gallery-overlay">
                    <h5>{item.title}</h5>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>
      {/* ================= LIBRARY RULES ================= */}

      <section className="library-rules py-5">
        <Container>
          <Row className="g-4">
            {/* Rules */}

            <Col lg={7}>
              <div className="rules-card">
                <span className="section-tag" style={{ color: "black" }}>
                  LIBRARY RULES
                </span>

                <h2 className="section-title mb-4">Library Guidelines</h2>

                {guidelines.map((item, index) => (
                  <div key={index} className="rule-item">
                    <div className="rule-check">✓</div>

                    <span>{item.guideline}</span>
                  </div>
                ))}
              </div>
            </Col>

            {/* Timings */}

            <Col lg={5}>
              <div className="timing-card">
                <span className="section-tag" style={{ color: "black" }}>
                  WORKING HOURS
                </span>

                <h2 className="section-title mb-4">Library Timings</h2>

                {timings && timings.active && (
                  <>
                    <div className="timing-row">
                      <span>Monday - Friday</span>
                      <strong>{timings.mondayFriday}</strong>
                    </div>

                    <div className="timing-row">
                      <span>Saturday</span>
                      <strong>{timings.saturday}</strong>
                    </div>

                    <div className="timing-row">
                      <span>Sunday</span>
                      <strong>{timings.sunday}</strong>
                    </div>

                    {timings.holidayNote && (
                      <div className="mt-3">
                        <small>{timings.holidayNote}</small>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= LIBRARIAN PROFILE ================= */}

      <section className="library-librarian py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-tag" style={{ color: "black" }}>
              LIBRARIAN PROFILE
            </span>

            <h2 className="section-title">
              Meet Our <span>Librarian</span>
            </h2>
          </div>

          {librarian && librarian.active && (
            <Row className="align-items-center g-5">
              <Col lg={4}>
                <img
                  src={librarian.image}
                  alt={librarian.name}
                  className="img-fluid rounded shadow"
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover",
                  }}
                />
              </Col>

              <Col lg={8}>
                <h3>{librarian.name}</h3>

                <h5 className="text-primary mb-4">{librarian.designation}</h5>

                <Row>
                  <Col md={6} className="mb-3">
                    <strong>Qualification</strong>
                    <p>{librarian.qualification}</p>
                  </Col>

                  <Col md={6} className="mb-3">
                    <strong>Experience</strong>
                    <p>{librarian.experience}</p>
                  </Col>

                  <Col md={6} className="mb-3">
                    <strong>Phone</strong>
                    <p>{librarian.phone}</p>
                  </Col>

                  <Col md={6} className="mb-3">
                    <strong>Email</strong>
                    <p>{librarian.email}</p>
                  </Col>
                </Row>

                <h5 className="mt-3">About</h5>

                <p style={{ textAlign: "justify" }}>{librarian.about}</p>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Library;
