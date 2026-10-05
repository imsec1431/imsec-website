import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFlask,
  FaBullseye,
  FaShieldAlt,
  FaBook,
  FaUniversity,
  FaBalanceScale,
  FaLightbulb,
  FaUsers,
  FaArrowRight,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { getResearchPolicies } from "../../services/researchPolicyService";
import "./ResearchPolicy.css";

/* ==========================================================
                    Static Data
========================================================== */

const objectives = [
  {
    id: 1,
    title: "Promote Quality Research",
    icon: <FaFlask />,
    description:
      "Encourage faculty members and students to undertake high-quality research and innovation.",
  },
  {
    id: 2,
    title: "Research Ethics",
    icon: <FaShieldAlt />,
    description:
      "Maintain academic integrity, originality and ethical standards in research activities.",
  },
  {
    id: 3,
    title: "Innovation",
    icon: <FaLightbulb />,
    description:
      "Support innovative ideas, patents, startups and technology development.",
  },
  {
    id: 4,
    title: "Industry Collaboration",
    icon: <FaUniversity />,
    description:
      "Strengthen partnerships with industries and research organizations.",
  },
];

const highlights = [
  {
    id: 1,
    title: "Faculty Research Support",
    icon: <FaBook />,
    description:
      "Support publication, consultancy, funded research and innovation.",
  },
  {
    id: 2,
    title: "Student Research",
    icon: <FaUsers />,
    description:
      "Promote UG and PG student research through projects and mentorship.",
  },
  {
    id: 3,
    title: "Seed Funding",
    icon: <FaBullseye />,
    description:
      "Provide institutional support for innovative research proposals.",
  },
  {
    id: 4,
    title: "Sponsored Projects",
    icon: <FaUniversity />,
    description:
      "Encourage externally funded projects from government and industries.",
  },
];

const ethics = [
  "Academic Integrity",
  "Original Research Work",
  "Plagiarism Prevention",
  "Responsible Data Management",
  "Publication Ethics",
  "Research Transparency",
];

const ResearchPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [policyError, setPolicyError] = useState("");
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoadingPolicies(true);
        setPolicyError("");

        const response = await getResearchPolicies();

        const data = response.data?.data || [];

        // Show only Active policies
        const activePolicies = data.filter(
          (policy) => policy.status === "Active",
        );

        setPolicies(activePolicies);
      } catch (error) {
        console.error("Research Policy Fetch Error:", error);

        setPolicyError("Unable to load policy documents at present.");
      } finally {
        setLoadingPolicies(false);
      }
    };

    fetchPolicies();
  }, []);
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="policy-hero">
        <Container>
          <div className="hero-content">
            <h1>Research Policy</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Research
              <span>/</span>
              Research Policy
            </p>
          </div>
        </Container>
      </section>

      {/* ================= About ================= */}

      <section className="policy-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={12}>
              <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                RESEARCH POLICY
              </h6>

              <h2 className="section-title">
                Building an
                <span> Innovation Ecosystem</span>
              </h2>

              <p>
                The Research Policy of IMS Engineering College aims to create a
                vibrant research culture by encouraging innovation,
                interdisciplinary collaboration, consultancy, publications,
                patents and socially relevant research.
              </p>

              <p>
                The policy provides guidelines for faculty, researchers and
                students to undertake ethical, impactful and sustainable
                research activities aligned with national and international
                priorities.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Objectives ================= */}

      <section className="objective-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "var(--primary)" }}>
              OBJECTIVES
            </h6>

            <h2 className="section-title">
              Research Policy
              <span> Objectives</span>
            </h2>
          </div>

          <Row className="g-4">
            {objectives.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="objective-card">
                  <div className="objective-icon">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Policy Highlights ================= */}

      <section className="highlight-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "var(--primary)" }}>
              POLICY HIGHLIGHTS
            </h6>

            <h2 className="section-title">
              Key
              <span> Features</span>
            </h2>
          </div>

          <Row className="g-4">
            {highlights.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="highlight-card">
                  <div className="highlight-icon">{item.icon}</div>

                  <h4 style={{ color: "var(--primary)" }}>{item.title}</h4>

                  <p style={{ color: "var(--primary)" }}>{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Research Ethics ================= */}

      <section className="ethics-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="ethics-image">
                <img
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80"
                  alt="Research Ethics"
                  className="img-fluid"
                />
              </div>
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                RESEARCH ETHICS
              </h6>

              <h2 className="section-title">
                Ethical
                <span> Research Practices</span>
              </h2>

              <ul className="ethics-list">
                {ethics.map((item, index) => (
                  <li key={index}>
                    <FaBalanceScale />

                    {item}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= IPR ================= */}

      <section className="ipr-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              IPR POLICY
            </h6>

            <h2 className="section-title">
              Intellectual Property
              <span> Rights</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Patent Filing",

              "Copyright",

              "Trademark",

              "Technology Transfer",

              "Commercialization",

              "Innovation Protection",
            ].map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="ipr-card">
                  <FaLightbulb className="ipr-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Roles ================= */}

      <section className="roles-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              Roles &<span> Responsibilities</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Director",
              "Dean R&D",
              "Research Cell",
              "Faculty Members",
              "Research Scholars",
              "Students",
            ].map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="role-card">
                  <FaUsers className="role-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Downloads ================= */}

      <section className="download-section py-5">
        <Container>
          <div className="table-responsive">
            <table className="table table-bordered download-table">
              {/* ================= Downloads ================= */}

              <section className="download-section py-5">
                <Container>
                  <div className="text-center mb-5">
                    <h6 className="section-tag" style={{ color: "black" }}>
                      DOWNLOADS
                    </h6>

                    <h2 className="section-title">
                      Policy
                      <span> Documents</span>
                    </h2>

                    <p className="mt-3">
                      Access the official research policies, guidelines and
                      institutional documents.
                    </p>
                  </div>

                  {/* ================= Loading ================= */}

                  {loadingPolicies && (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-warning"
                        role="status"
                      />

                      <p className="mt-3">Loading policy documents...</p>
                    </div>
                  )}

                  {/* ================= Error ================= */}

                  {!loadingPolicies && policyError && (
                    <div className="alert alert-warning text-center">
                      {policyError}
                    </div>
                  )}

                  {/* ================= Policy Table ================= */}

                  {!loadingPolicies && !policyError && policies.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-bordered download-table">
                        <thead>
                          <tr>
                            <th>S.N.</th>

                            <th>Document</th>

                            <th>Format</th>

                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {policies.map((policy, index) => (
                            <tr key={policy._id}>
                              <td>{index + 1}</td>

                              <td>
                                <div className="public-policy-document">
                                  <FaFilePdf />

                                  <strong>{policy.title}</strong>
                                </div>
                              </td>

                              <td>
                                <span className="policy-format">PDF</span>
                              </td>

                              <td>
                                <a
                                  href={policy.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-warning public-policy-btn"
                                >
                                  <FaFilePdf />
                                  View PDF
                                  <FaExternalLinkAlt />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ================= Empty ================= */}

                  {!loadingPolicies &&
                    !policyError &&
                    policies.length === 0 && (
                      <div className="text-center py-5">
                        <FaFilePdf
                          style={{
                            fontSize: "45px",
                            color: "#94a3b8",
                          }}
                        />

                        <h4 className="mt-3">No Policy Documents Available</h4>

                        <p>
                          Research policy documents will be published here when
                          available.
                        </p>
                      </div>
                    )}
                </Container>
              </section>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ResearchPolicy;
