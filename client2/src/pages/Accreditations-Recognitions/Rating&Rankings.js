import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaStar,
  FaAward,
  FaUsers,
  FaBuilding,
  FaDownload,
} from "react-icons/fa6";

import "./Rating&Rankings.css";

/* =====================================================
            Static Data
            Later Comes From Admin Panel
===================================================== */

const ratings = [
  {
    id: 1,
    title: "NAAC",
    rating: "A Grade",
    year: "2025",
    image: "https://upload.wikimedia.org/wikipedia/en/2/22/NAAC_Logo.png",
    description:
      "Recognized for academic excellence and institutional quality.",
  },

  {
    id: 2,
    title: "NBA",
    rating: "Accredited",
    year: "2025",
    image: "https://www.nbaind.org/images/nba-logo.png",
    description: "Engineering programmes accredited by NBA.",
  },

  {
    id: 3,
    title: "NIRF",
    rating: "Top Engineering Institute",
    year: "2025",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    description: "Recognized among India's leading engineering institutions.",
  },

  {
    id: 4,
    title: "Google Reviews",
    rating: "4.5 / 5",
    year: "2025",
    image: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
    description: "Highly rated by students, parents and visitors.",
  },

  {
    id: 5,
    title: "Shiksha",
    rating: "4.3 / 5",
    year: "2025",
    image: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    description: "Highly rated by students for academics and placements.",
  },

  {
    id: 6,
    title: "Careers360",
    rating: "AAAA",
    year: "2025",
    image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    description: "Recognized for quality education and infrastructure.",
  },
];

const Ratings = () => {
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="rating-hero">
        <Container>
          <div className="hero-content">
            <h1>Ratings & Rankings</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Coe
              <span>/</span>
              Ratings
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="rating-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"
                alt=""
                className="img-fluid rating-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag">QUALITY & EXCELLENCE</h6>

              <h2 className="section-title">
                Ratings &<span> Rankings</span>
              </h2>

              <p>
                IMS Engineering College has earned recognition from national
                accreditation agencies, ranking organizations and students for
                academic excellence, infrastructure, placements and innovation.
              </p>

              <p>
                These rankings reflect our continuous commitment towards quality
                education, research, industry collaboration and student success.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Rating Cards ================= */}

      <section className="rating-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">OUR RATINGS</h6>

            <h2 className="section-title">
              National &<span> Global Recognition</span>
            </h2>
          </div>

          <Row className="g-4">
            {ratings.map((item) => (
              <Col lg={4} md={6} key={item.id}>
                <div className="rating-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rating-logo"
                  />

                  <h4>{item.title}</h4>

                  <span>{item.rating}</span>

                  <small>{item.year}</small>

                  <p>{item.description}</p>

                  <button className="btn btn-outline-primary rounded-pill">
                    View Details
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Student Satisfaction ================= */}

      <section className="student-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">STUDENT SATISFACTION</h6>

            <h2 className="section-title">
              Students Love
              <span> IMSEC</span>
            </h2>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="score-card">
                <FaUsers className="score-icon" />

                <h2>95%</h2>

                <h5>Student Satisfaction</h5>

                <p>
                  Based on academic experience, campus life and faculty support.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="score-card">
                <FaBuilding className="score-icon" />

                <h2>92%</h2>

                <h5>Placement Support</h5>

                <p>
                  Students appreciate training, internships and placement
                  activities.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="score-card">
                <FaStar className="score-icon" />

                <h2>4.5/5</h2>

                <h5>Overall Rating</h5>

                <p>Excellent ratings received from students and recruiters.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Recruiter Feedback ================= */}

      <section className="recruiter-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h6 className="section-tag">RECRUITER FEEDBACK</h6>

              <h2 className="section-title">
                Trusted By
                <span> Recruiters</span>
              </h2>

              <p>
                Leading companies appreciate IMSEC graduates for their technical
                knowledge, communication skills, professionalism and industry
                readiness.
              </p>

              <ul className="rating-list">
                <li>✔ Strong Technical Skills</li>

                <li>✔ Industry Ready Graduates</li>

                <li>✔ Excellent Communication</li>

                <li>✔ Teamwork & Leadership</li>

                <li>✔ Problem Solving Ability</li>
              </ul>
            </Col>

            <Col lg={6}>
              <div className="recruiter-box">
                <FaAward className="award-large" />

                <h2>95%</h2>

                <h4>Recruiters Recommend IMSEC</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Timeline ================= */}

      {/* <section className="timeline-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">JOURNEY</h6>

            <h2 className="section-title">
              Year-wise
              <span> Rankings</span>
            </h2>
          </div>

          <div className="timeline">
            {["2021", "2022", "2023", "2024", "2025"].map((year, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-year">{year}</div>

                <div className="timeline-content">
                  Continuous improvement in academic quality, rankings and
                  institutional excellence.
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section> */}

      {/* ================= Downloads ================= */}

      <section className="download-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">DOWNLOADS</h6>

            <h2 className="section-title">
              Reports &<span> Rankings</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "NIRF Report",
              "NAAC Report",
              "NBA Report",
              "Ranking Brochure",
            ].map((item, index) => (
              <Col lg={6} key={index}>
                <div className="download-card">
                  <div>
                    <h5>{item}</h5>

                    <span>Official PDF</span>
                  </div>

                  <button className="btn btn-warning rounded-pill">
                    <FaDownload className="me-2" />
                    Download
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= FAQ ================= */}

      <section className="faq-section py-5">
        <Container>
          <div className="faq-card">
            <h5>How are ratings calculated?</h5>

            <p>
              Ratings are based on academic quality, infrastructure, placements,
              research, student feedback and national ranking frameworks.
            </p>

            <hr />

            <h5>Which organizations recognize IMSEC?</h5>

            <p>
              Various accreditation agencies, ranking bodies and educational
              platforms recognize IMSEC.
            </p>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="rating-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Join One of the Leading Engineering Colleges</h2>

              <p>
                Experience excellence in academics, placements, innovation and
                research.
              </p>
            </Col>

            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <button className="btn btn-warning rounded-pill px-4 me-3">
                Apply Now
              </button>

              <button className="btn btn-outline-light rounded-pill px-4">
                Contact Us
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Ratings;
