import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaFileAlt, FaTimes } from "react-icons/fa";

import {
  getDepartmentResearchConferencePaperById,
  createDepartmentResearchConferencePaper,
  updateDepartmentResearchConferencePaper,
} from "../../services/departmentResearchConferencePaperService";

import "./department-research-conference-papers-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchConferencePapersForm = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    conferenceName: "",
    conferenceLocation: "",
    organizer: "",
    publicationName: "",
    isbn: "",
    year: "",
    date: "",
    description: "",
    url: "",
    documentUrl: "",
    image: "",
    publicId: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + PAPER
     ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        /* -----------------------------------------------
           Get department by slug
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
           Get paper in edit mode
           ----------------------------------------------- */

        if (isEditMode) {
          const paperResult =
            await getDepartmentResearchConferencePaperById(id);

          const paper = paperResult?.data;

          if (!paper) {
            throw new Error("Conference paper not found");
          }

          setFormData({
            title: paper.title || "",
            authors: paper.authors || "",
            conferenceName: paper.conferenceName || "",
            conferenceLocation: paper.conferenceLocation || "",
            organizer: paper.organizer || "",
            publicationName: paper.publicationName || "",
            isbn: paper.isbn || "",
            year: paper.year || "",
            date: paper.date || "",
            description: paper.description || "",
            url: paper.url || "",
            documentUrl: paper.documentUrl || "",
            image: paper.image || "",
            publicId: paper.publicId || "",
            order: paper.order ?? 0,
            isActive:
              typeof paper.isActive === "boolean" ? paper.isActive : true,
          });
        }
      } catch (err) {
        console.error("Error loading conference paper form:", err);

        setError(err.message || "Failed to load conference paper");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug, id, isEditMode]);

  /* =========================================================
     HANDLE CHANGE
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
      alert("Please enter the conference paper title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        department: department._id,

        title: formData.title.trim(),

        authors: formData.authors.trim(),

        conferenceName: formData.conferenceName.trim(),

        conferenceLocation: formData.conferenceLocation.trim(),

        organizer: formData.organizer.trim(),

        publicationName: formData.publicationName.trim(),

        isbn: formData.isbn.trim(),

        year: formData.year.trim(),

        date: formData.date.trim(),

        description: formData.description.trim(),

        url: formData.url.trim(),

        documentUrl: formData.documentUrl.trim(),

        image: formData.image.trim(),

        publicId: formData.publicId.trim(),

        order: Number(formData.order) || 0,

        isActive: Boolean(formData.isActive),
      };

      if (isEditMode) {
        await updateDepartmentResearchConferencePaper(id, payload);
      } else {
        await createDepartmentResearchConferencePaper(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/conference-papers`,
      );
    } catch (err) {
      console.error("Error saving conference paper:", err);

      setError(err.message || "Failed to save conference paper");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL
     ========================================================= */

  const handleCancel = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/conference-papers`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="drcpf-page">
        <div className="drcpf-loading">
          <div className="drcpf-spinner"></div>

          <h3>{isEditMode ? "Loading Conference Paper..." : "Loading..."}</h3>

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
      <div className="drcpf-page">
        <div className="drcpf-error">
          <h3>Unable to Load Form</h3>

          <p>{error}</p>

          <button
            type="button"
            className="drcpf-secondary-btn"
            onClick={handleCancel}
          >
            <FaArrowLeft />
            Back to Conference Papers
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <div className="drcpf-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drcpf-header">
        <div className="drcpf-header-left">
          <button
            type="button"
            className="drcpf-back-btn"
            onClick={handleCancel}
            title="Back to Conference Papers"
          >
            <FaArrowLeft />
          </button>

          <div className="drcpf-icon">
            <FaFileAlt />
          </div>

          <div>
            <h1>
              {isEditMode ? "Edit Conference Paper" : "Add Conference Paper"}
            </h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR ALERT
          ===================================================== */}

      {error && <div className="drcpf-alert">{error}</div>}

      {/* =====================================================
          FORM
          ===================================================== */}

      <form className="drcpf-form" onSubmit={handleSubmit}>
        {/* ===================================================
            PAPER INFORMATION
            =================================================== */}

        <div className="drcpf-card">
          <div className="drcpf-card-header">
            <div>
              <h2>Paper Information</h2>

              <p>Enter the basic details of the conference paper.</p>
            </div>
          </div>

          <div className="drcpf-grid">
            {/* Title */}
            <div className="drcpf-field drcpf-full">
              <label htmlFor="title">
                Paper Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter conference paper title"
                required
              />
            </div>

            {/* Authors */}
            <div className="drcpf-field drcpf-full">
              <label htmlFor="authors">Authors</label>

              <input
                id="authors"
                name="authors"
                type="text"
                value={formData.authors}
                onChange={handleChange}
                placeholder="Enter author names"
              />

              <small>Example: Dr. A. Kumar, Prof. B. Sharma</small>
            </div>

            {/* Conference Name */}
            <div className="drcpf-field">
              <label htmlFor="conferenceName">Conference Name</label>

              <input
                id="conferenceName"
                name="conferenceName"
                type="text"
                value={formData.conferenceName}
                onChange={handleChange}
                placeholder="Enter conference name"
              />
            </div>

            {/* Organizer */}
            <div className="drcpf-field">
              <label htmlFor="organizer">Organizer</label>

              <input
                id="organizer"
                name="organizer"
                type="text"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Enter organizer"
              />
            </div>

            {/* Location */}
            <div className="drcpf-field">
              <label htmlFor="conferenceLocation">Conference Location</label>

              <input
                id="conferenceLocation"
                name="conferenceLocation"
                type="text"
                value={formData.conferenceLocation}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>

            {/* Publication */}
            <div className="drcpf-field">
              <label htmlFor="publicationName">Publication Name</label>

              <input
                id="publicationName"
                name="publicationName"
                type="text"
                value={formData.publicationName}
                onChange={handleChange}
                placeholder="Enter publication name"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            PUBLICATION DETAILS
            =================================================== */}

        <div className="drcpf-card">
          <div className="drcpf-card-header">
            <div>
              <h2>Publication Details</h2>

              <p>Add publication, date and identification details.</p>
            </div>
          </div>

          <div className="drcpf-grid">
            {/* ISBN */}
            <div className="drcpf-field">
              <label htmlFor="isbn">ISBN</label>

              <input
                id="isbn"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
              />
            </div>

            {/* Year */}
            <div className="drcpf-field">
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

            {/* Date */}
            <div className="drcpf-field">
              <label htmlFor="date">Conference Date</label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Order */}
            <div className="drcpf-field">
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
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
            =================================================== */}

        <div className="drcpf-card">
          <div className="drcpf-card-header">
            <div>
              <h2>Description</h2>

              <p>Add an abstract or short description of the paper.</p>
            </div>
          </div>

          <div className="drcpf-field">
            <label htmlFor="description">Description / Abstract</label>

            <textarea
              id="description"
              name="description"
              rows="7"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description or abstract..."
            />
          </div>
        </div>

        {/* ===================================================
            LINKS
            =================================================== */}

        <div className="drcpf-card">
          <div className="drcpf-card-header">
            <div>
              <h2>Links</h2>

              <p>Add publication and document links.</p>
            </div>
          </div>

          <div className="drcpf-grid">
            {/* Publication URL */}
            <div className="drcpf-field">
              <label htmlFor="url">Publication URL</label>

              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Document URL */}
            <div className="drcpf-field">
              <label htmlFor="documentUrl">Document / PDF URL</label>

              <input
                id="documentUrl"
                name="documentUrl"
                type="url"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            MEDIA
            =================================================== */}

        <div className="drcpf-card">
          <div className="drcpf-card-header">
            <div>
              <h2>Media</h2>

              <p>Add an image and Cloudinary public ID if required.</p>
            </div>
          </div>

          <div className="drcpf-grid">
            {/* Image */}
            <div className="drcpf-field">
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
            <div className="drcpf-field">
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

          {/* Preview */}

          {formData.image && (
            <div className="drcpf-preview">
              <span>Image Preview</span>

              <img
                src={formData.image}
                alt="Conference paper preview"
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

        <div className="drcpf-card">
          <div className="drcpf-status-row">
            <div>
              <h2>Publication Status</h2>

              <p>Set whether this conference paper should be active.</p>
            </div>

            <label className="drcpf-switch">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span className="drcpf-slider"></span>
            </label>
          </div>

          <div
            className={
              formData.isActive
                ? "drcpf-status-text active"
                : "drcpf-status-text inactive"
            }
          >
            {formData.isActive
              ? "Conference Paper is Active"
              : "Conference Paper is Inactive"}
          </div>
        </div>

        {/* ===================================================
            ACTIONS
            =================================================== */}

        <div className="drcpf-actions">
          <button
            type="button"
            className="drcpf-cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            <FaTimes />
            Cancel
          </button>

          <button type="submit" className="drcpf-save-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="drcpf-mini-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEditMode
                  ? "Update Conference Paper"
                  : "Save Conference Paper"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchConferencePapersForm;
