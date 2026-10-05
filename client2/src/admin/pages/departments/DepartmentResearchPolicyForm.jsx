import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaFileAlt, FaSave } from "react-icons/fa";

import {
  getDepartmentResearchPolicyById,
  createDepartmentResearchPolicy,
  updateDepartmentResearchPolicy,
} from "../../services/departmentResearchPolicyService";

import "./department-research-policy-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchPolicyForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "Research Policy",
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
     FETCH EXISTING POLICY
     ========================================================= */

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const result = await getDepartmentResearchPolicyById(id);

        const data = result?.data;

        if (!data) {
          throw new Error("Research policy not found");
        }

        setFormData({
          title: data.title || "Research Policy",
          content: data.content || "",
          isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        });
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load research policy");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  /* =========================================================
     HANDLE CHANGE
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
      setError("Please enter a policy title");
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
        await updateDepartmentResearchPolicy(id, payload);
      } else {
        await createDepartmentResearchPolicy(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/research-policy`,
      );
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to save research policy");
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
      )}/research/research-policy`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-policy-form-loading">
        <div className="department-research-policy-form-loader" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="department-research-policy-form-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="department-research-policy-form-header">
        <div>
          <button
            type="button"
            className="department-research-policy-form-back"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Research Policy
          </button>

          <div className="department-research-policy-form-heading">
            <div className="department-research-policy-form-icon">
              <FaFileAlt />
            </div>

            <div>
              <span className="department-research-policy-form-label">
                {isEditMode ? "EDIT RESEARCH POLICY" : "ADD RESEARCH POLICY"}
              </span>

              <h1>
                {isEditMode ? "Edit Research Policy" : "Add Research Policy"}
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
        <div className="department-research-policy-form-error">{error}</div>
      )}

      {/* =====================================================
          FORM
          ===================================================== */}

      <form
        className="department-research-policy-form-card"
        onSubmit={handleSubmit}
      >
        <div className="department-research-policy-form-card-header">
          <div>
            <span>DEPARTMENT RESEARCH</span>
            <h2>Research Policy Information</h2>
          </div>
        </div>

        <div className="department-research-policy-form-body">
          {/* =================================================
              TITLE
              ================================================= */}

          <div className="department-research-policy-form-group">
            <label htmlFor="title">
              Title <span>*</span>
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter research policy title"
              maxLength={200}
              required
            />
          </div>

          {/* =================================================
              CONTENT
              ================================================= */}

          <div className="department-research-policy-form-group">
            <label htmlFor="content">Policy Content</label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter department research policy and guidelines..."
              rows={14}
            />

            <small>
              Enter the research policy, guidelines, procedures and other
              relevant information for the department.
            </small>
          </div>

          {/* =================================================
              STATUS
              ================================================= */}

          <label className="department-research-policy-form-checkbox">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />

            <span>
              <strong>Active</strong>

              <small>Display this research policy as active.</small>
            </span>
          </label>
        </div>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <div className="department-research-policy-form-footer">
          <button
            type="button"
            className="department-research-policy-form-cancel"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="department-research-policy-form-save"
            disabled={saving}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Policy"
                : "Save Policy"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchPolicyForm;
