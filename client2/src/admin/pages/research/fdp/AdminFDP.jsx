import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Card,
  Badge,
  Spinner,
  Alert,
  Nav,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExternalLinkAlt,
  FaSortAmountDown,
  FaSync,
  FaSave,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaInfoCircle,
  FaLaptop,
  FaUsers,
} from "react-icons/fa";
import {
  getAllFDPsAdmin,
  createFDPAdmin,
  updateFDPAdmin,
  deleteFDPAdmin,
  getFDPContentAdmin,
  updateFDPContentAdmin,
} from "../../../services/facultyDevelopmentProgramService.js";

const emptyFormData = {
  title: "",
  department: "",
  speaker: "",
  duration: "",
  mode: "Offline",
  date: "",
  organizer: "",
  brochure: "",
  priority: 0,
};

const AdminFDP = () => {
  const [activeTab, setActiveTab] = useState("fdps");

  // FDP List
  const [fdpList, setFdpList] = useState([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");

  // Content
  const [contentData, setContentData] = useState({
    sectionTag: "",
    title: "",
    aboutImage: "",
    description1: "",
    description2: "",
    stats: [],
    timeline: [],
    categories: [],
  });

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  // Category Input
  const [categoryInput, setCategoryInput] = useState("");

  const loadFDPs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllFDPsAdmin({
        search: search.trim() || undefined,
        mode: modeFilter !== "All" ? modeFilter : undefined,
      });
      setFdpList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load FDP records.");
    } finally {
      setLoading(false);
    }
  }, [search, modeFilter]);

  const loadContent = async () => {
    try {
      const res = await getFDPContentAdmin();
      if (res.data) {
        setContentData(res.data);
      }
    } catch (err) {
      console.error("Failed to load page content", err);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => loadFDPs(), 350);
    return () => clearTimeout(delay);
  }, [loadFDPs]);

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError(null);
    try {
      await updateFDPContentAdmin(contentData);
      setSuccessMsg("Page configuration updated successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update page content.");
    } finally {
      setBtnLoading(false);
    }
  };

  // Timeline Handlers
  const handleAddTimeline = () => {
    setContentData((prev) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { year: "", count: "" }],
    }));
  };

  const handleRemoveTimeline = (index) => {
    setContentData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const handleTimelineChange = (index, field, val) => {
    const updated = [...contentData.timeline];
    updated[index][field] = val;
    setContentData((prev) => ({ ...prev, timeline: updated }));
  };

  // Category Handlers
  const handleAddCategory = () => {
    if (!categoryInput.trim()) return;
    setContentData((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), categoryInput.trim()],
    }));
    setCategoryInput("");
  };

  const handleRemoveCategory = (index) => {
    setContentData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  // Modal Handlers
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(emptyFormData);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setFormData({
      title: item.title || "",
      department: item.department || "",
      speaker: item.speaker || "",
      duration: item.duration || "",
      mode: item.mode || "Offline",
      date: item.date || "",
      organizer: item.organizer || "",
      brochure: item.brochure || "",
      priority: item.priority ?? 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FDP record?"))
      return;
    try {
      await deleteFDPAdmin(id);
      setSuccessMsg("FDP record removed successfully.");
      setFdpList((prev) => prev.filter((item) => item._id !== id));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record.");
    }
  };

  const handleModalChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError(null);
    try {
      if (isEditing) {
        const res = await updateFDPAdmin(currentId, formData);
        setFdpList((prev) =>
          prev
            .map((item) => (item._id === currentId ? res.data : item))
            .sort((a, b) => (b.priority || 0) - (a.priority || 0)),
        );
        setSuccessMsg("FDP record updated.");
      } else {
        const res = await createFDPAdmin(formData);
        setFdpList((prev) =>
          [res.data, ...prev].sort(
            (a, b) => (b.priority || 0) - (a.priority || 0),
          ),
        );
        setSuccessMsg("FDP record created.");
      }
      setShowModal(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save FDP.");
    } finally {
      setBtnLoading(false);
    }
  };

  const statsOverview = {
    total: fdpList.length,
    offline: fdpList.filter((f) => f.mode === "Offline").length,
    online: fdpList.filter((f) => f.mode === "Online").length,
    hybrid: fdpList.filter((f) => f.mode === "Hybrid").length,
  };

  return (
    <Container fluid className="py-4 px-lg-4">
      {successMsg && (
        <Alert
          variant="success"
          className="border-0 shadow-sm rounded-3 d-flex align-items-center"
          onClose={() => setSuccessMsg(null)}
          dismissible
        >
          <FaChalkboardTeacher className="me-2 fs-5 text-success" />
          <div>{successMsg}</div>
        </Alert>
      )}
      {error && (
        <Alert
          variant="danger"
          className="border-0 shadow-sm rounded-3 d-flex align-items-center"
          onClose={() => setError(null)}
          dismissible
        >
          <FaInfoCircle className="me-2 fs-5 text-danger" />
          <div>{error}</div>
        </Alert>
      )}

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">
            Faculty Development Programs (FDP)
          </h3>
          <p className="text-muted mb-0 small">
            Configure dynamic institutional FDP records, annual timeline
            milestones, domains, and hero overviews.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="white"
            className="border shadow-sm text-secondary px-3"
            onClick={loadFDPs}
            disabled={loading}
          >
            <FaSync className={`me-2 ${loading ? "fa-spin" : ""}`} /> Refresh
          </Button>
          <Button
            variant="primary"
            className="shadow-sm px-3 fw-semibold"
            onClick={handleAddNew}
          >
            <FaPlus className="me-2" /> Add New FDP
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-primary-subtle text-primary p-3 rounded-4 me-3">
                <FaChalkboardTeacher className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Total Listed
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.total}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-success-subtle text-success p-3 rounded-4 me-3">
                <FaUsers className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Offline
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.offline}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-info-subtle text-info p-3 rounded-4 me-3">
                <FaLaptop className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Online
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.online}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-warning-subtle text-warning p-3 rounded-4 me-3">
                <FaCalendarAlt className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Hybrid
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.hybrid}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 bg-white p-2 rounded-4 shadow-sm border"
      >
        <Nav.Item>
          <Nav.Link
            eventKey="fdps"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaChalkboardTeacher className="me-2" /> FDP Registry
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="about"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaInfoCircle className="me-2" /> Overview & Header
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="timeline"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaCalendarAlt className="me-2" /> Annual Timeline
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="categories"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaLaptop className="me-2" /> Domains & Categories
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* TAB 1: REGISTRY */}
      {activeTab === "fdps" && (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-4 border-bottom bg-light-subtle">
            <Row className="g-3 align-items-center">
              <Col md={7}>
                <InputGroup className="bg-white border rounded-pill overflow-hidden px-2 shadow-none">
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by title, department, or speaker..."
                    className="border-0 shadow-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={5} className="d-flex justify-content-md-end gap-2">
                <Form.Select
                  className="rounded-pill border shadow-none px-3"
                  style={{ maxWidth: "200px" }}
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                >
                  <option value="All">All Modes</option>
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>

          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-light text-muted text-uppercase small font-monospace">
                  <tr>
                    <th className="ps-4">#</th>
                    <th>
                      <FaSortAmountDown className="me-1" /> Priority
                    </th>
                    <th>FDP Title</th>
                    <th>Department & Organizer</th>
                    <th>Speaker</th>
                    <th>Duration & Date</th>
                    <th>Mode</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-5">
                        <Spinner
                          animation="border"
                          variant="primary"
                          size="sm"
                        />
                        <span className="ms-2 text-muted small">
                          Loading FDP data...
                        </span>
                      </td>
                    </tr>
                  ) : fdpList.length > 0 ? (
                    fdpList.map((item, index) => (
                      <tr key={item._id}>
                        <td className="ps-4 text-muted small">{index + 1}</td>
                        <td>
                          <Badge
                            bg="secondary"
                            className="bg-opacity-10 text-secondary border px-2 py-1"
                          >
                            #{item.priority || 0}
                          </Badge>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark mb-0.5">
                            {item.title}
                          </div>
                        </td>
                        <td>
                          <div className="small text-dark fw-medium">
                            {item.department}
                          </div>
                          <small className="text-muted">{item.organizer}</small>
                        </td>
                        <td>
                          <small className="text-secondary fw-medium">
                            {item.speaker}
                          </small>
                        </td>
                        <td>
                          <div className="small text-muted">
                            {item.duration}
                          </div>
                          <small className="text-muted font-monospace">
                            {item.date}
                          </small>
                        </td>
                        <td>
                          <Badge
                            bg={
                              item.mode === "Online"
                                ? "info"
                                : item.mode === "Hybrid"
                                  ? "warning"
                                  : "success"
                            }
                            className="rounded-pill px-2.5 py-1.5"
                          >
                            {item.mode}
                          </Badge>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-inline-flex gap-1.5">
                            {item.brochure && (
                              <a
                                href={
                                  item.brochure.startsWith("http")
                                    ? item.brochure
                                    : `https://${item.brochure}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-light border text-secondary"
                                title="Download Brochure"
                              >
                                <FaExternalLinkAlt size={12} />
                              </a>
                            )}
                            <Button
                              variant="light"
                              size="sm"
                              className="border text-primary"
                              onClick={() => handleEdit(item)}
                              title="Edit Record"
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="border text-danger"
                              onClick={() => handleDelete(item._id)}
                              title="Delete Record"
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-5">
                        <FaChalkboardTeacher className="text-muted fs-2 mb-2 d-block mx-auto opacity-50" />
                        <div className="text-muted fw-medium">
                          No FDP records found.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === "about" && (
        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          <Card.Body className="p-0">
            <div className="mb-4 pb-3 border-bottom">
              <h5 className="fw-bold mb-1">Page Hero & About Section</h5>
              <p className="text-muted small mb-0">
                Configure the top section displayed on the public FDP page.
              </p>
            </div>
            <Form onSubmit={handleContentSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="sectionTag">
                    <Form.Label className="fw-semibold small text-muted text-uppercase">
                      Section Tagline
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-3"
                      value={contentData.sectionTag || ""}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          sectionTag: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="aboutTitle">
                    <Form.Label className="fw-semibold small text-muted text-uppercase">
                      Main Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-3"
                      value={contentData.title || ""}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          title: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="aboutImage">
                    <Form.Label className="fw-semibold small text-muted text-uppercase">
                      Featured Image URL
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-3 font-monospace small"
                      value={contentData.aboutImage || ""}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          aboutImage: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="description1">
                    <Form.Label className="fw-semibold small text-muted text-uppercase">
                      Description Paragraph 1
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="rounded-3"
                      value={contentData.description1 || ""}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          description1: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="description2">
                    <Form.Label className="fw-semibold small text-muted text-uppercase">
                      Description Paragraph 2
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="rounded-3"
                      value={contentData.description2 || ""}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          description2: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="text-end pt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
                    disabled={btnLoading}
                  >
                    <FaSave className="me-2" />{" "}
                    {btnLoading ? "Saving..." : "Save Overview Settings"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === "timeline" && (
        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          <Card.Body className="p-0">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
              <div>
                <h5 className="fw-bold mb-1">Annual Timeline Progression</h5>
                <p className="text-muted small mb-0">
                  Manage the year-wise count milestones displayed on the public
                  page.
                </p>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3 fw-semibold"
                onClick={handleAddTimeline}
              >
                <FaPlus className="me-1" /> Add Year Milestone
              </Button>
            </div>
            <Form onSubmit={handleContentSubmit}>
              <Row className="g-3">
                {contentData.timeline?.map((item, idx) => (
                  <Col md={6} key={idx}>
                    <Card className="border rounded-4 p-3 bg-light-subtle position-relative">
                      <Row className="g-2 align-items-center">
                        <Col sm={4}>
                          <Form.Label className="small text-muted fw-semibold mb-1">
                            Year
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. 2024"
                            className="rounded-3 bg-white"
                            value={item.year}
                            onChange={(e) =>
                              handleTimelineChange(idx, "year", e.target.value)
                            }
                            required
                          />
                        </Col>
                        <Col sm={6}>
                          <Form.Label className="small text-muted fw-semibold mb-1">
                            Metric
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. 39 FDPs"
                            className="rounded-3 bg-white"
                            value={item.count}
                            onChange={(e) =>
                              handleTimelineChange(idx, "count", e.target.value)
                            }
                            required
                          />
                        </Col>
                        <Col sm={2} className="text-end pt-sm-4">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-circle p-2"
                            onClick={() => handleRemoveTimeline(idx)}
                          >
                            <FaTrash size={12} />
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
              <hr className="my-4" />
              <div className="text-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
                  disabled={btnLoading}
                >
                  <FaSave className="me-2" />{" "}
                  {btnLoading ? "Saving..." : "Save Timeline Configuration"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* TAB 4: DOMAINS & CATEGORIES */}
      {activeTab === "categories" && (
        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          <Card.Body className="p-0">
            <div className="mb-4 pb-3 border-bottom">
              <h5 className="fw-bold mb-1">FDP Domains & Categories</h5>
              <p className="text-muted small mb-0">
                Add or remove the discipline tags displayed under FDP Domains.
              </p>
            </div>
            <Form onSubmit={handleContentSubmit}>
              <Row className="g-2 align-items-center mb-4">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name (e.g. Quantum Computing)..."
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Button
                    variant="outline-primary"
                    onClick={handleAddCategory}
                    className="w-100"
                  >
                    <FaPlus className="me-2" /> Add Domain Tag
                  </Button>
                </Col>
              </Row>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {contentData.categories?.map((cat, idx) => (
                  <Badge
                    key={idx}
                    bg="light"
                    text="dark"
                    className="border px-3 py-2 fs-6 rounded-pill d-flex align-items-center gap-2"
                  >
                    <FaLaptop className="text-primary" /> {cat}
                    <Button
                      variant="link"
                      className="p-0 text-danger text-decoration-none ms-1"
                      onClick={() => handleRemoveCategory(idx)}
                    >
                      &times;
                    </Button>
                  </Badge>
                ))}
              </div>
              <hr className="my-4" />
              <div className="text-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
                  disabled={btnLoading}
                >
                  <FaSave className="me-2" />{" "}
                  {btnLoading ? "Saving..." : "Save Domain Settings"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Form onSubmit={handleModalSubmit}>
          <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
            <Modal.Title className="fw-bold fs-5">
              {isEditing ? "Modify FDP Record" : "Publish New FDP Record"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="priority">
                  <Form.Label className="fw-semibold small text-muted">
                    Priority Index (0 = Default)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="priority"
                    min="0"
                    className="rounded-3"
                    value={formData.priority}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="mode">
                  <Form.Label className="fw-semibold small text-muted">
                    Program Mode
                  </Form.Label>
                  <Form.Select
                    name="mode"
                    className="rounded-3"
                    value={formData.mode}
                    onChange={handleModalChange}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="duration">
                  <Form.Label className="fw-semibold small text-muted">
                    Duration (e.g. 5 Days) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    required
                    className="rounded-3"
                    value={formData.duration}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="title">
                  <Form.Label className="fw-semibold small text-muted">
                    FDP Title *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    required
                    className="rounded-3"
                    value={formData.title}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="department">
                  <Form.Label className="fw-semibold small text-muted">
                    Department *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    required
                    className="rounded-3"
                    value={formData.department}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="speaker">
                  <Form.Label className="fw-semibold small text-muted">
                    Resource Person / Speaker *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="speaker"
                    required
                    className="rounded-3"
                    value={formData.speaker}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label className="fw-semibold small text-muted">
                    Date Range (e.g. 15-19 July 2025) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    required
                    className="rounded-3"
                    value={formData.date}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="organizer">
                  <Form.Label className="fw-semibold small text-muted">
                    Organizer Body *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="organizer"
                    required
                    className="rounded-3"
                    value={formData.organizer}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="brochure">
                  <Form.Label className="fw-semibold small text-muted">
                    Brochure / Document URL
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="brochure"
                    placeholder="https://..."
                    className="rounded-3 font-monospace small"
                    value={formData.brochure}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 pb-4 px-4">
            <Button
              variant="light"
              className="rounded-pill px-4"
              onClick={() => setShowModal(false)}
              disabled={btnLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="rounded-pill px-4 fw-semibold"
              disabled={btnLoading}
            >
              {btnLoading
                ? "Processing..."
                : isEditing
                  ? "Save Changes"
                  : "Create Record"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminFDP;
