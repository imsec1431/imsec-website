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

  return (
    <>
      {/*================ Hero =================*/}
      <section className="books-hero">
        <Container>
          <div className="hero-content">
            <h1>{content.heroTitle}</h1>
            <p style={{ color: "white" }}>
              Home <span>/</span> Research <span>/</span> {content.heroTitle}
            </p>
          </div>
        </Container>
      </section>

      {/*================ About =================*/}
      <section className="books-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={content.aboutImage || defaultContent.aboutImage}
                alt="Books"
                className="img-fluid about-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                {content.sectionTag}
              </h6>
              <h2 className="section-title">
                Books &<span> Book Chapters</span>
              </h2>
              <p>{content.aboutDescriptionOne}</p>
              <p>{content.aboutDescriptionTwo}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Statistics =================*/}
      {content.statistics && content.statistics.length > 0 && (
        <section className="books-stats py-5">
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
      {content.timeline && content.timeline.length > 0 && (
        <section className="books-timeline py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "black" }}>
                YEAR WISE PUBLICATIONS
              </h6>
              <h2 className="section-title">
                Publication <span> Timeline</span>
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

      {/*================ Publication Categories =================*/}
      {content.categories && content.categories.length > 0 && (
        <section className="books-category py-5">
          <Container>
            <div className="text-center mb-5">
              <h6 className="section-tag" style={{ color: "black" }}>
                PUBLICATION CATEGORIES
              </h6>
              <h2 className="section-title">
                Books <span> Collection</span>
              </h2>
            </div>

            <Row className="g-4">
              {content.categories.map((item, index) => (
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
      {/*================ Search =================*/}
      <section className="search-section py-5" id="books-table-view">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />
                <Form.Control
                  type="text"
                  placeholder="Search by Title, Author, Type or Publisher..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Books Table =================*/}
      <section className="books-table-section pb-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status" />
              <p className="mt-2 text-muted">Loading publications...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered hover className="books-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Publication Title</th>
                      <th>Author(s)</th>
                      <th>Publication Type</th>
                      <th>Publisher</th>
                      <th>Publication Year</th>
                      <th>ISBN</th>
                      <th>DOI</th>
                      <th>Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBooks.length > 0 ? (
                      currentBooks.map((item, index) => (
                        <tr key={item._id || item.id || index}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{item.title}</td>
                          <td>{item.authors}</td>
                          <td>
                            <span className="publication-type">
                              {item.type || "Book"}
                            </span>
                          </td>
                          <td>{item.publisher}</td>
                          <td>{item.publicationYear}</td>
                          <td>{item.isbn || "—"}</td>
                          <td>{item.doi || "—"}</td>
                          <td>
                            {item.bookLink && item.bookLink !== "#" ? (
                              <a
                                href={item.bookLink}
                                target="_blank"
                                rel="noreferrer"
                                className="view-book"
                              >
                                View Book
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
                          No publications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/*================ Pagination (Only if records > 20) =================*/}
              {filteredBooks.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
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
            </>
          )}
        </Container>
      </section>
      {/*================ CTA =================*/}
      <section className="books-cta py-5">
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

export default BooksBookChapters;
