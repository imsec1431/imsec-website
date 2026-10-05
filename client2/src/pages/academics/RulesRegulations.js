import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Accordion } from "react-bootstrap";
import {
  FaSearch,
  FaBook,
  FaDownload,
  FaExclamationCircle,
} from "react-icons/fa";

import { getRules } from "../../services/ruleService";
import "./RulesRegulations.css";

/* ===================================================
      Static Data
      Later Fetch from Admin Panel
=================================================== */

const categories = [
  "All",
  "Attendance Rules",
  "Examination",
  "Library",
  "Discipline",
  "Anti Ragging",
];

const RulesRegulations = () => {
  const [rulesData, setRulesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await getRules();

      if (res.data.success) {
        setRulesData(res.data.data.filter((rule) => rule.active));
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRules = rulesData.filter((item) => {
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = category === "All" || item.category === category;

    return searchMatch && categoryMatch;
  });

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

      <section className="rules-hero">
        <Container>
          <div className="hero-content">
            <h1>Rules & Regulations</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Academics
              <span>/</span>
              Rules & Regulations
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="rules-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                alt="Person using laptop on desk"
                className="img-fluid rules-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                STUDENT HANDBOOK
              </h6>

              <h2 className="section-title">
                Institute
                <span> Rules & Regulations</span>
              </h2>

              <p>
                The Rules & Regulations are designed to maintain discipline,
                academic excellence, professional ethics and a healthy learning
                environment for every student.
              </p>

              <p>
                Every student is expected to read and strictly follow the
                institute policies throughout the academic session.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Search ================= */}

      <section className="rules-search py-4">
        <Container>
          <Row className="g-4">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />

                <Form.Control
                  type="text"
                  placeholder="Search Rules..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>

            <Col lg={4}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Rules Accordion ================= */}

      <section className="rules-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              STUDENT GUIDELINES
            </h6>

            <h2 className="section-title">
              Rules &<span> Regulations</span>
            </h2>
          </div>

          <Accordion flush>
            {filteredRules.map((rule, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                key={rule._id}
                className="rule-item"
              >
                <Accordion.Header>
                  <div className="rule-header">
                    <FaBook className="me-3" />

                    <strong>{rule.title}</strong>

                    {rule.important && (
                      <span className="important-badge">
                        <FaExclamationCircle />
                        Important
                      </span>
                    )}
                  </div>
                </Accordion.Header>

                <Accordion.Body>
                  <span className="rule-category">{rule.category}</span>

                  <p className="mt-3">{rule.description}</p>

                  <a
                    href={rule.pdfLink}
                    className="btn btn-warning rounded-pill mt-3"
                  >
                    <FaDownload className="me-2" />
                    Download PDF
                  </a>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </section>

      {/* ================= Important Guidelines ================= */}

      <section className="guidelines-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              IMPORTANT
            </h6>

            <h2 className="section-title">
              General
              <span> Guidelines</span>
            </h2>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="guide-card">
                <FaBook className="guide-icon" />

                <h4>Academic Discipline</h4>

                <p>
                  Attend classes regularly and follow the academic schedule
                  prescribed by the institute.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="guide-card">
                <FaExclamationCircle className="guide-icon" />

                <h4>Code of Conduct</h4>

                <p>
                  Maintain discipline, respect faculty, staff and fellow
                  students at all times within the campus.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="guide-card">
                <FaDownload className="guide-icon" />

                <h4>Important Documents</h4>

                <p>
                  Keep your identity card, fee receipts and academic documents
                  safely for future reference.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= FAQ ================= */}

      <section className="faq-section py-5">
        <Container>
          <div className="faq-card">
            <h5>What is the minimum attendance required?</h5>

            <p>
              Students must maintain at least 75% attendance as per institute
              and university regulations.
            </p>

            <hr />

            <h5>Where can I download the Rule Book?</h5>

            <p>
              The latest Rule Book can be downloaded from the Download section
              available on this page.
            </p>

            <hr />

            <h5>What happens if institute rules are violated?</h5>

            <p>
              Any violation of institute rules may result in disciplinary action
              according to the applicable regulations.
            </p>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="rules-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>Need More Information?</h2>

              <p style={{ color: "white" }}>
                For clarification regarding institute rules and regulations,
                please contact the Academic Office.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default RulesRegulations;
