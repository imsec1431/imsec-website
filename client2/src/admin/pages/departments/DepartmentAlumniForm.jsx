import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaUsers } from "react-icons/fa";

import {
  getDepartmentAlumniById,
  createDepartmentAlumni,
  updateDepartmentAlumni,
} from "../../services/departmentAlumniService";

import "./department-alumni-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentAlumniForm = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    company: "",
    image: "",
    publicId: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load department
  useEffect(() => {
    const loadDepartment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load department");
        }

        const departmentData = result?.data || result?.department || result;

        if (!departmentData?._id) {
          throw new Error("Department not found");
        }

        setDepartment(departmentData);
      } catch (err) {
        console.error("Department Load Error:", err);
        setError(err.message || "Failed to load department");
      }
    };

    if (slug) {
      loadDepartment();
    }
  }, [slug]);

  // Load alumni when editing
  useEffect(() => {
    const loadAlumni = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getDepartmentAlumniById(id);

        const alumniData = result?.data || result?.alumni || result;

        if (!alumniData) {
          throw new Error("Alumni record not found");
        }

        setFormData({
          name: alumniData.name || "",
          course: alumniData.course || "",
          company: alumniData.company || "",
          image: alumniData.image || "",
          publicId: alumniData.publicId || "",
          order: alumniData.order ?? 0,
          isActive:
            alumniData.isActive !== undefined ? alumniData.isActive : true,
        });
      } catch (err) {
        console.error("Alumni Load Error:", err);
        setError(err.message || "Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };

    loadAlumni();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department?._id) {
      setError("Department information is missing.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Alumni name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        department: department._id,
        name: formData.name.trim(),
        course: formData.course.trim(),
        company: formData.company.trim(),
        image: formData.image.trim(),
        publicId: formData.publicId.trim(),
        order: Number(formData.order) || 0,
        isActive: Boolean(formData.isActive),
      };

      if (isEditMode) {
        await updateDepartmentAlumni(id, payload);
      } else {
        await createDepartmentAlumni(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/alumni-section`,
      );
    } catch (err) {
      console.error("Save Alumni Error:", err);

      setError(
        err.message || `Failed to ${isEditMode ? "update" : "create"} alumni`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/alumni-section`,
    );
  };

  if (loading) {
    return (
      <div className="department-alumni-form-page">
        <div className="department-alumni-form-loading">
          <div className="department-alumni-form-loader"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-alumni-form-page">
      {/* Header */}
      <div className="department-alumni-form-header">
        <div className="department-alumni-form-heading">
          <button
            type="button"
            className="department-alumni-form-back"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="department-alumni-form-title">
            <div className="department-alumni-form-icon">
              <FaUsers />
            </div>

            <div>
              <h1>{isEditMode ? "Edit Alumni" : "Add Alumni"}</h1>

              <p>
                {department?.name || department?.departmentName || "Department"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="department-alumni-form-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      <div className="department-alumni-form-card">
        <form onSubmit={handleSubmit}>
          <div className="department-alumni-form-grid">
            {/* Name */}
            <div className="department-alumni-form-group full">
              <label htmlFor="name">
                Alumni Name <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter alumni name"
                required
              />
            </div>

            {/* Course */}
            <div className="department-alumni-form-group">
              <label htmlFor="course">Course</label>

              <input
                id="course"
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. MCA"
              />
            </div>

            {/* Company */}
            <div className="department-alumni-form-group">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            {/* Image */}
            <div className="department-alumni-form-group full">
              <label htmlFor="image">Image URL</label>

              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />

              {formData.image && (
                <div className="department-alumni-image-preview">
                  <img
                    src={formData.image}
                    alt="Alumni Preview"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Public ID */}
            <div className="department-alumni-form-group">
              <label htmlFor="publicId">Public ID</label>

              <input
                id="publicId"
                type="text"
                name="publicId"
                value={formData.publicId}
                onChange={handleChange}
                placeholder="Cloudinary Public ID"
              />
            </div>

            {/* Order */}
            <div className="department-alumni-form-group">
              <label htmlFor="order">Display Order</label>

              <input
                id="order"
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* Status */}
            <div className="department-alumni-form-group full">
              <label className="department-alumni-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <span>Active</span>
              </label>

              <small>
                Inactive alumni will not be displayed on the department website.
              </small>
            </div>
          </div>

          {/* Actions */}
          <div className="department-alumni-form-actions">
            <button
              type="button"
              className="department-alumni-cancel-btn"
              onClick={handleBack}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="department-alumni-save-btn"
              disabled={saving}
            >
              <FaSave />

              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Alumni"
                  : "Save Alumni"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentAlumniForm;
