import React, { useEffect, useMemo, useState } from "react";
import {
  FaAward,
  FaCheckCircle,
  FaFilePdf,
  FaUsers,
  FaCalendarAlt,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaUserTie,
} from "react-icons/fa";

import iqacService from "../../services/iqacService";
import "./iqac.css";

const DEFAULT_DATA = {
  title: "IQAC",
  heroSubtitle: "Internal Quality Assurance Cell",
  breadcrumb: "Home / IQAC",

  heading: "Internal Quality Assurance Cell",

  description:
    "The Internal Quality Assurance Cell (IQAC) is established to promote continuous improvement in the academic and administrative quality of the institution. IQAC facilitates quality enhancement initiatives, documentation, feedback and systematic monitoring of institutional processes.",

  aboutHeading: "About IQAC",

  aboutDescription:
    "IQAC works as a quality enhancement mechanism within the institution. It encourages a consistent approach towards improving teaching-learning processes, academic practices, institutional activities and overall student development.",

  functionsHeading: "IQAC Functions",

  functionsDescription:
    "IQAC facilitates quality-related initiatives, documentation, feedback analysis, academic and administrative improvements and continuous quality monitoring across the institution.",

  membersHeading: "IQAC Composition",

  membersDescription:
    "The IQAC consists of representatives from different areas of the institution who contribute towards planning, monitoring and continuous quality improvement.",

  meetingsHeading: "IQAC Meetings",

  meetingsDescription:
    "IQAC meetings are conducted periodically to review quality initiatives, discuss institutional requirements and plan activities for continuous improvement.",

  initiativesHeading: "Quality Initiatives",

  initiativesDescription:
    "The institution undertakes various quality enhancement initiatives through systematic planning, implementation, review and continuous improvement.",

  documentsHeading: "IQAC Reports & Documents",

  coordinatorName: "IQAC Coordinator",

  coordinatorDesignation: "Coordinator, Internal Quality Assurance Cell",

  coordinatorEmail: "iqac@imsec.ac.in",

  coordinatorPhone: "+91-120-4081999",

  members: [],

  documents: [],

  initiatives: [],

  published: true,
};

const IQAC = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD IQAC DATA
  ===================================================== */

  useEffect(() => {
    const loadIQAC = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await iqacService.getIQAC();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData && typeof pageData === "object") {
          setData({
            ...DEFAULT_DATA,
            ...pageData,

            members: Array.isArray(pageData.members) ? pageData.members : [],

            documents: Array.isArray(pageData.documents)
              ? pageData.documents
              : [],

            initiatives: Array.isArray(pageData.initiatives)
              ? pageData.initiatives
              : [],
          });
        }
      } catch (err) {
        console.error("IQAC Public Page Error:", err);

        setError(err?.message || "Unable to load IQAC information.");
      } finally {
        setLoading(false);
      }
    };

    loadIQAC();
  }, []);

  /* =====================================================
     ACTIVE MEMBERS
  ===================================================== */

  const members = useMemo(() => {
    return [...(data.members || [])]
      .filter((member) => member?.isActive !== false)
      .sort((a, b) => (a.order || 1) - (b.order || 1));
  }, [data.members]);

  /* =====================================================
     PUBLISHED DOCUMENTS
  ===================================================== */

  const documents = useMemo(() => {
    return [...(data.documents || [])]
      .filter((document) => document?.published !== false && document?.pdfUrl)
      .sort((a, b) => (a.order || 1) - (b.order || 1));
  }, [data.documents]);

  /* =====================================================
     ACTIVE INITIATIVES
  ===================================================== */

  const initiatives = useMemo(() => {
    return [...(data.initiatives || [])]
      .filter((initiative) => initiative?.isActive !== false)
      .sort((a, b) => (a.order || 1) - (b.order || 1));
  }, [data.initiatives]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="iqac-loading">
        <div className="iqac-loading-spinner" />

        <p>Loading IQAC information...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !data) {
    return (
      <div className="iqac-error-page">
        <h2>Unable to load IQAC</h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="iqac-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="iqac-hero">
        <div className="iqac-hero-overlay">
          <div className="iqac-container">
            <div className="iqac-breadcrumb">{data.breadcrumb}</div>

            <h1>{data.title}</h1>

            <p>{data.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRO
      ================================================= */}

      <section className="iqac-section iqac-intro-section">
        <div className="iqac-container">
          <div className="iqac-section-label">
            <span />
            IQAC
          </div>

          <div className="iqac-intro-grid">
            <div className="iqac-intro-content">
              <h2>{data.heading}</h2>

              <p>{data.description}</p>
            </div>

            <div className="iqac-intro-card">
              <div className="iqac-intro-icon">
                <FaAward />
              </div>

              <h3>Quality Enhancement</h3>

              <p>
                Continuous improvement in academic and administrative processes
                is at the heart of IQAC activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="iqac-section iqac-light-section">
        <div className="iqac-container">
          <div className="iqac-section-label">
            <span />
            ABOUT IQAC
          </div>

          <div className="iqac-content-card">
            <div className="iqac-content-number">01</div>

            <div>
              <h2>{data.aboutHeading}</h2>

              <p>{data.aboutDescription}</p>
            </div>
          </div>
        </div>
      </section>
      {/* =================================================
          COORDINATOR
      ================================================= */}

      {data.coordinatorName && (
        <section className="iqac-section iqac-light-section">
          <div className="iqac-container">
            <div className="iqac-section-label">
              <span />
              IQAC COORDINATION
            </div>

            <div className="iqac-coordinator-card">
              <div className="iqac-coordinator-main">
                <div className="iqac-coordinator-icon">
                  <FaUserTie />
                </div>

                <div>
                  <h2>{data.coordinatorName}</h2>

                  <p>{data.coordinatorDesignation}</p>
                </div>
              </div>

              <div className="iqac-coordinator-contact">
                {data.coordinatorEmail && (
                  <a href={`mailto:${data.coordinatorEmail}`}>
                    <FaEnvelope />
                    <span>{data.coordinatorEmail}</span>
                  </a>
                )}

                {data.coordinatorPhone && (
                  <a href={`tel:${data.coordinatorPhone}`}>
                    <FaPhone />
                    <span>{data.coordinatorPhone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* =================================================
          MEMBERS
      ================================================= */}

      {members.length > 0 && (
        <section className="iqac-section iqac-light-section">
          <div className="iqac-container">
            <div className="iqac-section-label">
              <span />
              IQAC COMPOSITION
            </div>

            <div className="iqac-content-card">
              <div className="iqac-content-number">03</div>

              <div>
                <h2>{data.membersHeading}</h2>

                <p>{data.membersDescription}</p>
              </div>
            </div>

            <div className="iqac-members-grid">
              {members.map((member, index) => (
                <div
                  className="iqac-member-card"
                  key={member._id || `member-${index}`}
                >
                  <div className="iqac-member-top">
                    <div className="iqac-member-icon">
                      <FaUsers />
                    </div>

                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <h3>{member.name}</h3>

                  <p>{member.designation}</p>

                  {member.role && (
                    <div className="iqac-member-role">{member.role}</div>
                  )}

                  {member.department && (
                    <div className="iqac-member-department">
                      {member.department}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* =================================================
          FUNCTIONS
      ================================================= */}

      <section className="iqac-section">
        <div className="iqac-container">
          <div className="iqac-section-label">
            <span />
            IQAC FUNCTIONS
          </div>

          <div className="iqac-content-card">
            <div className="iqac-content-number">02</div>

            <div>
              <h2>{data.functionsHeading}</h2>

              <p>{data.functionsDescription}</p>
            </div>
          </div>

          <div className="iqac-function-grid">
            {[
              "Academic Quality Enhancement",
              "Quality Documentation",
              "Feedback & Improvement",
              "Academic & Administrative Review",
              "Continuous Quality Monitoring",
              "Institutional Quality Initiatives",
            ].map((item, index) => (
              <div className="iqac-function-card" key={item}>
                <div className="iqac-function-icon">
                  <FaCheckCircle />
                </div>

                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <h3>{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          MEETINGS
      ================================================= */}

      <section className="iqac-section">
        <div className="iqac-container">
          <div className="iqac-section-label">
            <span />
            IQAC MEETINGS
          </div>

          <div className="iqac-meeting-card">
            <div className="iqac-meeting-icon">
              <FaCalendarAlt />
            </div>

            <div>
              <h2>{data.meetingsHeading}</h2>

              <p>{data.meetingsDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          QUALITY INITIATIVES
      ================================================= */}

      {initiatives.length > 0 && (
        <section className="iqac-section iqac-light-section">
          <div className="iqac-container">
            <div className="iqac-section-label">
              <span />
              QUALITY INITIATIVES
            </div>

            <div className="iqac-content-card">
              <div className="iqac-content-number">04</div>

              <div>
                <h2>{data.initiativesHeading}</h2>

                <p>{data.initiativesDescription}</p>
              </div>
            </div>

            <div className="iqac-initiatives-grid">
              {initiatives.map((initiative, index) => (
                <div
                  className="iqac-initiative-card"
                  key={initiative._id || `initiative-${index}`}
                >
                  <div className="iqac-initiative-icon">
                    <FaStar />
                  </div>

                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <h3>{initiative.title}</h3>

                  <p>{initiative.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          DOCUMENTS
      ================================================= */}

      {documents.length > 0 && (
        <section className="iqac-section">
          <div className="iqac-container">
            <div className="iqac-section-label">
              <span />
              IQAC DOCUMENTS
            </div>

            <div className="iqac-content-card">
              <div className="iqac-content-number">05</div>

              <div>
                <h2>{data.documentsHeading}</h2>

                <p>
                  Access IQAC reports, minutes and other quality-related
                  documents.
                </p>
              </div>
            </div>

            <div className="iqac-documents-grid">
              {documents.map((document, index) => (
                <div
                  className="iqac-document-card"
                  key={document._id || `document-${index}`}
                >
                  <div className="iqac-document-icon">
                    <FaFilePdf />
                  </div>

                  <div className="iqac-document-content">
                    <span className="iqac-document-number">
                      DOCUMENT {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{document.title}</h3>

                    {document.heading && <p>{document.heading}</p>}
                  </div>

                  <div className="iqac-document-buttons">
                    <a
                      href={document.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="iqac-view-btn"
                    >
                      <FaFilePdf />
                      View
                    </a>

                    <a
                      href={document.pdfUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="iqac-download-btn"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default IQAC;
