import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLinkedin,
  FaUserTie,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import "./department-faculty.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =====================================================
   AUTH CONFIG
===================================================== */

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

/* =====================================================
   COMPONENT
===================================================== */

const DepartmentFaculty = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { admin } = useAuth();

  const isSubAdmin = admin?.role === "Sub Admin";

  const [department, setDepartment] = useState(null);
  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     DEPARTMENT PERMISSION
  ===================================================== */

  const departmentPermission = useMemo(() => {
    if (!isSubAdmin) {
      return null;
    }

    const departments = Array.isArray(admin?.permissions?.departments)
      ? admin.permissions.departments
      : [];

    return (
      departments.find(
        (item) =>
          item?.slug?.toLowerCase() === slug?.toLowerCase() ||
          item?.departmentId === slug ||
          item?._id === slug,
      ) || null
    );
  }, [admin, isSubAdmin, slug]);

  /* =====================================================
     FACULTY MODULE PERMISSION

     IMPORTANT:
     Do NOT require departmentPermission.enabled here.

     Example:
       Department enabled = false
       Faculty module = false
       Faculty List = true

     Faculty List should still be accessible.
  ===================================================== */

  const facultyPermission = useMemo(() => {
    if (!isSubAdmin) {
      return null;
    }

    if (!departmentPermission) {
      return null;
    }

    const modules = Array.isArray(departmentPermission.modules)
      ? departmentPermission.modules
      : [];

    return modules.find((item) => item?.key === "faculty") || null;
  }, [departmentPermission, isSubAdmin]);

  /* =====================================================
     FACULTY LIST PERMISSION
  ===================================================== */

  const canManageFacultyList = useMemo(() => {
    /* Main Admin */
    if (!isSubAdmin) {
      return true;
    }

    if (!facultyPermission) {
      return false;
    }

    /*
      If complete Faculty module is enabled,
      allow Faculty List.
    */
    if (facultyPermission.enabled === true) {
      return true;
    }

    /*
      Otherwise check Faculty List sub-module.
    */
    const subModules = Array.isArray(facultyPermission.subModules)
      ? facultyPermission.subModules
      : [];

    return subModules.some(
      (item) => item?.key === "faculty-list" && item?.enabled === true,
    );
  }, [facultyPermission, isSubAdmin]);

  /* =====================================================
     FACULTY ACHIEVEMENT PERMISSION
  ===================================================== */

  const canManageFacultyAchievements = useMemo(() => {
    /* Main Admin */
    if (!isSubAdmin) {
      return true;
    }

    if (!facultyPermission) {
      return false;
    }

    /*
      Complete Faculty module enabled
    */
    if (facultyPermission.enabled === true) {
      return true;
    }

    /*
      Faculty Achievements is a SUB-MODULE
      of the Faculty module.

      Correct structure:

      faculty
        ├── faculty-list
        └── faculty-achievements
    */
    const subModules = Array.isArray(facultyPermission.subModules)
      ? facultyPermission.subModules
      : [];

    return subModules.some(
      (item) => item?.key === "faculty-achievements" && item?.enabled === true,
    );
  }, [facultyPermission, isSubAdmin]);

  /* =====================================================
     LOAD DEPARTMENT + FACULTY
  ===================================================== */

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError("");

      /* ---------------------------------------------
         GET DEPARTMENT
      --------------------------------------------- */

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${slug}`,
        getAuthConfig(),
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;

      setDepartment(departmentData);

      /* ---------------------------------------------
         GET FACULTY
      --------------------------------------------- */

      const facultyResponse = await fetch(
        `${API_URL}/department-faculty/department/${departmentData._id}`,
        getAuthConfig(),
      );

      const facultyResult = await facultyResponse.json();

      if (!facultyResponse.ok) {
        throw new Error(facultyResult.message || "Failed to fetch faculty");
      }

      const facultyData = Array.isArray(facultyResult?.data)
        ? facultyResult.data
        : Array.isArray(facultyResult)
          ? facultyResult
          : [];

      setFaculty(facultyData);
    } catch (err) {
      console.error("Load Faculty Error:", err);

      setError(err.message || "Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    if (slug) {
      loadFaculty();
    }
  }, [slug]);

  /* =====================================================
     DELETE FACULTY
  ===================================================== */

  const handleDelete = async (id) => {
    if (!canManageFacultyList) {
      navigate("/imsec-control-center/access-denied");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty member?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/department-faculty/${id}`, {
        method: "DELETE",
        ...getAuthConfig(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete faculty");
      }

      loadFaculty();
    } catch (err) {
      console.error("Delete Faculty Error:", err);

      alert(err.message || "Failed to delete faculty");
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="department-faculty-page">
        <div className="department-faculty-loading">Loading Faculty...</div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !department) {
    return (
      <div className="department-faculty-page">
        <div className="department-faculty-error">{error}</div>
      </div>
    );
  }

  /* =====================================================
     SUB ADMIN ACCESS CHECK

     IMPORTANT:
     Do NOT check:

       !departmentPermission?.enabled

     because a specific sub-module can be enabled
     even when the parent department/module is disabled.

     Access is determined by Faculty permissions.
  ===================================================== */

  if (isSubAdmin && !canManageFacultyList && !canManageFacultyAchievements) {
    return (
      <div className="department-faculty-page">
        <div
          style={{
            maxWidth: "600px",
            margin: "80px auto",
            padding: "45px 30px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
          }}
        >
          <FaLock
            style={{
              fontSize: "42px",
              color: "#64748b",
              marginBottom: "18px",
            }}
          />

          <h2>Access Denied</h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "25px",
            }}
          >
            Faculty management has not been assigned to your account.
          </p>

          <button
            type="button"
            className="department-faculty-back"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            <FaArrowLeft />
            Back to Department
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="department-faculty-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="department-faculty-header">
        <button
          type="button"
          className="department-faculty-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="department-faculty-heading">
          <div>
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{department?.name || "Department"} — Faculty</h1>

            <p>Manage faculty members of this department.</p>
          </div>

          {canManageFacultyList && (
            <button
              type="button"
              className="department-faculty-add-btn"
              onClick={() =>
                navigate(
                  `/imsec-control-center/departments/${slug}/faculty/add`,
                )
              }
            >
              <FaPlus />
              Add Faculty
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          FACULTY TABLE
      ================================================= */}

      {canManageFacultyList ? (
        <div className="department-faculty-card">
          <div className="department-faculty-card-header">
            <div>
              <span>FACULTY</span>

              <h2>Faculty Members</h2>
            </div>

            <div className="department-faculty-count">
              {faculty.length}{" "}
              {faculty.length === 1 ? "Faculty" : "Faculty Members"}
            </div>
          </div>

          {/* ============================================
              NO FACULTY
          ============================================ */}

          {faculty.length === 0 ? (
            <div className="department-faculty-empty">
              <FaUserTie />

              <h3>No Faculty Added</h3>

              <p>Add the first faculty member for this department.</p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/imsec-control-center/departments/${slug}/faculty/add`,
                  )
                }
              >
                <FaPlus />
                Add Faculty
              </button>
            </div>
          ) : (
            /* ==========================================
               FACULTY TABLE
            ========================================== */

            <div className="department-faculty-table-wrapper">
              <table className="department-faculty-table">
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Designation</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>HOD</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {faculty.map((member) => (
                    <tr key={member._id}>
                      {/* FACULTY */}
                      <td>
                        <div className="faculty-name-cell">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="faculty-photo"
                            />
                          ) : (
                            <div className="faculty-photo-placeholder">
                              <FaUserTie />
                            </div>
                          )}

                          <div>
                            <strong>{member.name}</strong>

                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="faculty-linkedin"
                                title="LinkedIn Profile"
                              >
                                <FaLinkedin />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DESIGNATION */}
                      <td>{member.designation || "—"}</td>

                      {/* QUALIFICATION */}
                      <td>{member.qualification || "—"}</td>

                      {/* EXPERIENCE */}
                      <td>{member.experience || "—"}</td>

                      {/* HOD */}
                      <td>
                        {member.isHOD ? (
                          <span className="faculty-hod-badge">
                            <FaUserTie />
                            HOD
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`faculty-status-badge ${
                            member.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="faculty-actions">
                          {/* EDIT */}
                          <button
                            type="button"
                            className="faculty-edit-btn"
                            title="Edit Faculty"
                            onClick={() =>
                              navigate(
                                `/imsec-control-center/departments/${slug}/faculty/edit/${member._id}`,
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="faculty-delete-btn"
                            title="Delete Faculty"
                            onClick={() => handleDelete(member._id)}
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
      ) : (
        /* =================================================
           FACULTY LIST RESTRICTED
        ================================================= */

        <div
          style={{
            maxWidth: "700px",
            margin: "60px auto",
            padding: "45px 30px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
          }}
        >
          <FaLock
            style={{
              fontSize: "40px",
              color: "#64748b",
              marginBottom: "15px",
            }}
          />

          <h2>Faculty List Access Restricted</h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            You have not been assigned permission to manage the faculty list.
          </p>

          {canManageFacultyAchievements && (
            <button
              type="button"
              className="department-faculty-back"
              onClick={() =>
                navigate(
                  `/imsec-control-center/departments/${slug}/achievements`,
                )
              }
            >
              <FaTrophyFallback />
              Go to Faculty Achievements
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* =====================================================
   TROPHY FALLBACK
===================================================== */

const FaTrophyFallback = () => <span style={{ marginRight: "6px" }}>🏆</span>;

export default DepartmentFaculty;
