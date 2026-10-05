import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getDepartmentResearchConferencePapers,
  deleteDepartmentResearchConferencePaper,
} from "../../services/departmentResearchConferencePaperService";

import "./department-research-conference-papers.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchConferencePapers = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [papers, setPapers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + CONFERENCE PAPERS
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
           Get department conference papers
           ----------------------------------------------- */

        const paperResult = await getDepartmentResearchConferencePapers(
          departmentData._id,
        );

        setPapers(paperResult?.data || []);
      } catch (err) {
        console.error("Error loading department conference papers:", err);

        setError(err.message || "Failed to load conference papers");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conference paper?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteDepartmentResearchConferencePaper(id);

      setPapers((prev) => prev.filter((paper) => paper._id !== id));
    } catch (err) {
      console.error("Error deleting conference paper:", err);

      alert(err.message || "Failed to delete conference paper");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const goBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(slug)}/research`,
    );
  };

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/conference-papers/add`,
    );
  };

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/conference-papers/edit/${id}`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-conference-page">
        <div className="drcp-loading">
          <div className="drcp-spinner"></div>

          <h3>Loading Conference Papers...</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="department-research-conference-page">
        <div className="drcp-error">
          <h3>Unable to Load Conference Papers</h3>

          <p>{error}</p>

          <button type="button" className="drcp-back-btn" onClick={goBack}>
            <FaArrowLeft />
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <div className="department-research-conference-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drcp-header">
        <div className="drcp-header-left">
          <button
            type="button"
            className="drcp-back-icon-btn"
            onClick={goBack}
            title="Back to Research"
          >
            <FaArrowLeft />
          </button>

          <div className="drcp-title-icon">
            <FaFileAlt />
          </div>

          <div>
            <h1>Conference Papers</h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>

        <button type="button" className="drcp-add-btn" onClick={handleAdd}>
          <FaPlus />
          Add Conference Paper
        </button>
      </div>

      {/* =====================================================
          DEPARTMENT CARD
          ===================================================== */}

      <div className="drcp-department-card">
        <div>
          <span className="drcp-label">Department</span>

          <h2>{department?.name || "Department"}</h2>
        </div>

        <div className="drcp-count-box">
          <strong>{papers.length}</strong>

          <span>{papers.length === 1 ? "Paper" : "Papers"}</span>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {papers.length === 0 ? (
        <div className="drcp-empty">
          <div className="drcp-empty-icon">
            <FaFileAlt />
          </div>

          <h2>No Conference Papers Found</h2>

          <p>No conference papers have been added for this department yet.</p>

          <button type="button" className="drcp-add-btn" onClick={handleAdd}>
            <FaPlus />
            Add First Paper
          </button>
        </div>
      ) : (
        /* ===================================================
           TABLE
           =================================================== */

        <div className="drcp-table-card">
          <div className="drcp-table-wrapper">
            <table className="drcp-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Conference Paper</th>
                  <th>Conference</th>
                  <th>Authors</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {papers.map((paper, index) => (
                  <tr key={paper._id}>
                    {/* Sr */}
                    <td>
                      <span className="drcp-number">{index + 1}</span>
                    </td>

                    {/* Paper */}
                    <td>
                      <div className="drcp-paper-info">
                        {paper.image ? (
                          <img
                            src={paper.image}
                            alt={paper.title}
                            className="drcp-paper-image"
                          />
                        ) : (
                          <div className="drcp-paper-placeholder">
                            <FaFileAlt />
                          </div>
                        )}

                        <div>
                          <strong>{paper.title}</strong>

                          {paper.publicationName && (
                            <small>{paper.publicationName}</small>
                          )}

                          {paper.description && <p>{paper.description}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Conference */}
                    <td>
                      <div className="drcp-conference-info">
                        <strong>{paper.conferenceName || "—"}</strong>

                        {paper.conferenceLocation && (
                          <small>{paper.conferenceLocation}</small>
                        )}

                        {paper.organizer && <small>{paper.organizer}</small>}
                      </div>
                    </td>

                    {/* Authors */}
                    <td>
                      <span className="drcp-authors">
                        {paper.authors || "—"}
                      </span>
                    </td>

                    {/* Year */}
                    <td>{paper.year || "—"}</td>

                    {/* Status */}
                    <td>
                      {paper.isActive ? (
                        <span className="drcp-status active">
                          <FaCheckCircle />
                          Active
                        </span>
                      ) : (
                        <span className="drcp-status inactive">
                          <FaTimesCircle />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Order */}
                    <td>{paper.order ?? 0}</td>

                    {/* Actions */}
                    <td>
                      <div className="drcp-actions">
                        <button
                          type="button"
                          className="drcp-edit-btn"
                          onClick={() => handleEdit(paper._id)}
                          title="Edit Conference Paper"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="drcp-delete-btn"
                          onClick={() => handleDelete(paper._id)}
                          disabled={deletingId === paper._id}
                          title="Delete Conference Paper"
                        >
                          {deletingId === paper._id ? (
                            <span className="drcp-mini-spinner"></span>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentResearchConferencePapers;
