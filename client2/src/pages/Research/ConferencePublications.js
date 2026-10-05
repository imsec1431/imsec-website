import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
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
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const tableElement = document.getElementById("conference-table-view");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/*================ Hero =================*/}
      <section className="conference-hero">
        <Container>
          <div className="hero-content">
            <h1>{content?.heroTitle || "Conference Publications"}</h1>
            <p style={{ color: "white" }}>
              Home <span>/</span> Research <span>/</span> Conference
              Publications
            </p>
          </div>
        </Container>
      </section>

      {/*================ About =================*/}
      <section className="conference-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={
                  content?.aboutImage ||
                  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80"
                }
                alt="Conference"
                className="img-fluid about-image"
              />
            </Col>
            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                {content?.sectionTag || "RESEARCH DISSEMINATION"}
              </h6>
              <h2 className="section-title">
                Conference <span> Publications</span>
              </h2>
              <p>{content?.aboutDescriptionOne}</p>
              <p>{content?.aboutDescriptionTwo}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Statistics =================*/}
      {content?.statistics && content.statistics.length > 0 && (
        <section className="conference-stats py-5">
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
      {/*================ Publication Timeline =================*/}
      {content?.timeline && content.timeline.length > 0 && (
        <section className="conference-timeline py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                YEAR WISE PUBLICATIONS
              </h6>
              <h2 className="section-title">
                Conference <span> Timeline</span>
              </h2>
            </div>

            <Row className="g-4">
              {content.timeline.map((item, index) => (
                <Col lg={3} md={6} key={index}>
                  <div className="timeline-card">
                    <FaBookOpen className="timeline-icon" />
                    <h3>{item.year}</h3>
                    <p>{item.count || item.papers}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/*================ Indexing Databases =================*/}
      {content?.indexingDatabases && content.indexingDatabases.length > 0 && (
        <section className="conference-database py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                INDEXING DATABASES
              </h6>
              <h2 className="section-title">
                Recognized <span> Databases</span>
              </h2>
            </div>

            <Row className="g-4">
              {content.indexingDatabases.map((db, index) => (
                <Col lg={4} md={6} key={index}>
                  <div className="category-card">
                    <FaDatabase className="category-icon" />
                    <h4>{db}</h4>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/*================ Search =================*/}
      <section className="search-section py-5" id="conference-table-view">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />
                <Form.Control
                  type="text"
                  placeholder="Search by Paper Title, Author, Indexing Database or Conference..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Conference Table =================*/}
      <section className="conference-table-section pb-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status" />
              <p className="mt-2 text-muted">Loading conference papers...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered hover className="conference-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Paper Title</th>
                      <th>Author(s)</th>
                      <th>Conference Name</th>
                      <th>Publication Year</th>
                      <th>ISBN / ISSN / DOI</th>
                      {/* <th>Publisher</th> */}
                      <th>Indexing Database</th>
                      <th>Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPapers.length > 0 ? (
                      currentPapers.map((item, index) => (
                        <tr key={item._id || item.id || index}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{item.paperTitle}</td>
                          <td>{item.authors}</td>
                          <td>{item.conferenceName}</td>
                          <td>{item.publicationYear}</td>
                          <td>
                            {item.identifier || item.isbn || item.doi || "-"}
                          </td>
                          {/* <td>{item.publisher || "-"}</td> */}
                          <td>
                            <span className="indexing-badge">
                              {item.indexingDatabase || "Non-Scopus"}
                            </span>
                          </td>
                          <td>
                            {item.paperLink && item.paperLink !== "#" ? (
                              <a
                                href={item.paperLink}
                                target="_blank"
                                rel="noreferrer"
                                className="view-paper"
                              >
                                View Paper{" "}
                                <FaExternalLinkAlt className="ms-2" />
                              </a>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No conference publications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/*================ Pagination (Only when items > 20) =================*/}
              {filteredConference.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
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
            </>
          )}
        </Container>
      </section>

      {/*================ Conference Categories =================*/}
      {content?.conferenceCategories &&
        content.conferenceCategories.length > 0 && (
          <section className="conference-category py-5">
            <Container>
              <div className="text-center mb-5">
                <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                  CONFERENCE CATEGORIES
                </h6>
                <h2 className="section-title">
                  Publication <span> Platforms</span>
                </h2>
              </div>

              <Row className="g-4">
                {content.conferenceCategories.map((item, index) => (
                  <Col lg={4} md={6} key={index}>
                    <div className="category-card">
                      <FaGlobe className="category-icon" />
                      <h4>{item}</h4>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}

      {/*================ CTA =================*/}
      <section className="conference-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>
                {content?.ctaTitle ||
                  "Present Research. Build Global Connections."}
              </h2>
              <p style={{ color: "white" }}>
                {content?.ctaDescription ||
                  "IMS Engineering College encourages researchers to present innovative ideas in prestigious national and international conferences, promoting collaboration, academic excellence, and global visibility."}
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ConferencePublications;
