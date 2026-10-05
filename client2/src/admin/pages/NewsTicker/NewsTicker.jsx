import React, { useEffect, useState } from "react";

import {
  getAdminNewsTicker,
  createNewsTicker,
  updateNewsTicker,
  publishNewsTicker,
  unpublishNewsTicker,
  deleteNewsTicker,
} from "../../services/newsTickerAdminService.js";

const initialForm = {
  title: "",
  description: "",
  pdfLink: "",
  buttonText: "View PDF",
  displayOrder: 0,
};

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD NEWS
  // =========================================================

  const loadNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminNewsTicker();

      setNews(response.data || []);
    } catch (err) {
      console.error("Load news ticker error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load news ticker.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      ...initialForm,
    });

    setEditingId(null);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter news title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter news description.");
      return;
    }

    if (!form.pdfLink.trim()) {
      setError("Please enter PDF link.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        pdfLink: form.pdfLink.trim(),
        buttonText: form.buttonText.trim() || "View PDF",
        displayOrder: Number(form.displayOrder) || 0,
      };

      if (editingId) {
        await updateNewsTicker(editingId, payload);

        setSuccess("News ticker updated successfully.");
      } else {
        await createNewsTicker(payload);

        setSuccess("News ticker created successfully.");
      }

      resetForm();

      await loadNews();
    } catch (err) {
      console.error("Save news ticker error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save news ticker.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      pdfLink: item.pdfLink || "",
      buttonText: item.buttonText || "View PDF",
      displayOrder: item.displayOrder ?? 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news ticker?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteNewsTicker(id);

      setSuccess("News ticker deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadNews();
    } catch (err) {
      console.error("Delete news ticker error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete news ticker.",
      );
    }
  };

  // =========================================================
  // PUBLISH
  // =========================================================

  const handlePublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await publishNewsTicker(id);

      setSuccess("News ticker published successfully.");

      await loadNews();
    } catch (err) {
      console.error("Publish news ticker error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to publish news ticker.",
      );
    }
  };

  // =========================================================
  // UNPUBLISH
  // =========================================================

  const handleUnpublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await unpublishNewsTicker(id);

      setSuccess("News ticker unpublished successfully.");

      await loadNews();
    } catch (err) {
      console.error("Unpublish news ticker error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to unpublish news ticker.",
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>News Ticker</h1>

            <p style={styles.subHeading}>
              Manage latest news displayed on the website.
            </p>
          </div>
        </div>

        {/* =====================================================
            MESSAGES
        ===================================================== */}

        {error && <div style={styles.error}>{error}</div>}

        {success && <div style={styles.success}>{success}</div>}

        {/* =====================================================
            ADD / EDIT FORM
        ===================================================== */}

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {editingId ? "Edit News" : "Add News"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* TITLE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Title <span style={styles.required}>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter news title"
                  maxLength={250}
                  style={styles.input}
                  required
                />
              </div>

              {/* PDF LINK */}

              <div style={styles.field}>
                <label style={styles.label}>
                  PDF Link <span style={styles.required}>*</span>
                </label>

                <input
                  type="url"
                  name="pdfLink"
                  value={form.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/document.pdf"
                  style={styles.input}
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div style={styles.fieldFull}>
                <label style={styles.label}>
                  Description <span style={styles.required}>*</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter news description"
                  maxLength={1000}
                  rows={4}
                  style={styles.textarea}
                  required
                />
              </div>

              {/* BUTTON TEXT */}

              <div style={styles.field}>
                <label style={styles.label}>Button Text</label>

                <input
                  type="text"
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  placeholder="View PDF"
                  maxLength={50}
                  style={styles.input}
                />
              </div>

              {/* DISPLAY ORDER */}

              <div style={styles.field}>
                <label style={styles.label}>Display Order</label>

                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />
              </div>
            </div>

            {/* FORM BUTTONS */}

            <div style={styles.formActions}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.primaryButton,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : editingId ? "Update News" : "Add News"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* =====================================================
            NEWS LIST
        ===================================================== */}

        <div style={styles.card}>
          <div style={styles.listHeader}>
            <h2 style={styles.cardTitle}>News List</h2>

            <span style={styles.count}>
              {news.length} {news.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading news ticker...</div>
          ) : news.length === 0 ? (
            <div style={styles.empty}>No news ticker items found.</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order</th>

                    <th style={styles.th}>Title</th>

                    <th style={styles.th}>Description</th>

                    <th style={styles.th}>PDF</th>

                    <th style={styles.th}>Status</th>

                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {news.map((item) => {
                    /*
                     * Handle both boolean and string values.
                     *
                     * Normally MongoDB returns boolean:
                     * true / false
                     *
                     * But this also supports:
                     * "true" / "false"
                     */

                    const isPublished =
                      item.isPublished === true || item.isPublished === "true";

                    return (
                      <tr key={item._id}>
                        {/* ORDER */}

                        <td style={styles.td}>{item.displayOrder ?? 0}</td>

                        {/* TITLE */}

                        <td style={styles.td}>
                          <strong>{item.title}</strong>
                        </td>

                        {/* DESCRIPTION */}

                        <td style={styles.td}>
                          <div style={styles.description}>
                            {item.description}
                          </div>
                        </td>

                        {/* PDF */}

                        <td style={styles.td}>
                          {item.pdfLink ? (
                            <a
                              href={item.pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.pdfLink}
                            >
                              View PDF
                            </a>
                          ) : (
                            <span>No PDF</span>
                          )}
                        </td>

                        {/* STATUS */}

                        <td style={styles.td}>
                          {isPublished ? (
                            <span style={styles.published}>Published</span>
                          ) : (
                            <span style={styles.unpublished}>Unpublished</span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td
                          style={{
                            ...styles.td,
                            minWidth: "280px",
                          }}
                        >
                          <div style={styles.actions}>
                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              style={styles.editButton}
                            >
                              Edit
                            </button>

                            {/* PUBLISH / UNPUBLISH */}

                            {isPublished ? (
                              <button
                                type="button"
                                onClick={() => handleUnpublish(item._id)}
                                style={styles.unpublishButton}
                              >
                                Unpublish
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePublish(item._id)}
                                style={styles.publishButton}
                              >
                                Publish
                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f5f7fb",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    color: "#0A2E5C",
    fontSize: "30px",
    fontWeight: 700,
  },

  subHeading: {
    margin: "7px 0 0",
    color: "#667085",
    fontSize: "15px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.07)",
  },

  cardTitle: {
    margin: "0 0 20px",
    color: "#0A2E5C",
    fontSize: "21px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
  },

  label: {
    marginBottom: "7px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: 600,
  },

  required: {
    color: "#d92d20",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    border: "1px solid #d0d5dd",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    border: "1px solid #d0d5dd",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
  },

  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "22px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "7px",
    padding: "11px 22px",
    background: "#0A2E5C",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },

  cancelButton: {
    border: "1px solid #d0d5dd",
    borderRadius: "7px",
    padding: "11px 22px",
    background: "#ffffff",
    color: "#344054",
    fontWeight: 600,
    cursor: "pointer",
  },

  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  count: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#eef4ff",
    color: "#0A2E5C",
    fontSize: "13px",
    fontWeight: 600,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1150px",
  },

  th: {
    textAlign: "left",
    padding: "13px 12px",
    background: "#f8fafc",
    borderBottom: "1px solid #e4e7ec",
    color: "#344054",
    fontSize: "13px",
  },

  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #eaecf0",
    color: "#475467",
    fontSize: "14px",
    verticalAlign: "top",
  },

  description: {
    maxWidth: "350px",
    lineHeight: 1.5,
  },

  pdfLink: {
    color: "#0A2E5C",
    fontWeight: 600,
    textDecoration: "none",
  },

  published: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#ecfdf3",
    color: "#027a48",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  unpublished: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#fef3f2",
    color: "#b42318",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    minWidth: "270px",
  },

  editButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#eef4ff",
    color: "#175cd3",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },

  publishButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#198754",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  unpublishButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#fd7e14",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  deleteButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#dc3545",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  loading: {
    padding: "30px",
    textAlign: "center",
    color: "#667085",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#667085",
    background: "#f8fafc",
    borderRadius: "8px",
  },

  error: {
    marginBottom: "20px",
    padding: "12px 15px",
    borderRadius: "7px",
    background: "#fef3f2",
    color: "#b42318",
    border: "1px solid #fecdca",
  },

  success: {
    marginBottom: "20px",
    padding: "12px 15px",
    borderRadius: "7px",
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
  },
};

export default NewsTicker;
