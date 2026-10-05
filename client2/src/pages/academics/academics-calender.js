import React, { useEffect, useState } from "react";
import { getPublicAcademicCalendars } from "../../services/academicCalendarService";
import "./academics-calender.css";

const AcademicCalendar = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH PUBLIC CALENDARS
  ========================= */

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicAcademicCalendars();

        setCalendars(response?.data || []);
      } catch (err) {
        console.error("Failed to fetch academic calendars:", err);

        setError(
          err?.response?.data?.message || "Failed to load academic calendars.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  /* =========================
     EXTRACT YEAR
  ========================= */

  const getAcademicYear = (session) => {
    if (!session) {
      return 0;
    }

    const match = String(session).match(/\d{4}/);

    return match ? Number(match[0]) : 0;
  };

  /* =========================
     SORT
     
     1. Latest academic year
     2. Even semester
     3. Odd semester
     4. Order
     5. Created date
  ========================= */

  const sortedCalendars = [...calendars].sort((a, b) => {
    const yearA = getAcademicYear(a.academicSession);

    const yearB = getAcademicYear(b.academicSession);

    if (yearA !== yearB) {
      return yearB - yearA;
    }

    const semesterA = a.semester === "Even" ? 0 : 1;

    const semesterB = b.semester === "Even" ? 0 : 1;

    if (semesterA !== semesterB) {
      return semesterA - semesterB;
    }

    const orderA = Number(a.order) || 0;
    const orderB = Number(b.order) || 0;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateB - dateA;
  });

  /* =========================
     VIEW PDF
  ========================= */

  const handleViewPdf = (pdfUrl) => {
    if (!pdfUrl) {
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="academic-calendar-page">
        <div className="academic-calendar-container">
          <div className="academic-calendar-loading">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="academic-calendar-page">
        <div className="academic-calendar-container">
          <div className="academic-calendar-error">
            <h3>Unable to load academic calendar</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="academic-calendar-page">
      <div className="academic-calendar-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="academic-calendar-header">
          <h1>Academic Calendar</h1>

          <p>Academic calendars for students, faculty and staff.</p>
        </div>

        {/* =========================
            EMPTY
        ========================= */}

        {sortedCalendars.length === 0 ? (
          <div className="academic-calendar-empty">
            <h3>No academic calendar available.</h3>

            <p>Academic calendar information will be published here.</p>
          </div>
        ) : (
          /* =========================
             CALENDAR CARDS
          ========================= */

          <div className="academic-calendar-list">
            {sortedCalendars.map((calendar) => (
              <div className="academic-calendar-card" key={calendar._id}>
                <div className="academic-calendar-card-content">
                  <div className="academic-calendar-info">
                    <div className="academic-calendar-title-row">
                      <h2>{calendar.calendarName || "Academics Calendar"}</h2>

                      <span
                        className={`academic-semester-badge ${calendar.semester?.toLowerCase()}`}
                      >
                        {calendar.semester}
                      </span>
                    </div>

                    <div className="academic-calendar-session">
                      <span className="session-label">Academic Session</span>

                      <span className="session-value">
                        {calendar.academicSession}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="academic-calendar-pdf-button"
                    onClick={() => handleViewPdf(calendar.pdfUrl)}
                    disabled={!calendar.pdfUrl}
                  >
                    View PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicCalendar;
