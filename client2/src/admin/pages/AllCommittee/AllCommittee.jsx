import React, { useEffect, useState } from "react";

import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaExternalLinkAlt,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";

import {
  getAllCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee,
} from "../../services/allCommitteeService";

import "./AllCommittee.css";

/* =========================================================
   COMPONENT
========================================================= */

const AllCommittee = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [committees, setCommittees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({
    committeeName: "",
    pdfLink: "",
    displayOrder: 0,
    status: "published",
  });

  /* =======================================================
     LOAD COMMITTEES
  ======================================================= */

  const loadCommittees = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAllCommittees();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setCommittees(data);
    } catch (err) {
      console.error("Committee loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load committees.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommittees();
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      committeeName: "",
      pdfLink: "",
      displayOrder: 0,
      status: "published",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      committeeName: item.committeeName || "",

      pdfLink: item.pdfLink || "",

      displayOrder: item.displayOrder ?? 0,

      status: item.status || "draft",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingId(null);

    setError("");
  };

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {
    if (!form.committeeName.trim()) {
      setError("Please enter the committee name.");

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

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        committeeName: form.committeeName.trim(),

        pdfLink: form.pdfLink.trim(),

        displayOrder: Number(form.displayOrder) || 0,

        status: form.status,
      };

      if (editingId) {
        await updateCommittee(editingId, payload);

        setMessage("Committee updated successfully.");
      } else {
        await createCommittee(payload);

        setMessage("Committee created successfully.");
      }

      await loadCommittees();

      setShowModal(false);

      setEditingId(null);
    } catch (err) {
      console.error("Committee save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save committee.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this committee?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setMessage("");

      await deleteCommittee(id);

      setMessage("Committee deleted successfully.");

      await loadCommittees();
    } catch (err) {
      console.error("Committee delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete committee.",
      );
    }
  };

  /* =======================================================
     SORT
  ======================================================= */

  const sortedCommittees = [...committees].sort((a, b) => {
    const orderDifference =
      Number(a.displayOrder || 0) - Number(b.displayOrder || 0);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return String(a.committeeName || "").localeCompare(
      String(b.committeeName || ""),
    );
  });

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="allCommitteeAdminPage">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="allCommitteeAdminHeader">
        <div className="allCommitteeAdminHeading">
          <div className="allCommitteeAdminIcon">
            <FaUsers />
          </div>

          <div>
            <span>ACADEMIC MANAGEMENT</span>

            <h1>All Committees</h1>

            <p>Manage committee names and their official PDF documents.</p>
          </div>
        </div>

        <button
          type="button"
          className="allCommitteeAddButton"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Committee
        </button>
      </div>

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {message && <div className="allCommitteeSuccess">{message}</div>}

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && !showModal && <div className="allCommitteeError">{error}</div>}

      {/* ===================================================
          STATS
      =================================================== */}

      {!loading && committees.length > 0 && (
        <div className="allCommitteeStats">
          <div className="allCommitteeStat">
            <div>
              <FaUsers />
            </div>

            <section>
              <strong>{committees.length}</strong>

              <span>Total Committees</span>
            </section>
          </div>

          <div className="allCommitteeStat">
            <div>
              <FaFilePdf />
            </div>

            <section>
              <strong>
                {
                  committees.filter((item) => item.status === "published")
                    .length
                }
              </strong>

              <span>Published</span>
            </section>
          </div>

          <div className="allCommitteeStat">
            <div>
              <FaEdit />
            </div>

            <section>
              <strong>
                {committees.filter((item) => item.status === "draft").length}
              </strong>

              <span>Draft</span>
            </section>
          </div>
        </div>
      )}

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (
        <div className="allCommitteeLoading">Loading committees...</div>
      ) : committees.length === 0 ? (
        /* =================================================
           EMPTY
        ================================================= */

        <div className="allCommitteeEmpty">
          <div className="allCommitteeEmptyIcon">
            <FaUsers />
          </div>

          <h2>No Committees Added</h2>

          <p>
            Add a committee with its PDF document to display it on the public
            website.
          </p>

          <button type="button" onClick={handleAdd}>
            <FaPlus />
            Add Committee
          </button>
        </div>
      ) : (
        /* =================================================
           COMMITTEE LIST
        ================================================= */

        <div className="allCommitteeList">
          {sortedCommittees.map((item, index) => (
            <article className="allCommitteeCard" key={item._id}>
              {/* =========================================
                    NUMBER
                ========================================= */}

              <div className="allCommitteeNumber">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* =========================================
                    PDF ICON
                ========================================= */}

              <div className="allCommitteePdfIcon">
                <FaFilePdf />
              </div>

              {/* =========================================
                    CONTENT
                ========================================= */}

              <div className="allCommitteeContent">
                <span>COMMITTEE</span>

                <h3>{item.committeeName}</h3>

                <div className="allCommitteeMeta">
                  <span>Order: {item.displayOrder ?? 0}</span>

                  <span
                    className={
                      item.status === "published"
                        ? "committeeStatus published"
                        : "committeeStatus draft"
                    }
                  >
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* =========================================
                    ACTIONS
                ========================================= */}

              <div className="allCommitteeActions">
                <a
                  href={item.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="committeeViewButton"
                >
                  <FaExternalLinkAlt />
                  View PDF
                </a>

                <a
                  href={item.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="committeeDownloadButton"
                >
                  <FaDownload />
                  Download
                </a>

                <button
                  type="button"
                  className="committeeEditButton"
                  onClick={() => handleEdit(item)}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  className="committeeDeleteButton"
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

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showModal && (
        <div
          className="allCommitteeModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="allCommitteeModal">
            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="allCommitteeModalHeader">
              <div>
                <span>{editingId ? "UPDATE COMMITTEE" : "NEW COMMITTEE"}</span>

                <h2>{editingId ? "Edit Committee" : "Add Committee"}</h2>
              </div>

              <button
                type="button"
                className="allCommitteeModalClose"
                onClick={handleClose}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* =============================================
                MODAL ERROR
            ============================================= */}

            {error && <div className="allCommitteeError">{error}</div>}

            {/* =============================================
                FORM
            ============================================= */}

            <form className="allCommitteeForm" onSubmit={handleSubmit}>
              {/* ===========================================
                  COMMITTEE NAME
              =========================================== */}

              <div className="allCommitteeFormGroup">
                <label htmlFor="committeeName">Committee Name</label>

                <input
                  id="committeeName"
                  name="committeeName"
                  type="text"
                  value={form.committeeName}
                  onChange={handleChange}
                  placeholder="Internal Complaints Committee"
                  required
                />
              </div>

              {/* ===========================================
                  PDF LINK
              =========================================== */}

              <div className="allCommitteeFormGroup">
                <label htmlFor="pdfLink">PDF Link</label>

                <input
                  id="pdfLink"
                  name="pdfLink"
                  type="url"
                  value={form.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/committee.pdf"
                  required
                />

                <small>
                  Paste the public PDF URL. The PDF itself is not uploaded to
                  the website.
                </small>
              </div>

              {/* ===========================================
                  DISPLAY ORDER
              =========================================== */}

              <div className="allCommitteeFormGroup">
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

              {/* ===========================================
                  STATUS
              =========================================== */}

              <div className="allCommitteeFormGroup">
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

              {/* ===========================================
                  ACTIONS
              =========================================== */}

              <div className="allCommitteeModalActions">
                <button
                  type="button"
                  className="allCommitteeCancelButton"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="allCommitteeSaveButton"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Committee"
                      : "Create Committee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCommittee;
