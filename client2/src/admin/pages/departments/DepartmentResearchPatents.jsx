import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

import {
  getDepartmentResearchPatents,
  deleteDepartmentResearchPatent,
} from "../../services/departmentResearchPatentService";

import "./department-research-patents.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchPatents = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [department, setDepartment] = useState(null);
  const [patents, setPatents] = useState([]);
  const [filteredPatents, setFilteredPatents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================================
     FETCH DEPARTMENT
     ========================================================= */

  const fetchDepartment = async () => {
    try {
      const response = await fetch(
        `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch department");
      }

      return result?.data;
    } catch (error) {
      console.error("Department fetch error:", error);
      throw error;
    }
  };

  /* =========================================================
     FETCH PATENTS
     ========================================================= */

  const fetchPatents = async (departmentId) => {
    try {
      setLoading(true);
      setError("");

      const result = await getDepartmentResearchPatents(departmentId);

      const data = result?.data || [];

      setPatents(data);
      setFilteredPatents(data);
    } catch (error) {
      console.error("Patent fetch error:", error);

      setError(error?.message || "Failed to load research patents");
    } finally {
      setLoading(false);
    }
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

        await fetchPatents(departmentData._id);
      } catch (error) {
        console.error("Load error:", error);

        setError(error?.message || "Failed to load patent information");

        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =========================================================
     SEARCH
     ========================================================= */

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredPatents(patents);
      return;
    }

    const filtered = patents.filter((patent) => {
      return (
        patent?.title?.toLowerCase().includes(term) ||
        patent?.inventors?.toLowerCase().includes(term) ||
        patent?.patentNumber?.toLowerCase().includes(term) ||
        patent?.applicationNumber?.toLowerCase().includes(term) ||
        patent?.year?.toString().toLowerCase().includes(term)
      );
    });

    setFilteredPatents(filtered);
  }, [searchTerm, patents]);

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patent?",
    );

    if (!confirmed) return;

    try {
      await deleteDepartmentResearchPatent(id);

      setPatents((prev) => prev.filter((item) => item._id !== id));

      setFilteredPatents((prev) => prev.filter((item) => item._id !== id));

      alert("Patent deleted successfully.");
    } catch (error) {
      console.error("Delete patent error:", error);

      alert(error?.message || "Failed to delete patent.");
    }
  };

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/patents/add`,
    );
  };

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/patents/edit/${id}`,
    );
  };

  const handleBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(slug)}/research`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="department-research-patents-page">
        <div className="drp-loading">
          <div className="drp-spinner"></div>
          <p>Loading research patents...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="department-research-patents-page">
        <div className="drp-error">
          <h3>Unable to Load Patents</h3>
          <p>{error}</p>

          <button type="button" className="drp-back-btn" onClick={handleBack}>
            <FaArrowLeft />
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     SUMMARY
     ========================================================= */

  const totalPatents = patents.length;

  const activePatents = patents.filter((item) => item.isActive).length;

  const inactivePatents = totalPatents - activePatents;

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="department-research-patents-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="drp-header">
        <div className="drp-header-left">
          <button
            type="button"
            className="drp-icon-back"
            onClick={handleBack}
            title="Back to Research"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="drp-breadcrumb">
              Department / Research / Patents
            </div>

            <h1>Research Patents</h1>

            <p>
              {department?.name || department?.departmentName || "Department"} —
              Manage research patents
            </p>
          </div>
        </div>

        <button type="button" className="drp-add-btn" onClick={handleAdd}>
          <FaPlus />
          Add Patent
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="drp-summary">
        <div className="drp-summary-card">
          <div className="drp-summary-content">
            <span>Total Patents</span>
            <strong>{totalPatents}</strong>
          </div>
        </div>

        <div className="drp-summary-card">
          <div className="drp-summary-content">
            <span>Active</span>
            <strong>{activePatents}</strong>
          </div>
        </div>

        <div className="drp-summary-card">
          <div className="drp-summary-content">
            <span>Inactive</span>
            <strong>{inactivePatents}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="drp-toolbar">
        <div className="drp-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search patents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="drp-table-card">
        <div className="drp-table-header">
          <div>
            <h2>Patent Records</h2>
            <span>
              {filteredPatents.length} record
              {filteredPatents.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {filteredPatents.length === 0 ? (
          <div className="drp-empty">
            <div className="drp-empty-icon">
              <FaEye />
            </div>

            <h3>{searchTerm ? "No patents found" : "No patent records yet"}</h3>

            <p>
              {searchTerm
                ? "Try changing your search term."
                : "Add the first research patent for this department."}
            </p>

            {!searchTerm && (
              <button type="button" className="drp-add-btn" onClick={handleAdd}>
                <FaPlus />
                Add Patent
              </button>
            )}
          </div>
        ) : (
          <div className="drp-table-wrapper">
            <table className="drp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Inventors</th>
                  <th>Patent Number</th>
                  <th>Application Number</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatents.map((patent, index) => (
                  <tr key={patent._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="drp-title-cell">
                        {patent.image && (
                          <img src={patent.image} alt={patent.title} />
                        )}

                        <div>
                          <strong>{patent.title || "Untitled Patent"}</strong>

                          {patent.description && (
                            <small>
                              {patent.description.length > 90
                                ? `${patent.description.slice(0, 90)}...`
                                : patent.description}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{patent.inventors || "—"}</td>

                    <td>{patent.patentNumber || "—"}</td>

                    <td>{patent.applicationNumber || "—"}</td>

                    <td>{patent.year || "—"}</td>

                    <td>
                      <span
                        className={`drp-status ${
                          patent.isActive ? "active" : "inactive"
                        }`}
                      >
                        {patent.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="drp-actions">
                        {patent.url && (
                          <a
                            href={patent.url}
                            target="_blank"
                            rel="noreferrer"
                            className="drp-action-btn view"
                            title="View Patent"
                          >
                            <FaEye />
                          </a>
                        )}

                        <button
                          type="button"
                          className="drp-action-btn edit"
                          onClick={() => handleEdit(patent._id)}
                          title="Edit Patent"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="drp-action-btn delete"
                          onClick={() => handleDelete(patent._id)}
                          title="Delete Patent"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentResearchPatents;
