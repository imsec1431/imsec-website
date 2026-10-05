import React, { useEffect, useState } from "react";
import "./PlacementRecord.css";

import {
  getPublicPlacementStatistics,
  getPublicPlacementHighlights,
  getPublicPlacementStudents,
} from "../../services/placementService";

const PlacementRecord = () => {
  const [statistics, setStatistics] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlacementData();
  }, []);

  const loadPlacementData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statisticsResponse, highlightsResponse, studentsResponse] =
        await Promise.all([
          getPublicPlacementStatistics(),
          getPublicPlacementHighlights(),
          getPublicPlacementStudents(),
        ]);

      setStatistics(statisticsResponse?.data || []);
      setHighlights(highlightsResponse?.data || []);
      setStudents(studentsResponse?.data || []);
    } catch (err) {
      console.error("Error loading placement information:", err);

      setError(
        err?.response?.data?.message || "Unable to load placement information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // STATISTICS LABEL
  // ==========================================================

  const getStatisticLabel = (type) => {
    switch (type) {
      case "highest-package":
        return "Highest Package";

      case "average-ctc":
        return "Average CTC";

      case "recruiters":
        return "Recruiters";

      case "placements":
        return "Placements";

      default:
        return type
          ? type
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
          : "Placement";
    }
  };

  // ==========================================================
  // STATISTICS ICON
  // ==========================================================

  const getStatisticIcon = (type) => {
    switch (type) {
      case "highest-package":
        return "₹";

      case "average-ctc":
        return "₹";

      case "recruiters":
        return "✓";

      case "placements":
        return "%";

      default:
        return "★";
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="placement-record-page">
        <div className="placement-loading">
          <div className="placement-loader"></div>

          <h3>Loading Placement Information...</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="placement-record-page">
        <div className="placement-error">
          <h3>Unable to Load Placement Information</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadPlacementData}
            className="placement-retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SORT DATA
  // ==========================================================

  const sortedStatistics = [...statistics].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const sortedHighlights = [...highlights]
    .filter((item) => item.isPublished !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const sortedStudents = [...students];

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="placement-record-page">
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <section className="placement-record-header">
        <div className="placement-record-header-overlay">
          <div className="placement-container">
            <div className="placement-breadcrumb">
              Home
              <span>/</span>
              Placements
            </div>

            <h1>Placements</h1>

            <p>Building careers and creating opportunities for our students.</p>
          </div>
        </div>
      </section>

      <main className="placement-container">
        {/* ==================================================
            1. PLACEMENT STATISTICS
        ================================================== */}

        {sortedStatistics.length > 0 && (
          <section className="placement-statistics-section">
            <div className="placement-section-heading">
              <span>PLACEMENT</span>

              <h2>Placement Statistics</h2>

              <p>Our placement achievements and career outcomes.</p>
            </div>

            <div className="placement-statistics-grid">
              {sortedStatistics.map((stat) => (
                <div
                  className="placement-stat-card"
                  key={stat._id || stat.id || stat.type}
                >
                  <div className="placement-stat-icon">
                    {getStatisticIcon(stat.type)}
                  </div>

                  <div className="placement-stat-content">
                    <h3>{stat.figure}</h3>

                    <p>{getStatisticLabel(stat.type)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================
            2. PLACEMENT HIGHLIGHTS
        ================================================== */}

        {sortedHighlights.length > 0 && (
          <section className="placement-highlights-section">
            <div className="placement-section-heading">
              <span>HIGHLIGHTS</span>

              <h2>Placement Highlights</h2>

              <p>
                Key highlights from our placement activities and achievements.
              </p>
            </div>

            <div className="placement-highlights-grid">
              {sortedHighlights.map((highlight, index) => (
                <article
                  className="placement-highlight-card"
                  key={highlight._id || highlight.id || index}
                >
                  <div className="placement-highlight-number">
                    {String(highlight.displayOrder || index + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <div className="placement-highlight-content">
                    <h3>{highlight.title}</h3>

                    {highlight.description && <p>{highlight.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================
            3. STUDENT PLACEMENT RECORDS
        ================================================== */}

        <section className="placement-records-section">
          <div className="placement-section-heading">
            <span>STUDENT PLACEMENT</span>

            <h2>Placement Records</h2>

            <p>
              Students who have successfully secured placement opportunities.
            </p>
          </div>

          {sortedStudents.length === 0 ? (
            <div className="placement-empty-state">
              <h3>No Placement Records Available</h3>

              <p>Placement records will be updated here when available.</p>
            </div>
          ) : (
            <div className="placement-table-wrapper">
              <table className="placement-table">
                <thead>
                  <tr>
                    <th>S.No.</th>

                    <th>Student Name</th>

                    <th>Roll No.</th>

                    <th>Branch</th>

                    <th>Placed In</th>

                    <th>Batch</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedStudents.map((student, index) => (
                    <tr key={student._id || student.id || index}>
                      <td>{index + 1}</td>

                      <td className="student-name">{student.name}</td>

                      <td>{student.rollNo}</td>

                      <td>{student.branch}</td>

                      <td className="placed-company">{student.placedIn}</td>

                      <td>{student.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ==================================================
            BOTTOM SECTION
        ================================================== */}

        <section className="placement-record-footer">
          <div>
            <h2>Building Careers, Creating Opportunities</h2>

            <p>
              Our placement cell continues to connect students with leading
              organizations and career opportunities.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlacementRecord;
