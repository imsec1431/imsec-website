import React, { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaPlus,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  getLearningDevelopmentCentres,
  createLearningDevelopmentCentre,
  updateLearningDevelopmentCentre,
  deleteLearningDevelopmentCentre,
  toggleLearningDevelopmentCentreStatus,
} from "../../../services/learningDevelopmentCentreService";

import "./LearningDevelopmentCentre.css";

const LearningDevelopmentCentre = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [centres, setCentres] = useState([]);

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

  const loadCentres = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLearningDevelopmentCentres();

      const data = Array.isArray(response?.data) ? response.data : [];

      const sortedData = [...data].sort(
        (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
      );

      setCentres(sortedData);
    } catch (err) {
      console.error("Learning Development Centre loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load Learning Development Centre documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCentres();
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
      setError("Please enter the Learning Development Centre title.");

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
        await updateLearningDevelopmentCentre(editingId, payload);

        setMessage(
          "Learning Development Centre document updated successfully.",
        );
      } else {
        await createLearningDevelopmentCentre(payload);

        setMessage(
          "Learning Development Centre document created successfully.",
        );
      }

      await loadCentres();

      setShowModal(false);

      setEditingId(null);
    } catch (err) {
      console.error("Learning Development Centre save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save Learning Development Centre document.",
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
      "Are you sure you want to delete this Learning Development Centre document?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteLearningDevelopmentCentre(id);

      setMessage("Learning Development Centre document deleted successfully.");

      await loadCentres();
    } catch (err) {
      console.error("Learning Development Centre delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete Learning Development Centre document.",
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

      await toggleLearningDevelopmentCentreStatus(id);

      setMessage("Learning Development Centre status updated successfully.");

      await loadCentres();
    } catch (err) {
      console.error("Learning Development Centre status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update Learning Development Centre status.",
      );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="learningDevelopmentCentreAdmin">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="learningDevelopmentCentreAdminHeader">
        <div className="learningDevelopmentCentreAdminHeading">
          <div className="learningDevelopmentCentreAdminIcon">
            <FaBookOpen />
          </div>

          <div>
            <span>STUDENT DEVELOPMENT</span>

            <h1>Learning Development Centre</h1>

            <p>
              Manage Learning Development Centre PDF documents displayed on the
              public website.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="learningDevelopmentCentreAddButton"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Document
        </button>
      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {message && (
        <div className="learningDevelopmentCentreSuccess">{message}</div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !showModal && (
        <div className="learningDevelopmentCentreError">{error}</div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="learningDevelopmentCentreLoading">
          Loading Learning Development Centre documents...
        </div>
      ) : centres.length === 0 ? (
        /* ===================================================
           EMPTY
        =================================================== */

        <div className="learningDevelopmentCentreEmpty">
          <div className="learningDevelopmentCentreEmptyIcon">
            <FaBookOpen />
          </div>

          <h2>No Documents Available</h2>

          <p>
            Add a Learning Development Centre PDF document to display it on the
            public website.
          </p>

          <button type="button" onClick={handleAdd}>
            <FaPlus />
            Add Document
          </button>
        </div>
      ) : (
        /* ===================================================
           DOCUMENT LIST
        =================================================== */

        <div className="learningDevelopmentCentreList">
          {centres.map((item, index) => (
            <article className="learningDevelopmentCentreCard" key={item._id}>
              {/* =========================================
                    NUMBER
                ========================================= */}

              <div className="learningDevelopmentCentreNumber">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* =========================================
                    ICON
                ========================================= */}

              <div className="learningDevelopmentCentreCardIcon">
                <FaBookOpen />
              </div>

              {/* =========================================
                    INFORMATION
                ========================================= */}

              <div className="learningDevelopmentCentreCardInfo">
                <span>LEARNING DEVELOPMENT CENTRE</span>

                <h2>{item.title}</h2>

                <div className="learningDevelopmentCentreMeta">
                  <span>Order: {item.displayOrder ?? 0}</span>

                  <span
                    className={
                      item.status === "published"
                        ? "learningDevelopmentCentreStatus published"
                        : "learningDevelopmentCentreStatus draft"
                    }
                  >
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* =========================================
                    ACTIONS
                ========================================= */}

              <div className="learningDevelopmentCentreActions">
                <a
                  href={item.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="learningDevelopmentCentreViewButton"
                >
                  <FaExternalLinkAlt />
                  View PDF
                </a>

                <button
                  type="button"
                  className="learningDevelopmentCentreStatusButton"
                  onClick={() => handleToggleStatus(item._id)}
                >
                  {item.status === "published" ? <FaEyeSlash /> : <FaEye />}

                  {item.status === "published" ? "Draft" : "Publish"}
                </button>

                <button
                  type="button"
                  className="learningDevelopmentCentreEditButton"
                  onClick={() => handleEdit(item)}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="learningDevelopmentCentreDeleteButton"
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
          className="learningDevelopmentCentreModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="learningDevelopmentCentreModal">
            {/* ===============================================
                MODAL HEADER
            =============================================== */}

            <div className="learningDevelopmentCentreModalHeader">
              <div>
                <span>{editingId ? "UPDATE DOCUMENT" : "NEW DOCUMENT"}</span>

                <h2>
                  {editingId
                    ? "Edit Learning Development Centre"
                    : "Add Learning Development Centre"}
                </h2>
              </div>

              <button
                type="button"
                className="learningDevelopmentCentreModalClose"
                onClick={handleClose}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* ===============================================
                MODAL ERROR
            =============================================== */}

            {error && (
              <div className="learningDevelopmentCentreError">{error}</div>
            )}

            {/* ===============================================
                FORM
            =============================================== */}

            <form
              className="learningDevelopmentCentreForm"
              onSubmit={handleSubmit}
            >
              {/* =============================================
                  TITLE
              ============================================= */}

              <div className="learningDevelopmentCentreFormGroup">
                <label htmlFor="title">Document Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Learning Development Centre"
                  required
                />
              </div>

              {/* =============================================
                  PDF LINK
              ============================================= */}

              <div className="learningDevelopmentCentreFormGroup">
                <label htmlFor="pdfLink">PDF Link</label>

                <input
                  id="pdfLink"
                  name="pdfLink"
                  type="url"
                  value={form.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/learning-development-centre.pdf"
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

              <div className="learningDevelopmentCentreFormGroup">
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

              <div className="learningDevelopmentCentreFormGroup">
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

              <div className="learningDevelopmentCentreModalActions">
                <button
                  type="button"
                  className="learningDevelopmentCentreCancelButton"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="learningDevelopmentCentreSaveButton"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Document"
                      : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningDevelopmentCentre;
