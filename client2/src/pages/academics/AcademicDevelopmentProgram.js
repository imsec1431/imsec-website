import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaBookOpen,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { getAcademicDevelopmentPrograms } from "../../services/academicDevelopmentProgramPublicService";

import "./AcademicDevelopmentProgram.css";

/* =====================================================
        Static Data
        Later From Admin Panel
===================================================== */

const featuredProgram = {
  title: "National Academic Development Program 2026",
  duration: "5 Days",
  venue: "Seminar Hall, IMSEC",
  organizer: "Department of Computer Science & Engineering",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  description:
    "A comprehensive Academic Development Program focusing on Outcome Based Education (OBE), NEP 2020 implementation, AI in Teaching-Learning, Research Methodology, and Modern Pedagogical Practices.",
};

const AcademicDevelopmentProgram = () => {
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);
  const fetchPrograms = async () => {
    try {
      const res = await getAcademicDevelopmentPrograms();

      if (res.data.success) {
        setPrograms(res.data.data.filter((item) => item.active));
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPrograms();
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

      <section className="adp-hero">
        <Container>
          <div className="hero-content">
            <h1>Academic Development Programs</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Academics
              <span>/</span>
              Academic Development Programs
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="adp-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={featuredProgram.image}
                alt=""
                className="img-fluid adp-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                ACADEMIC EXCELLENCE
              </h6>

              <h2 className="section-title">
                Academic Development
                <span> Programs</span>
              </h2>

              <p>
                Academic Development Programs are designed to enhance teaching
                quality, research capability, innovation, leadership and
                professional skills among faculty members and academic
                professionals.
              </p>

              <p>
                These initiatives promote continuous learning, modern pedagogy,
                industry collaboration and excellence in higher education.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Programs ================= */}

      <section className="program-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">PROGRAMS</h6>

            <h2 className="section-title">
              Upcoming &<span> Completed Programs</span>
            </h2>
          </div>

          <Row className="g-4">
            {programs.map((item) => (
              <Col lg={3} md={6} key={item._id}>
                <div className="program-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid rounded mb-3"
                    style={{
                      height: "180px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <span
                    className={
                      item.status === "Upcoming" ? "upcoming" : "completed"
                    }
                  >
                    {item.status}
                  </span>

                  <h4>{item.title}</h4>

                  <p>
                    <FaCalendarAlt /> {new Date(item.date).toLocaleDateString()}
                  </p>

                  <p>
                    <FaBookOpen className="program-icon" />
                    <FaMapMarkerAlt /> {item.venue}
                    <FaBookOpen className="program-icon" />
                  </p>

                  {item.status === "Upcoming" ? (
                    <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                      {item.detailsLink && (
                        <a
                          href={item.detailsLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-primary rounded-pill"
                        >
                          View Details
                        </a>
                      )}

                      {item.registrationLink && (
                        <a
                          href={item.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-warning rounded-pill"
                        >
                          Register Now
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="program-social mt-3">
                      {item.facebookLink && (
                        <a
                          href={item.facebookLink}
                          target="_blank"
                          rel="noreferrer"
                          className="facebook"
                        >
                          <FaFacebookF />
                        </a>
                      )}

                      {item.instagramLink && (
                        <a
                          href={item.instagramLink}
                          target="_blank"
                          rel="noreferrer"
                          className="instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}

                      {item.linkedinLink && (
                        <a
                          href={item.linkedinLink}
                          target="_blank"
                          rel="noreferrer"
                          className="linkedin"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}

                      {/* {item.youtubeLink && (
                        <a
                          href={item.youtubeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="youtube"
                        >
                          <FaYoutube />
                        </a>
                      )} */}

                      {item.twitterLink && (
                        <a
                          href={item.twitterLink}
                          target="_blank"
                          rel="noreferrer"
                          className="twitter"
                        >
                          <FaXTwitter />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Objectives ================= */}

      <section className="objective-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">OBJECTIVES</h6>

            <h2 className="section-title">
              Program
              <span> Objectives</span>
            </h2>
          </div>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="objective-card">
                <FaChalkboardTeacher className="objective-icon" />

                <h4>Teaching Excellence</h4>

                <p>Enhance innovative teaching and learning methodologies.</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="objective-card">
                <FaBookOpen className="objective-icon" />

                <h4>Research</h4>

                <p>Encourage quality research, innovation and publications.</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="objective-card">
                <FaUsers className="objective-icon" />

                <h4>Leadership</h4>

                <p>
                  Develop academic leadership and professional competencies.
                </p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="objective-card">
                <FaCalendarAlt className="objective-icon" />

                <h4>Continuous Learning</h4>

                <p>Promote lifelong learning and faculty development.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="adp-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>
                Join Our Academic Development Programs
              </h2>

              <p style={{ color: "white" }}>
                Enhance your academic excellence, research capabilities and
                teaching skills through our development programs.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AcademicDevelopmentProgram;
