import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaDownload,
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaTrophy,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import {
  getPlacementStudents,
  createPlacementStudent,
  updatePlacementStudent,
  deletePlacementStudent,
  importPlacementStudentsFromExcel,
  getPlacementStatistics,
  createPlacementStatistics,
  updatePlacementStatistics,
  deletePlacementStatistics,
  getPlacementHighlights,
  createPlacementHighlight,
  updatePlacementHighlight,
  deletePlacementHighlight,
} from "../../services/placementRecordService";

import "./PlacementRecordAdmin.css";

const PlacementRecordAdmin = () => {
  /* =========================================================
     COMMON STATES
  ========================================================= */

  const [activeModule, setActiveModule] = useState("records");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [editingItem, setEditingItem] = useState(null);

  /* =========================================================
     MODULE 1 - STUDENT PLACEMENT RECORDS
     DO NOT CHANGE EXISTING LOGIC
  ========================================================= */

  const [placementStudents, setPlacementStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: "",
    rollNo: "",
    branch: "",
    placedIn: "",
    batch: "",
    displayOrder: 0,
    isPublished: true,
  });

  /* =========================================================
     MODULE 2 - PLACEMENT STATISTICS
  ========================================================= */

  const [placementStatistics, setPlacementStatistics] = useState([]);

  const [statisticsForm, setStatisticsForm] = useState({
    type: "highest-package",
    figure: "",
    order: 1,
    isActive: true,
  });

  /* =========================================================
     MODULE 3 - PLACEMENT HIGHLIGHTS
  ========================================================= */

  const [placementHighlights, setPlacementHighlights] = useState([]);

  const [highlightForm, setHighlightForm] = useState({
    title: "",
    description: "",
    displayOrder: 0,
    isPublished: true,
  });

  /* =========================================================
     COMMON HELPERS
  ========================================================= */

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const getErrorMessage = (error, fallback) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  };

  const handleSuccess = (message) => {
    setErrorMessage("");
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  const handleError = (error, fallback) => {
    setSuccessMessage("");
    setErrorMessage(getErrorMessage(error, fallback));
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setEditingItem(null);
    setSaving(false);
  };

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadPlacementStudents = async () => {
    try {
      setLoading(true);

      const response = await getPlacementStudents();

      const data = response?.data?.data || response?.data || [];

      setPlacementStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      handleError(error, "Failed to load placement records.");
    } finally {
      setLoading(false);
    }
  };

  const loadPlacementStatistics = async () => {
    try {
      setLoading(true);

      const response = await getPlacementStatistics();

      const data = response?.data?.data || response?.data || [];

      setPlacementStatistics(Array.isArray(data) ? data : []);
    } catch (error) {
      handleError(error, "Failed to load placement statistics.");
    } finally {
      setLoading(false);
    }
  };

  const loadPlacementHighlights = async () => {
    try {
      setLoading(true);

      const response = await getPlacementHighlights();

      const data = response?.data?.data || response?.data || [];

      setPlacementHighlights(Array.isArray(data) ? data : []);
    } catch (error) {
      handleError(error, "Failed to load placement highlights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModule === "records") {
      loadPlacementStudents();
    }

    if (activeModule === "statistics") {
      loadPlacementStatistics();
    }

    if (activeModule === "highlights") {
      loadPlacementHighlights();
    }
  }, [activeModule]);

  /* =========================================================
     STUDENT RECORDS
  ========================================================= */

  const batches = useMemo(() => {
    return [
      ...new Set(placementStudents.map((item) => item.batch).filter(Boolean)),
    ]
      .sort()
      .reverse();
  }, [placementStudents]);

  const branches = useMemo(() => {
    return [
      ...new Set(placementStudents.map((item) => item.branch).filter(Boolean)),
    ].sort();
  }, [placementStudents]);

  const filteredStudents = useMemo(() => {
    return placementStudents.filter((student) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        student.name?.toLowerCase().includes(search) ||
        student.rollNo?.toLowerCase().includes(search) ||
        student.branch?.toLowerCase().includes(search) ||
        student.placedIn?.toLowerCase().includes(search);

      const matchesBatch =
        selectedBatch === "all" || student.batch === selectedBatch;

      const matchesBranch =
        selectedBranch === "all" || student.branch === selectedBranch;

      return matchesSearch && matchesBatch && matchesBranch;
    });
  }, [placementStudents, searchTerm, selectedBatch, selectedBranch]);

  const resetStudentForm = () => {
    setStudentForm({
      name: "",
      rollNo: "",
      branch: "",
      placedIn: "",
      batch: "",
      displayOrder: 0,
      isPublished: true,
    });
  };

  const openAddStudentModal = () => {
    clearMessages();
    resetStudentForm();
    setEditingItem(null);
    setModalType("student");
    setShowModal(true);
  };

  const openEditStudentModal = (student) => {
    clearMessages();

    setEditingItem(student);

    setStudentForm({
      name: student.name || "",
      rollNo: student.rollNo || "",
      branch: student.branch || "",
      placedIn: student.placedIn || "",
      batch: student.batch || "",
      displayOrder: student.displayOrder ?? 0,
      isPublished:
        student.isPublished !== undefined ? student.isPublished : true,
    });

    setModalType("student");
    setShowModal(true);
  };

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentForm.name ||
      !studentForm.rollNo ||
      !studentForm.branch ||
      !studentForm.placedIn ||
      !studentForm.batch
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      clearMessages();

      if (editingItem) {
        await updatePlacementStudent(
          editingItem._id || editingItem.id,
          studentForm,
        );

        handleSuccess("Placement record updated successfully.");
      } else {
        await createPlacementStudent(studentForm);

        handleSuccess("Placement record created successfully.");
      }

      closeModal();
      await loadPlacementStudents();
    } catch (error) {
      handleError(error, "Failed to save placement record.");
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`,
    );

    if (!confirmed) return;

    try {
      clearMessages();

      await deletePlacementStudent(student._id || student.id);

      handleSuccess("Placement record deleted successfully.");

      await loadPlacementStudents();
    } catch (error) {
      handleError(error, "Failed to delete placement record.");
    }
  };

  /* =========================================================
     EXCEL IMPORT
     KEEPING WORKING FILE UPLOAD
  ========================================================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];

    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setErrorMessage("Please select a valid Excel file (.xlsx or .xls).");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    clearMessages();
    setImportResult(null);
    setSelectedFile(file);
  };

  const handleExcelImport = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select an Excel file first.");
      return;
    }

    try {
      setImporting(true);
      clearMessages();
      setImportResult(null);

      const formData = new FormData();

      // IMPORTANT:
      // Backend expects upload.single("file")
      formData.append("file", selectedFile);

      const response = await importPlacementStudentsFromExcel(formData);

      const result = response?.data || response;

      setImportResult(result);

      if (result?.success || result?.imported > 0) {
        handleSuccess(
          result?.message || "Excel placement records imported successfully.",
        );

        await loadPlacementStudents();
      }
    } catch (error) {
      handleError(error, "Failed to import Excel file.");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers =
      "Name,Roll No,Branch,Placed In,Batch,Display Order,Published";

    const example = "Rahul Kumar,2024MCA001,MCA,TCS,2024-26,1,true";

    const csvContent = headers + "\n" + example;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "placement-record-template.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* =========================================================
     PLACEMENT STATISTICS
  ========================================================= */

  const resetStatisticsForm = () => {
    setStatisticsForm({
      type: "highest-package",
      figure: "",
      order: 1,
      isActive: true,
    });
  };

  const openAddStatisticsModal = () => {
    clearMessages();
    resetStatisticsForm();
    setEditingItem(null);
    setModalType("statistics");
    setShowModal(true);
  };

  const openEditStatisticsModal = (statistic) => {
    clearMessages();

    setEditingItem(statistic);

    setStatisticsForm({
      type: statistic.type || "highest-package",
      figure: statistic.figure || "",
      order: statistic.order ?? 1,
      isActive: statistic.isActive !== undefined ? statistic.isActive : true,
    });

    setModalType("statistics");
    setShowModal(true);
  };

  const handleStatisticsChange = (e) => {
    const { name, value, type, checked } = e.target;

    setStatisticsForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatStatisticType = (type) => {
    const labels = {
      "highest-package": "Highest Package",
      "average-ctc": "Average CTC",
      recruiters: "Recruiters",
      placements: "Placements",
    };

    return labels[type] || type;
  };

  const handleStatisticsSubmit = async (e) => {
    e.preventDefault();

    if (!statisticsForm.figure.trim()) {
      setErrorMessage("Please enter a figure.");
      return;
    }

    try {
      setSaving(true);
      clearMessages();

      const payload = {
        ...statisticsForm,
        order: Number(statisticsForm.order),
      };

      if (editingItem) {
        await updatePlacementStatistics(
          editingItem._id || editingItem.id,
          payload,
        );

        handleSuccess("Placement statistic updated successfully.");
      } else {
        await createPlacementStatistics(payload);

        handleSuccess("Placement statistic created successfully.");
      }

      closeModal();
      await loadPlacementStatistics();
    } catch (error) {
      handleError(error, "Failed to save placement statistic.");
      setSaving(false);
    }
  };

  const handleDeleteStatistics = async (statistic) => {
    const confirmed = window.confirm(
      `Delete "${formatStatisticType(statistic.type)}" statistic?`,
    );

    if (!confirmed) return;

    try {
      clearMessages();

      await deletePlacementStatistics(statistic._id || statistic.id);

      handleSuccess("Placement statistic deleted successfully.");

      await loadPlacementStatistics();
    } catch (error) {
      handleError(error, "Failed to delete placement statistic.");
    }
  };

  /* =========================================================
     PLACEMENT HIGHLIGHTS
  ========================================================= */

  const resetHighlightForm = () => {
    setHighlightForm({
      title: "",
      description: "",
      displayOrder: 0,
      isPublished: true,
    });
  };

  const openAddHighlightModal = () => {
    clearMessages();
    resetHighlightForm();
    setEditingItem(null);
    setModalType("highlight");
    setShowModal(true);
  };

  const openEditHighlightModal = (highlight) => {
    clearMessages();

    setEditingItem(highlight);

    setHighlightForm({
      title: highlight.title || "",
      description: highlight.description || "",
      displayOrder: highlight.displayOrder ?? 0,
      isPublished:
        highlight.isPublished !== undefined ? highlight.isPublished : true,
    });

    setModalType("highlight");
    setShowModal(true);
  };

  const handleHighlightChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHighlightForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHighlightSubmit = async (e) => {
    e.preventDefault();

    if (!highlightForm.title.trim()) {
      setErrorMessage("Please enter a highlight title.");
      return;
    }

    try {
      setSaving(true);
      clearMessages();

      const payload = {
        title: highlightForm.title.trim(),

        description: highlightForm.description.trim(),

        displayOrder: Number(highlightForm.displayOrder),

        isPublished: highlightForm.isPublished,
      };

      if (editingItem) {
        await updatePlacementHighlight(
          editingItem._id || editingItem.id,
          payload,
        );

        handleSuccess("Placement highlight updated successfully.");
      } else {
        await createPlacementHighlight(payload);

        handleSuccess("Placement highlight created successfully.");
      }

      closeModal();
      await loadPlacementHighlights();
    } catch (error) {
      handleError(error, "Failed to save placement highlight.");
      setSaving(false);
    }
  };

  const handleDeleteHighlight = async (highlight) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${highlight.title}"?`,
    );

    if (!confirmed) return;

    try {
      clearMessages();

      await deletePlacementHighlight(highlight._id || highlight.id);

      handleSuccess("Placement highlight deleted successfully.");

      await loadPlacementHighlights();
    } catch (error) {
      handleError(error, "Failed to delete placement highlight.");
    }
  };

  /* =========================================================
     SUMMARY COUNTS
  ========================================================= */

  const totalStudents = placementStudents.length;

  const publishedStudents = placementStudents.filter(
    (student) => student.isPublished !== false,
  ).length;

  const totalStatistics = placementStatistics.length;

  const activeStatistics = placementStatistics.filter(
    (item) => item.isActive !== false,
  ).length;

  const totalHighlights = placementHighlights.length;

  const publishedHighlights = placementHighlights.filter(
    (item) => item.isPublished !== false,
  ).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="placement-record-admin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="placement-record-header">
        <div>
          <div className="placement-record-eyebrow">PLACEMENT MANAGEMENT</div>

          <h1 className="placement-record-title">Placement Records</h1>
        </div>

        {activeModule === "records" && (
          <button
            className="placement-primary-btn"
            onClick={openAddStudentModal}
          >
            <FaPlus />
            Add Placement
          </button>
        )}

        {activeModule === "statistics" && (
          <button
            className="placement-primary-btn"
            onClick={openAddStatisticsModal}
          >
            <FaPlus />
            Add Statistic
          </button>
        )}

        {activeModule === "highlights" && (
          <button
            className="placement-primary-btn"
            onClick={openAddHighlightModal}
          >
            <FaPlus />
            Add Highlight
          </button>
        )}
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {successMessage && (
        <div className="placement-alert placement-alert-success">
          <FaCheckCircle />
          <span>{successMessage}</span>

          <button onClick={() => setSuccessMessage("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="placement-alert placement-alert-error">
          <FaExclamationCircle />
          <span>{errorMessage}</span>

          <button onClick={() => setErrorMessage("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* =====================================================
          MODULE TABS
      ===================================================== */}

      <div className="placement-module-tabs">
        <button
          className={activeModule === "records" ? "active" : ""}
          onClick={() => {
            clearMessages();
            setActiveModule("records");
          }}
        >
          <FaUsers />
          Student Placement Records
        </button>

        <button
          className={activeModule === "statistics" ? "active" : ""}
          onClick={() => {
            clearMessages();
            setActiveModule("statistics");
          }}
        >
          <FaChartLine />
          Placement Statistics
        </button>

        <button
          className={activeModule === "highlights" ? "active" : ""}
          onClick={() => {
            clearMessages();
            setActiveModule("highlights");
          }}
        >
          <FaTrophy />
          Placement Highlights
        </button>
      </div>

      {/* =====================================================
          MODULE 1 - STUDENT RECORDS
      ===================================================== */}

      {activeModule === "records" && (
        <>
          {/* SUMMARY */}

          <div className="placement-record-summary">
            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaUsers />
              </div>

              <div>
                <span>Total Students</span>
                <strong>{totalStudents}</strong>
              </div>
            </div>

            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaCheckCircle />
              </div>

              <div>
                <span>Published</span>
                <strong>{publishedStudents}</strong>
              </div>
            </div>

            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaBuilding />
              </div>

              <div>
                <span>Companies</span>
                <strong>
                  {
                    new Set(
                      placementStudents
                        .map((item) => item.placedIn)
                        .filter(Boolean),
                    ).size
                  }
                </strong>
              </div>
            </div>
          </div>

          {/* EXCEL IMPORT */}

          <div className="placement-excel-card">
            <div className="placement-excel-heading">
              <div className="placement-excel-icon">
                <FaFileExcel />
              </div>

              <div>
                <h3>Import Placement Records</h3>

                <p>
                  Upload an Excel file to import multiple placement records at
                  once.
                </p>
              </div>
            </div>

            <div className="placement-excel-body">
              <div className="placement-excel-input-area">
                <input
                  type="file"
                  id="placementExcelFile"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />

                <label htmlFor="placementExcelFile">
                  <FaUpload />
                  Choose Excel File
                </label>

                {selectedFile && (
                  <div className="placement-selected-file">
                    <FaFileExcel />

                    <span>{selectedFile.name}</span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImportResult(null);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              <div className="placement-excel-actions">
                <button
                  type="button"
                  className="placement-template-btn"
                  onClick={downloadTemplate}
                >
                  <FaDownload />
                  Template
                </button>

                <button
                  type="button"
                  className="placement-import-btn"
                  onClick={handleExcelImport}
                  disabled={importing || !selectedFile}
                >
                  <FaUpload />

                  {importing ? "Importing..." : "Import Excel"}
                </button>
              </div>
            </div>

            {importResult && (
              <div className="placement-import-result">
                <div className="placement-import-counts">
                  <div className="import-success-count">
                    <strong>{importResult.imported ?? 0}</strong>
                    <span>Imported</span>
                  </div>

                  <div className="import-failed-count">
                    <strong>{importResult.failed ?? 0}</strong>
                    <span>Failed</span>
                  </div>

                  <div>
                    <strong>{importResult.totalRows ?? 0}</strong>
                    <span>Total Rows</span>
                  </div>
                </div>

                {Array.isArray(importResult.errors) &&
                  importResult.errors.length > 0 && (
                    <div className="placement-import-errors">
                      <strong>Import Errors</strong>

                      {importResult.errors.map((error, index) => (
                        <div key={index}>
                          {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* STUDENT TABLE */}

          <div className="placement-record-section">
            <div className="placement-record-section-header">
              <div>
                <h2>Student Placement Records</h2>

                <p>Manage individual student placement records.</p>
              </div>

              <div className="placement-record-filters">
                <div className="placement-record-search">
                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search student, roll no, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="all">All Batches</option>

                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="all">All Branches</option>

                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="placement-record-loading">
                <div className="placement-spinner"></div>
                <p>Loading placement records...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="placement-record-empty">
                <FaUsers />

                <h3>No placement records found</h3>

                <p>Add a placement record or import records using Excel.</p>
              </div>
            ) : (
              <div className="placement-record-table-wrapper">
                <table className="placement-record-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll No.</th>
                      <th>Branch</th>
                      <th>Company</th>
                      <th>Batch</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id || student.id}>
                        <td>
                          <div className="placement-student-name">
                            <div className="placement-student-avatar">
                              {student.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <span>{student.name}</span>
                          </div>
                        </td>

                        <td>{student.rollNo}</td>

                        <td>
                          <span className="placement-branch-badge">
                            {student.branch}
                          </span>
                        </td>

                        <td>
                          <span className="placement-company">
                            {student.placedIn}
                          </span>
                        </td>

                        <td>{student.batch}</td>

                        <td>
                          <span
                            className={`placement-status ${
                              student.isPublished === false
                                ? "draft"
                                : "published"
                            }`}
                          >
                            {student.isPublished === false
                              ? "Draft"
                              : "Published"}
                          </span>
                        </td>

                        <td>
                          <div className="placement-row-actions">
                            <button
                              className="placement-edit-btn"
                              title="Edit"
                              onClick={() => openEditStudentModal(student)}
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="placement-delete-btn"
                              title="Delete"
                              onClick={() => handleDeleteStudent(student)}
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
        </>
      )}

      {/* =====================================================
          MODULE 2 - PLACEMENT STATISTICS
      ===================================================== */}

      {activeModule === "statistics" && (
        <>
          <div className="placement-record-summary">
            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaChartLine />
              </div>

              <div>
                <span>Total Statistics</span>

                <strong>{totalStatistics}</strong>
              </div>
            </div>

            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaCheckCircle />
              </div>

              <div>
                <span>Active</span>

                <strong>{activeStatistics}</strong>
              </div>
            </div>
          </div>

          <div className="placement-record-section">
            <div className="placement-record-section-header">
              <div>
                <h2>Placement Statistics</h2>

                <p>Manage placement performance statistics.</p>
              </div>
            </div>

            {loading ? (
              <div className="placement-record-loading">
                <div className="placement-spinner"></div>
                <p>Loading statistics...</p>
              </div>
            ) : placementStatistics.length === 0 ? (
              <div className="placement-record-empty">
                <FaChartLine />

                <h3>No placement statistics</h3>

                <p>Add your first placement statistic.</p>
              </div>
            ) : (
              <div className="placement-record-table-wrapper">
                <table className="placement-record-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Figure</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...placementStatistics]
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((statistic) => (
                        <tr key={statistic._id || statistic.id}>
                          <td>
                            <strong>
                              {formatStatisticType(statistic.type)}
                            </strong>
                          </td>

                          <td>
                            <span className="placement-stat-figure">
                              {statistic.figure}
                            </span>
                          </td>

                          <td>{statistic.order}</td>

                          <td>
                            <span
                              className={`placement-status ${
                                statistic.isActive === false
                                  ? "draft"
                                  : "published"
                              }`}
                            >
                              {statistic.isActive === false
                                ? "Inactive"
                                : "Active"}
                            </span>
                          </td>

                          <td>
                            <div className="placement-row-actions">
                              <button
                                className="placement-edit-btn"
                                title="Edit"
                                onClick={() =>
                                  openEditStatisticsModal(statistic)
                                }
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="placement-delete-btn"
                                title="Delete"
                                onClick={() =>
                                  handleDeleteStatistics(statistic)
                                }
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
        </>
      )}

      {/* =====================================================
          MODULE 3 - PLACEMENT HIGHLIGHTS
          UPDATED - CONNECTED TO BACKEND
      ===================================================== */}

      {activeModule === "highlights" && (
        <>
          <div className="placement-record-summary">
            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaTrophy />
              </div>

              <div>
                <span>Total Highlights</span>

                <strong>{totalHighlights}</strong>
              </div>
            </div>

            <div className="placement-record-summary-card">
              <div className="placement-record-summary-icon">
                <FaCheckCircle />
              </div>

              <div>
                <span>Published</span>

                <strong>{publishedHighlights}</strong>
              </div>
            </div>
          </div>

          <div className="placement-record-section">
            <div className="placement-record-section-header">
              <div>
                <h2>Placement Highlights</h2>

                <p>Manage important placement achievements and highlights.</p>
              </div>

              <button
                className="placement-primary-btn"
                onClick={openAddHighlightModal}
              >
                <FaPlus />
                Add Highlight
              </button>
            </div>

            {loading ? (
              <div className="placement-record-loading">
                <div className="placement-spinner"></div>

                <p>Loading placement highlights...</p>
              </div>
            ) : placementHighlights.length === 0 ? (
              <div className="placement-record-empty">
                <FaTrophy />

                <h3>No placement highlights</h3>

                <p>Add your first placement highlight.</p>
              </div>
            ) : (
              <div className="placement-record-table-wrapper">
                <table className="placement-record-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...placementHighlights]
                      .sort(
                        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
                      )
                      .map((highlight) => (
                        <tr key={highlight._id || highlight.id}>
                          <td>
                            <strong>{highlight.title}</strong>
                          </td>

                          <td>
                            <span className="placement-highlight-description">
                              {highlight.description || "—"}
                            </span>
                          </td>

                          <td>{highlight.displayOrder}</td>

                          <td>
                            <span
                              className={`placement-status ${
                                highlight.isPublished === false
                                  ? "draft"
                                  : "published"
                              }`}
                            >
                              {highlight.isPublished === false
                                ? "Draft"
                                : "Published"}
                            </span>
                          </td>

                          <td>
                            <div className="placement-row-actions">
                              <button
                                className="placement-edit-btn"
                                title="Edit"
                                onClick={() =>
                                  openEditHighlightModal(highlight)
                                }
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="placement-delete-btn"
                                title="Delete"
                                onClick={() => handleDeleteHighlight(highlight)}
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
        </>
      )}

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="placement-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <div className="placement-modal">
            <div className="placement-modal-header">
              <div>
                <h2>
                  {modalType === "student" &&
                    (editingItem
                      ? "Edit Placement Record"
                      : "Add Placement Record")}

                  {modalType === "statistics" &&
                    (editingItem
                      ? "Edit Placement Statistic"
                      : "Add Placement Statistic")}

                  {modalType === "highlight" &&
                    (editingItem
                      ? "Edit Placement Highlight"
                      : "Add Placement Highlight")}
                </h2>
              </div>

              <button
                className="placement-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* =================================================
                STUDENT FORM
            ================================================= */}

            {modalType === "student" && (
              <form
                className="placement-record-form"
                onSubmit={handleStudentSubmit}
              >
                <div className="placement-form-grid">
                  <div className="placement-form-group">
                    <label>Student Name *</label>

                    <input
                      type="text"
                      name="name"
                      value={studentForm.name}
                      onChange={handleStudentChange}
                      placeholder="Enter student name"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Roll No. *</label>

                    <input
                      type="text"
                      name="rollNo"
                      value={studentForm.rollNo}
                      onChange={handleStudentChange}
                      placeholder="Enter roll number"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Branch *</label>

                    <input
                      type="text"
                      name="branch"
                      value={studentForm.branch}
                      onChange={handleStudentChange}
                      placeholder="e.g. MCA"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Placed In *</label>

                    <input
                      type="text"
                      name="placedIn"
                      value={studentForm.placedIn}
                      onChange={handleStudentChange}
                      placeholder="Company name"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Batch *</label>

                    <input
                      type="text"
                      name="batch"
                      value={studentForm.batch}
                      onChange={handleStudentChange}
                      placeholder="e.g. 2024-26"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Display Order</label>

                    <input
                      type="number"
                      name="displayOrder"
                      value={studentForm.displayOrder}
                      onChange={handleStudentChange}
                    />
                  </div>

                  <div className="placement-form-group placement-form-full">
                    <label className="placement-publish-checkbox">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={studentForm.isPublished}
                        onChange={handleStudentChange}
                      />

                      <span>Publish this placement record</span>
                    </label>
                  </div>
                </div>

                <div className="placement-modal-actions">
                  <button
                    type="button"
                    className="placement-modal-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="placement-modal-save"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                        ? "Update Record"
                        : "Save Record"}
                  </button>
                </div>
              </form>
            )}

            {/* =================================================
                STATISTICS FORM
            ================================================= */}

            {modalType === "statistics" && (
              <form
                className="placement-record-form"
                onSubmit={handleStatisticsSubmit}
              >
                <div className="placement-form-grid">
                  <div className="placement-form-group">
                    <label>Statistic Type *</label>

                    <select
                      name="type"
                      value={statisticsForm.type}
                      onChange={handleStatisticsChange}
                    >
                      <option value="highest-package">Highest Package</option>

                      <option value="average-ctc">Average CTC</option>

                      <option value="recruiters">Recruiters</option>

                      <option value="placements">Placements</option>
                    </select>
                  </div>

                  <div className="placement-form-group">
                    <label>Figure *</label>

                    <input
                      type="text"
                      name="figure"
                      value={statisticsForm.figure}
                      onChange={handleStatisticsChange}
                      placeholder="e.g. ₹12 LPA"
                      required
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Display Order</label>

                    <input
                      type="number"
                      name="order"
                      value={statisticsForm.order}
                      onChange={handleStatisticsChange}
                      min="1"
                    />
                  </div>

                  <div className="placement-form-group placement-form-full">
                    <label className="placement-publish-checkbox">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={statisticsForm.isActive}
                        onChange={handleStatisticsChange}
                      />

                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="placement-modal-actions">
                  <button
                    type="button"
                    className="placement-modal-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="placement-modal-save"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                        ? "Update Statistic"
                        : "Save Statistic"}
                  </button>
                </div>
              </form>
            )}

            {/* =================================================
                HIGHLIGHT FORM
            ================================================= */}

            {modalType === "highlight" && (
              <form
                className="placement-record-form"
                onSubmit={handleHighlightSubmit}
              >
                <div className="placement-form-grid">
                  <div className="placement-form-group placement-form-full">
                    <label>Highlight Title *</label>

                    <input
                      type="text"
                      name="title"
                      value={highlightForm.title}
                      onChange={handleHighlightChange}
                      placeholder="Enter placement highlight title"
                      required
                    />
                  </div>

                  <div className="placement-form-group placement-form-full">
                    <label>Description</label>

                    <textarea
                      name="description"
                      value={highlightForm.description}
                      onChange={handleHighlightChange}
                      placeholder="Enter highlight description"
                      rows="5"
                    />
                  </div>

                  <div className="placement-form-group">
                    <label>Display Order</label>

                    <input
                      type="number"
                      name="displayOrder"
                      value={highlightForm.displayOrder}
                      onChange={handleHighlightChange}
                      min="0"
                    />
                  </div>

                  <div className="placement-form-group placement-form-full">
                    <label className="placement-publish-checkbox">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={highlightForm.isPublished}
                        onChange={handleHighlightChange}
                      />

                      <span>Publish this placement highlight</span>
                    </label>
                  </div>
                </div>

                <div className="placement-modal-actions">
                  <button
                    type="button"
                    className="placement-modal-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="placement-modal-save"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                        ? "Update Highlight"
                        : "Save Highlight"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementRecordAdmin;
