import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaFlask, FaSave } from "react-icons/fa";

import {
  getDepartmentResearchAboutById,
  createDepartmentResearchAbout,
  updateDepartmentResearchAbout,
} from "../../services/departmentResearchAboutService";

import "./department-research-about-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchAboutForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "Research",
    content: "",
    isActive: true,
  });

  /* =========================================================
     FETCH DEPARTMENT
     ========================================================= */

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch department");
        }

        if (!result?.data?._id) {
          throw new Error("Department not found");
        }

        setDepartment(result.data);
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load department information");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDepartment();
    }
  }, [slug]);

  /* =========================================================
     FETCH EXISTING RESEARCH ABOUT
     ========================================================= */

  useEffect(() => {
    const fetchResearchAbout = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const result = await getDepartmentResearchAboutById(id);

        const data = result?.data;

        if (!data) {
          throw new Error("Research information not found");
        }

        setFormData({
          title: data.title || "Research",
          content: data.content || "",
          isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        });
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load research information");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchAbout();
  }, [id]);

  /* =========================================================
     INPUT CHANGE
     ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department?._id) {
      setError("Department information is missing");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        department: department._id,
        title: formData.title.trim(),
        content: formData.content,
        isActive: formData.isActive,
      };

      if (isEditMode) {
        await updateDepartmentResearchAbout(id, payload);
      } else {
        await createDepartmentResearchAbout(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/about`,
      );
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to save research information");
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
      )}/research/about`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-about-form-loading">
        <div className="department-research-about-form-loader" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="department-research-about-form-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="department-research-about-form-header">
        <div>
          <button
            type="button"
            className="department-research-about-form-back"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Research About
          </button>

          <div className="department-research-about-form-heading">
            <div className="department-research-about-form-icon">
              <FaFlask />
            </div>

            <div>
              <span className="department-research-about-form-label">
                {isEditMode ? "EDIT RESEARCH" : "ADD RESEARCH"}
              </span>

              <h1>
                {isEditMode ? "Edit Research About" : "Add Research About"}
              </h1>

              <p>{department?.name || "Department"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="department-research-about-form-error">{error}</div>
      )}

      {/* =====================================================
          FORM
          ===================================================== */}

      <form
        className="department-research-about-form-card"
        onSubmit={handleSubmit}
      >
        <div className="department-research-about-form-card-header">
          <div>
            <span>DEPARTMENT RESEARCH</span>

            <h2>Research Information</h2>
          </div>
        </div>

        <div className="department-research-about-form-body">
          {/* =================================================
              TITLE
              ================================================= */}

          <div className="department-research-about-form-group">
            <label htmlFor="title">
              Title <span>*</span>
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter research title"
              maxLength={200}
              required
            />
          </div>

          {/* =================================================
              CONTENT
              ================================================= */}

          <div className="department-research-about-form-group">
            <label htmlFor="content">Research Content</label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter department research information..."
              rows={14}
            />

            <small>
              Enter the research introduction, focus areas, activities and other
              relevant information.
            </small>
          </div>

          {/* =================================================
              ACTIVE STATUS
              ================================================= */}

          <label className="department-research-about-form-checkbox">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />

            <span>
              <strong>Active</strong>
              <small>Display this research information as active.</small>
            </span>
          </label>
        </div>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <div className="department-research-about-form-footer">
          <button
            type="button"
            className="department-research-about-form-cancel"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="department-research-about-form-save"
            disabled={saving}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Research"
                : "Save Research"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchAboutForm;
