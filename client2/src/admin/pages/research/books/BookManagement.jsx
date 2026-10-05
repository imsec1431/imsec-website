import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Badge,
  Nav,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaBook,
  FaSlidersH,
  FaSearch,
  FaEye,
  FaExternalLinkAlt,
  FaBarcode,
  FaBuilding,
  FaCalendarAlt,
  FaUserGraduate,
  FaLayerGroup,
  FaGlobe,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getBookContent,
  updateBookContent,
} from "../../../services/bookService";

const defaultBookForm = {
  title: "",
  authors: "",
  department: "",
  type: "Book",
  publisher: "",
  publicationYear: new Date().getFullYear(),
  isbn: "",
  doi: "",
  bookLink: "",
  status: "Active",
  displayOrder: 1,
};

const defaultContentForm = {
  heroTitle: "Books & Book Chapters",
  sectionTag: "KNOWLEDGE CREATION",
  sectionTitle: "Books & Book Chapters",
  aboutImage: "",
  aboutDescriptionOne: "",
  aboutDescriptionTwo: "",
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
  ctaDescription: "",
};

const BookManagement = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState(defaultContentForm);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Bootstrap Message/Alert Modal State
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: "",
    message: "",
    variant: "success", // "success" or "danger"
  });

  const showAlert = (title, message, variant = "success") => {
    setAlertModal({
      show: true,
      title,
      message,
      variant,
    });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, show: false }));
  };

  // Add / Edit Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultBookForm);

  // View Details Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);

  // Category Input State
  const [newCategory, setNewCategory] = useState("");

  /* =========================================
     FETCH DATA
  ========================================= */
  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, contentRes] = await Promise.allSettled([
        getBooks(),
        getBookContent(),
      ]);

      if (booksRes.status === "fulfilled") {
        setBooks(booksRes.value?.data?.data || []);
      }
      if (contentRes.status === "fulfilled") {
        setContent({
          ...defaultContentForm,
          ...(contentRes.value?.data?.data || {}),
        });
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to load publications data.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================
     MODAL CONTROLS
  ========================================= */
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultBookForm);
    setShowFormModal(true);
  };

  const handleOpenEdit = (book) => {
    setEditingId(book._id);
    setFormData({
      title: book.title || "",
      authors: book.authors || "",
      department: book.department || "",
      type: book.type || "Book",
      publisher: book.publisher || "",
      publicationYear: book.publicationYear || new Date().getFullYear(),
      isbn: book.isbn || "",
      doi: book.doi || "",
      bookLink: book.bookLink || "",
      status: book.status || "Active",
      displayOrder: book.displayOrder || 1,
    });
    setShowFormModal(true);
  };

  const handleOpenView = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  const handleOpenDelete = (book) => {
    setDeletingBook(book);
    setShowDeleteModal(true);
  };

  /* =========================================
     BOOK FORM SUBMIT
  ========================================= */
  const handleSubmitBook = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await updateBook(editingId, formData);
        showAlert("Success", "Publication updated successfully!", "success");
      } else {
        await addBook(formData);
        showAlert("Success", "Publication added successfully!", "success");
      }
      setShowFormModal(false);
      loadData();
    } catch (err) {
      showAlert(
        "Operation Failed",
        err.response?.data?.message || "Failed to save publication.",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE BOOK CONFIRM
  ========================================= */
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    try {
      setSaving(true);
      await deleteBook(deletingBook._id);
      setShowDeleteModal(false);
      setDeletingBook(null);
      showAlert(
        "Deleted",
        `"${deletingBook.title}" deleted successfully!`,
        "success",
      );
      loadData();
    } catch (err) {
      showAlert(
        "Delete Failed",
        "Failed to delete publication record.",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     STATISTICS HANDLERS
  ========================================= */
  const handleStatChange = (index, field, value) => {
    const updated = [...(content.statistics || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, statistics: updated });
  };

  const addStatistic = () => {
    setContent({
      ...content,
      statistics: [...(content.statistics || []), { number: "", title: "" }],
    });
  };

  const removeStatistic = (index) => {
    setContent({
      ...content,
      statistics: content.statistics.filter((_, idx) => idx !== index),
    });
  };

  /* =========================================
     TIMELINE HANDLERS
  ========================================= */
  const handleTimelineChange = (index, field, value) => {
    const updated = [...(content.timeline || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, timeline: updated });
  };

  const addTimeline = () => {
    setContent({
      ...content,
      timeline: [
        ...(content.timeline || []),
        { year: new Date().getFullYear(), count: "" },
      ],
    });
  };

  const removeTimeline = (index) => {
    setContent({
      ...content,
      timeline: content.timeline.filter((_, idx) => idx !== index),
    });
  };

  /* =========================================
     CATEGORY HANDLERS
  ========================================= */
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setContent({
      ...content,
      categories: [...(content.categories || []), newCategory.trim()],
    });
    setNewCategory("");
  };

  const handleRemoveCategory = (catToRemove) => {
    setContent({
      ...content,
      categories: content.categories.filter((cat) => cat !== catToRemove),
    });
  };

  /* =========================================
     SAVE PAGE CONTENT
  ========================================= */
  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateBookContent(content);
      showAlert(
        "Saved",
        "Page settings, statistics & timeline updated successfully!",
        "success",
      );
    } catch (err) {
      showAlert(
        "Save Failed",
        err.response?.data?.message || "Failed to update page content.",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredBooks = useMemo(() => {
    const term = search.toLowerCase();
    return books.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(term)) ||
        (b.authors && b.authors.toLowerCase().includes(term)) ||
        (b.publisher && b.publisher.toLowerCase().includes(term)) ||
        (b.type && b.type.toLowerCase().includes(term)) ||
        (b.department && b.department.toLowerCase().includes(term)),
    );
  }, [books, search]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading Books Management...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 position-relative">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-1 fw-bold text-dark">Books & Book Chapters CMS</h2>
          <p className="text-muted mb-0">
            Manage published book records, year-wise timeline, statistics, and
            public page content.
          </p>
        </div>
        {activeTab === "books" && (
          <Button
            variant="primary"
            className="fw-semibold px-3"
            onClick={handleOpenAdd}
          >
            <FaPlus className="me-2" /> Add Publication
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="books" className="fw-semibold">
            <FaBook className="me-2" /> Publications List ({books.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="content" className="fw-semibold">
            <FaSlidersH className="me-2" /> Page Settings, Statistics & Timeline
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* ==================================================== */}
      {/* TAB 1: BOOKS LIST TABLE                              */}
      {/* ==================================================== */}
      {activeTab === "books" && (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3 border-bottom">
            <Row className="align-items-center justify-content-between g-2">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    className="border-start-0 bg-light"
                    placeholder="Search by title, author, type, department or publisher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md="auto">
                <span className="text-muted small">
                  Showing <strong>{filteredBooks.length}</strong> of{" "}
                  <strong>{books.length}</strong> records
                </span>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Publication Title</th>
                    <th>Author(s)</th>
                    <th>Type</th>
                    <th>Publisher</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th className="text-center" style={{ width: "160px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, idx) => (
                      <tr key={book._id}>
                        <td className="text-muted">{idx + 1}</td>
                        <td>
                          <span className="fw-bold text-primary d-block">
                            {book.title}
                          </span>
                          {book.department && (
                            <small className="text-muted">
                              Dept: {book.department}
                            </small>
                          )}
                        </td>
                        <td>{book.authors}</td>
                        <td>
                          <Badge bg="info" className="text-dark fw-semibold">
                            {book.type}
                          </Badge>
                        </td>
                        <td>{book.publisher}</td>
                        <td>{book.publicationYear}</td>
                        <td>
                          <Badge
                            bg={
                              book.status === "Active" ? "success" : "secondary"
                            }
                          >
                            {book.status}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1"
                            title="View Full Details"
                            onClick={() => handleOpenView(book)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            title="Edit Record"
                            onClick={() => handleOpenEdit(book)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete Record"
                            onClick={() => handleOpenDelete(book)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        No publications match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 2: PAGE CONTENT, STATISTICS & TIMELINE            */}
      {/* ==================================================== */}
      {activeTab === "content" && (
        <Form onSubmit={handleSaveContent}>
          {/* Section 1: Hero & Text */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                1. Hero & General Information
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Hero Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={content.heroTitle || ""}
                      onChange={(e) =>
                        setContent({ ...content, heroTitle: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Section Tag</Form.Label>
                    <Form.Control
                      type="text"
                      value={content.sectionTag || ""}
                      onChange={(e) =>
                        setContent({ ...content, sectionTag: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Section Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={content.sectionTitle || ""}
                      onChange={(e) =>
                        setContent({ ...content, sectionTitle: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      About Description (Paragraph 1)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.aboutDescriptionOne || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          aboutDescriptionOne: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      About Description (Paragraph 2)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.aboutDescriptionTwo || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          aboutDescriptionTwo: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Section 2: Statistics Cards */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="mb-0 fw-bold text-dark">2. Statistics Cards</h5>
                <small className="text-muted">
                  Key Numbers (e.g., 120+ Books Published, 280+ Book Chapters)
                </small>
              </div>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={addStatistic}
              >
                <FaPlus className="me-1" /> Add Stat
              </Button>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                {content.statistics?.map((stat, idx) => (
                  <Col lg={3} md={6} key={idx}>
                    <Card className="border rounded-3 p-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="dark">Stat #{idx + 1}</Badge>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => removeStatistic(idx)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label className="small text-muted mb-1">
                          Number / Count
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. 120+"
                          value={stat.number || ""}
                          onChange={(e) =>
                            handleStatChange(idx, "number", e.target.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="small text-muted mb-1">
                          Title
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. Books Published"
                          value={stat.title || ""}
                          onChange={(e) =>
                            handleStatChange(idx, "title", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Section 3: Timeline Cards */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="mb-0 fw-bold text-dark">
                  3. Year-wise Timeline
                </h5>
                <small className="text-muted">
                  Publications growth breakdown by year
                </small>
              </div>
              <Button size="sm" variant="outline-primary" onClick={addTimeline}>
                <FaPlus className="me-1" /> Add Timeline Year
              </Button>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                {content.timeline?.map((item, idx) => (
                  <Col lg={3} md={6} key={idx}>
                    <Card className="border rounded-3 p-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="primary">Year #{idx + 1}</Badge>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => removeTimeline(idx)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label className="small text-muted mb-1">
                          Year
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="e.g. 2021"
                          value={item.year || ""}
                          onChange={(e) =>
                            handleTimelineChange(idx, "year", e.target.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="small text-muted mb-1">
                          Count Label
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. 22 Publications"
                          value={item.count || ""}
                          onChange={(e) =>
                            handleTimelineChange(idx, "count", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Section 4: Publication Categories */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                4. Publication Categories & Platforms
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {content.categories?.map((cat, idx) => (
                  <Badge
                    key={idx}
                    bg="secondary"
                    className="p-2 d-flex align-items-center gap-2 fs-6 fw-normal"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      style={{ fontSize: "0.6rem" }}
                      onClick={() => handleRemoveCategory(cat)}
                    />
                  </Badge>
                ))}
              </div>
              <Row className="g-2 align-items-center">
                <Col md={5}>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <FaTags className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Add a new category (e.g. E-Books)..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={handleAddCategory}
                    >
                      Add
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Section 5: Call To Action */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                5. Call To Action (CTA) Banner
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">CTA Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={content.ctaTitle || ""}
                      onChange={(e) =>
                        setContent({ ...content, ctaTitle: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      CTA Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.ctaDescription || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          ctaDescription: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Button
            variant="success"
            size="lg"
            type="submit"
            disabled={saving}
            className="px-4 fw-semibold shadow-sm"
          >
            {saving ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <FaSave className="me-2" /> Save All Changes
              </>
            )}
          </Button>
        </Form>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: ADD / EDIT PUBLICATION                      */}
      {/* ==================================================== */}
      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title className="fs-5 fw-bold">
            {editingId ? "Edit Publication Record" : "Add New Publication"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitBook}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Publication Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence for Smart Healthcare"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Author(s) *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="e.g. Dr. A. Kumar, Dr. P. Sharma"
                    value={formData.authors}
                    onChange={(e) =>
                      setFormData({ ...formData, authors: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Publication Type *
                  </Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Book">Book</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Edited Book">Edited Book</option>
                    <option value="E-Book">E-Book</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Publisher *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="e.g. Springer Nature / Elsevier"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Publication Year *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.publicationYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publicationYear: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 978-981-99-4567-8"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">DOI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 10.1007/978-981-99-4567-8"
                    value={formData.doi}
                    onChange={(e) =>
                      setFormData({ ...formData, doi: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Access Link / URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://..."
                    value={formData.bookLink}
                    onChange={(e) =>
                      setFormData({ ...formData, bookLink: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowFormModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
              className="px-4 fw-semibold"
            >
              {saving ? (
                <Spinner size="sm" animation="border" />
              ) : editingId ? (
                "Update Publication"
              ) : (
                "Add Publication"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 2: VIEW FULL DETAILS MODAL                     */}
      {/* ==================================================== */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center">
            <FaBook className="me-2" /> Publication Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedBook && (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <h4 className="fw-bold text-dark mb-0">{selectedBook.title}</h4>
                <Badge bg="info" className="text-dark fs-6 px-3 py-2">
                  {selectedBook.type}
                </Badge>
              </div>

              <hr />

              <Row className="g-3">
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-muted d-block mb-1">
                      <FaUserGraduate className="me-1 text-primary" /> Author(s)
                    </span>
                    <strong className="text-dark">
                      {selectedBook.authors}
                    </strong>
                  </div>
                </Col>
                {selectedBook.department && (
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted d-block mb-1">
                        <FaLayerGroup className="me-1 text-primary" />{" "}
                        Department
                      </span>
                      <strong className="text-dark">
                        {selectedBook.department}
                      </strong>
                    </div>
                  </Col>
                )}
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-muted d-block mb-1">
                      <FaBuilding className="me-1 text-primary" /> Publisher
                    </span>
                    <strong className="text-dark">
                      {selectedBook.publisher}
                    </strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-muted d-block mb-1">
                      <FaCalendarAlt className="me-1 text-primary" />{" "}
                      Publication Year
                    </span>
                    <strong className="text-dark">
                      {selectedBook.publicationYear}
                    </strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-muted d-block mb-1">
                      <FaBarcode className="me-1 text-primary" /> ISBN
                    </span>
                    <strong className="text-dark">
                      {selectedBook.isbn || "Not Provided"}
                    </strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-muted d-block mb-1">
                      <FaGlobe className="me-1 text-primary" /> DOI / Identifier
                    </span>
                    <strong className="text-dark">
                      {selectedBook.doi || "Not Provided"}
                    </strong>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          {selectedBook?.bookLink && selectedBook.bookLink !== "#" && (
            <Button
              variant="warning"
              href={selectedBook.bookLink}
              target="_blank"
              rel="noreferrer"
              className="fw-semibold"
            >
              Access Online <FaExternalLinkAlt className="ms-1" />
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION MODAL                   */}
      {/* ==================================================== */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="fs-5 fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <FaTrash className="text-danger mb-3" style={{ fontSize: "3rem" }} />
          <h5>Are you sure you want to delete this publication?</h5>
          <p className="text-muted mb-0 fw-semibold">"{deletingBook?.title}"</p>
        </Modal.Body>
        <Modal.Footer className="bg-light justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            {saving ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete Publication"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 4: FEEDBACK / MESSAGE MODAL (POPUP ALERT)      */}
      {/* ==================================================== */}
      <Modal show={alertModal.show} onHide={closeAlert} centered size="sm">
        <Modal.Header
          closeButton
          className={
            alertModal.variant === "success"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }
        >
          <Modal.Title className="fs-6 fw-bold">{alertModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          {alertModal.variant === "success" ? (
            <FaCheckCircle
              className="text-success mb-3"
              style={{ fontSize: "3rem" }}
            />
          ) : (
            <FaTimesCircle
              className="text-danger mb-3"
              style={{ fontSize: "3rem" }}
            />
          )}
          <p className="mb-0 fs-6 text-dark fw-semibold">
            {alertModal.message}
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-light p-2 justify-content-center">
          <Button
            variant={alertModal.variant === "success" ? "success" : "danger"}
            size="sm"
            className="px-4 fw-semibold"
            onClick={closeAlert}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookManagement;
