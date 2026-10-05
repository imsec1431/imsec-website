import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";

import trainingInternshipService from "../../services/trainingInternshipService";

import "./trainingInternship.css";

const TrainingInternship = () => {
  const [data, setData] = useState({
    hero: {
      title: "Training & Internship",
      subtitle: "Training and Internship Cell",
      breadcrumb: "Home / Training & Internship",
    },

    introduction: {
      heading: "Training & Internship",
      description:
        "The Training and Internship Cell facilitates training opportunities, internships and industry exposure for students.",
    },

    team: [],

    details: [],

    documents: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await trainingInternshipService.getTrainingInternship();

        const pageData = response?.data?.data || response?.data || response;

        setData({
          hero: {
            title: pageData?.hero?.title || "Training & Internship",

            subtitle:
              pageData?.hero?.subtitle || "Training and Internship Cell",

            breadcrumb:
              pageData?.hero?.breadcrumb || "Home / Training & Internship",
          },

          introduction: {
            heading: pageData?.introduction?.heading || "Training & Internship",

            description: pageData?.introduction?.description || "",
          },

          team: Array.isArray(pageData?.team) ? pageData.team : [],

          details: Array.isArray(pageData?.details) ? pageData.details : [],

          documents: Array.isArray(pageData?.documents)
            ? pageData.documents
            : [],
        });
      } catch (err) {
        console.error("Training & Internship Page Error:", err);

        setError(
          err?.message || "Unable to load Training & Internship information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="training-public-page">
        <div className="training-public-loading">
          <div className="training-loading-spinner" />

          <p>Loading Training & Internship...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="training-public-page">
        <section className="training-public-hero">
          <div className="training-public-container">
            <div className="training-hero-content">
              <span className="training-breadcrumb">
                {data.hero.breadcrumb}
              </span>

              <h1>{data.hero.title}</h1>

              <div className="training-hero-line" />

              <p>{data.hero.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="training-public-container">
          <div className="training-public-error">
            <h3>Unable to load information</h3>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="training-public-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="training-public-hero">
        <div className="training-public-container">
          <div className="training-hero-content">
            <span className="training-breadcrumb">{data.hero.breadcrumb}</span>

            <h1>{data.hero.title}</h1>

            <div className="training-hero-line" />

            <p>{data.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="training-introduction">
        <div className="training-public-container">
          <div className="training-intro-content">
            <span className="training-section-label">ABOUT</span>

            <h2>{data.introduction.heading}</h2>

            <p>{data.introduction.description}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
      ===================================================== */}

      {data.team.length > 0 && (
        <section className="training-team-section">
          <div className="training-public-container">
            <div className="training-section-heading">
              <span className="training-section-label">OUR TEAM</span>

              <h2>Training & Internship Team</h2>

              <p>
                Meet the faculty members responsible for coordinating training
                and internship activities.
              </p>
            </div>

            <div className="training-team-grid">
              {data.team.map((member, index) => (
                <article
                  className="training-team-card"
                  key={member._id || index}
                >
                  {/* ===================================
                        PHOTO
                    ==================================== */}

                  <div className="training-team-photo">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="training-team-placeholder">
                        <FaUserGraduate />
                      </div>
                    )}
                  </div>

                  {/* ===================================
                        CONTENT
                    ==================================== */}

                  <div className="training-team-content">
                    <span className="training-team-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{member.name}</h3>

                    <div className="training-team-designation">
                      {member.designation}
                    </div>

                    {member.qualification && (
                      <p className="training-team-qualification">
                        {member.qualification}
                      </p>
                    )}

                    {member.details && (
                      <p className="training-team-details">{member.details}</p>
                    )}

                    {/* ===============================
                          CONTACT
                      ================================= */}

                    {(member.email || member.phone) && (
                      <div className="training-team-contact">
                        {member.email && (
                          <a href={`mailto:${member.email}`}>
                            <FaEnvelope />
                            <span>{member.email}</span>
                          </a>
                        )}

                        {member.phone && (
                          <a href={`tel:${member.phone}`}>
                            <FaPhone />
                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          TRAINING / INTERNSHIP DETAILS
      ===================================================== */}

      {data.details.length > 0 && (
        <section className="training-details-section">
          <div className="training-public-container">
            <div className="training-section-heading">
              <span className="training-section-label">INFORMATION</span>

              <h2>Training & Internship</h2>

              <p>
                Information about student training and internship opportunities.
              </p>
            </div>

            <div className="training-details-grid">
              {data.details.map((item, index) => (
                <article
                  className="training-detail-card"
                  key={item._id || index}
                >
                  <div className="training-detail-top">
                    <span className="training-detail-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="training-detail-title">{item.title}</span>
                  </div>

                  <h3>{item.heading}</h3>

                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      {data.documents.length > 0 && (
        <section className="training-documents-section">
          <div className="training-public-container">
            <div className="training-section-heading">
              <span className="training-section-label">RESOURCES</span>

              <h2>Important Documents</h2>

              <p>Access important training and internship related documents.</p>
            </div>

            <div className="training-document-grid">
              {data.documents.map((document, index) => (
                <article
                  className="training-document-card"
                  key={document._id || index}
                >
                  <div className="training-document-icon">
                    <FaFilePdf />
                  </div>

                  <div className="training-document-content">
                    <span className="training-document-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{document.title}</h3>

                    <p>{document.heading}</p>

                    {document.pdfUrl && (
                      <a
                        href={document.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="training-document-btn"
                      >
                        <FaFilePdf />

                        <span>View Document</span>

                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER INFORMATION
      ===================================================== */}

      <section className="training-public-info">
        <div className="training-public-container">
          <div className="training-info-box">
            <div className="training-info-icon">
              <FaUserGraduate />
            </div>

            <div>
              <span className="training-info-label">
                TRAINING & INTERNSHIP CELL
              </span>

              <h3>Building Industry-Ready Professionals</h3>

              <p>
                The Training and Internship Cell supports students in developing
                professional skills and gaining practical industry exposure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingInternship;
