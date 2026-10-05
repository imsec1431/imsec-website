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
  FaLightbulb,
  FaAward,
  FaCalendarAlt,
  FaInfoCircle,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";
import {
  getAllPatentsAdmin,
  createPatentAdmin,
  updatePatentAdmin,
  deletePatentAdmin,
  getPatentContentAdmin,
  updatePatentContentAdmin,
} from "../../../services/patentService.js";

const emptyFormData = {
  applicationNo: "",
  patentNo: "",
  title: "",
  inventors: "",
  applicant: "IMS Engineering College",
  filedDate: "",
  publishedDate: "",
  status: "Filed",
  priority: 0,
  url: "",
};

const AdminPatents = () => {
  const [activeTab, setActiveTab] = useState("patents");

  // Patent List States
  const [patentList, setPatentList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Page Content State
  const [contentData, setContentData] = useState({
    sectionTag: "",
    title: "",
    aboutImage: "",
    description1: "",
    description2: "",
    stats: [],
    timeline: [],
  });

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  // Load Patents
  const loadPatents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPatentsAdmin({
        search: search.trim() || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
      });
      setPatentList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patents.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Load Page Content
  const loadContent = async () => {
    try {
      const res = await getPatentContentAdmin();
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
    const delay = setTimeout(() => loadPatents(), 350);
    return () => clearTimeout(delay);
  }, [loadPatents]);

  // Save Content Changes
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError(null);
    try {
      await updatePatentContentAdmin(contentData);
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
      applicationNo: item.applicationNo || "",
      patentNo: item.patentNo || "",
      title: item.title || "",
      inventors: item.inventors || "",
      applicant: item.applicant || "IMS Engineering College",
      filedDate: item.filedDate || "",
      publishedDate: item.publishedDate || "",
      status: item.status || "Filed",
      priority: item.priority ?? 0,
      url: item.url || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patent?")) return;
    try {
      await deletePatentAdmin(id);
      setSuccessMsg("Patent removed successfully.");
      setPatentList((prev) => prev.filter((item) => item._id !== id));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete patent.");
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
        const res = await updatePatentAdmin(currentId, formData);
        setPatentList((prev) =>
          prev
            .map((item) => (item._id === currentId ? res.data : item))
            .sort((a, b) => (b.priority || 0) - (a.priority || 0)),
        );
        setSuccessMsg("Patent record updated.");
      } else {
        const res = await createPatentAdmin(formData);
        setPatentList((prev) =>
          [res.data, ...prev].sort(
            (a, b) => (b.priority || 0) - (a.priority || 0),
          ),
        );
        setSuccessMsg("Patent record published.");
      }
      setShowModal(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save patent.");
    } finally {
      setBtnLoading(false);
    }
  };

  // Quick Stat Calculations
  const statsOverview = {
    total: patentList.length,
    filed: patentList.filter((p) => p.status === "Filed").length,
    published: patentList.filter((p) => p.status === "Published").length,
    granted: patentList.filter((p) => p.status === "Granted").length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Granted":
        return (
          <Badge
            bg="success"
            className="px-2.5 py-1.5 fw-semibold rounded-pill"
          >
            Granted
          </Badge>
        );
      case "Published":
        return (
          <Badge
            bg="primary"
            className="px-2.5 py-1.5 fw-semibold rounded-pill"
          >
            Published
          </Badge>
        );
      default:
        return (
          <Badge
            bg="warning"
            text="dark"
            className="px-2.5 py-1.5 fw-semibold rounded-pill"
          >
            Filed
          </Badge>
        );
    }
  };

  return (
    <Container fluid className="py-4 px-lg-4">
      {/* Dynamic Notifications */}
      {successMsg && (
        <Alert
          variant="success"
          className="border-0 shadow-sm rounded-3 d-flex align-items-center"
          onClose={() => setSuccessMsg(null)}
          dismissible
        >
          <FaAward className="me-2 fs-5 text-success" />
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

      {/* Top Banner & Metric Overview Cards */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">
            Patent & Innovation Portfolio
          </h3>
          <p className="text-muted mb-0 small">
            Configure dynamic institutional patent registries, year-wise
            analytics, and public descriptions.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="white"
            className="border shadow-sm text-secondary px-3"
            onClick={loadPatents}
            disabled={loading}
          >
            <FaSync className={`me-2 ${loading ? "fa-spin" : ""}`} /> Refresh
          </Button>
          <Button
            variant="primary"
            className="shadow-sm px-3 fw-semibold"
            onClick={handleAddNew}
          >
            <FaPlus className="me-2" /> Add New Patent
          </Button>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-primary-subtle text-primary p-3 rounded-4 me-3">
                <FaLightbulb className="fs-4" />
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
              <div className="bg-warning-subtle text-warning p-3 rounded-4 me-3">
                <FaFileAlt className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Filed
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.filed}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-info-subtle text-info p-3 rounded-4 me-3">
                <FaChartLine className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Published
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.published}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-success-subtle text-success p-3 rounded-4 me-3">
                <FaAward className="fs-4" />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Granted
                </span>
                <h4 className="fw-bolder mb-0 text-dark">
                  {statsOverview.granted}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pill-Style Tabs */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 bg-white p-2 rounded-4 shadow-sm border"
      >
        <Nav.Item>
          <Nav.Link
            eventKey="patents"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaFileAlt className="me-2" /> Patents Registry
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="about"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaInfoCircle className="me-2" /> Page Overview & Header
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="timeline"
            className="fw-semibold px-4 py-2 rounded-pill"
          >
            <FaCalendarAlt className="me-2" /> Timeline Progression
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* TAB 1: PATENT TABLE */}
      {activeTab === "patents" && (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-4 border-bottom bg-light-subtle">
            <Row className="g-3 align-items-center">
              <Col md={7}>
                <InputGroup className="bg-white border rounded-pill overflow-hidden px-2 shadow-none">
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by title, inventor, or application number..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Filed">Filed</option>
                  <option value="Published">Published</option>
                  <option value="Granted">Granted</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>

          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0 custom-patent-table">
                <thead className="bg-light text-muted text-uppercase small font-monospace">
                  <tr>
                    <th className="ps-4">#</th>
                    <th>
                      <FaSortAmountDown className="me-1" /> Priority
                    </th>
                    <th>Application No.</th>
                    <th style={{ minWidth: "220px" }}>Title & Applicant</th>
                    <th>Inventors</th>
                    <th>Lifecycle Dates</th>
                    <th>Status</th>
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
                          Loading registry data...
                        </span>
                      </td>
                    </tr>
                  ) : patentList.length > 0 ? (
                    patentList.map((item, index) => (
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
                          <span className="fw-semibold font-monospace text-dark d-block">
                            {item.applicationNo}
                          </span>
                          {item.patentNo && (
                            <small className="text-muted font-monospace">
                              Grant: {item.patentNo}
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold text-dark mb-0.5 text-wrap">
                            {item.title}
                          </div>
                          <small className="text-muted">{item.applicant}</small>
                        </td>
                        <td>
                          <small className="text-secondary fw-medium">
                            {item.inventors}
                          </small>
                        </td>
                        <td>
                          <div className="small text-muted">
                            <span className="fw-semibold text-dark">
                              Filed:
                            </span>{" "}
                            {item.filedDate || "—"}
                          </div>
                          <div className="small text-muted">
                            <span className="fw-semibold text-dark">Pub:</span>{" "}
                            {item.publishedDate || "—"}
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td className="text-end pe-4">
                          <div className="d-inline-flex gap-1.5">
                            {item.url && (
                              <a
                                href={
                                  item.url.startsWith("http")
                                    ? item.url
                                    : `https://${item.url}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-light border text-secondary"
                                title="Open URL"
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
                        <FaFileAlt className="text-muted fs-2 mb-2 d-block mx-auto opacity-50" />
                        <div className="text-muted fw-medium">
                          No patent records found matching your filters.
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

      {/* TAB 2: ABOUT / OVERVIEW SECTION */}
      {activeTab === "about" && (
        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          <Card.Body className="p-0">
            <div className="mb-4 pb-3 border-bottom">
              <h5 className="fw-bold mb-1">
                Landing Page Hero & Overview Section
              </h5>
              <p className="text-muted small mb-0">
                Configure the branding, imagery, and intellectual property
                mission statement on the public portal.
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
                      Header Headline
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
                      Featured Banner Image URL
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
                      Overview Paragraph 1
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
                      Overview Paragraph 2
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

      {/* TAB 3: TIMELINE & PROGRESS CARDS */}
      {activeTab === "timeline" && (
        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          <Card.Body className="p-0">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
              <div>
                <h5 className="fw-bold mb-1">
                  Year-Wise Patent Progression Timeline
                </h5>
                <p className="text-muted small mb-0">
                  Manage the yearly statistical cards presented on the bottom of
                  the public page.
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
                            placeholder="e.g. 2025"
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
                            Progress Metric
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. 55 Filed"
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
                            title="Remove Card"
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

      {/* CREATE / EDIT MODAL */}
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
              {isEditing ? "Modify Patent Record" : "Publish New Patent Record"}
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
                <Form.Group controlId="applicationNo">
                  <Form.Label className="fw-semibold small text-muted">
                    Application No. *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationNo"
                    required
                    className="rounded-3 font-monospace"
                    value={formData.applicationNo}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="patentNo">
                  <Form.Label className="fw-semibold small text-muted">
                    Patent / Grant No.
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="patentNo"
                    className="rounded-3 font-monospace"
                    value={formData.patentNo}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="title">
                  <Form.Label className="fw-semibold small text-muted">
                    Patent Title *
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
                <Form.Group controlId="inventors">
                  <Form.Label className="fw-semibold small text-muted">
                    Inventor(s) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="inventors"
                    placeholder="e.g. Dr. A. Kumar, Dr. P. Sharma"
                    required
                    className="rounded-3"
                    value={formData.inventors}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="applicant">
                  <Form.Label className="fw-semibold small text-muted">
                    Applicant Body
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="applicant"
                    className="rounded-3"
                    value={formData.applicant}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="filedDate">
                  <Form.Label className="fw-semibold small text-muted">
                    Filed Date
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DD/MM/YYYY"
                    name="filedDate"
                    className="rounded-3"
                    value={formData.filedDate}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="publishedDate">
                  <Form.Label className="fw-semibold small text-muted">
                    Published / Grant Date
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DD/MM/YYYY"
                    name="publishedDate"
                    className="rounded-3"
                    value={formData.publishedDate}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="status">
                  <Form.Label className="fw-semibold small text-muted">
                    Lifecycle Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    className="rounded-3"
                    value={formData.status}
                    onChange={handleModalChange}
                  >
                    <option value="Filed">Filed</option>
                    <option value="Published">Published</option>
                    <option value="Granted">Granted</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="url">
                  <Form.Label className="fw-semibold small text-muted">
                    Official Link / Document URL
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="url"
                    placeholder="https://..."
                    className="rounded-3 font-monospace small"
                    value={formData.url}
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

export default AdminPatents;
