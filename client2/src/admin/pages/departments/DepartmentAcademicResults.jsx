import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Modal, Button } from "react-bootstrap";
import {
  FaArrowLeft,
  FaAward,
  FaPlus,
  FaSave,
  FaTrash,
  FaChartLine,
  FaGraduationCap,
} from "react-icons/fa";

import "./department-academic-results.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   EMPTY RESULT
========================================================= */
const createEmptyResult = () => ({
  academicYear: "",
  session: "Even",
  currentSession: false,
  semesters: [],
  overallResult: "",
  studentsAppeared: "",
  studentsPassed: "",
  displayOrder: 1,
});

/* =========================================================
   COMPONENT
========================================================= */
const DepartmentAcademicResults = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin } = useAuth();

  const isSubAdmin = admin?.role === "Sub Admin";
  const departmentPermission = (admin?.permissions?.departments || []).find(
    (item) =>
      item?.slug === slug ||
      String(item?.departmentId || "") === String(admin?.departmentId || ""),
  );

  const resultsPermission = (departmentPermission?.modules || []).find(
    (item) => item?.key === "academic-results",
  );

  const canManageResults =
    !isSubAdmin ||
    Boolean(
      departmentPermission?.enabled &&
      (resultsPermission?.enabled ||
        (resultsPermission?.subModules || []).some(
          (item) =>
            item?.enabled &&
            ["academic-results", "university-results"].includes(item?.key),
        )),
    );

  const [department, setDepartment] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     MODALS STATE
  ======================================================= */
  const [modal, setModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    index: null,
  });

  const [resultModal, setResultModal] = useState({ show: false, index: null });
  const [viewModal, setViewModal] = useState({ show: false, index: null });

  /* =======================================================
     MODAL FUNCTIONS
  ======================================================= */
  const showModal = (type, title, message) => {
    setModal({
      show: true,
      type,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: "info",
      title: "",
      message: "",
    });
  };

  /* =======================================================
     LOAD DATA
  ======================================================= */
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("adminToken");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${slug}`,
        { headers: authHeaders },
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;
      setDepartment(departmentData);

      const resultResponse = await fetch(
        `${API_URL}/department-academic-results/${departmentData._id}`,
        { headers: authHeaders },
      );

      const resultData = await resultResponse.json();

      if (resultResponse.status === 404 || resultData?.exists === false) {
        setResults([]);
        return;
      }

      if (!resultResponse.ok) {
        throw new Error(
          resultData.message || "Failed to fetch academic results",
        );
      }

      setResults(
        Array.isArray(resultData?.data?.results) ? resultData.data.results : [],
      );
    } catch (err) {
      console.error("Load Academic Results Error:", err);
      setError(err.message || "Failed to load academic results");
      showModal(
        "error",
        "Unable to Load Results",
        err.message || "Failed to load academic results.",
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
     RESULT ACTIONS
  ======================================================= */
  const addResult = () => {
    openAddResultModal();
  };

  const updateResult = (index, field, value) => {
    if (!canManageResults) return;
    setResults((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const askDelete = (index) => {
    if (!canManageResults) return;
    setDeleteModal({
      show: true,
      index,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      index: null,
    });
  };

  const openAddResultModal = () => {
    if (!canManageResults) return;
    const newIndex = results.length;
    setResults((prev) => [...prev, createEmptyResult()]);
    setResultModal({ show: true, index: newIndex });
  };

  const closeResultModal = () => setResultModal({ show: false, index: null });
  const openViewModal = (index) => setViewModal({ show: true, index });
  const closeViewModal = () => setViewModal({ show: false, index: null });

  const openEditResultModal = (index) => {
    if (!canManageResults) return;
    setResultModal({ show: true, index });
  };

  const confirmDelete = () => {
    const index = deleteModal.index;

    if (index === null || index === undefined) {
      closeDeleteModal();
      return;
    }

    setResults((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    closeDeleteModal();
    showModal(
      "success",
      "Result Removed",
      "The academic result has been removed from the form. Click Save Results to permanently save the changes.",
    );
  };

  /* =======================================================
     SEMESTER ACTIONS
  ======================================================= */
  const addSemester = (resultIndex) => {
    if (!canManageResults) return;
    setResults((prev) =>
      prev.map((item, index) => {
        if (index !== resultIndex) {
          return item;
        }

        return {
          ...item,
          semesters: [
            ...(item.semesters || []),
            {
              semester: "",
              result: "",
            },
          ],
        };
      }),
    );
  };

  const updateSemester = (resultIndex, semesterIndex, field, value) => {
    if (!canManageResults) return;
    setResults((prev) =>
      prev.map((item, index) => {
        if (index !== resultIndex) {
          return item;
        }

        return {
          ...item,
          semesters: (item.semesters || []).map((semester, semIndex) =>
            semIndex === semesterIndex
              ? {
                  ...semester,
                  [field]: value,
                }
              : semester,
          ),
        };
      }),
    );
  };

  const removeSemester = (resultIndex, semesterIndex) => {
    if (!canManageResults) return;
    setResults((prev) =>
      prev.map((item, index) => {
        if (index !== resultIndex) {
          return item;
        }

        return {
          ...item,
          semesters: (item.semesters || []).filter(
            (_, semIndex) => semIndex !== semesterIndex,
          ),
        };
      }),
    );
  };

  /* =======================================================
     SUBMIT / SAVE
  ======================================================= */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canManageResults) {
      showModal(
        "error",
        "Access Denied",
        "You do not have permission to manage academic results for this department.",
      );
      return;
    }

    if (!department?._id) {
      showModal(
        "error",
        "Department Missing",
        "Department information could not be found.",
      );
      return;
    }

    for (const item of results) {
      if (!item.academicYear.trim()) {
        showModal(
          "error",
          "Academic Year Required",
          "Please enter the academic year for every result.",
        );
        return;
      }

      if (!item.semesters || item.semesters.length === 0) {
        showModal(
          "error",
          "Semester Required",
          `Please add at least one semester for ${item.academicYear}.`,
        );
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        departmentId: department._id,
        results: results.map((item) => ({
          academicYear: item.academicYear.trim(),
          session: item.session,
          currentSession: Boolean(item.currentSession),
          semesters: (item.semesters || []).map((semester) => ({
            semester: semester.semester.trim(),
            result: semester.result.trim(),
          })),
          overallResult: item.overallResult.trim(),
          studentsAppeared:
            item.studentsAppeared === "" ? 0 : Number(item.studentsAppeared),
          studentsPassed:
            item.studentsPassed === "" ? 0 : Number(item.studentsPassed),
          displayOrder:
            item.displayOrder === "" ? 1 : Number(item.displayOrder),
        })),
      };

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("adminToken");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const existingResponse = await fetch(
        `${API_URL}/department-academic-results/${department._id}`,
        { headers: authHeaders },
      );

      const existingData = await existingResponse.json();
      const exists =
        existingData?.exists === true || Boolean(existingData?.data);

      const method = exists ? "PUT" : "POST";
      const url = exists
        ? `${API_URL}/department-academic-results/${department._id}`
        : `${API_URL}/department-academic-results`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to save academic results",
        );
      }

      setResults(
        Array.isArray(responseData?.data?.results)
          ? responseData.data.results
          : results,
      );

      closeResultModal();
      showModal(
        "success",
        "Academic Results Saved",
        "Department academic results have been saved successfully.",
      );
    } catch (err) {
      console.error("Save Academic Results Error:", err);
      setError(err.message || "Failed to save academic results");
      showModal(
        "error",
        "Unable to Save Results",
        err.message || "Failed to save academic results.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     GUARDS / CONDITIONAL RENDER
  ======================================================= */
  if (isSubAdmin && !canManageResults) {
    return (
      <div className="department-academic-results-page">
        <div className="academic-results-error">
          <h2>Access Denied</h2>
          <p>
            You do not have permission to manage academic results for this
            department.
          </p>
          <button
            type="button"
            className="academic-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            Back to Department
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="department-academic-results-page">
        <div className="academic-results-loading">
          Loading Academic Results...
        </div>
      </div>
    );
  }

  if (error && !department) {
    return (
      <div className="department-academic-results-page">
        <div className="academic-results-error">
          <h3>Unable to Load Academic Results</h3>
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
    <div className="department-academic-results-page">
      {/* HEADER */}
      <div className="department-academic-results-header">
        <button
          type="button"
          className="academic-results-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="academic-results-title">
          <div className="academic-results-icon">
            <FaGraduationCap />
          </div>
          <div>
            <span>DEPARTMENT MANAGEMENT</span>
            <h1>{department?.name} — Academic Results</h1>
            <p>
              Manage academic performance, semester-wise results and student
              performance records.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form className="academic-results-form" onSubmit={handleSubmit}>
        <div className="academic-results-card">
          <div className="academic-results-card-header">
            <div>
              <span>ACADEMIC PERFORMANCE</span>
              <h2>Academic Results</h2>
            </div>

            <button
              type="button"
              className="academic-add-btn"
              onClick={addResult}
            >
              <FaPlus />
              Add Academic Result
            </button>
          </div>

          {results.length === 0 ? (
            <div className="academic-results-empty">
              <FaAward />
              <h3>No Academic Results Added</h3>
              <p>
                Add the academic session and semester-wise performance of this
                department.
              </p>
              <button
                type="button"
                className="academic-add-btn"
                onClick={addResult}
                disabled={!canManageResults}
              >
                <FaPlus /> Add First Result
              </button>
            </div>
          ) : (
            <div className="academic-results-table-wrapper">
              <div className="table-responsive">
                <table className="table academic-results-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Academic Year</th>
                      <th>Session</th>
                      <th>Current</th>
                      <th>Semesters</th>
                      <th>Overall Result</th>
                      <th>Appeared</th>
                      <th>Passed</th>
                      {canManageResults && <th className="text-end">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="academic-result-table-row"
                        onClick={() => openViewModal(index)}
                      >
                        <td>
                          <span className="academic-table-number">
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <div className="academic-table-primary">
                            {item.academicYear || "—"}
                          </div>
                        </td>
                        <td>
                          <span className="academic-session-badge">
                            {item.session || "—"}
                          </span>
                        </td>
                        <td>
                          {item.currentSession ? (
                            <span className="academic-status-badge active">
                              Current
                            </span>
                          ) : (
                            <span className="academic-status-badge">
                              Previous
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="academic-count-badge">
                            {item.semesters?.length || 0}
                          </span>
                        </td>
                        <td>
                          <strong>{item.overallResult || "—"}</strong>
                        </td>
                        <td>{item.studentsAppeared ?? 0}</td>
                        <td>{item.studentsPassed ?? 0}</td>
                        {canManageResults && (
                          <td
                            className="text-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="academic-table-actions">
                              <button
                                type="button"
                                className="academic-view-btn"
                                onClick={() => openViewModal(index)}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="academic-edit-btn"
                                onClick={() => openEditResultModal(index)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="academic-delete-btn"
                                onClick={() => askDelete(index)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="academic-table-hint">
                <FaChartLine /> Click any row to view the complete academic
                result.
              </div>
            </div>
          )}
        </div>

        {/* ADD / EDIT RESULT MODAL */}
        <Modal
          show={resultModal.show}
          onHide={closeResultModal}
          size="lg"
          centered
          scrollable
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Academic Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resultModal.index !== null && results[resultModal.index] && (
              <div className="academic-modal-form">
                {(() => {
                  const item = results[resultModal.index];
                  const index = resultModal.index;
                  return (
                    <>
                      <div className="academic-modal-section">
                        <div className="academic-modal-section-title">
                          <span>ACADEMIC INFORMATION</span>
                          <h5>Basic Details</h5>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="academic-field">
                              <label>Academic Year</label>
                              <input
                                type="text"
                                value={item.academicYear}
                                onChange={(e) =>
                                  updateResult(
                                    index,
                                    "academicYear",
                                    e.target.value,
                                  )
                                }
                                placeholder="2025-26"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="academic-field">
                              <label>Session</label>
                              <select
                                value={item.session}
                                onChange={(e) =>
                                  updateResult(index, "session", e.target.value)
                                }
                              >
                                <option value="Odd">Odd</option>
                                <option value="Even">Even</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="academic-field">
                              <label>Display Order</label>
                              <input
                                type="number"
                                min="1"
                                value={item.displayOrder}
                                onChange={(e) =>
                                  updateResult(
                                    index,
                                    "displayOrder",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="academic-field">
                              <label>Current Session</label>
                              <label className="academic-switch">
                                <input
                                  type="checkbox"
                                  checked={Boolean(item.currentSession)}
                                  onChange={(e) =>
                                    updateResult(
                                      index,
                                      "currentSession",
                                      e.target.checked,
                                    )
                                  }
                                />
                                <span />
                                <b>{item.currentSession ? "Yes" : "No"}</b>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="academic-modal-section">
                        <div className="academic-section-heading">
                          <div>
                            <span>SEMESTER RESULTS</span>
                            <h4>Semester-wise Performance</h4>
                          </div>
                          <button
                            type="button"
                            className="academic-small-add-btn"
                            onClick={() => addSemester(index)}
                          >
                            <FaPlus /> Add Semester
                          </button>
                        </div>
                        {item.semesters?.length === 0 ? (
                          <div className="academic-semester-empty">
                            <FaChartLine />
                            <p>No semesters added. Click "Add Semester".</p>
                          </div>
                        ) : (
                          <div className="academic-semester-list">
                            {item.semesters.map((semester, semesterIndex) => (
                              <div
                                className="academic-semester-row"
                                key={semesterIndex}
                              >
                                <div className="academic-semester-number">
                                  {semesterIndex + 1}
                                </div>
                                <div className="academic-field">
                                  <label>Semester</label>
                                  <input
                                    type="text"
                                    value={semester.semester}
                                    onChange={(e) =>
                                      updateSemester(
                                        index,
                                        semesterIndex,
                                        "semester",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="I"
                                  />
                                </div>
                                <div className="academic-field">
                                  <label>Result</label>
                                  <input
                                    type="text"
                                    value={semester.result}
                                    onChange={(e) =>
                                      updateSemester(
                                        index,
                                        semesterIndex,
                                        "result",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="98%"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="academic-delete-btn"
                                  onClick={() =>
                                    removeSemester(index, semesterIndex)
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="academic-modal-section">
                        <div className="academic-modal-section-title">
                          <span>OVERALL PERFORMANCE</span>
                          <h5>Result Summary</h5>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <div className="academic-field">
                              <label>Overall Result</label>
                              <input
                                type="text"
                                value={item.overallResult}
                                onChange={(e) =>
                                  updateResult(
                                    index,
                                    "overallResult",
                                    e.target.value,
                                  )
                                }
                                placeholder="98%"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="academic-field">
                              <label>Students Appeared</label>
                              <input
                                type="number"
                                min="0"
                                value={item.studentsAppeared}
                                onChange={(e) =>
                                  updateResult(
                                    index,
                                    "studentsAppeared",
                                    e.target.value,
                                  )
                                }
                                placeholder="124"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="academic-field">
                              <label>Students Passed</label>
                              <input
                                type="number"
                                min="0"
                                value={item.studentsPassed}
                                onChange={(e) =>
                                  updateResult(
                                    index,
                                    "studentsPassed",
                                    e.target.value,
                                  )
                                }
                                placeholder="122"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeResultModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saving || !canManageResults}
            >
              <FaSave className="me-2" />
              {saving ? "Saving..." : "Save Academic Results"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* VIEW RESULT MODAL */}
        <Modal
          show={viewModal.show}
          onHide={closeViewModal}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {viewModal.index !== null && results[viewModal.index]
                ? `Academic Result — ${results[viewModal.index].academicYear || "Details"}`
                : "Academic Result"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewModal.index !== null && results[viewModal.index] && (
              <div className="academic-view-modal">
                {(() => {
                  const item = results[viewModal.index];
                  const appeared = Number(item.studentsAppeared || 0);
                  const passed = Number(item.studentsPassed || 0);
                  return (
                    <>
                      <div className="academic-view-summary">
                        <div>
                          <span>Academic Year</span>
                          <strong>{item.academicYear || "—"}</strong>
                        </div>
                        <div>
                          <span>Session</span>
                          <strong>{item.session || "—"}</strong>
                        </div>
                        <div>
                          <span>Overall Result</span>
                          <strong>{item.overallResult || "—"}</strong>
                        </div>
                        <div>
                          <span>Current Session</span>
                          <strong>{item.currentSession ? "Yes" : "No"}</strong>
                        </div>
                      </div>
                      <div className="academic-view-stats">
                        <div>
                          <span>Students Appeared</span>
                          <strong>{appeared}</strong>
                        </div>
                        <div>
                          <span>Students Passed</span>
                          <strong>{passed}</strong>
                        </div>
                        <div>
                          <span>Pass Percentage</span>
                          <strong>
                            {appeared
                              ? `${((passed / appeared) * 100).toFixed(2)}%`
                              : "—"}
                          </strong>
                        </div>
                        <div>
                          <span>Semesters</span>
                          <strong>{item.semesters?.length || 0}</strong>
                        </div>
                      </div>
                      <div className="academic-view-section">
                        <div className="academic-modal-section-title">
                          <span>SEMESTER RESULTS</span>
                          <h5>Semester-wise Performance</h5>
                        </div>
                        {item.semesters?.length ? (
                          <div className="table-responsive">
                            <table className="table table-bordered academic-view-semester-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Semester</th>
                                  <th>Result</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.semesters.map((semester, i) => (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{semester.semester || "—"}</td>
                                    <td>
                                      <strong>{semester.result || "—"}</strong>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="academic-view-empty">
                            No semester results available.
                          </div>
                        )}
                      </div>
                      <div className="academic-view-section">
                        <div className="academic-modal-section-title">
                          <span>RECORD INFORMATION</span>
                          <h5>Display Information</h5>
                        </div>
                        <div className="academic-view-details">
                          <div>
                            <span>Display Order</span>
                            <strong>{item.displayOrder || 1}</strong>
                          </div>
                          <div>
                            <span>Status</span>
                            <strong>
                              {item.currentSession
                                ? "Current Academic Session"
                                : "Previous Academic Session"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {viewModal.index !== null && canManageResults && (
              <Button
                variant="primary"
                onClick={() => {
                  const index = viewModal.index;
                  closeViewModal();
                  openEditResultModal(index);
                }}
              >
                Edit Result
              </Button>
            )}
            <Button variant="secondary" onClick={closeViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* SAVE BUTTONS */}
        <div className="academic-results-actions">
          <button
            type="button"
            className="academic-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="academic-save-btn"
            disabled={saving || !canManageResults}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Academic Results"}
          </button>
        </div>
      </form>

      {/* SUCCESS / ERROR MODAL */}
      <Modal show={modal.show} onHide={closeModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="academic-modal-body">
            <div className={`academic-modal-icon ${modal.type}`}>
              {modal.type === "success" ? "✓" : "!"}
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

      {/* DELETE MODAL */}
      <Modal
        show={deleteModal.show}
        onHide={closeDeleteModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Academic Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="academic-delete-modal">
            <div className="academic-delete-modal-icon">
              <FaTrash />
            </div>
            <div>
              <h5>Are you sure?</h5>
              <p>
                This academic result will be removed from the form. Click Save
                Academic Results to permanently save the change.
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

export default DepartmentAcademicResults;
