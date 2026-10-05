import React, { useEffect, useState } from "react";
import { FaCertificate, FaExternalLinkAlt, FaAward } from "react-icons/fa";

import accreditationsService from "../../services/accreditationsService";

import "./accreditations.css";

const Accreditations = () => {
  const [data, setData] = useState({
    title: "Accreditations",
    description: "",
    published: true,
    records: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
     ========================================================= */

  useEffect(() => {
    const loadAccreditations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await accreditationsService.getAccreditations();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData) {
          setData({
            title: pageData.title || "Accreditations",

            description: pageData.description || "",

            published: pageData.published !== false,

            records: Array.isArray(pageData.records) ? pageData.records : [],
          });
        }
      } catch (err) {
        console.error("Accreditations Public Page Error:", err);

        setError(err?.message || "Unable to load accreditations.");
      } finally {
        setLoading(false);
      }
    };

    loadAccreditations();
  }, []);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="public-accreditations-page">
        <div className="public-accreditations-loading">
          Loading Accreditations...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="public-accreditations-page">
        <div className="public-accreditations-error">{error}</div>
      </div>
    );
  }

  /* =========================================================
     HIDE WHEN UNPUBLISHED
     ========================================================= */

  if (data.published === false) {
    return null;
  }

  /* =========================================================
     ACTIVE RECORDS
     ========================================================= */

  const records = [...data.records]
    .filter((record) => record && record.isActive !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <main className="public-accreditations-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="public-accreditations-hero">
        <div className="public-accreditations-hero-overlay" />

        <div className="public-accreditations-container">
          <div className="public-accreditations-hero-content">
            <span className="public-accreditations-eyebrow">
              INSTITUTIONAL RECOGNITION
            </span>

            <h1>{data.title}</h1>

            <div className="public-accreditations-gold-line" />

            <p>
              {data.description ||
                "Institutional accreditations and recognitions of IMSEC."}
            </p>

            <div className="public-accreditations-breadcrumb">
              Home
              <span>/</span>
              Accreditations
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="public-accreditations-content">
        <div className="public-accreditations-container">
          <div className="public-accreditations-section-heading">
            <span>QUALITY & RECOGNITION</span>

            <h2>Our Accreditations</h2>

            <p>
              Explore the accreditation and recognition information maintained
              by the institution.
            </p>
          </div>

          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {records.length === 0 ? (
            <div className="public-accreditations-empty">
              <FaCertificate />

              <h3>Accreditation information coming soon</h3>

              <p>Accreditation details will be updated here.</p>
            </div>
          ) : (
            /* ===============================================
               RECORD GRID
               =============================================== */

            <div className="public-accreditations-grid">
              {records.map((record, index) => (
                <article
                  className="public-accreditation-card"
                  key={record._id || `accreditation-${index}`}
                >
                  {/* PHOTO */}

                  <div className="public-accreditation-photo">
                    {record.photoUrl ? (
                      <img
                        src={record.photoUrl}
                        alt={record.title || "Accreditation"}
                      />
                    ) : (
                      <div className="public-accreditation-placeholder">
                        <FaCertificate />
                      </div>
                    )}
                  </div>

                  {/* CARD CONTENT */}

                  <div className="public-accreditation-card-content">
                    <div className="public-accreditation-icon">
                      <FaAward />
                    </div>

                    <h3>{record.title}</h3>

                    {record.accreditationBody && (
                      <div className="public-accreditation-body">
                        <strong>Accreditation Body</strong>

                        <span>{record.accreditationBody}</span>
                      </div>
                    )}

                    {record.validity && (
                      <div className="public-accreditation-body">
                        <strong>Validity</strong>

                        <span>{record.validity}</span>
                      </div>
                    )}

                    {record.description && (
                      <p className="public-accreditation-description">
                        {record.description}
                      </p>
                    )}

                    {/* LINKS */}

                    <div className="public-accreditation-actions">
                      {record.linkUrl && (
                        <a
                          href={record.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="public-accreditation-btn primary"
                        >
                          <FaExternalLinkAlt />
                          View Details
                        </a>
                      )}

                      {record.certificateUrl && (
                        <a
                          href={record.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="public-accreditation-btn secondary"
                        >
                          <FaCertificate />
                          View Certificate
                        </a>
                      )}
                    </div>
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

export default Accreditations;
