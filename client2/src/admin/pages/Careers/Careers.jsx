import React, { useEffect, useState } from "react";

import {
  getCareerOpeningsAdmin,
  createCareerOpening,
  updateCareerOpening,
  deleteCareerOpening,
} from "../../services/careerService.js";

import CareerApplications from "./CareerApplications.jsx";

import "./Careers.css";

const initialForm = {
  title: "",
  department: "",
  location: "Ghaziabad",
  employmentType: "Full Time",
  vacancies: 1,
  experience: "",
  eligibility: "",
  description: "",
  applicationStartDate: "",
  applicationEndDate: "",
  status: "Draft",
};

const Careers = () => {
  const [activeTab, setActiveTab] = useState("openings");

  const [openings, setOpenings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);

  // ======================================================
  // LOAD OPENINGS
  // ======================================================

  const loadOpenings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCareerOpeningsAdmin();

      setOpenings(response?.data || []);
    } catch (error) {
      console.error("Career openings error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load career openings.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpenings();
  }, []);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // CREATE
  // ======================================================

  const handleCreate = () => {
    setEditingId(null);

    setForm({
      ...initialForm,
    });

    setShowForm(true);

    setError("");
  };

  // ======================================================
  // EDIT
  // ======================================================

  const handleEdit = (opening) => {
    setEditingId(opening._id);

    setForm({
      title: opening.title || "",

      department: opening.department || "",

      location: opening.location || "Ghaziabad",

      employmentType: opening.employmentType || "Full Time",

      vacancies: opening.vacancies || 1,

      experience: opening.experience || "",

      eligibility: opening.eligibility || "",

      description: opening.description || "",

      applicationStartDate: opening.applicationStartDate
        ? String(opening.applicationStartDate).slice(0, 10)
        : "",

      applicationEndDate: opening.applicationEndDate
        ? String(opening.applicationEndDate).slice(0, 10)
        : "",

      status: opening.status || "Draft",
    });

    setShowForm(true);

    setError("");
  };

  // ======================================================
  // CLOSE FORM
  // ======================================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    setEditingId(null);

    setForm({
      ...initialForm,
    });
  };

  // ======================================================
  // SAVE
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        vacancies: Number(form.vacancies),
      };

      if (editingId) {
        await updateCareerOpening(editingId, payload);
      } else {
        await createCareerOpening(payload);
      }

      handleCloseForm();

      await loadOpenings();
    } catch (error) {
      console.error("Career opening save error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save career opening.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this career opening?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCareerOpening(id);

      await loadOpenings();
    } catch (error) {
      console.error("Career opening delete error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete career opening.",
      );
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="admin-careers-page">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-careers-header">
        <div>
          <span className="admin-careers-eyebrow">HR / RECRUITMENT</span>

          <h1>Careers</h1>

          <p>Manage job openings and candidate applications.</p>
        </div>
      </div>

      {/* ==================================================
          TABS
      ================================================== */}

      <div className="admin-careers-tabs">
        <button
          type="button"
          className={activeTab === "openings" ? "active" : ""}
          onClick={() => setActiveTab("openings")}
        >
          Job Openings
        </button>

        <button
          type="button"
          className={activeTab === "applications" ? "active" : ""}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-careers-error">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      {/* ==================================================
          JOB OPENINGS TAB
      ================================================== */}

      {activeTab === "openings" && (
        <section className="admin-careers-section">
          {/* SECTION HEADER */}

          <div className="admin-careers-section-header">
            <div>
              <h2>Job Openings</h2>

              <p>
                Create and publish current vacancies for the public Careers
                page.
              </p>
            </div>

            <button
              type="button"
              className="admin-careers-primary-button"
              onClick={handleCreate}
            >
              + Add New Opening
            </button>
          </div>

          {/* ==================================================
              CREATE / EDIT FORM
          ================================================== */}

          {showForm && (
            <div className="career-opening-form-card">
              <div className="career-opening-form-header">
                <div>
                  <span>{editingId ? "EDIT OPENING" : "NEW OPENING"}</span>

                  <h2>
                    {editingId
                      ? "Edit Career Opening"
                      : "Create Career Opening"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="career-form-close"
                  onClick={handleCloseForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="career-form-grid">
                  {/* POST */}

                  <div className="career-form-field">
                    <label>Post Title *</label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Assistant Professor"
                      required
                    />
                  </div>

                  {/* DEPARTMENT */}

                  <div className="career-form-field">
                    <label>Department *</label>

                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      placeholder="Computer Science & Engineering"
                      required
                    />
                  </div>

                  {/* LOCATION */}

                  <div className="career-form-field">
                    <label>Location *</label>

                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* EMPLOYMENT */}

                  <div className="career-form-field">
                    <label>Employment Type *</label>

                    <select
                      name="employmentType"
                      value={form.employmentType}
                      onChange={handleChange}
                    >
                      <option value="Full Time">Full Time</option>

                      <option value="Part Time">Part Time</option>

                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  {/* VACANCIES */}

                  <div className="career-form-field">
                    <label>Number of Vacancies *</label>

                    <input
                      type="number"
                      name="vacancies"
                      min="1"
                      value={form.vacancies}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* EXPERIENCE */}

                  <div className="career-form-field">
                    <label>Experience</label>

                    <input
                      type="text"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="0-2 Years"
                    />
                  </div>

                  {/* START DATE */}

                  <div className="career-form-field">
                    <label>Application Start Date</label>

                    <input
                      type="date"
                      name="applicationStartDate"
                      value={form.applicationStartDate}
                      onChange={handleChange}
                    />
                  </div>

                  {/* END DATE */}

                  <div className="career-form-field">
                    <label>Application End Date</label>

                    <input
                      type="date"
                      name="applicationEndDate"
                      value={form.applicationEndDate}
                      onChange={handleChange}
                    />
                  </div>

                  {/* STATUS */}

                  <div className="career-form-field">
                    <label>Status *</label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Draft">Draft</option>

                      <option value="Published">Published</option>

                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* ELIGIBILITY */}

                  <div className="career-form-field full">
                    <label>Eligibility</label>

                    <textarea
                      name="eligibility"
                      value={form.eligibility}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Enter eligibility requirements..."
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div className="career-form-field full">
                    <label>Job Description</label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="7"
                      placeholder="Enter complete job description..."
                    />
                  </div>
                </div>

                {/* FORM ACTIONS */}

                <div className="career-form-actions">
                  <button
                    type="button"
                    className="career-form-cancel"
                    onClick={handleCloseForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="career-form-save"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Opening"
                        : "Publish / Save Opening"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================
              OPENING LIST
          ================================================== */}

          {loading ? (
            <div className="admin-careers-loading">Loading job openings...</div>
          ) : openings.length === 0 ? (
            <div className="admin-careers-empty">
              <div className="admin-careers-empty-icon">+</div>

              <h3>No Job Openings</h3>

              <p>Click "Add New Opening" to create your first vacancy.</p>
            </div>
          ) : (
            <div className="admin-career-opening-list">
              {openings.map((opening) => (
                <div key={opening._id} className="admin-career-opening-card">
                  <div className="admin-career-opening-info">
                    <div className="admin-career-opening-status">
                      <span
                        className={`opening-status ${String(
                          opening.status || "Draft",
                        ).toLowerCase()}`}
                      >
                        {opening.status || "Draft"}
                      </span>
                    </div>

                    <h3>{opening.title}</h3>

                    <p>{opening.department}</p>

                    <div className="admin-opening-meta">
                      <span>📍 {opening.location}</span>

                      <span>💼 {opening.employmentType}</span>

                      <span>👥 {opening.vacancies}</span>
                    </div>
                  </div>

                  <div className="admin-career-opening-actions">
                    <button type="button" onClick={() => handleEdit(opening)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(opening._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ==================================================
          APPLICATIONS TAB
      ================================================== */}

      {activeTab === "applications" && (
        <section className="admin-careers-applications-section">
          <CareerApplications />
        </section>
      )}
    </div>
  );
};

export default Careers;
