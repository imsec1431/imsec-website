import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaFlask, FaPlus, FaTrash } from "react-icons/fa";

import {
  getDepartmentResearchAbout,
  deleteDepartmentResearchAbout,
} from "../../services/departmentResearchAboutService";

import "./department-research-about.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchAbout = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [department, setDepartment] = useState(null);
  const [researchAbout, setResearchAbout] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH DEPARTMENT + RESEARCH ABOUT
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

        const researchResult = await getDepartmentResearchAbout(
          departmentData._id,
        );

        setResearchAbout(researchResult?.data || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load research information");
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
    if (!researchAbout?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this Research About information?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteDepartmentResearchAbout(researchAbout._id);

      setResearchAbout(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete research information");
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
      )}/research/about/add`,
    );
  };

  const handleEdit = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/about/edit/${researchAbout._id}`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-about-loading">
        <div className="department-research-about-loader" />
        <p>Loading research information...</p>
      </div>
    );
  }

  return (
    <div className="department-research-about-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="department-research-about-header">
        <div className="department-research-about-title-section">
          <button
            type="button"
            className="department-research-about-back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Research
          </button>

          <div className="department-research-about-heading">
            <div className="department-research-about-icon">
              <FaFlask />
            </div>

            <div>
              <span className="department-research-about-label">
                DEPARTMENT RESEARCH
              </span>

              <h1>About Research</h1>

              <p>
                {department?.name || "Department"} — Research introduction and
                information
              </p>
            </div>
          </div>
        </div>

        {!researchAbout && (
          <button
            type="button"
            className="department-research-about-add-btn"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Research Information
          </button>
        )}
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && <div className="department-research-about-error">{error}</div>}

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="department-research-about-content">
        {!researchAbout ? (
          <div className="department-research-about-empty">
            <div className="department-research-about-empty-icon">
              <FaFlask />
            </div>

            <h2>No Research Information Added</h2>

            <p>
              Add the research introduction and information for this department.
            </p>

            <button
              type="button"
              className="department-research-about-empty-btn"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Research Information
            </button>
          </div>
        ) : (
          <div className="department-research-about-card">
            {/* =================================================
                CARD HEADER
                ================================================= */}

            <div className="department-research-about-card-header">
              <div>
                <span className="department-research-about-card-label">
                  RESEARCH INFORMATION
                </span>

                <h2>{researchAbout.title || "Research"}</h2>
              </div>

              <div className="department-research-about-actions">
                <button
                  type="button"
                  className="department-research-about-edit-btn"
                  onClick={handleEdit}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="department-research-about-delete-btn"
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

            <div className="department-research-about-meta">
              <span
                className={`department-research-about-status ${
                  researchAbout.isActive ? "active" : "inactive"
                }`}
              >
                {researchAbout.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* =================================================
                CONTENT
                ================================================= */}

            <div className="department-research-about-body">
              <h3>Research About</h3>

              {researchAbout.content ? (
                <div className="department-research-about-text">
                  {researchAbout.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph || "\u00A0"}</p>
                  ))}
                </div>
              ) : (
                <div className="department-research-about-no-content">
                  No research content has been added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentResearchAbout;
