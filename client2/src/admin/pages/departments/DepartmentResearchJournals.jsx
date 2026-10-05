import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaFlask,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getDepartmentResearchJournals,
  deleteDepartmentResearchJournal,
} from "../../services/departmentResearchJournalService";

import "./department-research-journals.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchJournals = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [journals, setJournals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + JOURNALS
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
           Get department journals
           ----------------------------------------------- */

        const journalResult = await getDepartmentResearchJournals(
          departmentData._id,
        );

        setJournals(journalResult?.data || []);
      } catch (err) {
        console.error("Error loading department research journals:", err);

        setError(err.message || "Failed to load research journals");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =========================================================
     DELETE JOURNAL
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this research journal?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteDepartmentResearchJournal(id);

      setJournals((prev) => prev.filter((journal) => journal._id !== id));
    } catch (err) {
      console.error("Error deleting research journal:", err);

      alert(err.message || "Failed to delete research journal");
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
      )}/research/journals/add`,
    );
  };

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/journals/edit/${id}`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-journals-page">
        <div className="drj-loading">
          <div className="drj-spinner"></div>
          <h3>Loading Research Journals...</h3>
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
      <div className="department-research-journals-page">
        <div className="drj-error">
          <h3>Unable to Load Research Journals</h3>

          <p>{error}</p>

          <button type="button" className="drj-back-btn" onClick={goBack}>
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
    <div className="department-research-journals-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drj-header">
        <div className="drj-header-left">
          <button
            type="button"
            className="drj-back-icon-btn"
            onClick={goBack}
            title="Back to Research"
          >
            <FaArrowLeft />
          </button>

          <div className="drj-title-icon">
            <FaFlask />
          </div>

          <div>
            <h1>Research Journals</h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>

        <button type="button" className="drj-add-btn" onClick={handleAdd}>
          <FaPlus />
          Add Journal
        </button>
      </div>

      {/* =====================================================
          DEPARTMENT INFO
          ===================================================== */}

      <div className="drj-department-card">
        <div>
          <span className="drj-label">Department</span>

          <h2>{department?.name || "Department"}</h2>
        </div>

        <div className="drj-count-box">
          <strong>{journals.length}</strong>
          <span>{journals.length === 1 ? "Journal" : "Journals"}</span>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {journals.length === 0 ? (
        <div className="drj-empty">
          <div className="drj-empty-icon">
            <FaFlask />
          </div>

          <h2>No Research Journals Found</h2>

          <p>No research journals have been added for this department yet.</p>

          <button type="button" className="drj-add-btn" onClick={handleAdd}>
            <FaPlus />
            Add First Journal
          </button>
        </div>
      ) : (
        /* ===================================================
           JOURNAL TABLE
           =================================================== */

        <div className="drj-table-card">
          <div className="drj-table-wrapper">
            <table className="drj-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Journal</th>
                  <th>Publisher</th>
                  <th>ISSN</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {journals.map((journal, index) => (
                  <tr key={journal._id}>
                    {/* Sr */}
                    <td>
                      <span className="drj-number">{index + 1}</span>
                    </td>

                    {/* Journal */}
                    <td>
                      <div className="drj-journal-info">
                        {journal.image ? (
                          <img
                            src={journal.image}
                            alt={journal.title}
                            className="drj-journal-image"
                          />
                        ) : (
                          <div className="drj-journal-placeholder">
                            <FaFlask />
                          </div>
                        )}

                        <div>
                          <strong>{journal.title}</strong>

                          {journal.journalName && (
                            <small>{journal.journalName}</small>
                          )}

                          {journal.description && <p>{journal.description}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Publisher */}
                    <td>{journal.publisher || "—"}</td>

                    {/* ISSN */}
                    <td>{journal.issn || "—"}</td>

                    {/* Year */}
                    <td>{journal.year || "—"}</td>

                    {/* Status */}
                    <td>
                      {journal.isActive ? (
                        <span className="drj-status active">
                          <FaCheckCircle />
                          Active
                        </span>
                      ) : (
                        <span className="drj-status inactive">
                          <FaTimesCircle />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Order */}
                    <td>{journal.order ?? 0}</td>

                    {/* Actions */}
                    <td>
                      <div className="drj-actions">
                        <button
                          type="button"
                          className="drj-edit-btn"
                          onClick={() => handleEdit(journal._id)}
                          title="Edit Journal"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="drj-delete-btn"
                          onClick={() => handleDelete(journal._id)}
                          disabled={deletingId === journal._id}
                          title="Delete Journal"
                        >
                          {deletingId === journal._id ? (
                            <span className="drj-mini-spinner"></span>
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

export default DepartmentResearchJournals;
