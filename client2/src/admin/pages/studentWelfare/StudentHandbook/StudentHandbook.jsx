import React, { useEffect, useState } from "react";

import {
  FaBook,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaPlus,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  getStudentHandbooks,
  createStudentHandbook,
  updateStudentHandbook,
  deleteStudentHandbook,
  toggleStudentHandbookStatus,
} from "../../../services/studentHandbookService";

import "./StudentHandbook.css";

const StudentHandbook = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [handbooks, setHandbooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] = useState({
    title: "",
    pdfLink: "",
    displayOrder: 0,
    status: "published",
  });

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadHandbooks = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getStudentHandbooks();

      const data = Array.isArray(response?.data) ? response.data : [];

      setHandbooks(
        [...data].sort(
          (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
        ),
      );
    } catch (err) {
      console.error("Student handbook loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load student handbooks.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHandbooks();
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     ADD
  ========================================================= */

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      title: "",
      pdfLink: "",
      displayOrder: 0,
      status: "published",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      pdfLink: item.pdfLink || "",
      displayOrder: item.displayOrder ?? 0,
      status: item.status || "draft",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingId(null);

    setError("");
  };

  /* =========================================================
     VALIDATE
  ========================================================= */

  const validateForm = () => {
    if (!form.title.trim()) {
      setError("Please enter the student handbook title.");

      return false;
    }

    if (!form.pdfLink.trim()) {
      setError("Please enter the PDF link.");

      return false;
    }

    try {
      new URL(form.pdfLink.trim());
    } catch {
      setError("Please enter a valid PDF URL.");

      return false;
    }

    return true;
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setMessage("");

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: form.title.trim(),

      pdfLink: form.pdfLink.trim(),

      displayOrder: Number(form.displayOrder) || 0,

      status: form.status,
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateStudentHandbook(editingId, payload);

        setMessage("Student handbook updated successfully.");
      } else {
        await createStudentHandbook(payload);

        setMessage("Student handbook created successfully.");
      }

      await loadHandbooks();

      setShowModal(false);

      setEditingId(null);
    } catch (err) {
      console.error("Student handbook save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save student handbook.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student handbook?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setMessage("");

      await deleteStudentHandbook(id);

      setMessage("Student handbook deleted successfully.");

      await loadHandbooks();
    } catch (err) {
      console.error("Student handbook delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete student handbook.",
      );
    }
  };

  /* =========================================================
     TOGGLE STATUS
  ========================================================= */

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      setMessage("");

      await toggleStudentHandbookStatus(id);

      setMessage("Student handbook status updated successfully.");

      await loadHandbooks();
    } catch (err) {
      console.error("Student handbook status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update student handbook status.",
      );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="studentHandbookAdmin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="studentHandbookAdminHeader">
        <div className="studentHandbookAdminHeading">
          <div className="studentHandbookAdminIcon">
            <FaBook />
          </div>

          <div>
            <span>STUDENT SERVICES</span>

            <h1>Student Handbook</h1>

            <p>
              Manage student handbook PDF links displayed on the public website.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="studentHandbookAddButton"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Student Handbook
        </button>
      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {message && <div className="studentHandbookSuccess">{message}</div>}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !showModal && (
        <div className="studentHandbookError">{error}</div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="studentHandbookLoading">
          Loading student handbooks...
        </div>
      ) : handbooks.length === 0 ? (
        /* ===================================================
           EMPTY
        =================================================== */

        <div className="studentHandbookEmpty">
          <div className="studentHandbookEmptyIcon">
            <FaBook />
          </div>

          <h2>No Student Handbook</h2>

          <p>
            Add a student handbook PDF link to display it on the public website.
          </p>

          <button type="button" onClick={handleAdd}>
            <FaPlus />
            Add Student Handbook
          </button>
        </div>
      ) : (
        /* ===================================================
           HANDBOOK LIST
        =================================================== */

        <div className="studentHandbookList">
          {handbooks.map((item, index) => (
            <article className="studentHandbookCard" key={item._id}>
              {/* =========================================
                    NUMBER
                ========================================= */}

              <div className="studentHandbookNumber">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* =========================================
                    ICON
                ========================================= */}

              <div className="studentHandbookCardIcon">
                <FaBook />
              </div>

              {/* =========================================
                    INFORMATION
                ========================================= */}

              <div className="studentHandbookCardInfo">
                <span>STUDENT HANDBOOK</span>

                <h2>{item.title}</h2>

                <div className="studentHandbookMeta">
                  <span>Order: {item.displayOrder ?? 0}</span>

                  <span
                    className={
                      item.status === "published"
                        ? "studentHandbookStatus published"
                        : "studentHandbookStatus draft"
                    }
                  >
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* =========================================
                    ACTIONS
                ========================================= */}

              <div className="studentHandbookActions">
                <a
                  href={item.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studentHandbookViewButton"
                >
                  <FaExternalLinkAlt />
                  View PDF
                </a>

                <button
                  type="button"
                  className="studentHandbookStatusButton"
                  onClick={() => handleToggleStatus(item._id)}
                >
                  {item.status === "published" ? <FaEyeSlash /> : <FaEye />}

                  {item.status === "published" ? "Draft" : "Publish"}
                </button>

                <button
                  type="button"
                  className="studentHandbookEditButton"
                  onClick={() => handleEdit(item)}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="studentHandbookDeleteButton"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="studentHandbookModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="studentHandbookModal">
            {/* ===============================================
                MODAL HEADER
            =============================================== */}

            <div className="studentHandbookModalHeader">
              <div>
                <span>{editingId ? "UPDATE HANDBOOK" : "NEW HANDBOOK"}</span>

                <h2>
                  {editingId ? "Edit Student Handbook" : "Add Student Handbook"}
                </h2>
              </div>

              <button
                type="button"
                className="studentHandbookModalClose"
                onClick={handleClose}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* ===============================================
                MODAL ERROR
            =============================================== */}

            {error && <div className="studentHandbookError">{error}</div>}

            {/* ===============================================
                FORM
            =============================================== */}

            <form className="studentHandbookForm" onSubmit={handleSubmit}>
              {/* =============================================
                  TITLE
              ============================================= */}

              <div className="studentHandbookFormGroup">
                <label htmlFor="title">Handbook Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Student Handbook 2025-26"
                  required
                />
              </div>

              {/* =============================================
                  PDF LINK
              ============================================= */}

              <div className="studentHandbookFormGroup">
                <label htmlFor="pdfLink">PDF Link</label>

                <input
                  id="pdfLink"
                  name="pdfLink"
                  type="url"
                  value={form.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/student-handbook.pdf"
                  required
                />

                <small>
                  Paste the public PDF URL. The PDF itself is not uploaded to
                  the website.
                </small>
              </div>

              {/* =============================================
                  DISPLAY ORDER
              ============================================= */}

              <div className="studentHandbookFormGroup">
                <label htmlFor="displayOrder">Display Order</label>

                <input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={form.displayOrder}
                  onChange={handleChange}
                />

                <small>Lower numbers appear first.</small>
              </div>

              {/* =============================================
                  STATUS
              ============================================= */}

              <div className="studentHandbookFormGroup">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="published">Published</option>

                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* =============================================
                  ACTIONS
              ============================================= */}

              <div className="studentHandbookModalActions">
                <button
                  type="button"
                  className="studentHandbookCancelButton"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="studentHandbookSaveButton"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Handbook"
                      : "Create Handbook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHandbook;
