import React, { useState, useEffect } from "react";
import { Row, Col, Spinner, Alert, Pagination } from "react-bootstrap";
import {
  FaSearch,
  FaExternalLinkAlt,
  FaGlobe,
  FaBookOpen,
  FaDatabase,
} from "react-icons/fa";

import {
  getConferencePapers,
  getConferencePaperContent,
} from "../../services/conferencePaperService";

import "./ConferencePublications.css";

const defaultContent = {
  heroTitle: "Conference Publications",
  sectionTag: "RESEARCH DISSEMINATION",
  sectionTitle: "Conference Publications",
  aboutImage:
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  aboutDescriptionOne:
    "IMS Engineering College encourages faculty members, research scholars and students to present their research findings at prestigious national and international conferences.",
  aboutDescriptionTwo:
    "Conference publications provide opportunities for knowledge sharing, networking with researchers, industry collaboration and showcasing innovative research at globally recognized platforms.",
  statistics: [
    { number: "450+", title: "Conference Publications" },
    { number: "180+", title: "Scopus Indexed" },
    { number: "270+", title: "Non-Scopus" },
    { number: "95+", title: "International Conferences" },
  ],
  timeline: [
    { year: 2021, count: "60 Papers" },
    { year: 2022, count: "95 Papers" },
    { year: 2023, count: "120 Papers" },
    { year: 2024, count: "175 Papers" },
  ],
  conferenceCategories: [
    "IEEE Conferences",
    "Springer Conferences",
    "ACM Conferences",
    "Elsevier Conferences",
    "International Conferences",
    "National Conferences",
  ],
  indexingDatabases: [
    "Scopus",
    "Web of Science",
    "IEEE Xplore",
    "SpringerLink",
    "ACM Digital Library",
    "Google Scholar",
  ],
  ctaTitle: "Present Research. Build Global Connections.",
  ctaDescription:
    "IMS Engineering College encourages researchers to present innovative ideas in prestigious national and international conferences, promoting collaboration, academic excellence, and global visibility.",
};

const ConferencePublications = () => {
  const [search, setSearch] = useState("");
  const [conferencePapers, setConferencePapers] = useState([]);
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [papersRes, contentRes] = await Promise.allSettled([
          getConferencePapers(),
          getConferencePaperContent(),
        ]);

        if (papersRes.status === "fulfilled") {
          const papersData =
            papersRes.value?.data?.data || papersRes.value?.data || [];
          setConferencePapers(Array.isArray(papersData) ? papersData : []);
        }

        if (contentRes.status === "fulfilled") {
          const contentData =
            contentRes.value?.data?.data || contentRes.value?.data || {};
          setContent({
            ...defaultContent,
            ...contentData,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching conference publications data:", err);
        setError("Failed to load conference data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  // Reset to page 1 whenever the search term changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredConference = conferencePapers.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.paperTitle && item.paperTitle.toLowerCase().includes(term)) ||
      (item.authors && item.authors.toLowerCase().includes(term)) ||
      (item.conferenceName &&
        item.conferenceName.toLowerCase().includes(term)) ||
      (item.department && item.department.toLowerCase().includes(term)) ||
      (item.indexingDatabase &&
        item.indexingDatabase.toLowerCase().includes(term))
    );
  });

  // Calculate pagination indices
  const totalPages = Math.ceil(filteredConference.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPapers = filteredConference.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const tableElement = document.getElementById("conference-table-view");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="conference-publications-page">
        <div className="conference-publications-status">
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
            <p className="mt-3 text-muted">Loading conference papers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="conference-publications-page">
      {/* ================= Hero Banner ================= */}
      <section className="conference-publications-hero">
        <div className="conference-publications-hero-content">
          <h1>{content?.heroTitle || "Conference Publications"}</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="conference-publications-content">
        <div className="conference-publications-container">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {/* Introduction Box */}
          <div
            className="conference-publications-introduction"
            style={{ textAlign: "justify" }}
          >
            {content?.aboutDescriptionOne && (
              <p style={{ textAlign: "justify" }}>
                {content.aboutDescriptionOne}
              </p>
            )}
            {content?.aboutDescriptionTwo && (
              <p style={{ textAlign: "justify" }}>
                {content.aboutDescriptionTwo}
              </p>
            )}
          </div>

          {/* Statistics */}
          {content?.statistics && content.statistics.length > 0 && (
            <section className="conference-publications-section">
              <h2>Key Conference Metrics</h2>
              <Row className="g-3 mt-1">
                {content.statistics.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="conf-stat-card">
                      <h3>{item.number}</h3>
                      <p>{item.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Timeline */}
          {content?.timeline && content.timeline.length > 0 && (
            <section className="conference-publications-section">
              <h2>Conference Timeline</h2>
              <Row className="g-3 mt-1">
                {content.timeline.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="conf-timeline-card">
                      <div className="conf-timeline-icon">
                        <FaBookOpen />
                      </div>
                      <h4>{item.year}</h4>
                      <p>{item.count || item.papers}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Indexing Databases */}
          {content?.indexingDatabases && content.indexingDatabases.length > 0 && (
            <section className="conference-publications-section">
              <h2>Recognized Indexing Databases</h2>
              <Row className="g-3 mt-1">
                {content.indexingDatabases.map((db, index) => (
                  <Col lg={4} sm={6} key={index}>
                    <div className="conf-category-card">
                      <div className="conf-category-icon">
                        <FaDatabase />
                      </div>
                      <h5>{db}</h5>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Conference Categories */}
          {content?.conferenceCategories &&
            content.conferenceCategories.length > 0 && (
              <section className="conference-publications-section">
                <h2>Conference Publication Platforms</h2>
                <Row className="g-3 mt-1">
                  {content.conferenceCategories.map((item, index) => (
                    <Col lg={4} sm={6} key={index}>
                      <div className="conf-category-card">
                        <div className="conf-category-icon">
                          <FaGlobe />
                        </div>
                        <h5>{item}</h5>
                      </div>
                    </Col>
                  ))}
                </Row>
              </section>
            )}

          {/* Table Section */}
          <section
            className="conference-publications-section"
            id="conference-table-view"
          >
            <h2>Conference Papers Directory</h2>
            <p style={{ textAlign: "justify" }}>
              Search and access conference proceedings, papers presented by
              faculty members and students at national and international
              scientific conferences.
            </p>

            {/* Search Bar */}
            <div className="conf-search-wrapper mt-3">
              <Row>
                <Col lg={6} md={8}>
                  <div className="conf-search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by Paper Title, Author, Indexing Database or Conference..."
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div className="conf-table-container mt-3">
              <table className="conf-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      S.No.
                    </th>
                    <th>Paper Title</th>
                    <th>Author(s)</th>
                    <th>Conference Name</th>
                    <th className="text-center" style={{ width: "90px" }}>
                      Year
                    </th>
                    <th className="text-center" style={{ width: "130px" }}>
                      ISBN / ISSN / DOI
                    </th>
                    <th className="text-center" style={{ width: "130px" }}>
                      Indexing
                    </th>
                    <th className="text-center" style={{ width: "110px" }}>
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPapers.length > 0 ? (
                    currentPapers.map((item, index) => (
                      <tr key={item._id || item.id || index}>
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="conf-title-cell">{item.paperTitle}</td>
                        <td>{item.authors}</td>
                        <td>{item.conferenceName}</td>
                        <td className="text-center">{item.publicationYear}</td>
                        <td className="text-center">
                          {item.identifier || item.isbn || item.doi || "—"}
                        </td>
                        <td className="text-center">
                          <span className="conf-badge">
                            {item.indexingDatabase || "Non-Scopus"}
                          </span>
                        </td>
                        <td className="text-center">
                          {item.paperLink && item.paperLink !== "#" ? (
                            <a
                              href={item.paperLink}
                              target="_blank"
                              rel="noreferrer"
                              className="conf-view-link"
                            >
                              <span>View</span>
                              <FaExternalLinkAlt style={{ fontSize: "10px" }} />
                            </a>
                          ) : (
                            <span className="text-muted small">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No conference publications found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredConference.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2 conf-pagination-wrapper">
                <span className="text-muted small">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredConference.length)} of{" "}
                  {filteredConference.length} entries
                </span>

                <Pagination className="mb-0">
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, idx, array) => {
                      const previousPage = array[idx - 1];
                      return (
                        <React.Fragment key={page}>
                          {previousPage && page - previousPage > 1 && (
                            <Pagination.Ellipsis disabled />
                          )}
                          <Pagination.Item
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Pagination.Item>
                        </React.Fragment>
                      );
                    })}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </section>

          {/* CTA Banner */}
          {content?.ctaTitle && (
            <div className="conf-cta-banner">
              <h3>{content.ctaTitle}</h3>
              {content.ctaDescription && <p>{content.ctaDescription}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ConferencePublications;
