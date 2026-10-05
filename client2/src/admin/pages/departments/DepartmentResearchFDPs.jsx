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
  getDepartmentResearchFDPs,
  deleteDepartmentResearchFDP,
} from "../../services/departmentResearchFDPService";

import "./department-research-fdps.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchFDPs = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [department, setDepartment] = useState(null);
  const [fdps, setFdps] = useState([]);
  const [filteredFdps, setFilteredFdps] = useState([]);

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
     FETCH FDPs
     ========================================================= */

  const fetchFDPs = async (departmentId) => {
    try {
      setLoading(true);
      setError("");

      const result = await getDepartmentResearchFDPs(departmentId);

      const data = result?.data || [];

      setFdps(data);
      setFilteredFdps(data);
    } catch (error) {
      console.error("FDP fetch error:", error);

      setError(error?.message || "Failed to load research FDPs");
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

        await fetchFDPs(departmentData._id);
      } catch (error) {
        console.error("Load error:", error);

        setError(error?.message || "Failed to load FDP information");

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
      setFilteredFdps(fdps);
      return;
    }

    const filtered = fdps.filter((fdp) => {
      return (
        fdp?.title?.toLowerCase().includes(term) ||
        fdp?.coordinator?.toLowerCase().includes(term) ||
        fdp?.organizer?.toLowerCase().includes(term) ||
        fdp?.venue?.toLowerCase().includes(term) ||
        fdp?.mode?.toLowerCase().includes(term) ||
        fdp?.year?.toString().toLowerCase().includes(term)
      );
    });

    setFilteredFdps(filtered);
  }, [searchTerm, fdps]);

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FDP?",
    );

    if (!confirmed) return;

    try {
      await deleteDepartmentResearchFDP(id);

      setFdps((prev) => prev.filter((item) => item._id !== id));

      setFilteredFdps((prev) => prev.filter((item) => item._id !== id));

      alert("FDP deleted successfully.");
    } catch (error) {
      console.error("Delete FDP error:", error);

      alert(error?.message || "Failed to delete FDP.");
    }
  };

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/fdps/add`,
    );
  };

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/fdps/edit/${id}`,
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
      <div className="department-research-fdps-page">
        <div className="drf-loading">
          <div className="drf-spinner"></div>
          <p>Loading research FDPs...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="department-research-fdps-page">
        <div className="drf-error">
          <h3>Unable to Load FDPs</h3>
          <p>{error}</p>

          <button type="button" className="drf-back-btn" onClick={handleBack}>
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

  const totalFDPs = fdps.length;

  const activeFDPs = fdps.filter((item) => item.isActive).length;

  const inactiveFDPs = totalFDPs - activeFDPs;

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="department-research-fdps-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="drf-header">
        <div className="drf-header-left">
          <button
            type="button"
            className="drf-icon-back"
            onClick={handleBack}
            title="Back to Research"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="drf-breadcrumb">Department / Research / FDPs</div>

            <h1>Faculty Development Programmes</h1>

            <p>
              {department?.name || department?.departmentName || "Department"} —
              Manage faculty development programmes
            </p>
          </div>
        </div>

        <button type="button" className="drf-add-btn" onClick={handleAdd}>
          <FaPlus />
          Add FDP
        </button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="drf-summary">
        <div className="drf-summary-card">
          <div className="drf-summary-content">
            <span>Total FDPs</span>
            <strong>{totalFDPs}</strong>
          </div>
        </div>

        <div className="drf-summary-card">
          <div className="drf-summary-content">
            <span>Active</span>
            <strong>{activeFDPs}</strong>
          </div>
        </div>

        <div className="drf-summary-card">
          <div className="drf-summary-content">
            <span>Inactive</span>
            <strong>{inactiveFDPs}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="drf-toolbar">
        <div className="drf-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search FDPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="drf-table-card">
        <div className="drf-table-header">
          <div>
            <h2>FDP Records</h2>

            <span>
              {filteredFdps.length} record
              {filteredFdps.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {filteredFdps.length === 0 ? (
          <div className="drf-empty">
            <div className="drf-empty-icon">
              <FaEye />
            </div>

            <h3>{searchTerm ? "No FDPs found" : "No FDP records yet"}</h3>

            <p>
              {searchTerm
                ? "Try changing your search term."
                : "Add the first faculty development programme for this department."}
            </p>

            {!searchTerm && (
              <button type="button" className="drf-add-btn" onClick={handleAdd}>
                <FaPlus />
                Add FDP
              </button>
            )}
          </div>
        ) : (
          <div className="drf-table-wrapper">
            <table className="drf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Programme</th>
                  <th>Coordinator</th>
                  <th>Organizer</th>
                  <th>Venue</th>
                  <th>Dates</th>
                  <th>Mode</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredFdps.map((fdp, index) => (
                  <tr key={fdp._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="drf-title-cell">
                        {fdp.image && <img src={fdp.image} alt={fdp.title} />}

                        <div>
                          <strong>{fdp.title || "Untitled FDP"}</strong>

                          {fdp.description && (
                            <small>
                              {fdp.description.length > 80
                                ? `${fdp.description.slice(0, 80)}...`
                                : fdp.description}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{fdp.coordinator || "—"}</td>

                    <td>{fdp.organizer || "—"}</td>

                    <td>{fdp.venue || "—"}</td>

                    <td>
                      {fdp.startDate || fdp.endDate ? (
                        <div className="drf-date-cell">
                          <span>{fdp.startDate || "—"}</span>

                          {fdp.endDate && <span>to {fdp.endDate}</span>}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>{fdp.mode || "—"}</td>

                    <td>{fdp.year || "—"}</td>

                    <td>
                      <span
                        className={`drf-status ${
                          fdp.isActive ? "active" : "inactive"
                        }`}
                      >
                        {fdp.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="drf-actions">
                        {fdp.url && (
                          <a
                            href={fdp.url}
                            target="_blank"
                            rel="noreferrer"
                            className="drf-action-btn view"
                            title="View FDP"
                          >
                            <FaEye />
                          </a>
                        )}

                        {fdp.documentUrl && (
                          <a
                            href={fdp.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="drf-action-btn document"
                            title="View Document"
                          >
                            <FaEye />
                          </a>
                        )}

                        <button
                          type="button"
                          className="drf-action-btn edit"
                          onClick={() => handleEdit(fdp._id)}
                          title="Edit FDP"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="drf-action-btn delete"
                          onClick={() => handleDelete(fdp._id)}
                          title="Delete FDP"
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

export default DepartmentResearchFDPs;
