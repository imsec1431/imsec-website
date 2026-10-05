import React, { useEffect, useMemo, useState } from "react";

import {
  FaBookOpen,
  FaEdit,
  FaPlus,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import {
  addJournal,
  deleteJournal,
  getJournals,
  getResearchPublicationContent,
  updateJournal,
  updateResearchPublicationContent,
} from "../../../services/journalService";

import "./journal-management.css";

const defaultPublication = {
  researchPaperTitle: "",
  authors: "",
  department: "",
  journal: "",
  publicationYear: new Date().getFullYear(),
  indexingDatabase: "",
  issn: "",
  paperLink: "",
  status: "Active",
  displayOrder: 1,
};

const defaultContent = {
  heroTitle: "Research Publications",
  sectionTag: "RESEARCH EXCELLENCE",
  sectionTitle: "Research Publications",
  aboutImage: "",
  aboutDescriptionOne: "",
  aboutDescriptionTwo: "",
  statistics: [],
  timeline: [],
  indexingDatabases: [],
  ctaTitle: "Publish with Impact. Inspire Through Research.",
  ctaDescription: "",
};

const JournalManagement = () => {
  const [activeTab, setActiveTab] = useState("publications");

  const [journals, setJournals] = useState([]);

  const [publicationForm, setPublicationForm] = useState(defaultPublication);

  const [contentForm, setContentForm] = useState(defaultContent);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [savingPublication, setSavingPublication] = useState(false);

  const [savingContent, setSavingContent] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =========================================
     LOAD JOURNALS
  ========================================= */

  const fetchJournals = async () => {
    try {
      const response = await getJournals();

      setJournals(response.data?.data || []);
    } catch (err) {
      console.error("Journal fetch error:", err);

      setError(
        err.response?.data?.message || "Unable to load research publications.",
      );
    }
  };

  /* =========================================
     LOAD PAGE CONTENT
  ========================================= */

  const fetchContent = async () => {
    try {
      const response = await getResearchPublicationContent();

      setContentForm({
        ...defaultContent,
        ...(response.data?.data || {}),
      });
    } catch (err) {
      console.error("Publication content fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load publication page content.",
      );
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([fetchJournals(), fetchContent()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================================
     ALERT HELPER
  ========================================= */

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  /* =========================================
     PUBLICATION FORM
  ========================================= */

  const handlePublicationChange = (event) => {
    const { name, value } = event.target;

    setPublicationForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetPublicationForm = () => {
    setPublicationForm(defaultPublication);

    setEditId(null);
  };

  const handlePublicationSubmit = async (event) => {
    event.preventDefault();

    clearAlerts();

    if (!publicationForm.researchPaperTitle.trim()) {
      setError("Research paper title is required.");

      return;
    }

    if (
      !publicationForm.authors.trim() ||
      !publicationForm.department.trim() ||
      !publicationForm.journal.trim()
    ) {
      setError("Authors, department and journal name are required.");

      return;
    }

    if (!publicationForm.indexingDatabase.trim()) {
      setError("Indexing database is required.");

      return;
    }

    try {
      setSavingPublication(true);

      if (editId) {
        await updateJournal(editId, publicationForm);

        setMessage("Research publication updated successfully.");
      } else {
        await addJournal(publicationForm);

        setMessage("Research publication added successfully.");
      }

      resetPublicationForm();

      await fetchJournals();
    } catch (err) {
      console.error("Journal save error:", err);

      setError(
        err.response?.data?.message || "Unable to save research publication.",
      );
    } finally {
      setSavingPublication(false);
    }
  };

  const handleEditPublication = (item) => {
    clearAlerts();

    setEditId(item._id);

    setPublicationForm({
      researchPaperTitle: item.researchPaperTitle || "",
      authors: item.authors || "",
      department: item.department || "",
      journal: item.journal || "",
      publicationYear: item.publicationYear || new Date().getFullYear(),
      indexingDatabase: item.indexingDatabase || "",
      issn: item.issn || "",
      paperLink: item.paperLink || "",
      status: item.status || "Active",
      displayOrder: item.displayOrder || 1,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeletePublication = async (item) => {
    const shouldDelete = window.confirm(`Delete "${item.researchPaperTitle}"?`);

    if (!shouldDelete) return;

    clearAlerts();

    try {
      await deleteJournal(item._id);

      if (item._id === editId) {
        resetPublicationForm();
      }

      setMessage("Research publication deleted successfully.");

      await fetchJournals();
    } catch (err) {
      console.error("Journal delete error:", err);

      setError(
        err.response?.data?.message || "Unable to delete research publication.",
      );
    }
  };

  /* =========================================
     PAGE CONTENT FORM
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

  const handleIndexingDatabases = (event) => {
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

    clearAlerts();

    try {
      setSavingContent(true);

      await updateResearchPublicationContent(contentForm);

      setMessage("Research publication page content updated successfully.");

      await fetchContent();
    } catch (err) {
      console.error("Content save error:", err);

      setError(err.response?.data?.message || "Unable to update page content.");
    } finally {
      setSavingContent(false);
    }
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredJournals = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return journals;

    return journals.filter((item) =>
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
  }, [journals, search]);

  return (
    <div className="journal-management-page">
      <div className="page-header journal-page-header">
        <div>
          <span className="journal-eyebrow">RESEARCH MANAGEMENT</span>

          <h2>Research Publications</h2>

          <p>
            Manage research-paper records and the Research Publications public
            page.
          </p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="journal-tabs">
        <button
          type="button"
          className={
            activeTab === "publications" ? "journal-tab active" : "journal-tab"
          }
          onClick={() => setActiveTab("publications")}
        >
          <FaBookOpen />
          Research Publications
        </button>

        <button
          type="button"
          className={
            activeTab === "content" ? "journal-tab active" : "journal-tab"
          }
          onClick={() => setActiveTab("content")}
        >
          Page Content & Statistics
        </button>
      </div>

      {loading ? (
        <div className="journal-loading">Loading Research Publications...</div>
      ) : (
        <>
          {/* =====================================
              PUBLICATIONS TAB
          ===================================== */}

          {activeTab === "publications" && (
            <>
              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>
                      {editId
                        ? "Edit Research Publication"
                        : "Add Research Publication"}
                    </h4>

                    <p>
                      This information appears in the public Research
                      Publications table.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePublicationSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">
                        Research Paper Title *
                      </label>

                      <input
                        type="text"
                        name="researchPaperTitle"
                        className="form-control"
                        value={publicationForm.researchPaperTitle}
                        onChange={handlePublicationChange}
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
                        value={publicationForm.publicationYear}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Author(s) *</label>

                      <input
                        type="text"
                        name="authors"
                        placeholder="Dr. A. Kumar, Dr. P. Sharma"
                        className="form-control"
                        value={publicationForm.authors}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Department *</label>

                      <input
                        type="text"
                        name="department"
                        placeholder="Computer Science & Engineering"
                        className="form-control"
                        value={publicationForm.department}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Journal Name *</label>

                      <input
                        type="text"
                        name="journal"
                        className="form-control"
                        value={publicationForm.journal}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Indexing Database *</label>

                      <select
                        name="indexingDatabase"
                        className="form-select"
                        value={publicationForm.indexingDatabase}
                        onChange={handlePublicationChange}
                      >
                        <option value="">Select Database</option>

                        {contentForm.indexingDatabases.map((database) => (
                          <option key={database} value={database}>
                            {database}
                          </option>
                        ))}

                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">ISSN / E-ISSN</label>

                      <input
                        type="text"
                        name="issn"
                        placeholder="2456-9876 / 2456-9884"
                        className="form-control"
                        value={publicationForm.issn}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">View Paper Link</label>

                      <input
                        type="url"
                        name="paperLink"
                        placeholder="https://..."
                        className="form-control"
                        value={publicationForm.paperLink}
                        onChange={handlePublicationChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>

                      <select
                        name="status"
                        className="form-select"
                        value={publicationForm.status}
                        onChange={handlePublicationChange}
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
                        value={publicationForm.displayOrder}
                        onChange={handlePublicationChange}
                      />
                    </div>
                  </div>

                  <div className="journal-form-actions">
                    <button
                      type="submit"
                      className="journal-primary-btn"
                      disabled={savingPublication}
                    >
                      <FaSave />

                      {savingPublication
                        ? "Saving..."
                        : editId
                          ? "Update Publication"
                          : "Save Publication"}
                    </button>

                    {editId && (
                      <button
                        type="button"
                        className="journal-secondary-btn"
                        onClick={resetPublicationForm}
                        disabled={savingPublication}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="journal-panel">
                <div className="journal-list-header">
                  <div>
                    <h4>All Research Publications</h4>

                    <p>{filteredJournals.length} publication(s)</p>
                  </div>

                  <div className="journal-search">
                    <FaSearch />

                    <input
                      type="text"
                      placeholder="Search title, author or journal..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table journal-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Research Paper Title</th>
                        <th>Author(s)</th>
                        <th>Department</th>
                        <th>Journal</th>
                        <th>Year</th>
                        <th>Indexing</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredJournals.length > 0 ? (
                        filteredJournals.map((item, index) => (
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

                            <td>
                              <span
                                className={
                                  item.status === "Active"
                                    ? "status-badge active"
                                    : "status-badge inactive"
                                }
                              >
                                {item.status}
                              </span>
                            </td>

                            <td>
                              <div className="journal-actions">
                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() => handleEditPublication(item)}
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => handleDeletePublication(item)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
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
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================
              PAGE CONTENT TAB
          ===================================== */}

          {activeTab === "content" && (
            <form onSubmit={handleContentSubmit}>
              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>Hero and About Section</h4>

                    <p>
                      Manage page heading, image and research introduction text.
                    </p>
                  </div>
                </div>

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

              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>Publication Statistics</h4>

                    <p>Example: 1200+ Research Publications.</p>
                  </div>

                  <button
                    type="button"
                    className="journal-secondary-btn"
                    onClick={addStatistic}
                  >
                    <FaPlus /> Add Statistic
                  </button>
                </div>

                {contentForm.statistics.map((item, index) => (
                  <div className="row g-3 mb-3" key={index}>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="1200+"
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
                        placeholder="Research Publications"
                        value={item.title || ""}
                        onChange={(event) =>
                          updateStatistic(index, "title", event.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="journal-delete-text-btn"
                        onClick={() => removeStatistic(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>Publication Timeline</h4>

                    <p>Manage year-wise publication counts.</p>
                  </div>

                  <button
                    type="button"
                    className="journal-secondary-btn"
                    onClick={addTimeline}
                  >
                    <FaPlus /> Add Year
                  </button>
                </div>

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
                        placeholder="350 Publications"
                        value={item.count || ""}
                        onChange={(event) =>
                          updateTimeline(index, "count", event.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="journal-delete-text-btn"
                        onClick={() => removeTimeline(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>Indexing Databases</h4>

                    <p>
                      These appear in the Research Visibility Worldwide section.
                    </p>
                  </div>
                </div>

                <label className="form-label">
                  Databases, separated by commas
                </label>

                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Scopus, Web of Science, UGC CARE..."
                  value={contentForm.indexingDatabases.join(", ")}
                  onChange={handleIndexingDatabases}
                />
              </div>

              <div className="journal-panel">
                <div className="journal-panel-header">
                  <div>
                    <h4>Call to Action</h4>

                    <p>The bottom message on the public page.</p>
                  </div>
                </div>

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

                <div className="journal-form-actions">
                  <button
                    type="submit"
                    className="journal-primary-btn"
                    disabled={savingContent}
                  >
                    <FaSave />

                    {savingContent ? "Saving..." : "Save Page Content"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default JournalManagement;
