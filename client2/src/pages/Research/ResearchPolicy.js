import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  FaFlask,
  FaBullseye,
  FaShieldAlt,
  FaBook,
  FaUniversity,
  FaBalanceScale,
  FaLightbulb,
  FaUsers,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { getResearchPolicies } from "../../services/researchPolicyService";
import "./ResearchPolicy.css";

/* ==========================================================
   STATIC DATA
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
    title: "Innovation & Startups",
    icon: <FaLightbulb />,
    description:
      "Support innovative ideas, patents, startups and product technology development.",
  },
  {
    id: 4,
    title: "Industry Collaboration",
    icon: <FaUniversity />,
    description:
      "Strengthen partnerships with leading industries and research organizations.",
  },
];

const highlights = [
  {
    id: 1,
    title: "Faculty Research Support",
    icon: <FaBook />,
    description:
      "Support publication, consultancy, funded research and technological innovation.",
  },
  {
    id: 2,
    title: "Student Research",
    icon: <FaUsers />,
    description:
      "Promote UG and PG student research through capstone projects and faculty mentorship.",
  },
  {
    id: 3,
    title: "Seed Funding",
    icon: <FaBullseye />,
    description:
      "Provide institutional seed grant support for promising, innovative research proposals.",
  },
  {
    id: 4,
    title: "Sponsored Projects",
    icon: <FaUniversity />,
    description:
      "Encourage externally funded research projects from government agencies and industry.",
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

const iprAreas = [
  "Patent Filing",
  "Copyright Protection",
  "Trademark Registration",
  "Technology Transfer",
  "Commercialization",
  "Innovation Protection",
];

const roles = [
  "Director",
  "Dean R&D",
  "Research Cell",
  "Faculty Members",
  "Research Scholars",
  "Students",
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
          (policy) => policy.status === "Active"
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
    <main className="research-policy-page">
      {/* ================= Hero Banner ================= */}
      <section className="research-policy-hero">
        <div className="research-policy-hero-content">
          <h1>Research Policy</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="research-policy-content">
        <div className="research-policy-container">
          {/* Introduction Box */}
          <div
            className="research-policy-introduction"
            style={{ textAlign: "justify" }}
          >
            <p style={{ textAlign: "justify" }}>
              The Research Policy of IMS Engineering College aims to create a
              vibrant research culture by encouraging innovation,
              interdisciplinary collaboration, consultancy, publications,
              patents and socially relevant research.
            </p>
            <p style={{ textAlign: "justify" }}>
              The policy provides guidelines for faculty members, researchers
              and students to undertake ethical, impactful and sustainable
              research activities aligned with national priorities, statutory
              standards and global academic benchmarks.
            </p>
          </div>

          {/* Objectives */}
          <section className="research-policy-section">
            <h2>Research Policy Objectives</h2>
            <Row className="g-3 mt-1">
              {objectives.map((item) => (
                <Col lg={3} sm={6} key={item.id}>
                  <div className="policy-grid-card">
                    <div className="policy-card-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Highlights */}
          <section className="research-policy-section">
            <h2>Key Features &amp; Highlights</h2>
            <Row className="g-3 mt-1">
              {highlights.map((item) => (
                <Col lg={3} sm={6} key={item.id}>
                  <div className="policy-grid-card">
                    <div className="policy-card-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Ethical Research Practices */}
          <section className="research-policy-section">
            <h2>Ethical Research Practices</h2>
            <Row className="align-items-center g-4 mt-1">
              <Col lg={5}>
                <img
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80"
                  alt="Research Ethics"
                  className="policy-ethics-image"
                />
              </Col>
              <Col lg={7}>
                <p style={{ textAlign: "justify" }}>
                  IMSEC strictly adheres to international principles of research
                  integrity, ethical guidelines and intellectual honesty. Every
                  research publication, grant proposal and thesis produced by
                  scholars and faculty must comply with rigorous institutional
                  standards.
                </p>
                <div className="policy-ethics-list">
                  {ethics.map((item, index) => (
                    <div className="policy-ethics-item" key={index}>
                      <FaBalanceScale />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </section>

          {/* Intellectual Property Rights */}
          <section className="research-policy-section">
            <h2>Intellectual Property Rights (IPR)</h2>
            <Row className="g-3 mt-1">
              {iprAreas.map((item, index) => (
                <Col lg={4} sm={6} key={index}>
                  <div className="policy-grid-card text-center">
                    <div className="policy-card-icon">
                      <FaLightbulb />
                    </div>
                    <h5>{item}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Roles & Responsibilities */}
          <section className="research-policy-section">
            <h2>Roles &amp; Responsibilities</h2>
            <Row className="g-3 mt-1">
              {roles.map((item, index) => (
                <Col lg={4} sm={6} key={index}>
                  <div className="policy-grid-card text-center">
                    <div className="policy-card-icon">
                      <FaUsers />
                    </div>
                    <h5>{item}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Downloads / Policy Documents */}
          <section className="research-policy-section">
            <h2>Policy Documents &amp; Downloads</h2>
            <p style={{ textAlign: "justify" }}>
              Access the official research policies, guidelines, code of conduct
              and institutional framework documents.
            </p>

            {loadingPolicies && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Loading policy documents...</p>
              </div>
            )}

            {!loadingPolicies && policyError && (
              <div className="alert alert-warning">{policyError}</div>
            )}

            {!loadingPolicies && !policyError && policies.length > 0 && (
              <div className="policy-table-container mt-3">
                <table className="policy-table">
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: "70px" }}>
                        S.N.
                      </th>
                      <th>Document Title</th>
                      <th className="text-center" style={{ width: "120px" }}>
                        Format
                      </th>
                      <th className="text-center" style={{ width: "160px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy, index) => (
                      <tr key={policy._id}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="policy-doc-title">
                            <FaFilePdf />
                            <span>{policy.title}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="policy-badge">PDF</span>
                        </td>
                        <td className="text-center">
                          <a
                            href={policy.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="policy-pdf-btn"
                          >
                            <FaFilePdf />
                            <span>View PDF</span>
                            <FaExternalLinkAlt style={{ fontSize: "11px" }} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loadingPolicies && !policyError && policies.length === 0 && (
              <div className="text-center py-4">
                <FaFilePdf
                  style={{
                    fontSize: "40px",
                    color: "#94a3b8",
                    marginBottom: "12px",
                  }}
                />
                <h5 className="text-muted">No Policy Documents Available</h5>
                <p className="text-muted small">
                  Official research policy documents will be published here as
                  they become available.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default ResearchPolicy;
