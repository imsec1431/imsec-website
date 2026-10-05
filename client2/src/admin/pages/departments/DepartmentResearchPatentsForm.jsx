import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import {
  getDepartmentResearchPatentById,
  createDepartmentResearchPatent,
  updateDepartmentResearchPatent,
} from "../../services/departmentResearchPatentService";

import "./department-research-patents-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchPatentsForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    inventors: "",
    patentNumber: "",
    applicationNumber: "",
    filingDate: "",
    grantDate: "",
    status: "",
    patentOffice: "",
    country: "",
    year: "",
    description: "",
    url: "",
    documentUrl: "",
    image: "",
    publicId: "",
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
     FETCH PATENT FOR EDIT
     ========================================================= */

  const fetchPatent = async () => {
    const result = await getDepartmentResearchPatentById(id);

    const data = result?.data;

    if (!data) {
      throw new Error("Patent record not found");
    }

    setFormData({
      title: data.title || "",
      inventors: data.inventors || "",
      patentNumber: data.patentNumber || "",
      applicationNumber: data.applicationNumber || "",
      filingDate: data.filingDate || "",
      grantDate: data.grantDate || "",
      status: data.status || "",
      patentOffice: data.patentOffice || "",
      country: data.country || "",
      year: data.year || "",
      description: data.description || "",
      url: data.url || "",
      documentUrl: data.documentUrl || "",
      image: data.image || "",
      publicId: data.publicId || "",
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
          await fetchPatent();
        }
      } catch (error) {
        console.error("Load form error:", error);

        setError(error?.message || "Failed to load patent information");
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
      setError("Patent title is required.");
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
        await updateDepartmentResearchPatent(id, payload);

        alert("Patent updated successfully.");
      } else {
        await createDepartmentResearchPatent(payload);

        alert("Patent added successfully.");
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/patents`,
      );
    } catch (error) {
      console.error("Save patent error:", error);

      setError(error?.message || "Failed to save patent.");
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
      )}/research/patents`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-patents-form-page">
        <div className="drpf-loading">
          <div className="drpf-spinner"></div>
          <p>Loading patent form...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR WITHOUT DEPARTMENT
     ========================================================= */

  if (!department) {
    return (
      <div className="department-research-patents-form-page">
        <div className="drpf-error">
          <h3>Unable to Load Form</h3>
          <p>{error || "Department not found."}</p>

          <button type="button" className="drpf-back-btn" onClick={handleBack}>
            <FaArrowLeft />
            Back to Patents
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="department-research-patents-form-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="drpf-header">
        <div className="drpf-header-left">
          <button
            type="button"
            className="drpf-icon-back"
            onClick={handleBack}
            title="Back to Patents"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="drpf-breadcrumb">
              Department / Research / Patents / {isEditMode ? "Edit" : "Add"}
            </div>

            <h1>
              {isEditMode ? "Edit Research Patent" : "Add Research Patent"}
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

      {error && <div className="drpf-error-message">{error}</div>}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form className="drpf-form" onSubmit={handleSubmit}>
        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <div className="drpf-card">
          <div className="drpf-card-header">
            <h2>Patent Information</h2>
            <p>Enter the basic details of the research patent.</p>
          </div>

          <div className="drpf-grid">
            <div className="drpf-field full">
              <label>
                Patent Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter patent title"
                required
              />
            </div>

            <div className="drpf-field full">
              <label>Inventors</label>

              <input
                type="text"
                name="inventors"
                value={formData.inventors}
                onChange={handleChange}
                placeholder="Enter inventor names"
              />
            </div>

            <div className="drpf-field">
              <label>Patent Number</label>

              <input
                type="text"
                name="patentNumber"
                value={formData.patentNumber}
                onChange={handleChange}
                placeholder="Enter patent number"
              />
            </div>

            <div className="drpf-field">
              <label>Application Number</label>

              <input
                type="text"
                name="applicationNumber"
                value={formData.applicationNumber}
                onChange={handleChange}
                placeholder="Enter application number"
              />
            </div>

            <div className="drpf-field">
              <label>Filing Date</label>

              <input
                type="text"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleChange}
                placeholder="e.g. 15 March 2024"
              />
            </div>

            <div className="drpf-field">
              <label>Grant Date</label>

              <input
                type="text"
                name="grantDate"
                value={formData.grantDate}
                onChange={handleChange}
                placeholder="e.g. 20 August 2025"
              />
            </div>

            <div className="drpf-field">
              <label>Status</label>

              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="e.g. Granted / Published / Filed"
              />
            </div>

            <div className="drpf-field">
              <label>Patent Office</label>

              <input
                type="text"
                name="patentOffice"
                value={formData.patentOffice}
                onChange={handleChange}
                placeholder="Enter patent office"
              />
            </div>

            <div className="drpf-field">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>

            <div className="drpf-field">
              <label>Year</label>

              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2025"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <div className="drpf-card">
          <div className="drpf-card-header">
            <h2>Description</h2>
            <p>Add a short description of the patent.</p>
          </div>

          <div className="drpf-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter patent description"
              rows="5"
            />
          </div>
        </div>

        {/* ===================================================
            LINKS & MEDIA
        =================================================== */}

        <div className="drpf-card">
          <div className="drpf-card-header">
            <h2>Links & Media</h2>
            <p>Add external links and image information.</p>
          </div>

          <div className="drpf-grid">
            <div className="drpf-field">
              <label>Patent URL</label>

              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="drpf-field">
              <label>Document URL</label>

              <input
                type="url"
                name="documentUrl"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="drpf-field">
              <label>Image URL</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="drpf-field">
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

        <div className="drpf-card">
          <div className="drpf-card-header">
            <h2>Display Settings</h2>
            <p>Control ordering and visibility.</p>
          </div>

          <div className="drpf-grid">
            <div className="drpf-field">
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

            <div className="drpf-checkbox-field">
              <label className="drpf-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <span>
                  <strong>Active Patent</strong>
                  <small>Show this patent on the department website.</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="drpf-form-actions">
          <button
            type="button"
            className="drpf-cancel-btn"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="drpf-save-btn" disabled={saving}>
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Patent"
                : "Save Patent"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchPatentsForm;
