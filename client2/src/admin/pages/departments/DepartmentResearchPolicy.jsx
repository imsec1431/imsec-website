import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaFileAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import {
  getDepartmentResearchPolicy,
  deleteDepartmentResearchPolicy,
} from "../../services/departmentResearchPolicyService";

import "./department-research-policy.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchPolicy = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [department, setDepartment] = useState(null);
  const [researchPolicy, setResearchPolicy] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH DEPARTMENT + RESEARCH POLICY
     ========================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

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
          throw new Error("Department information not found");
        }

        setDepartment(departmentData);

        const policyResult = await getDepartmentResearchPolicy(
          departmentData._id,
        );

        setResearchPolicy(policyResult?.data || null);
      } catch (err) {
        console.error(err);

        setError(err.message || "Failed to load research policy");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async () => {
    if (!researchPolicy?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this Research Policy?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteDepartmentResearchPolicy(researchPolicy._id);

      setResearchPolicy(null);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to delete research policy");
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const handleBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(slug)}/research`,
    );
  };

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/research-policy/add`,
    );
  };

  const handleEdit = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/research-policy/edit/${researchPolicy._id}`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-policy-loading">
        <div className="department-research-policy-loader" />
        <p>Loading research policy...</p>
      </div>
    );
  }

  return (
    <div className="department-research-policy-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="department-research-policy-header">
        <div className="department-research-policy-title-section">
          <button
            type="button"
            className="department-research-policy-back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Research
          </button>

          <div className="department-research-policy-heading">
            <div className="department-research-policy-icon">
              <FaFileAlt />
            </div>

            <div>
              <span className="department-research-policy-label">
                DEPARTMENT RESEARCH
              </span>

              <h1>Research Policy</h1>

              <p>
                {department?.name || "Department"} — Research policies and
                guidelines
              </p>
            </div>
          </div>
        </div>

        {!researchPolicy && (
          <button
            type="button"
            className="department-research-policy-add-btn"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Research Policy
          </button>
        )}
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && <div className="department-research-policy-error">{error}</div>}

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="department-research-policy-content">
        {!researchPolicy ? (
          <div className="department-research-policy-empty">
            <div className="department-research-policy-empty-icon">
              <FaFileAlt />
            </div>

            <h2>No Research Policy Added</h2>

            <p>Add the research policy and guidelines for this department.</p>

            <button
              type="button"
              className="department-research-policy-empty-btn"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Research Policy
            </button>
          </div>
        ) : (
          <div className="department-research-policy-card">
            {/* =================================================
                CARD HEADER
                ================================================= */}

            <div className="department-research-policy-card-header">
              <div>
                <span className="department-research-policy-card-label">
                  RESEARCH POLICY
                </span>

                <h2>{researchPolicy.title || "Research Policy"}</h2>
              </div>

              <div className="department-research-policy-actions">
                <button
                  type="button"
                  className="department-research-policy-edit-btn"
                  onClick={handleEdit}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="department-research-policy-delete-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <FaTrash />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {/* =================================================
                STATUS
                ================================================= */}

            <div className="department-research-policy-meta">
              <span
                className={`department-research-policy-status ${
                  researchPolicy.isActive ? "active" : "inactive"
                }`}
              >
                {researchPolicy.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* =================================================
                POLICY CONTENT
                ================================================= */}

            <div className="department-research-policy-body">
              <h3>Policy Details</h3>

              {researchPolicy.content ? (
                <div className="department-research-policy-text">
                  {researchPolicy.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph || "\u00A0"}</p>
                    ))}
                </div>
              ) : (
                <div className="department-research-policy-no-content">
                  No research policy content has been added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentResearchPolicy;
