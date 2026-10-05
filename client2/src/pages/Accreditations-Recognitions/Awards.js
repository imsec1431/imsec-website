import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaAward, FaTrophy, FaMedal, FaDownload } from "react-icons/fa6";

import "./Awards.css";

/* =====================================================
            Static Data
            Later Comes From Admin Panel
===================================================== */

const awards = [
  {
    id: 1,
    title: "Best Engineering College Award",
    organization: "Times Education",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
    description:
      "Awarded for excellence in engineering education and innovation.",
  },

  {
    id: 2,
    title: "Innovation Excellence Award",
    organization: "AICTE",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    description: "Recognized for promoting innovation and entrepreneurship.",
  },

  {
    id: 3,
    title: "Outstanding Placement Award",
    organization: "Industry Association",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    description:
      "Honoured for exceptional placement achievements and industry collaboration.",
  },

  {
    id: 4,
    title: "Green Campus Award",
    organization: "Environment Council",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    description:
      "Awarded for sustainable development and eco-friendly campus initiatives.",
  },
];

const Awards = () => {
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="awards-hero">
        <Container>
          <div className="hero-content">
            <h1>Awards & Honors</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Coe
              <span>/</span>
              Awards
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="awards-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
                alt="Awards"
                className="img-fluid awards-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag">ACHIEVEMENTS</h6>

              <h2 className="section-title">
                Awards &<span> Honors</span>
              </h2>

              <p>
                IMS Engineering College has received numerous awards and
                recognitions for excellence in academics, innovation, research,
                placements and institutional development.
              </p>

              <p>
                These prestigious honors reflect our commitment towards quality
                education, industry collaboration, student success and
                continuous improvement.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Featured Awards ================= */}

      <section className="featured-awards py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">FEATURED AWARDS</h6>

            <h2 className="section-title">
              Our Proud
              <span> Achievements</span>
            </h2>
          </div>

          <Row className="g-4">
            {awards.map((award) => (
              <Col lg={6} key={award.id}>
                <div className="award-card">
                  <div className="award-image">
                    <img src={award.image} alt={award.title} />
                  </div>

                  <div className="award-content">
                    <span className="award-year">{award.year}</span>

                    <h3>{award.title}</h3>

                    <h5>{award.organization}</h5>

                    <p>{award.description}</p>

                    <button className="btn btn-warning rounded-pill">
                      View Details
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Award Statistics ================= */}

      <section className="award-stats py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">OUR ACHIEVEMENTS</h6>

            <h2 className="section-title">
              Awards in
              <span> Numbers</span>
            </h2>
          </div>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="stat-card">
                <FaTrophy className="stat-icon" />

                <h2>50+</h2>

                <p>Awards Received</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <FaAward className="stat-icon" />

                <h2>25+</h2>

                <p>National Awards</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <FaMedal className="stat-icon" />

                <h2>10+</h2>

                <p>International Recognition</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <FaAward className="stat-icon" />

                <h2>100%</h2>

                <p>Quality Commitment</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Timeline ================= */}

      {/* <section className="award-timeline py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">JOURNEY</h6>

            <h2 className="section-title">
              Award
              <span> Timeline</span>
            </h2>
          </div>

          <div className="timeline">
            {["2021", "2022", "2023", "2024", "2025"].map((year, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-year">{year}</div>

                <div className="timeline-content">
                  Excellence in academics, innovation, research, placements and
                  institutional achievements.
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section> */}

      {/* ================= Recognition ================= */}

      <section className="recognition-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">RECOGNITIONS</h6>

            <h2 className="section-title">
              National &<span> International</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "National Excellence Awards",
              "International Academic Recognition",
              "Research Excellence",
              "Innovation & Entrepreneurship",
              "Placement Excellence",
              "Green Campus Recognition",
            ].map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="recognition-card">
                  <FaAward className="recognition-icon" />

                  <h4>{item}</h4>

                  <p>
                    Recognition received for continuous contribution towards
                    academic excellence and institutional development.
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Download Certificates ================= */}

      <section className="certificate-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">DOWNLOADS</h6>

            <h2 className="section-title">
              Award
              <span> Certificates</span>
            </h2>
          </div>

          <Row className="g-4">
            {awards.map((award) => (
              <Col lg={6} key={award.id}>
                <div className="certificate-card">
                  <div>
                    <h5>{award.title}</h5>

                    <span>Official Certificate PDF</span>
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
            <h5>How are institutional awards received?</h5>

            <p>
              Awards are conferred by recognized organizations based on academic
              performance, innovation, research, infrastructure and student
              success.
            </p>

            <hr />

            <h5>Can students view award certificates?</h5>

            <p>
              Yes. Official certificates and recognition documents are available
              through the download section.
            </p>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="awards-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Excellence Recognized Across India</h2>

              <p>
                Join an institution known for academic excellence, innovation,
                placements and quality education.
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

export default Awards;
