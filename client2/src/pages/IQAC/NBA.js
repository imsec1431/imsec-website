import { useEffect, useState } from "react";
import { FaFilePdf, FaExternalLinkAlt, FaAward } from "react-icons/fa";

import nbaService from "../../services/nbaService";
import "./nba.css";

const NBA = () => {
  const [data, setData] = useState({
    hero: {
      title: "NBA",
      subtitle: "National Board of Accreditation",
      breadcrumb: "Home / IQAC / NBA",
    },
    records: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD NBA DATA
  ========================================================= */

  useEffect(() => {
    const loadNBA = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await nbaService.getNBA();

        const pageData = response?.data?.data || response?.data || response;

        setData({
          hero: {
            title: pageData?.hero?.title || "NBA",

            subtitle:
              pageData?.hero?.subtitle || "National Board of Accreditation",

            breadcrumb: pageData?.hero?.breadcrumb || "Home / IQAC / NBA",
          },

          records: Array.isArray(pageData?.records) ? pageData.records : [],
        });
      } catch (err) {
        console.error("Get NBA Public Page Error:", err);

        setError(err?.message || "Unable to load NBA information.");
      } finally {
        setLoading(false);
      }
    };

    loadNBA();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="nba-public-page">
        <div className="nba-public-loading">
          <div className="nba-loading-spinner" />

          <p>Loading NBA information...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="nba-public-page">
        <section className="nba-public-hero">
          <div className="nba-public-container">
            <div className="nba-hero-content">
              <span className="nba-breadcrumb">{data.hero.breadcrumb}</span>

              <h1>{data.hero.title}</h1>

              <div className="nba-hero-line" />

              <p>{data.hero.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="nba-public-container">
          <div className="nba-public-error">
            <h3>Unable to load NBA information</h3>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="nba-public-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="nba-public-hero">
        <div className="nba-public-container">
          <div className="nba-hero-content">
            <span className="nba-breadcrumb">{data.hero.breadcrumb}</span>

            <h1>{data.hero.title}</h1>

            <div className="nba-hero-line" />

            <p>{data.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      <section className="nba-documents-section">
        <div className="nba-public-container">
          <div className="nba-section-heading">
            <span className="nba-section-label">IQAC</span>

            <h2>NBA Documents</h2>

            <p>
              Explore National Board of Accreditation related documents and
              institutional information.
            </p>
          </div>

          {/* =================================================
              DOCUMENT LIST
          ================================================= */}

          {data.records.length === 0 ? (
            <div className="nba-no-records">
              <FaFilePdf />

              <h4>No NBA Documents Available</h4>

              <p>
                NBA documents will be published here when they become available.
              </p>
            </div>
          ) : (
            <div className="nba-document-grid">
              {data.records.map((record, index) => (
                <article
                  className="nba-document-card"
                  key={record._id || index}
                >
                  {/* =====================================
                        PDF ICON
                    ====================================== */}

                  <div className="nba-document-icon">
                    <FaFilePdf />
                  </div>

                  {/* =====================================
                        CONTENT
                    ====================================== */}

                  <div className="nba-document-content">
                    <span className="nba-document-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{record.title}</h3>

                    <p>{record.heading}</p>

                    {/* ================================
                          PDF BUTTON
                      ================================= */}

                    {record.pdfUrl && (
                      <a
                        href={record.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nba-document-btn"
                      >
                        <FaFilePdf />

                        <span>View PDF</span>

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

      {/* =====================================================
          INFORMATION SECTION
      ===================================================== */}

      <section className="nba-info-section">
        <div className="nba-public-container">
          <div className="nba-info-box">
            <div className="nba-info-icon">
              <FaAward />
            </div>

            <div>
              <h3>National Board of Accreditation</h3>

              <p>
                NBA accreditation related documents and institutional
                information are provided here for reference.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NBA;
