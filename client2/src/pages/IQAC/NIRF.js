import React, { useEffect, useState } from "react";
import { FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";

import nirfService from "../../services/nirfService";

import "./nirf.css";

const NIRF = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD NIRF DATA
  ===================================================== */

  useEffect(() => {
    const loadNIRF = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await nirfService.getNIRF();

        const pageData = response?.data?.data || response?.data || response;

        setData(pageData);
      } catch (err) {
        console.error("Public NIRF Page Error:", err);

        setError(err?.message || "Unable to load NIRF information.");
      } finally {
        setLoading(false);
      }
    };

    loadNIRF();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="nirf-public-loading">
        <div className="nirf-loading-spinner"></div>

        <p>Loading NIRF information...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="nirf-public-error">
        <h3>Unable to load NIRF information</h3>

        <p>{error}</p>
      </div>
    );
  }

  const hero = data?.hero || {};

  const records = Array.isArray(data?.records)
    ? [...data.records].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <div className="nirf-public-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="nirf-public-hero">
        <div className="container">
          <div className="nirf-hero-content">
            <div className="nirf-breadcrumb">
              {hero.breadcrumb || "Home / IQAC / NIRF"}
            </div>

            <h1>{hero.title || "NIRF"}</h1>

            <div className="nirf-hero-line"></div>

            <p>{hero.subtitle || "National Institutional Ranking Framework"}</p>
          </div>
        </div>
      </section>

      {/* =================================================
          DOCUMENT SECTION
      ================================================= */}

      <section className="nirf-documents-section">
        <div className="container">
          <div className="nirf-section-heading">
            <span className="nirf-section-label">IQAC</span>

            <h2>NIRF Documents</h2>

            <p>
              Access institutional ranking related information and documents.
            </p>
          </div>

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          {records.length === 0 ? (
            <div className="nirf-no-records">
              <FaFilePdf />

              <h4>No documents available</h4>

              <p>NIRF documents will be published here when available.</p>
            </div>
          ) : (
            <div className="nirf-document-grid">
              {records.map((record) => (
                <div className="nirf-document-card" key={record._id}>
                  <div className="nirf-document-icon">
                    <FaFilePdf />
                  </div>

                  <div className="nirf-document-content">
                    <h3>{record.title}</h3>

                    <p>{record.heading}</p>

                    <a
                      href={record.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nirf-document-btn"
                    >
                      <FaFilePdf />

                      <span>View PDF</span>

                      <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          INFORMATION SECTION
      ================================================= */}

      <section className="nirf-public-info">
        <div className="container">
          <div className="nirf-info-box">
            <div className="nirf-info-icon">
              <FaFilePdf />
            </div>

            <div>
              <h3>National Institutional Ranking Framework</h3>

              <p>
                Explore NIRF related documents and institutional ranking
                information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NIRF;
