import React, { useEffect, useMemo, useState } from "react";

import { Button, Modal, Spinner, Table } from "react-bootstrap";

import { FaEdit, FaPlus, FaSave, FaSearch, FaTrash } from "react-icons/fa";

import {
  addConferencePaper,
  deleteConferencePaper,
  getConferencePaperContent,
  getConferencePapers,
  updateConferencePaper,
  updateConferencePaperContent,
} from "../../../services/conferencePaperService";

const defaultPaperForm = {
  paperTitle: "",
  authors: "",
  department: "",
  conferenceName: "",
  conferenceVenue: "",
  conferenceDate: "",
  publicationYear: new Date().getFullYear(),
  indexingDatabase: "",
  isbn: "",
  doi: "",
  paperLink: "",
  status: "Active",
  displayOrder: 1,
};

const defaultContentForm = {
  heroTitle: "Conference Papers",
  sectionTag: "RESEARCH EXCELLENCE",
  sectionTitle: "Conference Papers",
  aboutImage: "",
  aboutDescriptionOne: "",
  aboutDescriptionTwo: "",
  statistics: [],
  timeline: [],
  indexingDatabases: [],
  ctaTitle: "Present Innovation. Build Global Research Impact.",
  ctaDescription: "",
};

const ConferencePaperManagement = () => {
  const [activeTab, setActiveTab] = useState("papers");

  const [papers, setPapers] = useState([]);

  const [paperForm, setPaperForm] = useState(defaultPaperForm);

  const [contentForm, setContentForm] = useState(defaultContentForm);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [savingPaper, setSavingPaper] = useState(false);

  const [savingContent, setSavingContent] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [messageModal, setMessageModal] = useState({
    show: false,
    title: "",
    message: "",
    variant: "success",
  });

  /* =========================================
     BOOTSTRAP MESSAGE MODAL
  ========================================= */

  const showMessage = (title, message, variant = "success") => {
    setMessageModal({
      show: true,
      title,
      message,
      variant,
    });
  };

  const closeMessage = () => {
    setMessageModal((current) => ({
      ...current,
      show: false,
    }));
  };

  /* =========================================
     FETCH CONFERENCE PAPERS
  ========================================= */

  const fetchConferencePapers = async () => {
    try {
      setLoading(true);

      const response = await getConferencePapers();

      setPapers(response.data?.data || []);
    } catch (error) {
      console.error("Conference Paper Fetch Error:", error);

      showMessage(
        "Unable to Load",
        error.response?.data?.message || "Unable to load conference papers.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FETCH PAGE CONTENT
  ========================================= */

  const fetchConferenceContent = async () => {
    try {
      const response = await getConferencePaperContent();

      setContentForm({
        ...defaultContentForm,
        ...(response.data?.data || {}),
      });
    } catch (error) {
      console.error("Conference Content Fetch Error:", error);

      showMessage(
        "Unable to Load",
        error.response?.data?.message ||
          "Unable to load conference page content.",
        "danger",
      );
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchConferencePapers(), fetchConferenceContent()]);
    };

    loadData();
  }, []);

  /* =========================================
     CONFERENCE PAPER FORM
  ========================================= */

  const handlePaperChange = (event) => {
    const { name, value } = event.target;

    setPaperForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetPaperForm = () => {
    setPaperForm(defaultPaperForm);

    setEditId(null);
  };

  const handlePaperSubmit = async (event) => {
    event.preventDefault();

    if (!paperForm.paperTitle.trim()) {
      showMessage("Required Field", "Paper title is required.", "danger");

      return;
    }

    if (!paperForm.authors.trim()) {
      showMessage("Required Field", "Author name is required.", "danger");

      return;
    }

    if (!paperForm.department.trim()) {
      showMessage("Required Field", "Department is required.", "danger");

      return;
    }

    if (!paperForm.conferenceName.trim()) {
      showMessage("Required Field", "Conference name is required.", "danger");

      return;
    }

    try {
      setSavingPaper(true);

      if (editId) {
        await updateConferencePaper(editId, paperForm);

        showMessage(
          "Updated Successfully",
          "Conference paper updated successfully.",
        );
      } else {
        await addConferencePaper(paperForm);

        showMessage(
          "Added Successfully",
          "Conference paper added successfully.",
        );
      }

      resetPaperForm();

      await fetchConferencePapers();
    } catch (error) {
      console.error("Conference Paper Save Error:", error);

      showMessage(
        "Save Failed",
        error.response?.data?.message || "Unable to save conference paper.",
        "danger",
      );
    } finally {
      setSavingPaper(false);
    }
  };

  const handleEditPaper = (paper) => {
    setEditId(paper._id);

    setPaperForm({
      paperTitle: paper.paperTitle || "",
      authors: paper.authors || "",
      department: paper.department || "",
      conferenceName: paper.conferenceName || "",
      conferenceVenue: paper.conferenceVenue || "",
      conferenceDate: paper.conferenceDate
        ? paper.conferenceDate.substring(0, 10)
        : "",
      publicationYear: paper.publicationYear || new Date().getFullYear(),
      indexingDatabase: paper.indexingDatabase || "",
      isbn: paper.isbn || "",
      doi: paper.doi || "",
      paperLink: paper.paperLink || "",
      status: paper.status || "Active",
      displayOrder: paper.displayOrder || 1,
    });

    setActiveTab("papers");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     DELETE CONFERENCE PAPER
  ========================================= */

  const openDeleteModal = (paper) => {
    setDeleteTarget(paper);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteConferencePaper(deleteTarget._id);

      if (deleteTarget._id === editId) {
        resetPaperForm();
      }

      closeDeleteModal();

      showMessage(
        "Deleted Successfully",
        "Conference paper deleted successfully.",
      );

      await fetchConferencePapers();
    } catch (error) {
      console.error("Conference Paper Delete Error:", error);

      closeDeleteModal();

      showMessage(
        "Delete Failed",
        error.response?.data?.message || "Unable to delete conference paper.",
        "danger",
      );
    }
  };

  /* =========================================
     CONTENT FORM
  ========================================= */

  const handleContentChange = (event) => {
    const { name, value } = event.target;

    setContentForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateStatistic = (index, field, value) => {
    setContentForm((current) => {
      const statistics = [...current.statistics];

      statistics[index] = {
        ...statistics[index],
        [field]: value,
      };

      return {
        ...current,
        statistics,
      };
    });
  };

  const addStatistic = () => {
    setContentForm((current) => ({
      ...current,
      statistics: [
        ...current.statistics,
        {
          number: "",
          title: "",
        },
      ],
    }));
  };

  const removeStatistic = (index) => {
    setContentForm((current) => ({
      ...current,
      statistics: current.statistics.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const updateTimeline = (index, field, value) => {
    setContentForm((current) => {
      const timeline = [...current.timeline];

      timeline[index] = {
        ...timeline[index],
        [field]: value,
      };

      return {
        ...current,
        timeline,
      };
    });
  };

  const addTimeline = () => {
    setContentForm((current) => ({
      ...current,
      timeline: [
        ...current.timeline,
        {
          year: new Date().getFullYear(),
          count: "",
        },
      ],
    }));
  };

  const removeTimeline = (index) => {
    setContentForm((current) => ({
      ...current,
      timeline: current.timeline.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleIndexingDatabaseChange = (event) => {
    const databases = event.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setContentForm((current) => ({
      ...current,
      indexingDatabases: databases,
    }));
  };

  const handleContentSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingContent(true);

      await updateConferencePaperContent(contentForm);

      showMessage(
        "Updated Successfully",
        "Conference Papers page content updated successfully.",
      );

      await fetchConferenceContent();
    } catch (error) {
      console.error("Conference Content Save Error:", error);

      showMessage(
        "Save Failed",
        error.response?.data?.message ||
          "Unable to update conference page content.",
        "danger",
      );
    } finally {
      setSavingContent(false);
    }
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredPapers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return papers;

    return papers.filter((paper) =>
      [
        paper.paperTitle,
        paper.authors,
        paper.department,
        paper.conferenceName,
        paper.indexingDatabase,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText)),
    );
  }, [papers, search]);

  return (
    <div className="container-fluid py-3">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Conference Papers</h2>

          <p className="text-muted mb-0">
            Manage conference papers and Conference Papers public page content.
          </p>
        </div>

        {activeTab === "papers" && (
          <Button
            variant="primary"
            onClick={() => {
              resetPaperForm();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <FaPlus className="me-2" />
            Add Paper
          </Button>
        )}
      </div>

      {/* =====================================
          TABS
      ===================================== */}

      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Button
          variant={activeTab === "papers" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("papers")}
        >
          Conference Papers
        </Button>

        <Button
          variant={activeTab === "content" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("content")}
        >
          Page Content & Statistics
        </Button>
      </div>

      {/* =====================================
          CONFERENCE PAPERS TAB
      ===================================== */}

      {activeTab === "papers" && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                {editId ? "Edit Conference Paper" : "Add New Conference Paper"}
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={handlePaperSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Paper Title *</label>

                    <input
                      type="text"
                      name="paperTitle"
                      className="form-control"
                      value={paperForm.paperTitle}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Publication Year *</label>

                    <input
                      type="number"
                      name="publicationYear"
                      min="1900"
                      max="3000"
                      className="form-control"
                      value={paperForm.publicationYear}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Author(s) *</label>

                    <input
                      type="text"
                      name="authors"
                      className="form-control"
                      value={paperForm.authors}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Department *</label>

                    <input
                      type="text"
                      name="department"
                      className="form-control"
                      value={paperForm.department}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Conference Name *</label>

                    <input
                      type="text"
                      name="conferenceName"
                      className="form-control"
                      value={paperForm.conferenceName}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Conference Venue</label>

                    <input
                      type="text"
                      name="conferenceVenue"
                      placeholder="New Delhi, India"
                      className="form-control"
                      value={paperForm.conferenceVenue}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Conference Date</label>

                    <input
                      type="date"
                      name="conferenceDate"
                      className="form-control"
                      value={paperForm.conferenceDate}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Indexing Database</label>

                    <input
                      type="text"
                      name="indexingDatabase"
                      placeholder="Scopus / Web of Science"
                      className="form-control"
                      value={paperForm.indexingDatabase}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">ISBN</label>

                    <input
                      type="text"
                      name="isbn"
                      className="form-control"
                      value={paperForm.isbn}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">DOI</label>

                    <input
                      type="text"
                      name="doi"
                      placeholder="10.xxxx/example"
                      className="form-control"
                      value={paperForm.doi}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">View Paper Link</label>

                    <input
                      type="url"
                      name="paperLink"
                      placeholder="https://..."
                      className="form-control"
                      value={paperForm.paperLink}
                      onChange={handlePaperChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>

                    <select
                      name="status"
                      className="form-select"
                      value={paperForm.status}
                      onChange={handlePaperChange}
                    >
                      <option value="Active">Active</option>

                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Display Order</label>

                    <input
                      type="number"
                      name="displayOrder"
                      min="1"
                      className="form-control"
                      value={paperForm.displayOrder}
                      onChange={handlePaperChange}
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingPaper}
                  >
                    {savingPaper ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />

                        {editId
                          ? "Update Conference Paper"
                          : "Save Conference Paper"}
                      </>
                    )}
                  </Button>

                  {editId && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetPaperForm}
                      disabled={savingPaper}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center gap-3">
              <div>
                <h5 className="mb-1">All Conference Papers</h5>

                <small className="text-muted">
                  {filteredPapers.length} paper(s) found
                </small>
              </div>

              <div className="input-group" style={{ maxWidth: "320px" }}>
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search paper, author..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Paper Title</th>
                    <th>Author(s)</th>
                    <th>Conference</th>
                    <th>Year</th>
                    <th>Indexing</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <Spinner animation="border" size="sm" />

                        <span className="ms-2">
                          Loading conference papers...
                        </span>
                      </td>
                    </tr>
                  ) : filteredPapers.length > 0 ? (
                    filteredPapers.map((paper, index) => (
                      <tr key={paper._id}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{paper.paperTitle}</strong>

                          <small className="d-block text-muted">
                            {paper.department}
                          </small>
                        </td>

                        <td>{paper.authors}</td>

                        <td>
                          {paper.conferenceName}

                          {paper.conferenceVenue && (
                            <small className="d-block text-muted">
                              {paper.conferenceVenue}
                            </small>
                          )}
                        </td>

                        <td>{paper.publicationYear}</td>

                        <td>{paper.indexingDatabase || "—"}</td>

                        <td>
                          <span
                            className={
                              paper.status === "Active"
                                ? "badge bg-success"
                                : "badge bg-warning text-dark"
                            }
                          >
                            {paper.status}
                          </span>
                        </td>

                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => handleEditPaper(paper)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(paper)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No conference papers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* =====================================
          PAGE CONTENT & STATISTICS TAB
      ===================================== */}

      {activeTab === "content" && (
        <form onSubmit={handleContentSubmit}>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Hero and About Section</h5>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Hero Title</label>

                  <input
                    type="text"
                    name="heroTitle"
                    className="form-control"
                    value={contentForm.heroTitle}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Section Tag</label>

                  <input
                    type="text"
                    name="sectionTag"
                    className="form-control"
                    value={contentForm.sectionTag}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Section Title</label>

                  <input
                    type="text"
                    name="sectionTitle"
                    className="form-control"
                    value={contentForm.sectionTitle}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">About Image URL</label>

                  <input
                    type="url"
                    name="aboutImage"
                    placeholder="https://..."
                    className="form-control"
                    value={contentForm.aboutImage}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">About Description One</label>

                  <textarea
                    rows="4"
                    name="aboutDescriptionOne"
                    className="form-control"
                    value={contentForm.aboutDescriptionOne}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">About Description Two</label>

                  <textarea
                    rows="4"
                    name="aboutDescriptionTwo"
                    className="form-control"
                    value={contentForm.aboutDescriptionTwo}
                    onChange={handleContentChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Conference Statistics</h5>

              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={addStatistic}
              >
                <FaPlus className="me-1" />
                Add Statistic
              </Button>
            </div>

            <div className="card-body">
              {contentForm.statistics.map((item, index) => (
                <div className="row g-3 mb-3" key={index}>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="500+"
                      value={item.number || ""}
                      onChange={(event) =>
                        updateStatistic(index, "number", event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Conference Papers"
                      value={item.title || ""}
                      onChange={(event) =>
                        updateStatistic(index, "title", event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <Button
                      type="button"
                      variant="outline-danger"
                      className="w-100"
                      onClick={() => removeStatistic(index)}
                    >
                      <FaTrash className="me-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Conference Timeline</h5>

              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={addTimeline}
              >
                <FaPlus className="me-1" />
                Add Year
              </Button>
            </div>

            <div className="card-body">
              {contentForm.timeline.map((item, index) => (
                <div className="row g-3 mb-3" key={index}>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2024"
                      value={item.year || ""}
                      onChange={(event) =>
                        updateTimeline(index, "year", event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="190 Papers"
                      value={item.count || ""}
                      onChange={(event) =>
                        updateTimeline(index, "count", event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <Button
                      type="button"
                      variant="outline-danger"
                      className="w-100"
                      onClick={() => removeTimeline(index)}
                    >
                      <FaTrash className="me-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Indexing Databases</h5>
            </div>

            <div className="card-body">
              <label className="form-label">
                Databases, separated by commas
              </label>

              <textarea
                rows="3"
                className="form-control"
                placeholder="Scopus, Web of Science, IEEE Xplore..."
                value={contentForm.indexingDatabases.join(", ")}
                onChange={handleIndexingDatabaseChange}
              />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Call to Action</h5>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">CTA Title</label>

                  <input
                    type="text"
                    name="ctaTitle"
                    className="form-control"
                    value={contentForm.ctaTitle}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">CTA Description</label>

                  <textarea
                    rows="3"
                    name="ctaDescription"
                    className="form-control"
                    value={contentForm.ctaDescription}
                    onChange={handleContentChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={savingContent}
                >
                  {savingContent ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Save Page Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* =====================================
          SUCCESS / ERROR MODAL
      ===================================== */}

      <Modal show={messageModal.show} onHide={closeMessage} centered>
        <Modal.Header
          closeButton
          className={
            messageModal.variant === "danger"
              ? "bg-danger text-white"
              : "bg-success text-white"
          }
        >
          <Modal.Title>{messageModal.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{messageModal.message}</Modal.Body>

        <Modal.Footer>
          <Button
            variant={messageModal.variant === "danger" ? "danger" : "success"}
            onClick={closeMessage}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================
          DELETE CONFIRMATION MODAL
      ===================================== */}

      <Modal show={Boolean(deleteTarget)} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Conference Paper</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete:
          <strong className="d-block mt-2">{deleteTarget?.paperTitle}</strong>
          <p className="text-danger mb-0 mt-3">This action cannot be undone.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConferencePaperManagement;
