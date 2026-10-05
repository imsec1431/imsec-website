import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaUserTie, FaLock } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import "./department-hod-message-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = (includeContentType = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* =========================================================
   COMPONENT
========================================================= */

const DepartmentHodMessageForm = () => {
  const navigate = useNavigate();
  const { slug, id } = useParams();

  const { admin, isSubAdmin } = useAuth();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [hodFaculty, setHodFaculty] = useState([]);

  const [formData, setFormData] = useState({
    facultyId: "",
    title: "Message from the Head of Department",
    message: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

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
        departmentPermission?.enabled &&
        (overviewPermission?.enabled ||
          overviewPermission?.subModules?.some(
            (subModule) =>
              subModule?.key === "hod-message" && subModule?.enabled,
          )),
      );

  /* =====================================================
     LOAD DEPARTMENT
  ===================================================== */

  const loadDepartment = async () => {
    const response = await fetch(
      `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch department");
    }

    setDepartment(result.data);

    return result.data;
  };

  /* =====================================================
     LOAD HOD FACULTY
  ===================================================== */

  const loadHodFaculty = async (departmentId) => {
    const response = await fetch(
      `${API_URL}/department-faculty/department/${departmentId}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch faculty");
    }

    const allFaculty = Array.isArray(result.data) ? result.data : [];

    /*
      Only faculty marked as HOD
      and Active are shown.
    */

    const hods = allFaculty.filter(
      (faculty) => faculty?.isHOD === true && faculty?.status === "Active",
    );

    setHodFaculty(hods);
  };

  /* =====================================================
     LOAD EXISTING MESSAGE
  ===================================================== */

  const loadExistingMessage = async (departmentId) => {
    if (!id) {
      return;
    }

    const response = await fetch(
      `${API_URL}/department-hod-message/department/${departmentId}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const result = await response.json();

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch HOD message");
    }

    const message = result.data;

    setFormData({
      facultyId: message?.facultyId?._id || message?.facultyId || "",

      title: message?.title || "Message from the Head of Department",

      message: message?.message || "",

      status: message?.status || "Active",
    });
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!slug) {
          throw new Error("Department slug is missing from the URL");
        }

        const departmentData = await loadDepartment();

        if (!departmentData?._id) {
          throw new Error("Department information is missing");
        }

        await loadHodFaculty(departmentData._id);

        if (isEditMode) {
          await loadExistingMessage(departmentData._id);
        }
      } catch (err) {
        console.error("Load HOD Form Error:", err);

        setError(err.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug, id]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -----------------------------------------------
       EXTRA SECURITY CHECK
    ----------------------------------------------- */

    if (!canManageHodMessage) {
      setError("You do not have permission to manage the HOD's Message.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!department?._id) {
        throw new Error("Department information is missing");
      }

      if (!formData.facultyId) {
        throw new Error("Please select the HOD");
      }

      if (!formData.message.trim()) {
        throw new Error("HOD message is required");
      }

      const payload = {
        departmentId: department._id,

        facultyId: formData.facultyId,

        title: formData.title.trim(),

        message: formData.message.trim(),

        status: formData.status,
      };

      const url = isEditMode
        ? `${API_URL}/department-hod-message/${id}`
        : `${API_URL}/department-hod-message`;

      const method = isEditMode ? "PUT" : "POST";

      /* =================================================
         SAVE WITH JWT
      ================================================= */

      const response = await fetch(url, {
        method,

        headers: getAuthHeaders(true),

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save HOD message");
      }

      setSuccess(result.message || "HOD message saved successfully");

      setTimeout(() => {
        navigate(`/imsec-control-center/departments/${slug}/hod-message`);
      }, 700);
    } catch (err) {
      console.error("Save HOD Message Error:", err);

      setError(err.message || "Failed to save HOD message");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="department-hod-form-page">
        <div className="hod-form-loading">Loading HOD Message Form...</div>
      </div>
    );
  }

  /* =====================================================
     ACCESS DENIED
  ===================================================== */

  if (isSubAdmin && !canManageHodMessage) {
    return (
      <div className="department-hod-form-page">
        <div
          className="hod-form-error"
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
            className="hod-form-back"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}/hod-message`)
            }
            style={{
              marginTop: "20px",
            }}
          >
            <FaArrowLeft />
            Back to HOD Message
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
      <div className="department-hod-form-page">
        <div className="hod-form-error">{error}</div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="department-hod-form-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="hod-form-header">
        <button
          type="button"
          className="hod-form-back"
          onClick={() =>
            navigate(`/imsec-control-center/departments/${slug}/hod-message`)
          }
        >
          <FaArrowLeft />
          Back to HOD Message
        </button>

        <div className="hod-form-title">
          <div className="hod-form-icon">
            <FaUserTie />
          </div>

          <div>
            <span>{department?.name}</span>

            <h1>{isEditMode ? "Edit HOD Message" : "Add HOD Message"}</h1>

            <p>Manage the message from the Head of Department.</p>
          </div>
        </div>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form className="hod-form-card" onSubmit={handleSubmit}>
        {/* =================================================
            HOD SELECTION
        ================================================= */}

        <div className="hod-form-section">
          <div className="hod-form-section-title">
            <span>HEAD OF DEPARTMENT</span>

            <h2>Select HOD</h2>
          </div>

          {hodFaculty.length === 0 ? (
            <div className="hod-form-warning">
              <FaUserTie />

              <div>
                <strong>No Active HOD Found</strong>

                <p>
                  Please go to Faculty Management and mark one active faculty
                  member as HOD first.
                </p>
              </div>
            </div>
          ) : (
            <div className="hod-faculty-grid">
              {hodFaculty.map((faculty) => (
                <label
                  key={faculty._id}
                  className={`hod-faculty-option ${
                    formData.facultyId === faculty._id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="facultyId"
                    value={faculty._id}
                    checked={formData.facultyId === faculty._id}
                    onChange={handleChange}
                  />

                  {faculty.photo ? (
                    <img
                      src={
                        typeof faculty.photo === "string"
                          ? faculty.photo
                          : faculty.photo?.url
                      }
                      alt={faculty.name}
                    />
                  ) : (
                    <div className="hod-faculty-placeholder">
                      <FaUserTie />
                    </div>
                  )}

                  <div>
                    <strong>{faculty.name}</strong>

                    <span>{faculty.designation}</span>

                    <small>HOD</small>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* =================================================
            MESSAGE DETAILS
        ================================================= */}

        <div className="hod-form-section">
          <div className="hod-form-section-title">
            <span>MESSAGE CONTENT</span>

            <h2>HOD's Message</h2>
          </div>

          {/* TITLE */}

          <div className="hod-form-group">
            <label>Message Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Message from the Head of Department"
            />
          </div>

          {/* MESSAGE */}

          <div className="hod-form-group">
            <label>
              Message
              <span>*</span>
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="10"
              placeholder="Enter the message from the Head of Department..."
              required
            />

            <small>
              You can use multiple paragraphs. Press Enter to create a new
              paragraph.
            </small>
          </div>
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="hod-form-section">
          <div className="hod-form-section-title">
            <span>STATUS</span>

            <h2>Publication Status</h2>
          </div>

          <div className="hod-form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && <div className="hod-form-error">{error}</div>}

        {success && <div className="hod-form-success">{success}</div>}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="hod-form-actions">
          <button
            type="button"
            className="hod-form-cancel"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}/hod-message`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="hod-form-save"
            disabled={saving || hodFaculty.length === 0 || !canManageHodMessage}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update HOD Message"
                : "Save HOD Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentHodMessageForm;
