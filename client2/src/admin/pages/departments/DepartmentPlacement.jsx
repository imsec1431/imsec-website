/*
 * UPDATED COMPLETE FILE
 * DepartmentPlacement.jsx
 * Sub-Admin permission protected
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Modal, Button } from "react-bootstrap";

import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaPlus,
  FaSave,
  FaTrash,
  FaUserGraduate,
  FaQuoteLeft,
} from "react-icons/fa";

import "./department-placement.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeaders = (includeContentType = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* =========================================================
   EMPTY DATA
========================================================= */

const emptyPlacement = {
  placementStatistics: {
    placementRate: "",
    highestPackage: "",
    averagePackage: "",
    offersReceived: "",
  },

  recruiters: [],

  placementHistory: [],

  topPlacements: [],

  trainings: [],

  process: [],

  testimonials: [],
};

/* =========================================================
   DEPARTMENT PLACEMENT
========================================================= */

const DepartmentPlacement = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin, isSubAdmin } = useAuth();

  const [department, setDepartment] = useState(null);

  /* =========================================================
     SUB ADMIN PERMISSION
  ========================================================= */

  const departmentPermission = isSubAdmin
    ? admin?.permissions?.departments?.find(
        (item) =>
          String(item.slug || "").toLowerCase() ===
            String(slug || "").toLowerCase() ||
          String(item.departmentId || "") === String(slug || ""),
      )
    : null;

  const placementPermission = departmentPermission?.modules?.find(
    (module) => module.key === "placement",
  );

  const canManagePlacement = !isSubAdmin
    ? true
    : Boolean(departmentPermission?.enabled && placementPermission?.enabled);

  const [placement, setPlacement] = useState(emptyPlacement);

  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     GENERAL MODAL
  ======================================================= */

  const [modal, setModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  /* =======================================================
     DELETE MODAL
  ======================================================= */

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: "",
    index: null,
  });

  /* =======================================================
     SHOW MODAL
  ======================================================= */

  const showModal = (type, title, message) => {
    setModal({
      show: true,
      type,
      title,
      message,
    });
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setModal({
      show: false,
      type: "info",
      title: "",
      message: "",
    });
  };

  /* =======================================================
     DELETE CONFIRMATION
  ======================================================= */

  const askDelete = (type, index) => {
    if (!canManagePlacement) {
      showModal(
        "error",
        "Access Denied",
        "You do not have permission to manage department placement.",
      );
      return;
    }

    setDeleteModal({
      show: true,
      type,
      index,
    });
  };

  /* =======================================================
     CLOSE DELETE MODAL
  ======================================================= */

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      type: "",
      index: null,
    });
  };

  /* =======================================================
     CONFIRM DELETE
  ======================================================= */

  const confirmDelete = () => {
    const { type, index } = deleteModal;

    if (index === null || index === undefined) {
      closeDeleteModal();
      return;
    }

    if (type === "recruiter") {
      removeRecruiter(index);
    }

    if (type === "history") {
      removePlacementHistory(index);
    }

    if (type === "achiever") {
      removeTopPlacement(index);
    }

    if (type === "training") {
      removeTraining(index);
    }

    if (type === "process") {
      removeProcess(index);
    }

    if (type === "testimonial") {
      removeTestimonial(index);
    }

    closeDeleteModal();

    showModal(
      "success",
      "Item Removed",
      "The item has been removed from the form. Click Save Placement to permanently save this change.",
    );
  };

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      /* ================================================
         GET DEPARTMENT
      ================================================= */

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${slug}`,
        { headers: getAuthHeaders() },
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;

      setDepartment(departmentData);

      /* ================================================
         GET PLACEMENT
      ================================================= */

      const placementResponse = await fetch(
        `${API_URL}/department-placement/${departmentData._id}`,
        { headers: getAuthHeaders() },
      );

      const placementResult = await placementResponse.json();

      /* ================================================
         NO PLACEMENT YET
      ================================================= */

      if (
        placementResponse.status === 404 ||
        placementResult?.exists === false
      ) {
        setPlacement({
          ...emptyPlacement,
        });

        return;
      }

      if (!placementResponse.ok) {
        throw new Error(placementResult.message || "Failed to fetch placement");
      }

      /* ================================================
         EXISTING PLACEMENT
      ================================================= */

      const data = placementResult.data;

      if (data) {
        setPlacement({
          placementStatistics: {
            ...emptyPlacement.placementStatistics,
            ...(data.placementStatistics || {}),
          },

          recruiters: Array.isArray(data.recruiters) ? data.recruiters : [],

          placementHistory: Array.isArray(data.placementHistory)
            ? data.placementHistory
            : [],

          topPlacements: Array.isArray(data.topPlacements)
            ? data.topPlacements
            : [],

          trainings: Array.isArray(data.trainings) ? data.trainings : [],

          process: Array.isArray(data.process) ? data.process : [],

          testimonials: Array.isArray(data.testimonials)
            ? data.testimonials
            : [],
        });
      } else {
        setPlacement({
          ...emptyPlacement,
        });
      }
    } catch (err) {
      console.error("Load Department Placement Error:", err);

      setError(err.message || "Failed to load placement");

      showModal(
        "error",
        "Unable to Load Placement",
        err.message || "Failed to load department placement.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EFFECT
  ======================================================= */

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =======================================================
     PLACEMENT STATISTICS
  ======================================================= */

  const updateStatistics = (field, value) => {
    if (!canManagePlacement) return;

    setPlacement((prev) => ({
      ...prev,

      placementStatistics: {
        ...prev.placementStatistics,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     RECRUITERS
  ======================================================= */

  const addRecruiter = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      recruiters: [
        ...prev.recruiters,

        {
          companyName: "",
        },
      ],
    }));
  };

  const updateRecruiter = (index, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      recruiters: prev.recruiters.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              companyName: value,
            }
          : item,
      ),
    }));
  };

  const removeRecruiter = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      recruiters: prev.recruiters.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  /* =======================================================
     YEAR-WISE PLACEMENT
  ======================================================= */

  const addPlacementHistory = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      placementHistory: [
        ...prev.placementHistory,

        {
          year: "",
          percentage: "",
        },
      ],
    }));
  };

  const updatePlacementHistory = (index, field, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      placementHistory: prev.placementHistory.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removePlacementHistory = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      placementHistory: prev.placementHistory.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     TOP PLACEMENTS
  ======================================================= */

  const addTopPlacement = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      topPlacements: [
        ...prev.topPlacements,

        {
          student: "",
          company: "",
          package: "",
          role: "",
          batch: "",
        },
      ],
    }));
  };

  const updateTopPlacement = (index, field, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      topPlacements: prev.topPlacements.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeTopPlacement = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      topPlacements: prev.topPlacements.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     TRAINING ACTIVITIES
  ======================================================= */

  const addTraining = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      trainings: [
        ...prev.trainings,

        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateTraining = (index, field, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      trainings: prev.trainings.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeTraining = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      trainings: prev.trainings.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  /* =======================================================
     PLACEMENT PROCESS
  ======================================================= */

  const addProcess = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      process: [
        ...prev.process,

        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateProcess = (index, field, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      process: prev.process.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeProcess = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      process: prev.process.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  /* =======================================================
     TESTIMONIALS
  ======================================================= */

  const addTestimonial = () => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      testimonials: [
        ...prev.testimonials,

        {
          student: "",
          company: "",
          message: "",
        },
      ],
    }));
  };

  const updateTestimonial = (index, field, value) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      testimonials: prev.testimonials.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeTestimonial = (index) => {
    if (!canManagePlacement) return;
    setPlacement((prev) => ({
      ...prev,

      testimonials: prev.testimonials.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManagePlacement) {
      setError("You do not have permission to manage department placement.");

      showModal(
        "error",
        "Access Denied",
        "You do not have permission to save department placement.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      /* ================================================
         CHECK EXISTING
      ================================================= */

      const existingResponse = await fetch(
        `${API_URL}/department-placement/${department._id}`,
        { headers: getAuthHeaders() },
      );

      const existingResult = await existingResponse.json();

      const exists =
        existingResult?.exists === true || Boolean(existingResult?.data);

      /* ================================================
         CREATE OR UPDATE
      ================================================= */

      const method = exists ? "PUT" : "POST";

      const url = exists
        ? `${API_URL}/department-placement/${department._id}`
        : `${API_URL}/department-placement`;

      /* ================================================
         PAYLOAD
      ================================================= */

      const payload = {
        departmentId: department._id,

        placementStatistics: placement.placementStatistics,

        recruiters: placement.recruiters,

        placementHistory: placement.placementHistory.map((item) => ({
          ...item,

          percentage: item.percentage === "" ? 0 : Number(item.percentage),
        })),

        topPlacements: placement.topPlacements,

        trainings: placement.trainings,

        process: placement.process,

        testimonials: placement.testimonials,
      };

      /* ================================================
         REQUEST
      ================================================= */

      const response = await fetch(url, {
        method,

        headers: getAuthHeaders(true),

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save placement");
      }

      /* ================================================
         UPDATE STATE
      ================================================= */

      const data = result.data || {};

      setPlacement({
        placementStatistics: {
          ...emptyPlacement.placementStatistics,
          ...(data.placementStatistics || {}),
        },

        recruiters: Array.isArray(data.recruiters) ? data.recruiters : [],

        placementHistory: Array.isArray(data.placementHistory)
          ? data.placementHistory
          : [],

        topPlacements: Array.isArray(data.topPlacements)
          ? data.topPlacements
          : [],

        trainings: Array.isArray(data.trainings) ? data.trainings : [],

        process: Array.isArray(data.process) ? data.process : [],

        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      });

      /* ================================================
         SUCCESS MODAL
      ================================================= */

      showModal(
        "success",
        "Placement Saved Successfully",
        "The department placement information has been saved successfully.",
      );
    } catch (err) {
      console.error("Save Department Placement Error:", err);

      const errorMessage = err.message || "Failed to save placement";

      setError(errorMessage);

      /* ================================================
         ERROR MODAL
      ================================================= */

      showModal("error", "Unable to Save Placement", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="department-placement-page">
        <div className="department-placement-loading">
          Loading Department Placement...
        </div>
      </div>
    );
  }

  /* =======================================================
     ACCESS DENIED
  ======================================================= */

  if (isSubAdmin && !canManagePlacement) {
    return (
      <div className="department-placement-page">
        <div
          className="department-placement-error"
          style={{
            textAlign: "center",
            padding: "60px 25px",
          }}
        >
          <FaBriefcase
            style={{
              fontSize: "48px",
              marginBottom: "18px",
            }}
          />

          <h3>Access Denied</h3>

          <p>
            You do not have permission to manage Placement for this department.
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

  /* =======================================================
     ERROR PAGE
  ======================================================= */

  if (error && !department) {
    return (
      <div className="department-placement-page">
        <div className="department-placement-error">
          <h3>Unable to Load Placement</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/imsec-control-center/departments")}
          >
            <FaArrowLeft />
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="department-placement-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="department-placement-header">
        <button
          type="button"
          className="department-placement-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="department-placement-title">
          <div className="department-placement-icon">
            <FaBriefcase />
          </div>

          <div>
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{department?.name} — Placement</h1>

            <p>
              Manage placement statistics, recruiters, success stories and
              student placement activities.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="department-placement-tabs">
        <button
          type="button"
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>

        <button
          type="button"
          className={activeTab === "statistics" ? "active" : ""}
          onClick={() => setActiveTab("statistics")}
        >
          Statistics
        </button>

        <button
          type="button"
          className={activeTab === "recruiters" ? "active" : ""}
          onClick={() => setActiveTab("recruiters")}
        >
          Recruiters
        </button>

        <button
          type="button"
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Year-wise Statistics
        </button>

        <button
          type="button"
          className={activeTab === "achievers" ? "active" : ""}
          onClick={() => setActiveTab("achievers")}
        >
          Highest Package
        </button>

        <button
          type="button"
          className={activeTab === "training" ? "active" : ""}
          onClick={() => setActiveTab("training")}
        >
          Training
        </button>

        <button
          type="button"
          className={activeTab === "process" ? "active" : ""}
          onClick={() => setActiveTab("process")}
        >
          Process
        </button>

        <button
          type="button"
          className={activeTab === "experiences" ? "active" : ""}
          onClick={() => setActiveTab("experiences")}
        >
          Experiences
        </button>
      </div>

      <form onSubmit={handleSubmit} className="department-placement-form">
        {/* =================================================
            PLACEMENT STATISTICS
        ================================================= */}

        {(activeTab === "all" || activeTab === "statistics") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>PLACEMENT STATISTICS</span>

                <h2>Placement Overview</h2>
              </div>

              <FaChartLine />
            </div>

            <div className="placement-statistics-grid">
              <div className="placement-field">
                <label>Placement Rate</label>

                <input
                  type="text"
                  value={placement.placementStatistics.placementRate}
                  onChange={(e) =>
                    updateStatistics("placementRate", e.target.value)
                  }
                  placeholder="95%"
                />
              </div>

              <div className="placement-field">
                <label>Highest Package</label>

                <input
                  type="text"
                  value={placement.placementStatistics.highestPackage}
                  onChange={(e) =>
                    updateStatistics("highestPackage", e.target.value)
                  }
                  placeholder="18 LPA"
                />
              </div>

              <div className="placement-field">
                <label>Average Package</label>

                <input
                  type="text"
                  value={placement.placementStatistics.averagePackage}
                  onChange={(e) =>
                    updateStatistics("averagePackage", e.target.value)
                  }
                  placeholder="6.8 LPA"
                />
              </div>

              <div className="placement-field">
                <label>Our Recruiters</label>

                <input
                  type="text"
                  value={placement.placementStatistics.offersReceived}
                  onChange={(e) =>
                    updateStatistics("offersReceived", e.target.value)
                  }
                  placeholder="150+"
                />
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            RECRUITERS
        ================================================= */}

        {(activeTab === "all" || activeTab === "recruiters") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>TOP RECRUITING COMPANIES</span>

                <h2>Our Recruiters</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addRecruiter}
              >
                <FaPlus />
                Add Company
              </button>
            </div>

            {placement.recruiters.length === 0 ? (
              <div className="placement-empty">
                <FaBuilding />

                <h3>No Recruiters Added</h3>

                <p>Add companies that recruit students from this department.</p>
              </div>
            ) : (
              <div className="placement-list">
                {placement.recruiters.map((recruiter, index) => (
                  <div
                    className="placement-list-row"
                    key={recruiter._id || index}
                  >
                    <span className="placement-row-number">{index + 1}</span>

                    <input
                      type="text"
                      value={recruiter.companyName || ""}
                      onChange={(e) => updateRecruiter(index, e.target.value)}
                      placeholder="Company Name"
                    />

                    <button
                      type="button"
                      className="placement-delete-btn"
                      onClick={() => askDelete("recruiter", index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            YEAR-WISE STATISTICS
        ================================================= */}

        {(activeTab === "all" || activeTab === "history") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>YEAR-WISE PLACEMENT</span>

                <h2>Placement Statistics</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addPlacementHistory}
              >
                <FaPlus />
                Add Year
              </button>
            </div>

            {placement.placementHistory.length === 0 ? (
              <div className="placement-empty">
                <FaChartLine />

                <h3>No Year-wise Data</h3>

                <p>Add annual placement percentages.</p>
              </div>
            ) : (
              <div className="placement-table-wrapper">
                <table className="placement-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>

                      <th>Year</th>

                      <th>Placement Percentage</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {placement.placementHistory.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>

                        <td>
                          <input
                            type="text"
                            value={item.year || ""}
                            onChange={(e) =>
                              updatePlacementHistory(
                                index,
                                "year",
                                e.target.value,
                              )
                            }
                            placeholder="2025"
                          />
                        </td>

                        <td>
                          <div className="placement-percentage-input">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.percentage ?? ""}
                              onChange={(e) =>
                                updatePlacementHistory(
                                  index,
                                  "percentage",
                                  e.target.value,
                                )
                              }
                              placeholder="95"
                            />

                            <span>%</span>
                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="placement-delete-btn"
                            onClick={() => askDelete("history", index)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            HIGHEST PACKAGE ACHIEVERS
        ================================================= */}

        {(activeTab === "all" || activeTab === "achievers") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>SUCCESS STORIES</span>

                <h2>Highest Package Achievers</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addTopPlacement}
              >
                <FaPlus />
                Add Achiever
              </button>
            </div>

            {placement.topPlacements.length === 0 ? (
              <div className="placement-empty">
                <FaUserGraduate />

                <h3>No Achievers Added</h3>

                <p>Add students who secured outstanding placement packages.</p>
              </div>
            ) : (
              <div className="placement-table-wrapper">
                <table className="placement-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>

                      <th>Student</th>

                      <th>Company</th>

                      <th>Package</th>

                      <th>Role</th>

                      <th>Batch</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {placement.topPlacements.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>

                        <td>
                          <input
                            type="text"
                            value={item.student || ""}
                            onChange={(e) =>
                              updateTopPlacement(
                                index,
                                "student",
                                e.target.value,
                              )
                            }
                            placeholder="Rahul Sharma"
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.company || ""}
                            onChange={(e) =>
                              updateTopPlacement(
                                index,
                                "company",
                                e.target.value,
                              )
                            }
                            placeholder="Microsoft"
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.package || ""}
                            onChange={(e) =>
                              updateTopPlacement(
                                index,
                                "package",
                                e.target.value,
                              )
                            }
                            placeholder="18 LPA"
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.role || ""}
                            onChange={(e) =>
                              updateTopPlacement(index, "role", e.target.value)
                            }
                            placeholder="Software Engineer"
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={item.batch || ""}
                            onChange={(e) =>
                              updateTopPlacement(index, "batch", e.target.value)
                            }
                            placeholder="2023-25"
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            className="placement-delete-btn"
                            onClick={() => askDelete("achiever", index)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            TRAINING ACTIVITIES
        ================================================= */}

        {(activeTab === "all" || activeTab === "training") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>CAREER DEVELOPMENT</span>

                <h2>Placement Training Activities</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addTraining}
              >
                <FaPlus />
                Add Activity
              </button>
            </div>

            {placement.trainings.length === 0 ? (
              <div className="placement-empty">
                <FaBriefcase />

                <h3>No Training Activities</h3>

                <p>Add placement preparation activities.</p>
              </div>
            ) : (
              <div className="placement-content-list">
                {placement.trainings.map((training, index) => (
                  <div
                    className="placement-content-row"
                    key={training._id || index}
                  >
                    <div className="placement-content-number">{index + 1}</div>

                    <div className="placement-content-fields">
                      <input
                        type="text"
                        value={training.title || ""}
                        onChange={(e) =>
                          updateTraining(index, "title", e.target.value)
                        }
                        placeholder="Coding Practice"
                      />

                      <textarea
                        value={training.description || ""}
                        onChange={(e) =>
                          updateTraining(index, "description", e.target.value)
                        }
                        placeholder="Regular DSA and coding sessions."
                        rows="3"
                      />
                    </div>

                    <button
                      type="button"
                      className="placement-delete-btn"
                      onClick={() => askDelete("training", index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            PLACEMENT PROCESS
        ================================================= */}

        {(activeTab === "all" || activeTab === "process") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>PLACEMENT PROCESS</span>

                <h2>Campus Recruitment Journey</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addProcess}
              >
                <FaPlus />
                Add Step
              </button>
            </div>

            {placement.process.length === 0 ? (
              <div className="placement-empty">
                <FaChartLine />

                <h3>No Process Steps</h3>

                <p>Add the steps followed during campus recruitment.</p>
              </div>
            ) : (
              <div className="placement-content-list">
                {placement.process.map((item, index) => (
                  <div
                    className="placement-content-row"
                    key={item._id || index}
                  >
                    <div className="placement-content-number">{index + 1}</div>

                    <div className="placement-content-fields">
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) =>
                          updateProcess(index, "title", e.target.value)
                        }
                        placeholder="Registration"
                      />

                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          updateProcess(index, "description", e.target.value)
                        }
                        placeholder="Students register for campus placement drives."
                        rows="3"
                      />
                    </div>

                    <button
                      type="button"
                      className="placement-delete-btn"
                      onClick={() => askDelete("process", index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            STUDENT EXPERIENCES
        ================================================= */}

        {(activeTab === "all" || activeTab === "experiences") && (
          <section className="department-placement-card">
            <div className="department-placement-card-header">
              <div>
                <span>STUDENT EXPERIENCES</span>

                <h2>What Our Students Say</h2>
              </div>

              <button
                type="button"
                className="placement-add-btn"
                onClick={addTestimonial}
              >
                <FaPlus />
                Add Experience
              </button>
            </div>

            {placement.testimonials.length === 0 ? (
              <div className="placement-empty">
                <FaQuoteLeft />

                <h3>No Student Experiences</h3>

                <p>Add feedback from students about their placement journey.</p>
              </div>
            ) : (
              <div className="placement-content-list">
                {placement.testimonials.map((testimonial, index) => (
                  <div
                    className="placement-testimonial-row"
                    key={testimonial._id || index}
                  >
                    <div className="placement-content-number">{index + 1}</div>

                    <div className="placement-testimonial-fields">
                      <div className="placement-two-column">
                        <input
                          type="text"
                          value={testimonial.student || ""}
                          onChange={(e) =>
                            updateTestimonial(index, "student", e.target.value)
                          }
                          placeholder="Rahul Sharma"
                        />

                        <input
                          type="text"
                          value={testimonial.company || ""}
                          onChange={(e) =>
                            updateTestimonial(index, "company", e.target.value)
                          }
                          placeholder="Microsoft"
                        />
                      </div>

                      <textarea
                        value={testimonial.message || ""}
                        onChange={(e) =>
                          updateTestimonial(index, "message", e.target.value)
                        }
                        placeholder="Student experience..."
                        rows="4"
                      />
                    </div>

                    <button
                      type="button"
                      className="placement-delete-btn"
                      onClick={() => askDelete("testimonial", index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            SAVE ACTIONS
        ================================================= */}

        <div className="department-placement-actions">
          <button
            type="button"
            className="placement-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="placement-save-btn"
            disabled={saving || !canManagePlacement}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Placement"}
          </button>
        </div>
      </form>

      {/* =====================================================
          SUCCESS / ERROR MODAL
      ===================================================== */}

      <Modal show={modal.show} onHide={closeModal} centered backdrop="static">
        <Modal.Header
          closeButton
          className={
            modal.type === "success"
              ? "placement-modal-success-header"
              : modal.type === "error"
                ? "placement-modal-error-header"
                : ""
          }
        >
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="placement-modal-body">
            <div
              className={`placement-modal-icon ${
                modal.type === "success"
                  ? "success"
                  : modal.type === "error"
                    ? "error"
                    : "info"
              }`}
            >
              {modal.type === "success" && "✓"}

              {modal.type === "error" && "!"}

              {modal.type === "info" && "i"}
            </div>

            <p>{modal.message}</p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={modal.type === "error" ? "danger" : "primary"}
            onClick={closeModal}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      <Modal
        show={deleteModal.show}
        onHide={closeDeleteModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="placement-delete-modal">
            <div className="placement-delete-modal-icon">
              <FaTrash />
            </div>

            <div>
              <h5>Delete this item?</h5>

              <p>
                Are you sure you want to remove this item? This change will be
                applied when you save the placement.
              </p>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentPlacement;
