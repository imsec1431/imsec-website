import React, { useState, useEffect } from "react";
import {
  fetchNewslettersAdmin,
  createNewsletterAdmin,
  updateNewsletterAdmin,
  deleteNewsletterAdmin,
} from "../../services/adminNewsletterService.js";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaFilePdf,
  FaExternalLinkAlt,
  FaCheck,
} from "react-icons/fa";

const initialFormState = {
  month: "January",
  year: "2026",
  title: "Department Newsletter",
  description: "",
  cover: "",
  drive: "",
  isFeatured: false,
};

const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AdminNewsletter = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchNewslettersAdmin();
      if (res.success) setItems(res.data);
    } catch (err) {
      setError(err.message || "Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateNewsletterAdmin(editingId, formData);
        setSuccessMsg("Edition updated successfully!");
        setEditingId(null);
      } else {
        await createNewsletterAdmin(formData);
        setSuccessMsg("New edition added successfully!");
      }
      setFormData(initialFormState);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      month: item.month,
      year: item.year,
      title: item.title,
      description: item.description,
      cover: item.cover,
      drive: item.drive,
      isFeatured: item.isFeatured || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this edition?",
      )
    ) {
      try {
        await deleteNewsletterAdmin(id);
        setSuccessMsg("Edition deleted successfully!");
        loadData();
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (err) {
        setError(err.message || "Failed to delete");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setError(null);
  };

  return (
    <div
      style={{
        padding: "2.5rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0, color: "#1e293b" }}>
          Newsletter Admin Dashboard
        </h2>
        <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
          Total Records: {items.length}
        </span>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaCheck /> {successMsg}
        </div>
      )}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          padding: "1.75rem",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          marginBottom: "2.5rem",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "1.25rem", color: "#334155" }}>
          {editingId ? "Edit Newsletter Edition" : "Add New Edition"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            >
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              Year
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2026"
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Department Newsletter"
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Highlights of academic activities, workshops, etc."
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              PDF / Google Drive Link
            </label>
            <input
              type="url"
              name="drive"
              value={formData.drive}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              required
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "0.25rem",
            }}
          >
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label
              htmlFor="isFeatured"
              style={{ cursor: "pointer", fontWeight: "500", color: "#334155" }}
            >
              Feature this edition on top banner
            </label>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.65rem 1.4rem",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {editingId ? (
              "Update Newsletter"
            ) : (
              <>
                <FaPlus /> Save Newsletter
              </>
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.65rem 1.2rem",
                background: "#94a3b8",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* Publications Table */}
      <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>
        Published Editions
      </h3>
      {loading ? (
        <p style={{ color: "#64748b" }}>Loading newsletter data...</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "0.85rem",
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Edition
                </th>
                <th
                  style={{
                    padding: "0.85rem",
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "0.85rem",
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "0.85rem",
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Drive Link
                </th>
                <th
                  style={{
                    padding: "0.85rem",
                    color: "#475569",
                    fontSize: "0.875rem",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    No newsletters published yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item._id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td
                      style={{
                        padding: "0.75rem",
                        fontWeight: "600",
                        color: "#1e293b",
                      }}
                    >
                      {item.month} {item.year}
                    </td>
                    <td style={{ padding: "0.75rem", color: "#475569" }}>
                      {item.title}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {item.isFeatured ? (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                          }}
                        >
                          ⭐ FEATURED
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                          Standard
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <a
                        href={item.drive}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                        }}
                      >
                        View PDF <FaExternalLinkAlt size={11} />
                      </a>
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          background: "#e0e7ff",
                          color: "#4338ca",
                          border: "none",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "0.5rem",
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "none",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
