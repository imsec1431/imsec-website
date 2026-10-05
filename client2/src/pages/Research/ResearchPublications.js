import React, { useEffect, useMemo, useState } from "react";

import { Container, Row, Col, Table, Form, Spinner } from "react-bootstrap";

import {
  FaSearch,
  FaBookOpen,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  getPublicResearchPublications,
  getPublicResearchPublicationContent,
} from "../../services/researchPublicationService";

import "./ResearchPublications.css";

const defaultContent = {
  heroTitle: "Research Publications",

  sectionTag: "RESEARCH EXCELLENCE",

  sectionTitle: "Research Publications",

  aboutImage:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",

  aboutDescriptionOne:
    "IMS Engineering College actively promotes quality research and encourages faculty members, research scholars and students to publish innovative research in reputed national and international journals.",

  aboutDescriptionTwo:
    "Our publications are indexed in Scopus, Web of Science, UGC CARE, Google Scholar and other recognized indexing databases, reflecting our commitment towards academic excellence and global research impact.",

  statistics: [],

  timeline: [],

  indexingDatabases: [],

  ctaTitle: "Publish with Impact. Inspire Through Research.",

  ctaDescription:
    "IMS Engineering College encourages faculty members, research scholars and students to publish quality research in internationally recognized journals and indexing databases.",
};

const ResearchPublications = () => {
  const [search, setSearch] = useState("");

  const [publications, setPublications] = useState([]);

  const [content, setContent] = useState(defaultContent);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadResearchPublications = async () => {
      try {
        setLoading(true);

        setError("");

        const [journalData, contentData] = await Promise.all([
          getPublicResearchPublications(),

          getPublicResearchPublicationContent(),
        ]);

        setPublications(journalData);

        setContent({
          ...defaultContent,
          ...contentData,
        });
      } catch (err) {
        console.error("Research Publications Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load research publications.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResearchPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return publications;
    }

    return publications.filter((item) =>
      [
        item.researchPaperTitle,
        item.authors,
        item.journal,
        item.department,
        item.indexingDatabase,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText)),
    );
  }, [publications, search]);

  const renderTitle = (title) => {
    const words = title.trim().split(" ");

    if (words.length <= 1) {
      return title;
    }

    const lastWord = words.pop();

    return (
      <>
        {words.join(" ")} <span>{lastWord}</span>
      </>
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{
            width: "40px",
            height: "40px",
            color: "#0a2e5c",
          }}
        />

        <p className="mt-3">Loading research publications...</p>
      </div>
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}

      <section className="publication-hero">
        <Container>
          <div className="hero-content">
            <h1>{content.heroTitle}</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Research
              <span>/</span>
              {content.heroTitle}
            </p>
          </div>
        </Container>
      </section>

      {/* ================= ERROR ================= */}

      {error && (
        <Container className="mt-4">
          <div className="alert alert-warning mb-0">{error}</div>
        </Container>
      )}

      {/* ================= ABOUT ================= */}

      <section className="publication-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={content.aboutImage || defaultContent.aboutImage}
                alt={content.heroTitle}
                className="img-fluid about-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                {content.sectionTag}
              </h6>

              <h2 className="section-title">
                {renderTitle(content.sectionTitle)}
              </h2>

              <p>{content.aboutDescriptionOne}</p>

              <p>{content.aboutDescriptionTwo}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= STATISTICS ================= */}

      {content.statistics?.length > 0 && (
        <section className="publication-stats py-5">
          <Container>
            <Row className="g-4">
              {content.statistics.map((item, index) => (
                <Col lg={3} md={6} key={index}>
                  <div className="stat-card">
                    <h2>{item.number}</h2>

                    <p>{item.title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* ================= TIMELINE ================= */}

      {content.timeline?.length > 0 && (
        <section className="timeline-section py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "black" }}>
                YEAR WISE PUBLICATIONS
              </h6>

              <h2 className="section-title">
                Publication <span>Timeline</span>
              </h2>
            </div>

            <Row className="g-4">
              {content.timeline.map((item, index) => (
                <Col lg={3} md={6} key={index}>
                  <div className="timeline-card">
                    <FaBookOpen className="timeline-icon" />

                    <h3>{item.year}</h3>

                    <p>{item.count}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ================= INDEXING DATABASES ================= */}

      {content.indexingDatabases?.length > 0 && (
        <section className="database-section py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "black" }}>
                INDEXING DATABASES
              </h6>

              <h2 className="section-title">
                Research Visibility <span>Worldwide</span>
              </h2>
            </div>

            <Row className="g-4">
              {content.indexingDatabases.map((database, index) => (
                <Col lg={4} md={6} key={index}>
                  <div className="database-card">
                    <FaGlobe className="database-icon" />

                    <h4>{database}</h4>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* ================= SEARCH ================= */}

      <section className="search-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />

                <Form.Control
                  type="text"
                  placeholder="Search by Title, Author or Journal..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= PUBLICATION TABLE ================= */}

      <section className="publication-table-section pb-5">
        <Container>
          <div className="table-responsive">
            <Table bordered hover className="publication-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Research Paper Title</th>
                  <th>Author(s)</th>
                  <th>Department</th>
                  <th>Journal</th>
                  <th>Publication Year</th>
                  <th>Indexing Database</th>
                  <th>ISSN / E-ISSN</th>
                  <th>Access</th>
                </tr>
              </thead>

              <tbody>
                {filteredPublications.length > 0 ? (
                  filteredPublications.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>{item.researchPaperTitle}</td>

                      <td>{item.authors}</td>

                      <td>{item.department}</td>

                      <td>{item.journal}</td>

                      <td>{item.publicationYear}</td>

                      <td>
                        <span className="indexing-badge">
                          {item.indexingDatabase}
                        </span>
                      </td>

                      <td>{item.issn || "—"}</td>

                      <td>
                        {item.paperLink ? (
                          <a
                            href={item.paperLink}
                            target="_blank"
                            rel="noreferrer"
                            className="view-paper"
                          >
                            View Paper
                            <FaExternalLinkAlt className="ms-2" />
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No research publications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="publication-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>{content.ctaTitle}</h2>

              <p style={{ color: "white" }}>{content.ctaDescription}</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ResearchPublications;
