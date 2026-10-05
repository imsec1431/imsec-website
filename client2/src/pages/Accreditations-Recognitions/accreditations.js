import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaAward, FaMedal, FaDownload, FaCertificate } from "react-icons/fa6";

import "./Accreditations.css";

/* =====================================================
        Static Data
        Later From Admin Panel
===================================================== */

const accreditations = [
  {
    id: 1,
    title: "NAAC Accreditation",
    grade: "A Grade",
    year: "2025",
    image: "https://upload.wikimedia.org/wikipedia/en/2/22/NAAC_Logo.png",
    description:
      "Recognized for institutional excellence and quality education.",
  },

  {
    id: 2,
    title: "NBA Accreditation",
    grade: "Accredited",
    year: "2025",
    image: "https://www.nbaind.org/images/nba-logo.png",
    description: "Eligible engineering programmes accredited by NBA.",
  },

  {
    id: 3,
    title: "NIRF Ranking",
    grade: "Top Engineering Institute",
    year: "2025",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    description: "Recognized among India's leading engineering institutions.",
  },

  {
    id: 4,
    title: "Academic Excellence",
    grade: "Best Institution Award",
    year: "2024",
    image: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
    description: "Awarded for excellence in academics and innovation.",
  },
];

const awards = [
  "Academic Excellence",
  "Innovation Award",
  "Best Engineering Institute",
  "Industry Collaboration",
  "Research Excellence",
  "Green Campus",
];

const Accreditations = () => {
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="accreditation-hero">
        <Container>
          <div className="hero-content">
            <h1>Accreditations & Recognitions</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Coe
              <span>/</span>
              Accreditations
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="accreditation-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"
                alt="Accreditations"
                className="img-fluid accreditation-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag">QUALITY ASSURANCE</h6>

              <h2 className="section-title">
                Accreditations &<span> Recognitions</span>
              </h2>

              <p>
                IMS Engineering College is committed to maintaining the highest
                standards of academic excellence through national
                accreditations, quality certifications and institutional
                recognitions.
              </p>

              <p>
                These achievements reflect our dedication to continuous
                improvement, innovation, research, industry collaboration and
                student success.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Accreditation Cards ================= */}

      <section className="accreditation-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">OUR ACCREDITATIONS</h6>

            <h2 className="section-title">
              National
              <span> Recognition</span>
            </h2>
          </div>

          <Row className="g-4">
            {accreditations.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="accreditation-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="accreditation-logo"
                  />

                  <h4>{item.title}</h4>

                  <span>{item.grade}</span>

                  <small>{item.year}</small>

                  <p>{item.description}</p>

                  {/* <button className="btn btn-outline-primary rounded-pill">
                    View Details
                  </button> */}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Awards & Recognitions ================= */}

      <section className="awards-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">AWARDS & RECOGNITIONS</h6>

            <h2 className="section-title">
              Excellence &<span> Achievements</span>
            </h2>
          </div>

          <Row className="g-4">
            {awards.map((award, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="award-card">
                  <FaAward className="award-icon" />

                  <h4>{award}</h4>

                  <p>
                    Recognized for excellence in academics, innovation, research
                    and institutional development.
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Timeline ================= */}

      {/* <section className="timeline-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">TIMELINE</h6>

            <h2 className="section-title">
              Accreditation
              <span> Journey</span>
            </h2>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2021</div>

              <div className="timeline-content">
                Institutional Quality Enhancement Initiatives
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2022</div>

              <div className="timeline-content">
                Academic Infrastructure Expansion
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2023</div>

              <div className="timeline-content">
                Research & Innovation Recognition
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2024</div>

              <div className="timeline-content">
                Excellence Awards & Institutional Growth
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2025</div>

              <div className="timeline-content">
                Continued Accreditation & Quality Assurance
              </div>
            </div>
          </div>
        </Container>
      </section> */}

      {/* ================= Downloads ================= */}

      <section className="download-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">DOWNLOADS</h6>

            <h2 className="section-title">
              Accreditation
              <span> Certificates</span>
            </h2>
          </div>

          <Row className="g-4">
            {accreditations.map((item) => (
              <Col lg={6} key={item.id}>
                <div className="download-card">
                  <div className="download-left">
                    <FaCertificate className="certificate-icon" />

                    <div>
                      <h5>{item.title}</h5>

                      <span>Official Certificate (PDF)</span>
                    </div>
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
          <div className="text-center mb-5">
            <h6 className="section-tag">FAQ</h6>

            <h2 className="section-title">
              Frequently Asked
              <span> Questions</span>
            </h2>
          </div>

          <div className="faq-card">
            <h5>What is NAAC Accreditation?</h5>

            <p>
              NAAC evaluates higher education institutions on academic quality,
              governance, infrastructure, research and student support.
            </p>

            <hr />

            <h5>What is NBA Accreditation?</h5>

            <p>
              NBA accredits individual academic programmes based on
              outcome-based education and quality standards.
            </p>

            <hr />

            <h5>Why are accreditations important?</h5>

            <p>
              Accreditations ensure that an institution meets national quality
              standards and continuously improves academic excellence.
            </p>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="accreditation-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Learn More About Our Quality Standards</h2>

              <p>
                Explore our accreditations, recognitions and achievements that
                demonstrate our commitment to excellence in higher education.
              </p>
            </Col>

            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <button className="btn btn-warning rounded-pill px-4 me-3">
                Contact Us
              </button>

              <button className="btn btn-outline-light rounded-pill px-4">
                Apply Now
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Accreditations;
