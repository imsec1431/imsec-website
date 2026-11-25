import React, { useState, useEffect } from "react";
import { Row, Col, Spinner, Alert, Pagination } from "react-bootstrap";
import {
  FaSearch,
  FaBookOpen,
  FaExternalLinkAlt,
  FaGlobe,
} from "react-icons/fa";

import {
  getPublicBooks,
  getPublicBookContent,
} from "../../services/bookService";

import "./BooksBookChapters.css";

const defaultContent = {
  heroTitle: "Books & Book Chapters",
  sectionTag: "KNOWLEDGE CREATION",
  sectionTitle: "Books & Book Chapters",
  aboutImage:
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
  aboutDescriptionOne:
    "IMS Engineering College encourages faculty members and researchers to publish books, edited volumes, and book chapters through reputed national and international publishers.",
  aboutDescriptionTwo:
    "Books and book chapters reflect the academic expertise of our faculty and contribute to knowledge dissemination, innovation, and global research impact.",
  statistics: [
    { number: "120+", title: "Books Published" },
    { number: "280+", title: "Book Chapters" },
    { number: "45+", title: "International Publishers" },
    { number: "18+", title: "National Publishers" },
  ],
  timeline: [
    { year: 2021, count: "22 Publications" },
    { year: 2022, count: "35 Publications" },
    { year: 2023, count: "48 Publications" },
    { year: 2024, count: "61 Publications" },
  ],
  categories: [
    "Books",
    "Book Chapters",
    "Edited Books",
    "E-Books",
    "International Publications",
    "National Publications",
  ],
  ctaTitle: "Inspire Through Knowledge. Publish Your Research.",
  ctaDescription:
    "IMS Engineering College encourages researchers and academicians to publish books and book chapters with recognized global and national publishing houses.",
};

const BooksBookChapters = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state (20 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [booksData, contentData] = await Promise.all([
          getPublicBooks(),
          getPublicBookContent(),
        ]);

        setBooks(Array.isArray(booksData) ? booksData : []);
        setContent({
          ...defaultContent,
          ...contentData,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching Books & Book Chapters data:", err);
        setError("Failed to load publications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const filteredBooks = books.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.authors && item.authors.toLowerCase().includes(term)) ||
      (item.publisher && item.publisher.toLowerCase().includes(term)) ||
      (item.department && item.department.toLowerCase().includes(term)) ||
      (item.type && item.type.toLowerCase().includes(term))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const tableElement = document.getElementById("books-table-view");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="books-chapters-page">
        <div className="books-chapters-status">
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
            <p className="mt-3 text-muted">Loading publications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="books-chapters-page">
      {/* ================= Hero Banner ================= */}
      <section className="books-chapters-hero">
        <div className="books-chapters-hero-content">
          <h1>{content.heroTitle || "Books & Book Chapters"}</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="books-chapters-content">
        <div className="books-chapters-container">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {/* Introduction Box */}
          <div
            className="books-chapters-introduction"
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

          {/* Statistics */}
          {content.statistics && content.statistics.length > 0 && (
            <section className="books-chapters-section">
              <h2>Key Publication Statistics</h2>
              <Row className="g-3 mt-1">
                {content.statistics.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="book-stat-card">
                      <h3>{item.number}</h3>
                      <p>{item.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Publication Timeline */}
          {content.timeline && content.timeline.length > 0 && (
            <section className="books-chapters-section">
              <h2>Publication Timeline</h2>
              <Row className="g-3 mt-1">
                {content.timeline.map((item, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className="book-timeline-card">
                      <div className="book-timeline-icon">
                        <FaBookOpen />
                      </div>
                      <h4>{item.year}</h4>
                      <p>{item.count}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Publication Categories */}
          {content.categories && content.categories.length > 0 && (
            <section className="books-chapters-section">
              <h2>Books &amp; Publications Collection</h2>
              <Row className="g-3 mt-1">
                {content.categories.map((item, index) => (
                  <Col lg={4} sm={6} key={index}>
                    <div className="book-category-card">
                      <div className="book-category-icon">
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
            className="books-chapters-section"
            id="books-table-view"
          >
            <h2>Books &amp; Chapters Directory</h2>
            <p style={{ textAlign: "justify" }}>
              Explore authored and edited books, textbooks, reference materials,
              monographs, and specialized book chapters contributed by IMSEC
              faculty across multiple academic disciplines.
            </p>

            {/* Search Bar */}
            <div className="book-search-wrapper mt-3">
              <Row>
                <Col lg={6} md={8}>
                  <div className="book-search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by Title, Author, Type or Publisher..."
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div className="book-table-container mt-3">
              <table className="book-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      S.No.
                    </th>
                    <th>Publication Title</th>
                    <th>Author(s)</th>
                    <th className="text-center" style={{ width: "130px" }}>
                      Type
                    </th>
                    <th>Publisher</th>
                    <th className="text-center" style={{ width: "90px" }}>
                      Year
                    </th>
                    <th className="text-center" style={{ width: "130px" }}>
                      ISBN
                    </th>
                    <th className="text-center" style={{ width: "120px" }}>
                      DOI
                    </th>
                    <th className="text-center" style={{ width: "110px" }}>
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.length > 0 ? (
                    currentBooks.map((item, index) => (
                      <tr key={item._id || item.id || index}>
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="book-title-cell">{item.title}</td>
                        <td>{item.authors}</td>
                        <td className="text-center">
                          <span className="book-type-badge">
                            {item.type || "Book"}
                          </span>
                        </td>
                        <td>{item.publisher}</td>
                        <td className="text-center">{item.publicationYear}</td>
                        <td className="text-center">{item.isbn || "—"}</td>
                        <td className="text-center">{item.doi || "—"}</td>
                        <td className="text-center">
                          {item.bookLink && item.bookLink !== "#" ? (
                            <a
                              href={item.bookLink}
                              target="_blank"
                              rel="noreferrer"
                              className="book-view-link"
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
                      <td colSpan="9" className="text-center py-4 text-muted">
                        No publications found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredBooks.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2 book-pagination-wrapper">
                <span className="text-muted small">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredBooks.length)} of{" "}
                  {filteredBooks.length} entries
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
          {content.ctaTitle && (
            <div className="book-cta-banner">
              <h3>{content.ctaTitle}</h3>
              {content.ctaDescription && <p>{content.ctaDescription}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BooksBookChapters;
