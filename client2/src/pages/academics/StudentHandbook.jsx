import React, { useEffect, useState } from "react";

import { FaBook, FaEye, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

import { getStudentHandbooks } from "../../services/studentHandbookService";

import "./StudentHandbook.css";

const StudentHandbook = () => {
  const [handbooks, setHandbooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD HANDBOOKS
  ========================================================= */

  const loadHandbooks = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getStudentHandbooks();

      const data = Array.isArray(response?.data) ? response.data : [];

      const sortedData = [...data].sort(
        (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
      );

      setHandbooks(sortedData);
    } catch (err) {
      console.error("Student handbook public loading error:", err);

      setError(
        err?.response?.data?.message || "Unable to load student handbooks.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHandbooks();
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="publicStudentHandbookPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="publicStudentHandbookHero">
        <div className="publicStudentHandbookHeroOverlay"></div>

        <div className="publicStudentHandbookHeroContent">
          <div className="publicStudentHandbookHeroIcon">
            <FaBook />
          </div>

          <span>STUDENT SERVICES</span>

          <h1>Student Handbook</h1>

          <p>
            Access the official student handbook and important academic
            information provided by IMSEC.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="publicStudentHandbookSection">
        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="publicStudentHandbookLoading">
            <div className="publicStudentHandbookSpinner"></div>

            <p>Loading student handbooks...</p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="publicStudentHandbookError">
            <FaBook />

            <p>{error}</p>
          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading && !error && handbooks.length === 0 && (
          <div className="publicStudentHandbookEmpty">
            <FaBook />

            <h3>No Student Handbook Available</h3>

            <p>The student handbook will be available here when published.</p>
          </div>
        )}

        {/* ===================================================
            HANDBOOK LIST
        =================================================== */}

        {!loading && !error && handbooks.length > 0 && (
          <div className="publicStudentHandbookList">
            {handbooks.map((item, index) => (
              <article className="publicStudentHandbookCard" key={item._id}>
                {/* =======================================
                        NUMBER
                    ======================================= */}

                <div className="publicStudentHandbookNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* =======================================
                        ICON
                    ======================================= */}

                <div className="publicStudentHandbookIcon">
                  <FaBook />
                </div>

                {/* =======================================
                        CONTENT
                    ======================================= */}

                <div className="publicStudentHandbookInfo">
                  <span>STUDENT HANDBOOK</span>

                  <h3>{item.title}</h3>
                </div>

                {/* =======================================
                        ACTIONS
                    ======================================= */}

                <div className="publicStudentHandbookActions">
                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publicStudentHandbookView"
                  >
                    <FaEye />
                    View
                  </a>

                  <a
                    href={item.pdfLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publicStudentHandbookDownload"
                  >
                    <FaDownload />
                    Download
                  </a>

                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publicStudentHandbookExternal"
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

export default StudentHandbook;
