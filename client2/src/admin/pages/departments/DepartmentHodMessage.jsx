import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaUserTie,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import "./department-hod-message.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

/* =========================================================
   COMPONENT
========================================================= */

const DepartmentHodMessage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { admin, isSubAdmin } = useAuth();

  const [department, setDepartment] = useState(null);

  const [hodMessage, setHodMessage] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     SUB ADMIN PERMISSION
  ===================================================== */

  const departmentPermission = isSubAdmin
    ? admin?.permissions?.departments?.find(
        (item) =>
          String(item?.slug || "").toLowerCase() ===
            String(slug || "").toLowerCase() ||
          String(item?.departmentId || "") === String(slug || ""),
      )
    : null;

  const overviewPermission = departmentPermission?.modules?.find(
    (module) => module?.key === "overview",
  );

  const canManageHodMessage = !isSubAdmin
    ? true
    : Boolean(
        departmentPermission &&
        (overviewPermission?.enabled === true ||
          overviewPermission?.subModules?.some(
            (subModule) =>
              subModule?.key === "hod-message" && subModule?.enabled === true,
          )),
      );

  /* =====================================================
     LOAD DEPARTMENT + HOD MESSAGE
  ===================================================== */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!slug) {
        throw new Error("Department slug is missing from the URL");
      }

      /* ===============================================
         GET DEPARTMENT BY SLUG
      =============================================== */

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${encodeURIComponent(slug.trim())}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;

      /* ===============================================
         CHECK DEPARTMENT DATA
      =============================================== */

      if (!departmentData?._id) {
        throw new Error("Department data not found");
      }

      setDepartment(departmentData);

      /* ===============================================
         GET HOD MESSAGE
      =============================================== */

      const hodResponse = await fetch(
        `${API_URL}/department-hod-message/department/${departmentData._id}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const hodResult = await hodResponse.json();

      /*
        404 means department exists,
        but HOD message has not been created yet.
      */

      if (hodResponse.status === 404) {
        setHodMessage(null);
        return;
      }

      if (!hodResponse.ok) {
        throw new Error(hodResult.message || "Failed to fetch HOD message");
      }

      setHodMessage(hodResult.data);
    } catch (err) {
      console.error("Load HOD Message Error:", err);

      setError(err.message || "Failed to load HOD message");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD WHEN SLUG CHANGES
  ===================================================== */

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =====================================================
     DELETE HOD MESSAGE
  ===================================================== */

  const handleDelete = async () => {
    if (!canManageHodMessage) {
      alert("You do not have permission to delete the HOD message.");
      return;
    }

    if (!hodMessage?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the HOD message?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/department-hod-message/${hodMessage._id}`,
        {
          method: "DELETE",

          /* IMPORTANT */
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete HOD message");
      }

      setHodMessage(null);
    } catch (err) {
      console.error("Delete HOD Message Error:", err);

      alert(err.message || "Failed to delete HOD message");
    }
  };

  /* =====================================================
     NAVIGATION HELPERS
  ===================================================== */

  const handleAdd = () => {
    if (!canManageHodMessage) {
      return;
    }

    navigate(`/imsec-control-center/departments/${slug}/hod-message/add`);
  };

  const handleEdit = () => {
    if (!canManageHodMessage || !hodMessage?._id) {
      return;
    }

    navigate(
      `/imsec-control-center/departments/${slug}/hod-message/edit/${hodMessage._id}`,
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="department-hod-message-page">
        <div className="hod-message-loading">Loading HOD Message...</div>
      </div>
    );
  }

  /* =====================================================
     ACCESS DENIED
  ===================================================== */

  if (isSubAdmin && !canManageHodMessage) {
    return (
      <div className="department-hod-message-page">
        <div
          className="hod-message-error"
          style={{
            textAlign: "center",
            padding: "50px 25px",
          }}
        >
          <FaLock
            style={{
              fontSize: "42px",
              marginBottom: "15px",
            }}
          />

          <h3>Access Denied</h3>

          <p>
            You do not have permission to manage the HOD's Message for this
            department.
          </p>

          <p
            style={{
              fontSize: "13px",
              opacity: 0.75,
              marginTop: "8px",
            }}
          >
            Please contact the administrator if you need access.
          </p>

          <button
            type="button"
            className="hod-message-back"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
            style={{
              marginTop: "20px",
            }}
          >
            <FaArrowLeft />
            Back to Department
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !department) {
    return (
      <div className="department-hod-message-page">
        <div className="hod-message-error">
          <h3>Unable to Load Department</h3>

          <p>{error}</p>

          <p
            style={{
              marginTop: "10px",
              fontSize: "12px",
            }}
          >
            Slug received: <strong>{slug || "Not available"}</strong>
          </p>

          <button
            type="button"
            className="hod-message-back"
            onClick={() => navigate("/imsec-control-center/departments")}
          >
            <FaArrowLeft />
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="department-hod-message-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="hod-message-header">
        <button
          type="button"
          className="hod-message-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="hod-message-heading">
          <div className="hod-message-heading-content">
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{department?.name} — HOD's Message</h1>

            <p>Manage the message from the Head of Department.</p>
          </div>

          {/* ============================================
              ADD BUTTON
          ============================================ */}

          {!hodMessage && canManageHodMessage && (
            <button
              type="button"
              className="hod-message-add-btn"
              onClick={handleAdd}
            >
              <FaPlus />
              Add HOD Message
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="hod-message-card">
        <div className="hod-message-card-header">
          <div>
            <span>HOD MESSAGE</span>

            <h2>Message from the Head</h2>
          </div>

          {hodMessage && (
            <span
              className={`hod-message-status ${
                hodMessage.status === "Active" ? "active" : "inactive"
              }`}
            >
              {hodMessage.status}
            </span>
          )}
        </div>

        {/* =================================================
            NO MESSAGE
        ================================================= */}

        {!hodMessage ? (
          <div className="hod-message-empty">
            <FaUserTie />

            <h3>No HOD Message Added</h3>

            <p>Create a message from the current Head of Department.</p>

            {canManageHodMessage && (
              <button type="button" onClick={handleAdd}>
                <FaPlus />
                Add HOD Message
              </button>
            )}
          </div>
        ) : (
          <div className="hod-message-content">
            {/* =========================================
                HOD PROFILE
            ========================================= */}

            <div className="hod-profile">
              {hodMessage.facultyId?.photo ? (
                <img
                  src={
                    typeof hodMessage.facultyId.photo === "string"
                      ? hodMessage.facultyId.photo
                      : hodMessage.facultyId.photo?.url
                  }
                  alt={hodMessage.facultyId?.name || "HOD"}
                />
              ) : (
                <div className="hod-profile-placeholder">
                  <FaUserTie />
                </div>
              )}

              <div>
                <h3>{hodMessage.facultyId?.name}</h3>

                <p>{hodMessage.facultyId?.designation}</p>

                {hodMessage.facultyId?.qualification && (
                  <small>{hodMessage.facultyId.qualification}</small>
                )}
              </div>
            </div>

            {/* =========================================
                MESSAGE
            ========================================= */}

            <div className="hod-message-text">
              <h3>
                {hodMessage.title || "Message from the Head of Department"}
              </h3>

              <div>
                {hodMessage.message
                  ?.split("\n")
                  .map(
                    (paragraph, index) =>
                      paragraph.trim() && <p key={index}>{paragraph}</p>,
                  )}
              </div>
            </div>

            {/* =========================================
                ACTIONS
            ========================================= */}

            {canManageHodMessage && (
              <div className="hod-message-actions">
                <button
                  type="button"
                  className="hod-edit-btn"
                  onClick={handleEdit}
                >
                  <FaEdit />
                  Edit Message
                </button>

                <button
                  type="button"
                  className="hod-delete-btn"
                  onClick={handleDelete}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            )}

            {/* =========================================
                READ ONLY MESSAGE
            ========================================= */}

            {isSubAdmin && !canManageHodMessage && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaLock />
                You have read-only access to this HOD message.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentHodMessage;
