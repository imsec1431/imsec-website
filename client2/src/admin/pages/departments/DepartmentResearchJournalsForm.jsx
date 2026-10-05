import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaFlask, FaTimes } from "react-icons/fa";

import {
  getDepartmentResearchJournalById,
  createDepartmentResearchJournal,
  updateDepartmentResearchJournal,
} from "../../services/departmentResearchJournalService";

import "./department-research-journals-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchJournalsForm = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    journalName: "",
    publisher: "",
    issn: "",
    volume: "",
    issue: "",
    year: "",
    url: "",
    image: "",
    publicId: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + JOURNAL
     ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        /* -----------------------------------------------
           Get department
           ----------------------------------------------- */

        const departmentResponse = await fetch(
          `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
        );

        const departmentResult = await departmentResponse.json();

        if (!departmentResponse.ok) {
          throw new Error(
            departmentResult?.message || "Failed to fetch department",
          );
        }

        const departmentData = departmentResult.data;

        if (!departmentData?._id) {
          throw new Error("Department not found");
        }

        setDepartment(departmentData);

        /* -----------------------------------------------
           Get journal in edit mode
           ----------------------------------------------- */

        if (isEditMode) {
          const journalResult = await getDepartmentResearchJournalById(id);

          const journal = journalResult?.data;

          if (!journal) {
            throw new Error("Research journal not found");
          }

          setFormData({
            title: journal.title || "",
            description: journal.description || "",
            journalName: journal.journalName || "",
            publisher: journal.publisher || "",
            issn: journal.issn || "",
            volume: journal.volume || "",
            issue: journal.issue || "",
            year: journal.year || "",
            url: journal.url || "",
            image: journal.image || "",
            publicId: journal.publicId || "",
            order: journal.order ?? 0,
            isActive:
              typeof journal.isActive === "boolean" ? journal.isActive : true,
          });
        }
      } catch (err) {
        console.error("Error loading research journal form:", err);

        setError(err.message || "Failed to load research journal");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug, id, isEditMode]);

  /* =========================================================
     INPUT CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!department?._id) {
      alert("Department information is missing.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter the journal title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        department: department._id,

        title: formData.title.trim(),

        description: formData.description.trim(),

        journalName: formData.journalName.trim(),

        publisher: formData.publisher.trim(),

        issn: formData.issn.trim(),

        volume: formData.volume.trim(),

        issue: formData.issue.trim(),

        year: formData.year.trim(),

        url: formData.url.trim(),

        image: formData.image.trim(),

        publicId: formData.publicId.trim(),

        order: Number(formData.order) || 0,

        isActive: Boolean(formData.isActive),
      };

      if (isEditMode) {
        await updateDepartmentResearchJournal(id, payload);
      } else {
        await createDepartmentResearchJournal(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/journals`,
      );
    } catch (err) {
      console.error("Error saving research journal:", err);

      setError(err.message || "Failed to save research journal");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     BACK
     ========================================================= */

  const handleCancel = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/journals`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="drjf-page">
        <div className="drjf-loading">
          <div className="drjf-spinner"></div>

          <h3>{isEditMode ? "Loading Journal..." : "Loading..."}</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error && !department) {
    return (
      <div className="drjf-page">
        <div className="drjf-error">
          <h3>Unable to Load Form</h3>

          <p>{error}</p>

          <button
            type="button"
            className="drjf-secondary-btn"
            onClick={handleCancel}
          >
            <FaArrowLeft />
            Back to Journals
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <div className="drjf-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drjf-header">
        <div className="drjf-header-left">
          <button
            type="button"
            className="drjf-back-btn"
            onClick={handleCancel}
            title="Back to Journals"
          >
            <FaArrowLeft />
          </button>

          <div className="drjf-icon">
            <FaFlask />
          </div>

          <div>
            <h1>
              {isEditMode ? "Edit Research Journal" : "Add Research Journal"}
            </h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && <div className="drjf-alert">{error}</div>}

      {/* =====================================================
          FORM
          ===================================================== */}

      <form className="drjf-form" onSubmit={handleSubmit}>
        {/* ===================================================
            BASIC INFORMATION
            =================================================== */}

        <div className="drjf-card">
          <div className="drjf-card-header">
            <div>
              <h2>Journal Information</h2>
              <p>Enter the basic details of the research journal.</p>
            </div>
          </div>

          <div className="drjf-grid">
            {/* Title */}
            <div className="drjf-field drjf-full">
              <label htmlFor="title">
                Journal Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter journal title"
                required
              />
            </div>

            {/* Journal Name */}
            <div className="drjf-field">
              <label htmlFor="journalName">Journal Name</label>

              <input
                id="journalName"
                name="journalName"
                type="text"
                value={formData.journalName}
                onChange={handleChange}
                placeholder="Enter journal name"
              />
            </div>

            {/* Publisher */}
            <div className="drjf-field">
              <label htmlFor="publisher">Publisher</label>

              <input
                id="publisher"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher"
              />
            </div>

            {/* ISSN */}
            <div className="drjf-field">
              <label htmlFor="issn">ISSN</label>

              <input
                id="issn"
                name="issn"
                type="text"
                value={formData.issn}
                onChange={handleChange}
                placeholder="e.g. 1234-5678"
              />
            </div>

            {/* Year */}
            <div className="drjf-field">
              <label htmlFor="year">Publication Year</label>

              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2026"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            PUBLICATION DETAILS
            =================================================== */}

        <div className="drjf-card">
          <div className="drjf-card-header">
            <div>
              <h2>Publication Details</h2>
              <p>Add volume and issue information.</p>
            </div>
          </div>

          <div className="drjf-grid">
            {/* Volume */}
            <div className="drjf-field">
              <label htmlFor="volume">Volume</label>

              <input
                id="volume"
                name="volume"
                type="text"
                value={formData.volume}
                onChange={handleChange}
                placeholder="Enter volume"
              />
            </div>

            {/* Issue */}
            <div className="drjf-field">
              <label htmlFor="issue">Issue</label>

              <input
                id="issue"
                name="issue"
                type="text"
                value={formData.issue}
                onChange={handleChange}
                placeholder="Enter issue"
              />
            </div>

            {/* Order */}
            <div className="drjf-field">
              <label htmlFor="order">Display Order</label>

              <input
                id="order"
                name="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={handleChange}
              />
            </div>

            {/* URL */}
            <div className="drjf-field">
              <label htmlFor="url">Journal URL</label>

              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
            =================================================== */}

        <div className="drjf-card">
          <div className="drjf-card-header">
            <div>
              <h2>Description</h2>
              <p>Add a short description of the journal.</p>
            </div>
          </div>

          <div className="drjf-field">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter journal description..."
            />
          </div>
        </div>

        {/* ===================================================
            MEDIA
            =================================================== */}

        <div className="drjf-card">
          <div className="drjf-card-header">
            <div>
              <h2>Media & Link</h2>
              <p>Add journal image and Cloudinary information if required.</p>
            </div>
          </div>

          <div className="drjf-grid">
            {/* Image */}
            <div className="drjf-field">
              <label htmlFor="image">Image URL</label>

              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            {/* Public ID */}
            <div className="drjf-field">
              <label htmlFor="publicId">Cloudinary Public ID</label>

              <input
                id="publicId"
                name="publicId"
                type="text"
                value={formData.publicId}
                onChange={handleChange}
                placeholder="Enter Cloudinary public ID"
              />
            </div>
          </div>

          {/* Image Preview */}

          {formData.image && (
            <div className="drjf-preview">
              <span>Image Preview</span>

              <img
                src={formData.image}
                alt="Journal preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* ===================================================
            STATUS
            =================================================== */}

        <div className="drjf-card">
          <div className="drjf-status-row">
            <div>
              <h2>Publication Status</h2>

              <p>Set whether this journal should be visible as active.</p>
            </div>

            <label className="drjf-switch">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span className="drjf-slider"></span>
            </label>
          </div>

          <div
            className={
              formData.isActive
                ? "drjf-status-text active"
                : "drjf-status-text inactive"
            }
          >
            {formData.isActive ? "Journal is Active" : "Journal is Inactive"}
          </div>
        </div>

        {/* ===================================================
            ACTIONS
            =================================================== */}

        <div className="drjf-actions">
          <button
            type="button"
            className="drjf-cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            <FaTimes />
            Cancel
          </button>

          <button type="submit" className="drjf-save-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="drjf-mini-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEditMode ? "Update Journal" : "Save Journal"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchJournalsForm;
