import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBell,
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt,
  FaSave,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "../auth/AccessDenied";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./StudentCorner.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const StudentCorner = () => {
  const navigate = useNavigate();
  const { slug, departmentId } = useParams();
  const { admin } = useAuth();

  const isSubAdmin = admin?.role === "Sub Admin";

  /* =====================================================
     SUB ADMIN - STUDENT CORNER PERMISSION
  ===================================================== */

  const departmentPermission = isSubAdmin
    ? (admin?.permissions?.departments || []).find(
        (department) =>
          department?.slug?.toLowerCase() === slug?.toLowerCase() ||
          String(department?.departmentId || department?._id) ===
            String(departmentId),
      )
    : null;

  const studentCornerPermission = departmentPermission?.modules?.find(
    (module) => module?.key === "student-corner",
  );

  const canManageStudentCorner =
    !isSubAdmin ||
    (departmentPermission?.enabled === true &&
      (studentCornerPermission?.enabled === true ||
        studentCornerPermission?.subModules?.some(
          (subModule) => subModule?.enabled === true,
        )));

  /* =====================================================
     AUTH HEADERS
  ===================================================== */

  const authHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("adminToken");

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /*
   * If your route gives departmentId directly,
   * it will use that.
   *
   * If your route uses slug, replace this with
   * your existing department ID logic.
   */
  const currentDepartmentId = departmentId || slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [exists, setExists] = useState(false);

  const [notices, setNotices] = useState([]);
  const [timeTables, setTimeTables] = useState([]);
  const [syllabus, setSyllabus] = useState([]);

  const [status, setStatus] = useState("Active");

  /* =====================================================
     MODAL STATES
  ===================================================== */

  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const [showTimeTableModal, setShowTimeTableModal] = useState(false);

  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);

  const [messageType, setMessageType] = useState("success");

  const [message, setMessage] = useState("");

  const [deleteType, setDeleteType] = useState("");

  const [deleteIndex, setDeleteIndex] = useState(null);

  /* =====================================================
     FORM STATES
  ===================================================== */

  const emptyNotice = {
    title: "",
    date: "",
    driveLink: "",
    displayOrder: 1,
    isActive: true,
  };

  const emptyTimeTable = {
    semester: "",
    title: "",
    subtitle: "Class Time Table",
    driveLink: "",
    displayOrder: 1,
    isActive: true,
  };

  const emptySyllabus = {
    semester: "",
    title: "",
    description: "",
    driveLink: "",
    displayOrder: 1,
    isActive: true,
  };

  const [noticeForm, setNoticeForm] = useState(emptyNotice);

  const [timeTableForm, setTimeTableForm] = useState(emptyTimeTable);

  const [syllabusForm, setSyllabusForm] = useState(emptySyllabus);

  const [editingNoticeIndex, setEditingNoticeIndex] = useState(null);

  const [editingTimeTableIndex, setEditingTimeTableIndex] = useState(null);

  const [editingSyllabusIndex, setEditingSyllabusIndex] = useState(null);

  /* =====================================================
     MESSAGE MODAL
  ===================================================== */

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setShowMessageModal(true);
  };

  /* =====================================================
     FETCH DATA
  ===================================================== */

  const fetchStudentCorner = async () => {
    if (isSubAdmin && !canManageStudentCorner) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/student-corner/${currentDepartmentId}`,
        {
          headers: authHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch Student Corner");
      }

      if (!result.exists || !result.data) {
        setExists(false);
        setNotices([]);
        setTimeTables([]);
        setSyllabus([]);
        return;
      }

      setExists(true);

      const data = result.data;

      setNotices(data.notices || []);
      setTimeTables(data.timeTables || []);
      setSyllabus(data.syllabus || []);

      setStatus(data.status || "Active");
    } catch (error) {
      console.error(error);

      showMessage("error", error.message || "Failed to load Student Corner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCorner();
  }, [currentDepartmentId, isSubAdmin, canManageStudentCorner]);

  /* =====================================================
     GOOGLE DRIVE VALIDATION
  ===================================================== */

  const isValidDriveLink = (link) => {
    return (
      link.includes("drive.google.com") || link.includes("docs.google.com")
    );
  };

  /* =====================================================
     ADD / EDIT NOTICE
  ===================================================== */

  const openNoticeModal = (index = null) => {
    if (!canManageStudentCorner) return;

    if (index !== null) {
      setEditingNoticeIndex(index);

      setNoticeForm({
        ...notices[index],
        date: notices[index].date ? notices[index].date.substring(0, 10) : "",
      });
    } else {
      setEditingNoticeIndex(null);

      setNoticeForm({
        ...emptyNotice,
        displayOrder: notices.length + 1,
      });
    }

    setShowNoticeModal(true);
  };

  const saveNotice = () => {
    if (!canManageStudentCorner) return;

    if (!noticeForm.title.trim()) {
      showMessage("error", "Notice title is required.");
      return;
    }

    if (!noticeForm.date) {
      showMessage("error", "Published date is required.");
      return;
    }

    if (!noticeForm.driveLink.trim()) {
      showMessage("error", "Google Drive link is required.");
      return;
    }

    if (!isValidDriveLink(noticeForm.driveLink.trim())) {
      showMessage("error", "Please enter a valid Google Drive link.");
      return;
    }

    const updated = [...notices];

    if (editingNoticeIndex !== null) {
      updated[editingNoticeIndex] = {
        ...noticeForm,
        _id: notices[editingNoticeIndex]._id,
      };
    } else {
      updated.push({
        ...noticeForm,
      });
    }

    setNotices(updated);
    setShowNoticeModal(false);
  };

  /* =====================================================
     ADD / EDIT TIME TABLE
  ===================================================== */

  const openTimeTableModal = (index = null) => {
    if (!canManageStudentCorner) return;

    if (index !== null) {
      setEditingTimeTableIndex(index);

      setTimeTableForm({
        ...timeTables[index],
      });
    } else {
      setEditingTimeTableIndex(null);

      setTimeTableForm({
        ...emptyTimeTable,
        displayOrder: timeTables.length + 1,
      });
    }

    setShowTimeTableModal(true);
  };

  const saveTimeTable = () => {
    if (!canManageStudentCorner) return;

    if (!timeTableForm.semester.trim()) {
      showMessage("error", "Semester is required.");
      return;
    }

    if (!timeTableForm.title.trim()) {
      showMessage("error", "Time table title is required.");
      return;
    }

    if (!timeTableForm.driveLink.trim()) {
      showMessage("error", "Google Drive link is required.");
      return;
    }

    if (!isValidDriveLink(timeTableForm.driveLink.trim())) {
      showMessage("error", "Please enter a valid Google Drive link.");
      return;
    }

    const updated = [...timeTables];

    if (editingTimeTableIndex !== null) {
      updated[editingTimeTableIndex] = {
        ...timeTableForm,
        _id: timeTables[editingTimeTableIndex]._id,
      };
    } else {
      updated.push({
        ...timeTableForm,
      });
    }

    setTimeTables(updated);
    setShowTimeTableModal(false);
  };

  /* =====================================================
     ADD / EDIT SYLLABUS
  ===================================================== */

  const openSyllabusModal = (index = null) => {
    if (!canManageStudentCorner) return;

    if (index !== null) {
      setEditingSyllabusIndex(index);

      setSyllabusForm({
        ...syllabus[index],
      });
    } else {
      setEditingSyllabusIndex(null);

      setSyllabusForm({
        ...emptySyllabus,
        displayOrder: syllabus.length + 1,
      });
    }

    setShowSyllabusModal(true);
  };

  const saveSyllabus = () => {
    if (!canManageStudentCorner) return;

    if (!syllabusForm.semester.trim()) {
      showMessage("error", "Semester is required.");
      return;
    }

    if (!syllabusForm.title.trim()) {
      showMessage("error", "Syllabus title is required.");
      return;
    }

    if (!syllabusForm.driveLink.trim()) {
      showMessage("error", "Google Drive link is required.");
      return;
    }

    if (!isValidDriveLink(syllabusForm.driveLink.trim())) {
      showMessage("error", "Please enter a valid Google Drive link.");
      return;
    }

    const updated = [...syllabus];

    if (editingSyllabusIndex !== null) {
      updated[editingSyllabusIndex] = {
        ...syllabusForm,
        _id: syllabus[editingSyllabusIndex]._id,
      };
    } else {
      updated.push({
        ...syllabusForm,
      });
    }

    setSyllabus(updated);
    setShowSyllabusModal(false);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const openDeleteModal = (type, index) => {
    if (!canManageStudentCorner) return;

    setDeleteType(type);
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canManageStudentCorner) return;

    if (deleteIndex === null) return;

    if (deleteType === "notice") {
      setNotices(notices.filter((_, index) => index !== deleteIndex));
    }

    if (deleteType === "timetable") {
      setTimeTables(timeTables.filter((_, index) => index !== deleteIndex));
    }

    if (deleteType === "syllabus") {
      setSyllabus(syllabus.filter((_, index) => index !== deleteIndex));
    }

    setDeleteIndex(null);
    setDeleteType("");
    setShowDeleteModal(false);
  };

  /* =====================================================
     SAVE COMPLETE STUDENT CORNER
  ===================================================== */

  const saveStudentCorner = async () => {
    if (!canManageStudentCorner) {
      showMessage(
        "error",
        "You do not have permission to manage Student Corner.",
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        departmentId: currentDepartmentId,

        notices: notices.map((item, index) => ({
          ...(item._id ? { _id: item._id } : {}),

          title: item.title.trim(),

          date: item.date,

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        })),

        timeTables: timeTables.map((item, index) => ({
          ...(item._id ? { _id: item._id } : {}),

          semester: item.semester.trim(),

          title: item.title.trim(),

          subtitle: item.subtitle?.trim() || "Class Time Table",

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        })),

        syllabus: syllabus.map((item, index) => ({
          ...(item._id ? { _id: item._id } : {}),

          semester: item.semester.trim(),

          title: item.title.trim(),

          description: item.description?.trim() || "",

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        })),

        status,
      };

      const url = exists
        ? `${API_URL}/api/student-corner/${currentDepartmentId}`
        : `${API_URL}/api/student-corner`;

      const response = await fetch(url, {
        method: exists ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save Student Corner");
      }

      setExists(true);

      await fetchStudentCorner();

      showMessage(
        "success",
        exists
          ? "Student Corner updated successfully."
          : "Student Corner created successfully.",
      );
    } catch (error) {
      console.error(error);

      showMessage("error", error.message || "Failed to save Student Corner.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     ACCESS DENIED
  ===================================================== */

  if (isSubAdmin && !canManageStudentCorner) {
    return <AccessDenied />;
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="student-corner-loading">
        <div className="student-corner-spinner"></div>

        <p>Loading Student Corner...</p>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="student-corner-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-corner-header">
        <button className="student-corner-back" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>

        <div className="student-corner-header-content">
          <div>
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>Student Corner</h1>

            <p>Manage notices, time tables and syllabus documents.</p>
          </div>

          <div>
            <button
              className="student-corner-save-btn"
              onClick={saveStudentCorner}
              disabled={saving || !canManageStudentCorner}
            >
              <FaSave />

              {saving
                ? "Saving..."
                : exists
                  ? "Update Student Corner"
                  : "Create Student Corner"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          STATUS
      ================================================= */}

      <div className="student-corner-card">
        <div className="student-corner-status">
          <div>
            <strong>Student Corner Status</strong>

            <small>
              Control whether the Student Corner is visible on the public
              website.
            </small>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!canManageStudentCorner}
          >
            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* =================================================
          NOTICES
      ================================================= */}

      <div className="student-corner-card">
        <div className="student-corner-card-header">
          <div>
            <span>STUDENT NOTICES</span>

            <h2>Notices</h2>

            <p>Manage important academic notices and announcements.</p>
          </div>

          <button
            className="student-corner-add-btn"
            onClick={() => openNoticeModal()}
            disabled={!canManageStudentCorner}
          >
            <FaPlus />
            Add Notice
          </button>
        </div>

        {notices.length === 0 ? (
          <div className="student-corner-empty">
            <FaBell />

            <h3>No Notices Added</h3>

            <p>Add the first student notice.</p>
          </div>
        ) : (
          <div className="student-corner-table-wrapper">
            <table className="student-corner-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Google Drive</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {notices
                  .sort(
                    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
                  )
                  .map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.title}</strong>
                      </td>

                      <td>
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                      <td>
                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="student-corner-link"
                        >
                          <FaExternalLinkAlt />
                          Open
                        </a>
                      </td>

                      <td>{item.displayOrder}</td>

                      <td>
                        <span
                          className={
                            item.isActive ? "status-active" : "status-inactive"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="student-corner-actions">
                          <button
                            onClick={() => openNoticeModal(index)}
                            title="Edit"
                            disabled={!canManageStudentCorner}
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => openDeleteModal("notice", index)}
                            title="Delete"
                            disabled={!canManageStudentCorner}
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

      {/* =================================================
          TIME TABLE
      ================================================= */}

      <div className="student-corner-card">
        <div className="student-corner-card-header">
          <div>
            <span>ACADEMIC SCHEDULE</span>

            <h2>Time Table</h2>

            <p>Manage semester-wise class time table documents.</p>
          </div>

          <button
            className="student-corner-add-btn"
            onClick={() => openTimeTableModal()}
            disabled={!canManageStudentCorner}
          >
            <FaPlus />
            Add Time Table
          </button>
        </div>

        {timeTables.length === 0 ? (
          <div className="student-corner-empty">
            <FaClock />

            <h3>No Time Tables Added</h3>

            <p>Add semester time tables.</p>
          </div>
        ) : (
          <div className="student-corner-table-wrapper">
            <table className="student-corner-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Semester</th>
                  <th>Title</th>
                  <th>Google Drive</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {timeTables
                  .sort(
                    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
                  )
                  .map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.semester}</strong>
                      </td>

                      <td>{item.title}</td>

                      <td>
                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="student-corner-link"
                        >
                          <FaExternalLinkAlt />
                          Open
                        </a>
                      </td>

                      <td>{item.displayOrder}</td>

                      <td>
                        <span
                          className={
                            item.isActive ? "status-active" : "status-inactive"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="student-corner-actions">
                          <button
                            onClick={() => openTimeTableModal(index)}
                            disabled={!canManageStudentCorner}
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => openDeleteModal("timetable", index)}
                            disabled={!canManageStudentCorner}
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

      {/* =================================================
          SYLLABUS
      ================================================= */}

      <div className="student-corner-card">
        <div className="student-corner-card-header">
          <div>
            <span>ACADEMIC CURRICULUM</span>

            <h2>Syllabus</h2>

            <p>Manage semester-wise syllabus documents.</p>
          </div>

          <button
            className="student-corner-add-btn"
            onClick={() => openSyllabusModal()}
            disabled={!canManageStudentCorner}
          >
            <FaPlus />
            Add Syllabus
          </button>
        </div>

        {syllabus.length === 0 ? (
          <div className="student-corner-empty">
            <FaBook />

            <h3>No Syllabus Added</h3>

            <p>Add semester syllabus documents.</p>
          </div>
        ) : (
          <div className="student-corner-table-wrapper">
            <table className="student-corner-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Semester</th>
                  <th>Title</th>
                  <th>Google Drive</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {syllabus
                  .sort(
                    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
                  )
                  .map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.semester}</strong>
                      </td>

                      <td>
                        <strong>{item.title}</strong>

                        <small className="table-description">
                          {item.description}
                        </small>
                      </td>

                      <td>
                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="student-corner-link"
                        >
                          <FaExternalLinkAlt />
                          Open
                        </a>
                      </td>

                      <td>{item.displayOrder}</td>

                      <td>
                        <span
                          className={
                            item.isActive ? "status-active" : "status-inactive"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="student-corner-actions">
                          <button
                            onClick={() => openSyllabusModal(index)}
                            disabled={!canManageStudentCorner}
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => openDeleteModal("syllabus", index)}
                            disabled={!canManageStudentCorner}
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

      {/* =================================================
          NOTICE MODAL
      ================================================= */}

      <Modal
        show={showNoticeModal}
        onHide={() => setShowNoticeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingNoticeIndex !== null ? "Edit Notice" : "Add Notice"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="student-corner-form">
            <label>Notice Title</label>

            <input
              type="text"
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  title: e.target.value,
                })
              }
              placeholder="Enter notice title"
            />

            <label>Published Date</label>

            <input
              type="date"
              value={noticeForm.date}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  date: e.target.value,
                })
              }
            />

            <label>Google Drive Link</label>

            <input
              type="url"
              value={noticeForm.driveLink}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  driveLink: e.target.value,
                })
              }
              placeholder="https://drive.google.com/..."
            />

            <label>Display Order</label>

            <input
              type="number"
              min="1"
              value={noticeForm.displayOrder}
              onChange={(e) =>
                setNoticeForm({
                  ...noticeForm,
                  displayOrder: e.target.value,
                })
              }
            />

            <label className="student-corner-checkbox">
              <input
                type="checkbox"
                checked={noticeForm.isActive}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoticeModal(false)}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={saveNotice}
            disabled={!canManageStudentCorner}
          >
            Save Notice
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          TIME TABLE MODAL
      ================================================= */}

      <Modal
        show={showTimeTableModal}
        onHide={() => setShowTimeTableModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTimeTableIndex !== null
              ? "Edit Time Table"
              : "Add Time Table"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="student-corner-form">
            <label>Semester</label>

            <input
              type="text"
              value={timeTableForm.semester}
              onChange={(e) =>
                setTimeTableForm({
                  ...timeTableForm,
                  semester: e.target.value,
                })
              }
              placeholder="e.g. I Semester"
            />

            <label>Title</label>

            <input
              type="text"
              value={timeTableForm.title}
              onChange={(e) =>
                setTimeTableForm({
                  ...timeTableForm,
                  title: e.target.value,
                })
              }
              placeholder="e.g. MCA I Semester"
            />

            <label>Subtitle</label>

            <input
              type="text"
              value={timeTableForm.subtitle}
              onChange={(e) =>
                setTimeTableForm({
                  ...timeTableForm,
                  subtitle: e.target.value,
                })
              }
            />

            <label>Google Drive Link</label>

            <input
              type="url"
              value={timeTableForm.driveLink}
              onChange={(e) =>
                setTimeTableForm({
                  ...timeTableForm,
                  driveLink: e.target.value,
                })
              }
              placeholder="https://drive.google.com/..."
            />

            <label>Display Order</label>

            <input
              type="number"
              min="1"
              value={timeTableForm.displayOrder}
              onChange={(e) =>
                setTimeTableForm({
                  ...timeTableForm,
                  displayOrder: e.target.value,
                })
              }
            />

            <label className="student-corner-checkbox">
              <input
                type="checkbox"
                checked={timeTableForm.isActive}
                onChange={(e) =>
                  setTimeTableForm({
                    ...timeTableForm,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTimeTableModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={saveTimeTable}
            disabled={!canManageStudentCorner}
          >
            Save Time Table
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          SYLLABUS MODAL
      ================================================= */}

      <Modal
        show={showSyllabusModal}
        onHide={() => setShowSyllabusModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSyllabusIndex !== null ? "Edit Syllabus" : "Add Syllabus"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="student-corner-form">
            <label>Semester</label>

            <input
              type="text"
              value={syllabusForm.semester}
              onChange={(e) =>
                setSyllabusForm({
                  ...syllabusForm,
                  semester: e.target.value,
                })
              }
              placeholder="e.g. I Semester"
            />

            <label>Title</label>

            <input
              type="text"
              value={syllabusForm.title}
              onChange={(e) =>
                setSyllabusForm({
                  ...syllabusForm,
                  title: e.target.value,
                })
              }
              placeholder="e.g. MCA Syllabus"
            />

            <label>Description</label>

            <textarea
              rows="4"
              value={syllabusForm.description}
              onChange={(e) =>
                setSyllabusForm({
                  ...syllabusForm,
                  description: e.target.value,
                })
              }
              placeholder="Enter syllabus description"
            />

            <label>Google Drive Link</label>

            <input
              type="url"
              value={syllabusForm.driveLink}
              onChange={(e) =>
                setSyllabusForm({
                  ...syllabusForm,
                  driveLink: e.target.value,
                })
              }
              placeholder="https://drive.google.com/..."
            />

            <label>Display Order</label>

            <input
              type="number"
              min="1"
              value={syllabusForm.displayOrder}
              onChange={(e) =>
                setSyllabusForm({
                  ...syllabusForm,
                  displayOrder: e.target.value,
                })
              }
            />

            <label className="student-corner-checkbox">
              <input
                type="checkbox"
                checked={syllabusForm.isActive}
                onChange={(e) =>
                  setSyllabusForm({
                    ...syllabusForm,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSyllabusModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={saveSyllabus}
            disabled={!canManageStudentCorner}
          >
            Save Syllabus
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="student-corner-delete-modal">
            <FaTrash />

            <h4>Delete this item?</h4>

            <p>This item will be removed from the Student Corner.</p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={!canManageStudentCorner}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          SUCCESS / ERROR MODAL
      ================================================= */}

      <Modal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        centered
      >
        <Modal.Body>
          <div
            className={`student-corner-message ${
              messageType === "success" ? "success" : "error"
            }`}
          >
            <div className="message-icon">
              {messageType === "success" ? "✓" : "!"}
            </div>

            <h4>{messageType === "success" ? "Success" : "Error"}</h4>

            <p>{message}</p>

            <Button
              variant={messageType === "success" ? "primary" : "danger"}
              onClick={() => setShowMessageModal(false)}
            >
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentCorner;
