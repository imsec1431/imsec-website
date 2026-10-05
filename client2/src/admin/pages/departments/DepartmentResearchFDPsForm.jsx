import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import {
  getDepartmentResearchFDPById,
  createDepartmentResearchFDP,
  updateDepartmentResearchFDP,
} from "../../services/departmentResearchFDPService";

import "./department-research-fdps-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchFDPsForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    coordinator: "",
    organizer: "",
    venue: "",
    startDate: "",
    endDate: "",
    duration: "",
    mode: "",
    participants: "",
    description: "",
    url: "",
    documentUrl: "",
    image: "",
    publicId: "",
    year: "",
    order: 0,
    isActive: true,
  });

  /* =========================================================
     FETCH DEPARTMENT
     ========================================================= */

  const fetchDepartment = async () => {
    const response = await fetch(
      `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch department");
    }

    return result?.data;
  };

  /* =========================================================
     FETCH FDP FOR EDIT
     ========================================================= */

  const fetchFDP = async () => {
    const result = await getDepartmentResearchFDPById(id);

    const data = result?.data;

    if (!data) {
      throw new Error("FDP record not found");
    }

    setFormData({
      title: data.title || "",
      coordinator: data.coordinator || "",
      organizer: data.organizer || "",
      venue: data.venue || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      duration: data.duration || "",
      mode: data.mode || "",
      participants: data.participants || "",
      description: data.description || "",
      url: data.url || "",
      documentUrl: data.documentUrl || "",
      image: data.image || "",
      publicId: data.publicId || "",
      year: data.year || "",
      order: data.order ?? 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
  };

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const departmentData = await fetchDepartment();

        if (!departmentData?._id) {
          throw new Error("Department information not found");
        }

        setDepartment(departmentData);

        if (isEditMode) {
          await fetchFDP();
        }
      } catch (error) {
        console.error("Load FDP form error:", error);

        setError(error?.message || "Failed to load FDP information");
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department?._id) {
      setError("Department information is missing.");
      return;
    }

    if (!formData.title.trim()) {
      setError("FDP title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        department: department._id,
        order: formData.order === "" ? 0 : Number(formData.order),
      };

      if (isEditMode) {
        await updateDepartmentResearchFDP(id, payload);

        alert("FDP updated successfully.");
      } else {
        await createDepartmentResearchFDP(payload);

        alert("FDP added successfully.");
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/fdps`,
      );
    } catch (error) {
      console.error("Save FDP error:", error);

      setError(error?.message || "Failed to save FDP.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     BACK
     ========================================================= */

  const handleBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/fdps`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-fdps-form-page">
        <div className="drff-loading">
          <div className="drff-spinner"></div>
          <p>Loading FDP form...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR PAGE
     ========================================================= */

  if (!department) {
    return (
      <div className="department-research-fdps-form-page">
        <div className="drff-error">
          <h3>Unable to Load Form</h3>

          <p>{error || "Department not found."}</p>

          <button type="button" className="drff-back-btn" onClick={handleBack}>
            <FaArrowLeft />
            Back to FDPs
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="department-research-fdps-form-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="drff-header">
        <div className="drff-header-left">
          <button
            type="button"
            className="drff-icon-back"
            onClick={handleBack}
            title="Back to FDPs"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="drff-breadcrumb">
              Department / Research / FDPs / {isEditMode ? "Edit" : "Add"}
            </div>

            <h1>
              {isEditMode
                ? "Edit Faculty Development Programme"
                : "Add Faculty Development Programme"}
            </h1>

            <p>
              {department.name || department.departmentName || "Department"}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && <div className="drff-error-message">{error}</div>}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form className="drff-form" onSubmit={handleSubmit}>
        {/* ===================================================
            PROGRAMME INFORMATION
        =================================================== */}

        <div className="drff-card">
          <div className="drff-card-header">
            <h2>Programme Information</h2>

            <p>Enter the basic details of the faculty development programme.</p>
          </div>

          <div className="drff-grid">
            <div className="drff-field full">
              <label>
                Programme Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter FDP title"
                required
              />
            </div>

            <div className="drff-field">
              <label>Coordinator</label>

              <input
                type="text"
                name="coordinator"
                value={formData.coordinator}
                onChange={handleChange}
                placeholder="Enter coordinator name"
              />
            </div>

            <div className="drff-field">
              <label>Organizer</label>

              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Enter organizing institute / department"
              />
            </div>

            <div className="drff-field">
              <label>Venue</label>

              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue"
              />
            </div>

            <div className="drff-field">
              <label>Mode</label>

              <select name="mode" value={formData.mode} onChange={handleChange}>
                <option value="">Select mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="drff-field">
              <label>Start Date</label>

              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="e.g. 10 March 2025"
              />
            </div>

            <div className="drff-field">
              <label>End Date</label>

              <input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="e.g. 14 March 2025"
              />
            </div>

            <div className="drff-field">
              <label>Duration</label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 5 Days / 30 Hours"
              />
            </div>

            <div className="drff-field">
              <label>Year</label>

              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2025"
              />
            </div>

            <div className="drff-field">
              <label>Participants</label>

              <input
                type="text"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                placeholder="e.g. 75 Faculty Members"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <div className="drff-card">
          <div className="drff-card-header">
            <h2>Description</h2>

            <p>Add details about the faculty development programme.</p>
          </div>

          <div className="drff-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter FDP description"
              rows="6"
            />
          </div>
        </div>

        {/* ===================================================
            LINKS & MEDIA
        =================================================== */}

        <div className="drff-card">
          <div className="drff-card-header">
            <h2>Links & Media</h2>

            <p>Add programme links and image information.</p>
          </div>

          <div className="drff-grid">
            <div className="drff-field">
              <label>Programme URL</label>

              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="drff-field">
              <label>Document URL</label>

              <input
                type="url"
                name="documentUrl"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="drff-field">
              <label>Image URL</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="drff-field">
              <label>Public ID</label>

              <input
                type="text"
                name="publicId"
                value={formData.publicId}
                onChange={handleChange}
                placeholder="Enter Cloudinary public ID"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            DISPLAY SETTINGS
        =================================================== */}

        <div className="drff-card">
          <div className="drff-card-header">
            <h2>Display Settings</h2>

            <p>Control ordering and visibility of this FDP.</p>
          </div>

          <div className="drff-grid">
            <div className="drff-field">
              <label>Display Order</label>

              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="drff-checkbox-field">
              <label className="drff-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <span>
                  <strong>Active FDP</strong>

                  <small>Show this FDP on the department website.</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="drff-form-actions">
          <button
            type="button"
            className="drff-cancel-btn"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="drff-save-btn" disabled={saving}>
            <FaSave />

            {saving ? "Saving..." : isEditMode ? "Update FDP" : "Save FDP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchFDPsForm;
