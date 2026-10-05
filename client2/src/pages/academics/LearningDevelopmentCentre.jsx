import React, { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaEye,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { getLearningDevelopmentCentres } from "../../services/learningDevelopmentCentreService";

import "./LearningDevelopmentCentre.css";

const LearningDevelopmentCentre = () => {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD PUBLIC DATA
  ========================================================= */

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLearningDevelopmentCentres();

      const data = Array.isArray(response?.data) ? response.data : [];

      const sortedData = [...data].sort(
        (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
      );

      setDocuments(sortedData);
    } catch (err) {
      console.error("Learning Development Centre public loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load Learning Development Centre documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="publicLearningDevelopmentCentre">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="ldcHero">
        <div className="ldcHeroShape ldcHeroShapeOne"></div>

        <div className="ldcHeroShape ldcHeroShapeTwo"></div>

        <div className="ldcHeroContent">
          <div className="ldcHeroIcon">
            <FaBookOpen />
          </div>

          <span>STUDENT DEVELOPMENT</span>

          <h1>Learning Development Centre</h1>

          <p>
            Access important Learning Development Centre documents, guidelines
            and resources provided by IMSEC.
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="ldcSection">
        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="ldcLoading">
            <div className="ldcSpinner"></div>

            <p>Loading documents...</p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="ldcError">
            <FaBookOpen />

            <h3>Unable to Load Documents</h3>

            <p>{error}</p>
          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading && !error && documents.length === 0 && (
          <div className="ldcEmpty">
            <div className="ldcEmptyIcon">
              <FaBookOpen />
            </div>

            <h3>No Documents Available</h3>

            <p>
              Learning Development Centre documents will be available here when
              published.
            </p>
          </div>
        )}

        {/* ===================================================
            DOCUMENTS
        =================================================== */}

        {!loading && !error && documents.length > 0 && (
          <div className="ldcDocumentList">
            {documents.map((item, index) => (
              <article className="ldcDocumentCard" key={item._id}>
                {/* =======================================
                        NUMBER
                    ======================================= */}

                <div className="ldcDocumentNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* =======================================
                        ICON
                    ======================================= */}

                <div className="ldcDocumentIcon">
                  <FaBookOpen />
                </div>

                {/* =======================================
                        INFORMATION
                    ======================================= */}

                <div className="ldcDocumentInfo">
                  <span>LEARNING DEVELOPMENT CENTRE</span>

                  <h3>{item.title}</h3>
                </div>

                {/* =======================================
                        ACTIONS
                    ======================================= */}

                <div className="ldcDocumentActions">
                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ldcViewButton"
                  >
                    <FaEye />
                    View PDF
                  </a>

                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="ldcDownloadButton"
                  >
                    <FaDownload />
                    Download
                  </a>

                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ldcExternalButton"
                    aria-label="Open PDF"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LearningDevelopmentCentre;
