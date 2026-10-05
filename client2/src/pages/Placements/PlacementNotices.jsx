import React, { useEffect, useState } from "react";

import {
  FaBullhorn,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaFilePdf,
  FaInfoCircle,
} from "react-icons/fa";

import { fetchPlacementNotices } from "../../services/placementNoticeService";

import "./PlacementNotices.css";

/* =========================================================
   COMPONENT
========================================================= */

const PlacementNotices = () => {
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD NOTICES
  ========================================================= */

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);

        setError("");

        const result = await fetchPlacementNotices();

        setNotices(result?.data || []);
      } catch (err) {
        console.error("Public Placement Notices:", err);

        setError(err?.message || "Unable to load placement notices.");
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="placement-notices-page">
        <section className="placement-notices-status">
          <div className="placement-notices-spinner" />

          <h2>Loading Placement Notices</h2>

          <p>Please wait while we load the latest placement notices.</p>
        </section>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="placement-notices-page">
        <section className="placement-notices-status">
          <FaInfoCircle />

          <h2>Unable to Load Notices</h2>

          <p>{error}</p>
        </section>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="placement-notices-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="placement-notices-hero">
        <div className="placement-notices-hero-overlay" />

        <div className="container">
          <div className="placement-notices-hero-content">
            <h1>
              {" "}
              <FaBullhorn /> Placement Notices
            </h1>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="placement-notices-content">
        <div className="container">
          <div className="placement-notices-heading">
            <div>
              <span>Corporate Development Cell</span>

              <h2>Latest Notices</h2>
            </div>
          </div>

          {/* =================================================
              NO NOTICES
          ================================================= */}

          {!notices.length ? (
            <div className="placement-notices-empty">
              <FaInfoCircle />

              <h3>No Placement Notices Available</h3>

              <p>There are currently no published placement notices.</p>
            </div>
          ) : (
            <div className="placement-notices-list">
              {notices.map((notice, index) => (
                <article className="placement-notice-item" key={notice._id}>
                  {/* NUMBER */}

                  <div className="placement-notice-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* CONTENT */}

                  <div className="placement-notice-main">
                    <div className="placement-notice-meta">
                      <span className="placement-notice-category">
                        {notice.category || "Placement"}
                      </span>

                      <span className="placement-notice-date">
                        <FaCalendarAlt />

                        {formatDate(notice.noticeDate)}
                      </span>
                    </div>

                    <h3>{notice.title}</h3>

                    {notice.description && <p>{notice.description}</p>}

                    {notice.documentLink && (
                      <a
                        href={notice.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="placement-notice-view-button"
                      >
                        <FaFilePdf />

                        <span>{notice.documentLabel || "View Notice"}</span>

                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PlacementNotices;
