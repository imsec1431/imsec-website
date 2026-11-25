import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
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

        setPublications(journalData || []);
        setContent({
          ...defaultContent,
          ...contentData,
        });
      } catch (err) {
        console.error("Research Publications Error:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load research publications at present."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResearchPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) return publications;

    return publications.filter((item) =>
      [
        item.researchPaperTitle,
        item.authors,
        item.journal,
        item.department,
        item.indexingDatabase,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText))
    );
  }, [publications, search]);

  if (loading) {
    return (
      <div className="research-publications-page">
        <div className="research-publications-status">
          <div className="text-center">
            <Spinner
              animation="border"
              role="status"
              style={{
                width: "42px",
                height: "42px",
                color: "#002147",
              }}
            />
            <p className="mt-3 text-muted">Loading research publications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="research-publications-page">
      {/* ================= Hero Banner ================= */}
      <section className="research-publications-hero">
        <div className="research-publications-hero-content">
          <h1>{content.heroTitle || "Research Publications"}</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="research-publications-content">
        <div className="research-publications-container">
          {error && <div className="alert alert-warning mb-4">{error}</div>}

          {/* Introduction Box */}
          <div
            className="research-publications-introduction"
            style={{ textAlign: "justify" }}
          >
            {content.aboutDescriptionOne && (
              <p style={{ textAlign: "justify" }}>
                {content.aboutDescriptionOne}
              </p>
            )}
            {content.aboutDescriptionTwo && (
              <p style={{ textAlign: "justify" }}>
                {content.aboutDescriptionTwo}
              </p>
            )}
          </div>

          {/* Statistics (if available) */}
          {content.statistics?.length > 0 && (
            <section className="research-publications-section">
              <h2>Key Publication Metrics</h2>
              <Row className="g-3 mt-1">
                {content.statistics.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="pub-stat-card">
                      <h3>{item.number}</h3>
                      <p>{item.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Timeline (if available) */}
          {content.timeline?.length > 0 && (
            <section className="research-publications-section">
              <h2>Publication Timeline</h2>
              <Row className="g-3 mt-1">
                {content.timeline.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="pub-timeline-card">
                      <div className="pub-timeline-icon">
                        <FaBookOpen />
                      </div>
                      <h4>{item.year}</h4>
                      <p>{item.count} Publications</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Indexing Databases (if available) */}
          {content.indexingDatabases?.length > 0 && (
            <section className="research-publications-section">
              <h2>Research Visibility &amp; Indexing</h2>
              <Row className="g-3 mt-1">
                {content.indexingDatabases.map((database, index) => (
                  <Col lg={4} sm={6} key={index}>
                    <div className="pub-database-card">
                      <div className="pub-database-icon">
                        <FaGlobe />
                      </div>
                      <h5>{database}</h5>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Publications Table Section */}
          <section className="research-publications-section">
            <h2>Research Publications Directory</h2>
            <p style={{ textAlign: "justify" }}>
              Explore peer-reviewed publications, conference papers, and
              scholarly journal articles authored by IMS Engineering College
              faculty and research scholars.
            </p>

            {/* Search Bar */}
            <div className="pub-search-wrapper mt-3">
              <Row>
                <Col lg={6} md={8}>
                  <div className="pub-search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by Title, Author, Department or Journal..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div className="pub-table-container mt-3">
              <table className="pub-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      S.No.
                    </th>
                    <th>Research Paper Title</th>
                    <th>Author(s)</th>
                    <th>Department</th>
                    <th>Journal</th>
                    <th className="text-center" style={{ width: "110px" }}>
                      Year
                    </th>
                    <th className="text-center" style={{ width: "130px" }}>
                      Indexing
                    </th>
                    <th className="text-center" style={{ width: "120px" }}>
                      ISSN
                    </th>
                    <th className="text-center" style={{ width: "120px" }}>
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPublications.length > 0 ? (
                    filteredPublications.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="pub-title-cell">
                          {item.researchPaperTitle}
                        </td>
                        <td>{item.authors}</td>
                        <td>{item.department}</td>
                        <td>{item.journal}</td>
                        <td className="text-center">{item.publicationYear}</td>
                        <td className="text-center">
                          {item.indexingDatabase ? (
                            <span className="pub-badge">
                              {item.indexingDatabase}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="text-center">{item.issn || "—"}</td>
                        <td className="text-center">
                          {item.paperLink ? (
                            <a
                              href={item.paperLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pub-view-link"
                            >
                              <span>View</span>
                              <FaExternalLinkAlt style={{ fontSize: "10px" }} />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-muted">
                        No research publications found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA Banner */}
          {content.ctaTitle && (
            <div className="pub-cta-banner">
              <h3>{content.ctaTitle}</h3>
              {content.ctaDescription && <p>{content.ctaDescription}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ResearchPublications;
