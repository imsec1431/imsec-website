import React, { useEffect, useState } from "react";
import { FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";

import naacService from "../../services/naacService";

import "./naac.css";

const NAAC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD NAAC DATA
  ===================================================== */

  useEffect(() => {
    const loadNAAC = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await naacService.getNAAC();

        const pageData = response?.data?.data || response?.data || response;

        setData(pageData);
      } catch (err) {
        console.error("Public NAAC Page Error:", err);

        setError(err?.message || "Unable to load NAAC information.");
      } finally {
        setLoading(false);
      }
    };

    loadNAAC();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="naac-public-loading">
        <div className="naac-loading-spinner"></div>
        <p>Loading NAAC information...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="naac-public-error">
        <h3>Unable to load NAAC information</h3>
        <p>{error}</p>
      </div>
    );
  }

  const hero = data?.hero || {};

  const records = Array.isArray(data?.records) ? data.records : [];

  return (
    <div className="naac-public-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="naac-public-hero">
        <div className="container">
          <div className="naac-hero-content">
            <div className="naac-breadcrumb">
              {hero.breadcrumb || "Home / IQAC / NAAC"}
            </div>

            <h1>{hero.title || "NAAC"}</h1>

            <div className="naac-hero-line"></div>

            <p>
              {hero.subtitle || "National Assessment and Accreditation Council"}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          DOCUMENT SECTION
      ================================================= */}

      <section className="naac-documents-section">
        <div className="container">
          <div className="naac-section-heading">
            <span className="naac-section-label">IQAC</span>

            <h2>NAAC Documents</h2>

            <p>
              Access institutional accreditation related information and
              documents.
            </p>
          </div>

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          {records.length === 0 ? (
            <div className="naac-no-records">
              <FaFilePdf />

              <h4>No documents available</h4>

              <p>NAAC documents will be published here when available.</p>
            </div>
          ) : (
            <div className="naac-document-grid">
              {records
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((record) => (
                  <div className="naac-document-card" key={record._id}>
                    <div className="naac-document-icon">
                      <FaFilePdf />
                    </div>

                    <div className="naac-document-content">
                      <h3>{record.title}</h3>

                      <p>{record.heading}</p>

                      <a
                        href={record.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="naac-document-btn"
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
          BOTTOM INFORMATION
      ================================================= */}

      <section className="naac-public-info">
        <div className="container">
          <div className="naac-info-box">
            <div className="naac-info-icon">
              <FaFilePdf />
            </div>

            <div>
              <h3>National Assessment and Accreditation Council</h3>

              <p>
                Explore NAAC related documents and accreditation information of
                the institution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NAAC;
