import React, { useEffect, useState } from "react";

import {
  FaCalendarDays,
  FaEye,
  FaPen,
  FaTrash,
  FaPlus,
  FaXmark,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

import {
  getActivityCalendars,
  createActivityCalendar,
  updateActivityCalendar,
  deleteActivityCalendar,
} from "../../../services/activityCalendarService";

import "./ActivityCalendar.css";

const ActivityCalendar = () => {
  const [calendars, setCalendars] = useState([]);

  const [formData, setFormData] = useState({
    academicSession: "",
    semester: "Odd",
    calendarName: "Dean IQAC",
    pdfUrl: "",
    order: 0,
    isPublished: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     LOAD ACTIVITY CALENDARS
  ========================================================= */

  const loadCalendars = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivityCalendars();

      setCalendars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load Activity Calendars Error:", err);

      setError(
        err.response?.data?.message || "Failed to load Activity Calendars.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setFormData({
      academicSession: "",
      semester: "Odd",
      calendarName: "Dean IQAC",
      pdfUrl: "",
      order: 0,
      isPublished: true,
    });

    setEditingId(null);
    setError("");
  };

  /* =========================================================
     VALIDATE PDF URL
  ========================================================= */

  const isValidPdfUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const academicSession = formData.academicSession.trim();

    const calendarName = formData.calendarName.trim();

    const pdfUrl = formData.pdfUrl.trim();

    if (!academicSession) {
      setError("Please enter Academic Session.");
      return;
    }

    if (!formData.semester) {
      setError("Please select Odd or Even.");
      return;
    }

    if (!calendarName) {
      setError("Please enter Activity Calendar Name.");
      return;
    }

    if (!pdfUrl) {
      setError("Please enter the PDF link.");
      return;
    }

    if (!isValidPdfUrl(pdfUrl)) {
      setError(
        "Please enter a valid PDF URL starting with http:// or https://.",
      );
      return;
    }

    const payload = {
      academicSession,
      semester: formData.semester,
      calendarName,
      pdfUrl,
      order: Number(formData.order) || 0,
      isPublished: Boolean(formData.isPublished),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateActivityCalendar(editingId, payload);

        setSuccess("Activity Calendar updated successfully.");
      } else {
        await createActivityCalendar(payload);

        setSuccess("Activity Calendar created successfully.");
      }

      resetForm();
      await loadCalendars();
    } catch (err) {
      console.error("Save Activity Calendar Error:", err);

      setError(
        err.response?.data?.message || "Failed to save Activity Calendar.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (calendar) => {
    setEditingId(calendar._id);

    setFormData({
      academicSession: calendar.academicSession || "",

      semester: calendar.semester || "Odd",

      calendarName: calendar.calendarName || "Dean IQAC",

      pdfUrl: calendar.pdfUrl || "",

      order: calendar.order || 0,

      isPublished: calendar.isPublished !== false,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Activity Calendar?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteActivityCalendar(id);

      setSuccess("Activity Calendar deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadCalendars();
    } catch (err) {
      console.error("Delete Activity Calendar Error:", err);

      setError(
        err.response?.data?.message || "Failed to delete Activity Calendar.",
      );
    }
  };

  /* =========================================================
     VIEW PDF
  ========================================================= */

  const handleViewPdf = (url) => {
    if (!url) {
      setError("PDF link is not available.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="activity-calendar-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="activity-calendar-header">
        <div className="activity-calendar-header-icon">
          <FaCalendarDays />
        </div>

        <div>
          <span>ACADEMICS</span>

          <h1>Activity Calendar</h1>

          <p>Manage academic activity calendars and their PDF links.</p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="activity-calendar-alert error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="activity-calendar-alert success">
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      <div className="activity-calendar-card">
        <div className="activity-calendar-card-header">
          <div>
            <span>{editingId ? "EDIT CALENDAR" : "ADD CALENDAR"}</span>

            <h2>
              {editingId
                ? "Update Activity Calendar"
                : "Create Activity Calendar"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              className="activity-calendar-cancel-btn"
              onClick={resetForm}
            >
              <FaXmark />
              Cancel Edit
            </button>
          )}
        </div>

        <form className="activity-calendar-form" onSubmit={handleSubmit}>
          {/* Academic Session */}

          <div className="activity-calendar-form-group">
            <label htmlFor="academicSession">
              Academic Session
              <span>*</span>
            </label>

            <input
              id="academicSession"
              name="academicSession"
              type="text"
              value={formData.academicSession}
              onChange={handleChange}
              placeholder="e.g. 2026-27"
            />
          </div>

          {/* Odd / Even */}

          <div className="activity-calendar-form-group">
            <label htmlFor="semester">
              Odd / Even Activity Calendar
              <span>*</span>
            </label>

            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="Odd">Odd</option>

              <option value="Even">Even</option>
            </select>
          </div>

          {/* Calendar Name */}

          <div className="activity-calendar-form-group">
            <label htmlFor="calendarName">
              Activity Calendar Name
              <span>*</span>
            </label>

            <input
              id="calendarName"
              name="calendarName"
              type="text"
              value={formData.calendarName}
              onChange={handleChange}
              placeholder="Dean IQAC"
            />
          </div>

          {/* Display Order */}

          <div className="activity-calendar-form-group">
            <label htmlFor="order">Display Order</label>

            <input
              id="order"
              name="order"
              type="number"
              min="0"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* PDF LINK */}

          <div className="activity-calendar-form-group full-width">
            <label htmlFor="pdfUrl">
              PDF Link
              <span>*</span>
            </label>

            <div className="activity-calendar-pdf-input">
              <FaArrowUpRightFromSquare />

              <input
                id="pdfUrl"
                name="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://example.com/activity-calendar.pdf"
              />
            </div>

            <small>
              Enter the complete public URL of the Activity Calendar PDF.
            </small>
          </div>

          {/* Published */}

          <div className="activity-calendar-form-group">
            <label className="activity-calendar-switch">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />

              <span></span>

              <strong>Publish Activity Calendar</strong>
            </label>
          </div>

          {/* Form Actions */}

          <div className="activity-calendar-form-actions">
            <button
              type="submit"
              className="activity-calendar-save-btn"
              disabled={saving}
            >
              {editingId ? (
                <>
                  <FaPen />
                  {saving ? "Updating..." : "Update Calendar"}
                </>
              ) : (
                <>
                  <FaPlus />
                  {saving ? "Saving..." : "Add Calendar"}
                </>
              )}
            </button>

            <button
              type="button"
              className="activity-calendar-reset-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================
          ACTIVITY CALENDAR LIST
      ===================================================== */}

      <div className="activity-calendar-card">
        <div className="activity-calendar-card-header">
          <div>
            <span>CALENDAR LIST</span>

            <h2>Activity Calendars</h2>
          </div>

          <div className="activity-calendar-count">
            {calendars.length}{" "}
            {calendars.length === 1 ? "Calendar" : "Calendars"}
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="activity-calendar-loading">
            <FaCalendarDays />

            <p>Loading Activity Calendars...</p>
          </div>
        ) : calendars.length === 0 ? (
          /* Empty */

          <div className="activity-calendar-empty">
            <FaCalendarDays />

            <h3>No Activity Calendars Found</h3>

            <p>Add your first Activity Calendar using the form above.</p>
          </div>
        ) : (
          /* Table */

          <div className="activity-calendar-table-wrapper">
            <table className="activity-calendar-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Academic Session</th>
                  <th>Semester</th>
                  <th>Calendar Name</th>
                  <th>PDF</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {calendars.map((calendar) => (
                  <tr key={calendar._id}>
                    <td>
                      <strong>{calendar.order ?? 0}</strong>
                    </td>

                    <td>
                      <strong>{calendar.academicSession}</strong>
                    </td>

                    <td>
                      <span
                        className={`activity-calendar-semester ${calendar.semester?.toLowerCase()}`}
                      >
                        {calendar.semester}
                      </span>
                    </td>

                    <td>{calendar.calendarName}</td>

                    <td>
                      <button
                        type="button"
                        className="activity-calendar-view-btn"
                        onClick={() => handleViewPdf(calendar.pdfUrl)}
                      >
                        <FaEye />
                        View PDF
                      </button>
                    </td>

                    <td>
                      <span
                        className={`activity-calendar-status ${
                          calendar.isPublished ? "published" : "unpublished"
                        }`}
                      >
                        {calendar.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td>
                      <div className="activity-calendar-actions">
                        {/* View */}

                        <button
                          type="button"
                          className="activity-calendar-action view"
                          title="View PDF"
                          onClick={() => handleViewPdf(calendar.pdfUrl)}
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          className="activity-calendar-action edit"
                          title="Edit"
                          onClick={() => handleEdit(calendar)}
                        >
                          <FaPen />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          className="activity-calendar-action delete"
                          title="Delete"
                          onClick={() => handleDelete(calendar._id)}
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
    </div>
  );
};

export default ActivityCalendar;
