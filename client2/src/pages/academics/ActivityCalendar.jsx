import React, { useEffect, useState } from "react";
import { FaCalendarDays, FaArrowUpRightFromSquare } from "react-icons/fa6";

import { getPublicActivityCalendars } from "../../services/activityCalendarService";

import "./ActivityCalendar.css";

const ActivityCalendar = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     SORT CALENDARS
     
     1. Latest academic year first
     2. Even semester first
     3. Odd semester second
     4. Display order
     ===================================================== */

  const sortCalendars = (data) => {
    return [...data].sort((a, b) => {
      // Extract first 4-digit year
      const yearA =
        parseInt(String(a.academicSession || "").match(/\d{4}/)?.[0], 10) || 0;

      const yearB =
        parseInt(String(b.academicSession || "").match(/\d{4}/)?.[0], 10) || 0;

      // Latest academic year first
      if (yearA !== yearB) {
        return yearB - yearA;
      }

      // Semester order
      // Even = 1
      // Odd  = 2
      const semesterA = String(a.semester || "").toLowerCase();

      const semesterB = String(b.semester || "").toLowerCase();

      const semesterOrder = {
        even: 1,
        odd: 2,
      };

      const semesterAOrder = semesterOrder[semesterA] || 99;

      const semesterBOrder = semesterOrder[semesterB] || 99;

      if (semesterAOrder !== semesterBOrder) {
        return semesterAOrder - semesterBOrder;
      }

      // Same year + same semester
      // Sort by display order
      const orderA = Number(a.order) || 0;
      const orderB = Number(b.order) || 0;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Final fallback: latest created first
      const dateA = new Date(a.createdAt || 0).getTime();

      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  };

  /* =====================================================
     LOAD PUBLIC ACTIVITY CALENDARS
     ===================================================== */

  const loadCalendars = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicActivityCalendars();

      const data = Array.isArray(response) ? response : response?.data || [];

      // FRONTEND SORTING
      const sortedCalendars = sortCalendars(data);

      setCalendars(sortedCalendars);
    } catch (err) {
      console.error("Error loading activity calendars:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load activity calendars.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  /* =====================================================
     VIEW PDF
     ===================================================== */

  const handleViewPdf = (pdfUrl) => {
    if (!pdfUrl) {
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="activity-calendar-page">
        <div className="activity-calendar-loading">
          <FaCalendarDays />
          <p>Loading activity calendars...</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="activity-calendar-page">
      {/* HEADER */}

      <div className="activity-calendar-header">
        <div>
          <div className="activity-calendar-title">
            <FaCalendarDays />

            <h1>Activity Calendar</h1>
          </div>

          <p>Academic activity calendars semester-wise.</p>
        </div>
      </div>

      {/* ERROR */}

      {error && <div className="activity-calendar-alert error">{error}</div>}

      {/* EMPTY */}

      {!error && calendars.length === 0 && (
        <div className="activity-calendar-empty">
          <FaCalendarDays />

          <h3>No Activity Calendar Available</h3>

          <p>Activity calendars will appear here when published.</p>
        </div>
      )}

      {/* CALENDARS */}

      {calendars.length > 0 && (
        <div className="activity-calendar-list">
          {calendars.map((calendar) => (
            <div className="activity-calendar-card" key={calendar._id}>
              {/* CARD HEADER */}

              <div className="activity-calendar-card-header">
                <div className="activity-calendar-session">
                  <FaCalendarDays />

                  <div>
                    <span>Academic Session</span>

                    <h2>{calendar.academicSession}</h2>
                  </div>
                </div>

                <span
                  className={`activity-calendar-semester ${
                    String(calendar.semester || "").toLowerCase() === "even"
                      ? "even"
                      : "odd"
                  }`}
                >
                  {calendar.semester}
                </span>
              </div>

              {/* CARD CONTENT */}

              <div className="activity-calendar-card-content">
                <h3>{calendar.calendarName}</h3>

                {/* PDF BUTTON */}

                {calendar.pdfUrl && (
                  <button
                    type="button"
                    className="activity-calendar-pdf-btn"
                    onClick={() => handleViewPdf(calendar.pdfUrl)}
                  >
                    View Activity Calendar PDF
                    <FaArrowUpRightFromSquare />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
