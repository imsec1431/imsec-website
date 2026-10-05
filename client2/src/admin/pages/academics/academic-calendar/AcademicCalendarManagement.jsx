import React, { useEffect, useState } from "react";
import {
  getAcademicCalendars,
  createAcademicCalendar,
  updateAcademicCalendar,
  deleteAcademicCalendar,
} from "../../../services/academicCalendarService";
import "./AcademicCalendar.css";

const DEFAULT_CALENDAR_NAME = "Academics Calendar";

const AcademicCalendarManagement = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    academicSession: "",
    semester: "Odd",
    calendarNameType: "default",
    customCalendarName: "",
    pdfUrl: "",
    order: 0,
    isPublished: true,
  });

  const [errors, setErrors] = useState({});

  /* =========================
     FETCH
  ========================= */

  const fetchCalendars = async () => {
    try {
      setLoading(true);

      const response = await getAcademicCalendars();

      setCalendars(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch academic calendars:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch academic calendars.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.academicSession.trim()) {
      newErrors.academicSession = "Academic session is required.";
    }

    if (!formData.semester || !["Odd", "Even"].includes(formData.semester)) {
      newErrors.semester = "Please select Odd or Even semester.";
    }

    if (
      formData.calendarNameType === "other" &&
      !formData.customCalendarName.trim()
    ) {
      newErrors.customCalendarName = "Academic calendar name is required.";
    }

    if (!formData.pdfUrl.trim()) {
      newErrors.pdfUrl = "PDF URL is required.";
    } else {
      try {
        new URL(formData.pdfUrl.trim());
      } catch {
        newErrors.pdfUrl = "Please enter a valid PDF URL.";
      }
    }

    if (formData.order === "" || Number.isNaN(Number(formData.order))) {
      newErrors.order = "Order must be a valid number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setFormData({
      academicSession: "",
      semester: "Odd",
      calendarNameType: "default",
      customCalendarName: "",
      pdfUrl: "",
      order: 0,
      isPublished: true,
    });

    setErrors({});
    setEditingId(null);
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const calendarName =
        formData.calendarNameType === "other"
          ? formData.customCalendarName.trim()
          : DEFAULT_CALENDAR_NAME;

      const payload = {
        academicSession: formData.academicSession.trim(),

        semester: formData.semester,

        calendarName,

        pdfUrl: formData.pdfUrl.trim(),

        order: Number(formData.order),

        isPublished: formData.isPublished,
      };

      if (editingId) {
        await updateAcademicCalendar(editingId, payload);

        alert("Academic calendar updated successfully.");
      } else {
        await createAcademicCalendar(payload);

        alert("Academic calendar created successfully.");
      }

      resetForm();
      await fetchCalendars();
    } catch (error) {
      console.error("Save academic calendar error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save academic calendar.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (calendar) => {
    const isDefaultName =
      !calendar.calendarName || calendar.calendarName === DEFAULT_CALENDAR_NAME;

    setFormData({
      academicSession: calendar.academicSession || "",

      semester: calendar.semester || "Odd",

      calendarNameType: isDefaultName ? "default" : "other",

      customCalendarName: isDefaultName ? "" : calendar.calendarName || "",

      pdfUrl: calendar.pdfUrl || "",

      order: calendar.order ?? 0,

      isPublished: calendar.isPublished ?? true,
    });

    setErrors({});
    setEditingId(calendar._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this academic calendar?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAcademicCalendar(id);

      alert("Academic calendar deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchCalendars();
    } catch (error) {
      console.error("Delete academic calendar error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete academic calendar.",
      );
    }
  };

  /* =========================
     PDF VIEW
  ========================= */

  const handleViewPdf = (url) => {
    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="academic-calendar-admin">
      <div className="academic-calendar-admin-header">
        <div>
          <h1>Academic Calendar</h1>

          <p>
            Manage academic calendars, semesters, PDF links and publishing
            status.
          </p>
        </div>
      </div>

      {/* =========================
          FORM
      ========================= */}

      <div className="academic-calendar-form-card">
        <div className="academic-calendar-form-header">
          <h2>
            {editingId ? "Edit Academic Calendar" : "Add Academic Calendar"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="academic-calendar-form-grid">
            {/* Academic Session */}

            <div className="form-group">
              <label>
                Academic Session
                <span>*</span>
              </label>

              <input
                type="text"
                name="academicSession"
                value={formData.academicSession}
                onChange={handleChange}
                placeholder="Example: 2026-27"
              />

              {errors.academicSession && (
                <small className="form-error">{errors.academicSession}</small>
              )}
            </div>

            {/* Semester */}

            <div className="form-group">
              <label>
                Semester
                <span>*</span>
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="Odd">Odd</option>

                <option value="Even">Even</option>
              </select>

              {errors.semester && (
                <small className="form-error">{errors.semester}</small>
              )}
            </div>

            {/* Calendar Name */}

            <div className="form-group full-width">
              <label>
                Academic Calendar Name
                <span>*</span>
              </label>

              <select
                name="calendarNameType"
                value={formData.calendarNameType}
                onChange={handleChange}
              >
                <option value="default">Academics Calendar</option>

                <option value="other">Other</option>
              </select>
            </div>

            {/* Other Calendar Name */}

            {formData.calendarNameType === "other" && (
              <div className="form-group full-width">
                <label>
                  Other Academic Calendar Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="customCalendarName"
                  value={formData.customCalendarName}
                  onChange={handleChange}
                  placeholder="Enter academic calendar name"
                />

                {errors.customCalendarName && (
                  <small className="form-error">
                    {errors.customCalendarName}
                  </small>
                )}
              </div>
            )}

            {/* PDF URL */}

            <div className="form-group full-width">
              <label>
                PDF URL
                <span>*</span>
              </label>

              <input
                type="url"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://example.com/academic-calendar.pdf"
              />

              <small className="form-help">
                Enter the complete public URL of the academic calendar PDF.
              </small>

              {errors.pdfUrl && (
                <small className="form-error">{errors.pdfUrl}</small>
              )}
            </div>

            {/* Order */}

            <div className="form-group">
              <label>Order</label>

              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />

              {errors.order && (
                <small className="form-error">{errors.order}</small>
              )}
            </div>

            {/* Published */}

            <div className="form-group checkbox-group">
              <label>Publish</label>

              <label className="switch">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />

                <span className="slider"></span>
              </label>

              <span className="publish-text">
                {formData.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Buttons */}

          <div className="academic-calendar-form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Academic Calendar"
                  : "Add Academic Calendar"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          LIST
      ========================= */}

      <div className="academic-calendar-list-card">
        <div className="academic-calendar-list-header">
          <h2>Academic Calendars</h2>

          <span>
            {calendars.length}{" "}
            {calendars.length === 1 ? "Calendar" : "Calendars"}
          </span>
        </div>

        {loading ? (
          <div className="academic-calendar-loading">
            Loading academic calendars...
          </div>
        ) : calendars.length === 0 ? (
          <div className="academic-calendar-empty">
            No academic calendars found.
          </div>
        ) : (
          <div className="academic-calendar-table-wrapper">
            <table className="academic-calendar-table">
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
                    <td>{calendar.order ?? 0}</td>

                    <td>
                      <strong>{calendar.academicSession}</strong>
                    </td>

                    <td>
                      <span
                        className={`semester-badge ${calendar.semester?.toLowerCase()}`}
                      >
                        {calendar.semester}
                      </span>
                    </td>

                    <td>{calendar.calendarName}</td>

                    <td>
                      <button
                        type="button"
                        className="btn-view-pdf"
                        onClick={() => handleViewPdf(calendar.pdfUrl)}
                      >
                        View PDF
                      </button>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          calendar.isPublished ? "published" : "draft"
                        }`}
                      >
                        {calendar.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => handleEdit(calendar)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(calendar._id)}
                        >
                          Delete
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

export default AcademicCalendarManagement;
