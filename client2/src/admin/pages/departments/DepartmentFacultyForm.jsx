import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaUserTie } from "react-icons/fa";

import "./department-faculty-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const emptyForm = {
  name: "",
  designation: "",
  qualification: "",
  experience: "",
  specialization: "",
  description: "",
  photo: "",
  photoFile: null,
  email: "",
  phone: "",
  linkedinUrl: "",
  isHOD: false,
  priority: 1,
  status: "Active",
};

const DepartmentFacultyForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* =====================================================
     LOAD DEPARTMENT
  ===================================================== */

  const loadDepartment = async () => {
    try {
      const response = await fetch(`${API_URL}/departments/slug/${slug}`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch department");
      }

      setDepartment(result.data);
    } catch (err) {
      console.error("Load Department Error:", err);

      setError(err.message || "Failed to load department");
    }
  };

  /* =====================================================
     LOAD FACULTY FOR EDIT
  ===================================================== */

  const loadFaculty = async () => {
    try {
      const response = await fetch(
        `${API_URL}/department-faculty/single/${id}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch faculty");
      }

      const faculty = result.data;

      /*
        Photo can currently be:
        1. String URL
        2. Object { url, publicId }

        We support both so existing records
        do not break.
      */

      let existingPhoto = "";

      if (typeof faculty.photo === "string") {
        existingPhoto = faculty.photo;
      } else if (faculty.photo?.url) {
        existingPhoto = faculty.photo.url;
      }

      setFormData({
        name: faculty.name || "",

        designation: faculty.designation || "",

        qualification: faculty.qualification || "",

        experience: faculty.experience || "",

        specialization: faculty.specialization || "",

        description: faculty.description || "",

        photo: existingPhoto,

        photoFile: null,

        email: faculty.email || "",

        phone: faculty.phone || "",

        linkedinUrl: faculty.linkedinUrl || "",

        isHOD: faculty.isHOD || false,

        priority: faculty.priority || 1,

        status: faculty.status || "Active",
      });
    } catch (err) {
      console.error("Load Faculty Error:", err);

      setError(err.message || "Failed to load faculty");
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await loadDepartment();

      if (isEditMode) {
        await loadFaculty();
      }

      setLoading(false);
    };

    loadData();
  }, [slug, id]);

  /* =====================================================
     HANDLE NORMAL INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     HANDLE PHOTO CHANGE
  ===================================================== */

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      return;
    }

    /* =================================================
       FILE TYPE VALIDATION
    ================================================= */

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");

      e.target.value = "";

      return;
    }

    /* =================================================
       FILE SIZE VALIDATION
       5 MB
    ================================================= */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Faculty photo must be less than 5 MB.");

      e.target.value = "";

      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,

      photoFile: file,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      /* =================================================
         DEPARTMENT CHECK
      ================================================= */

      if (!department?._id) {
        throw new Error("Department information is missing");
      }

      /* =================================================
         NAME VALIDATION
      ================================================= */

      if (!formData.name.trim()) {
        throw new Error("Faculty name is required");
      }

      /* =================================================
         DESIGNATION VALIDATION
      ================================================= */

      if (!formData.designation.trim()) {
        throw new Error("Faculty designation is required");
      }

      /* =================================================
         CREATE FORM DATA
      ================================================= */

      const data = new FormData();

      data.append("departmentId", department._id);

      data.append("name", formData.name.trim());

      data.append("designation", formData.designation.trim());

      data.append("qualification", formData.qualification.trim());

      data.append("experience", formData.experience.trim());

      data.append("specialization", formData.specialization.trim());

      data.append("description", formData.description.trim());

      data.append("email", formData.email.trim());

      data.append("phone", formData.phone.trim());

      data.append("linkedinUrl", formData.linkedinUrl.trim());

      data.append("isHOD", String(formData.isHOD));

      data.append("priority", String(Number(formData.priority) || 1));

      data.append("status", formData.status);

      /* =================================================
         PHOTO
         ONLY SEND WHEN NEW PHOTO SELECTED
      ================================================= */

      if (formData.photoFile) {
        data.append("photo", formData.photoFile);
      }

      /* =================================================
         API URL
      ================================================= */

      const url = isEditMode
        ? `${API_URL}/department-faculty/${id}`
        : `${API_URL}/department-faculty`;

      const method = isEditMode ? "PUT" : "POST";

      /* =================================================
         SEND REQUEST
      ================================================= */

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),

        /*
          DO NOT SET CONTENT-TYPE MANUALLY HERE.

          Because this request uses FormData, the browser automatically
          creates the correct multipart/form-data boundary.
        */
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save faculty");
      }

      /* =================================================
         SUCCESS
      ================================================= */

      setMessage(result.message || "Faculty saved successfully");

      setTimeout(() => {
        navigate(`/imsec-control-center/departments/${slug}/faculty`);
      }, 700);
    } catch (err) {
      console.error("Save Faculty Error:", err);

      setError(err.message || "Failed to save faculty");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     PHOTO PREVIEW URL
  ===================================================== */

  const photoPreview = formData.photoFile
    ? URL.createObjectURL(formData.photoFile)
    : formData.photo;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="department-faculty-form-page">
        <div className="faculty-form-loading">Loading Faculty Form...</div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (!department) {
    return (
      <div className="department-faculty-form-page">
        <div className="faculty-form-error">
          {error || "Department not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="department-faculty-form-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="faculty-form-header">
        <button
          type="button"
          className="faculty-form-back"
          onClick={() =>
            navigate(`/imsec-control-center/departments/${slug}/faculty`)
          }
        >
          <FaArrowLeft />
          Back to Faculty
        </button>

        <div className="faculty-form-heading">
          <div className="faculty-form-icon">
            <FaUserTie />
          </div>

          <div>
            <span>{department.name}</span>

            <h1>{isEditMode ? "Edit Faculty" : "Add Faculty"}</h1>

            <p>
              {isEditMode
                ? "Update faculty member information."
                : "Add a new faculty member to this department."}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form className="faculty-form" onSubmit={handleSubmit}>
        {/* ===============================================
            BASIC INFORMATION
        =============================================== */}

        <div className="faculty-form-card">
          <div className="faculty-form-card-header">
            <span>BASIC INFORMATION</span>

            <h2>Faculty Details</h2>
          </div>

          <div className="faculty-form-grid">
            {/* NAME */}

            <div className="faculty-form-group full">
              <label>
                Faculty Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter faculty name"
                required
              />
            </div>

            {/* DESIGNATION */}

            <div className="faculty-form-group">
              <label>
                Designation
                <span>*</span>
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Professor / Associate Professor / Assistant Professor"
                required
              />
            </div>

            {/* QUALIFICATION */}

            <div className="faculty-form-group">
              <label>Qualification</label>

              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Ph.D., M.Tech, MCA"
              />
            </div>

            {/* EXPERIENCE */}

            <div className="faculty-form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="10 Years"
              />
            </div>

            {/* SPECIALIZATION */}

            <div className="faculty-form-group">
              <label>Specialization</label>

              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Artificial Intelligence"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="faculty-form-group full">
              <label>Profile / Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter faculty profile"
              />
            </div>
          </div>
        </div>

        {/* ===============================================
            CONTACT
        =============================================== */}

        <div className="faculty-form-card">
          <div className="faculty-form-card-header">
            <span>CONTACT INFORMATION</span>

            <h2>Contact Details</h2>
          </div>

          <div className="faculty-form-grid">
            {/* EMAIL */}

            <div className="faculty-form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="faculty@imsec.ac.in"
              />
            </div>

            {/* PHONE */}

            <div className="faculty-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            {/* LINKEDIN */}

            <div className="faculty-form-group full">
              <label>LinkedIn Profile URL</label>

              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/example"
              />

              <small>
                Optional — leave blank if the faculty member does not have a
                LinkedIn profile.
              </small>
            </div>
          </div>
        </div>

        {/* ===============================================
            PHOTO
        =============================================== */}

        <div className="faculty-form-card">
          <div className="faculty-form-card-header">
            <span>PROFILE PHOTO</span>

            <h2>Faculty Photo</h2>
          </div>

          <div className="faculty-form-grid">
            <div className="faculty-form-group full">
              <label>Upload Faculty Photo</label>

              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />

              <small>JPG, PNG or WEBP only. Maximum size 5 MB.</small>
            </div>

            {/* EXISTING / NEW PREVIEW */}

            {photoPreview && (
              <div className="faculty-photo-preview">
                <img src={photoPreview} alt="Faculty Preview" />
              </div>
            )}
          </div>
        </div>

        {/* ===============================================
            ADMIN SETTINGS
        =============================================== */}

        <div className="faculty-form-card">
          <div className="faculty-form-card-header">
            <span>ADMIN SETTINGS</span>

            <h2>Display & Status</h2>
          </div>

          <div className="faculty-form-grid">
            {/* HOD */}

            <div className="faculty-checkbox-group">
              <label className="faculty-checkbox-label">
                <input
                  type="checkbox"
                  name="isHOD"
                  checked={formData.isHOD}
                  onChange={handleChange}
                />

                <span>Mark as Head of Department</span>
              </label>

              <small>Only one faculty member can be HOD of a department.</small>
            </div>

            {/* PRIORITY */}

            <div className="faculty-form-group">
              <label>Display Priority</label>

              <input
                type="number"
                name="priority"
                min="1"
                value={formData.priority}
                onChange={handleChange}
              />
            </div>

            {/* STATUS */}

            <div className="faculty-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===============================================
            MESSAGES
        =============================================== */}

        {error && <div className="faculty-form-error">{error}</div>}

        {message && <div className="faculty-form-success">{message}</div>}

        {/* ===============================================
            ACTIONS
        =============================================== */}

        <div className="faculty-form-actions">
          <button
            type="button"
            className="faculty-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}/faculty`)
            }
          >
            Cancel
          </button>

          <button type="submit" className="faculty-save-btn" disabled={saving}>
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Faculty"
                : "Save Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentFacultyForm;
