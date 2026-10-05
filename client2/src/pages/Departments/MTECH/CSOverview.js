import React, { useEffect, useState } from "react";
import { FaCheck, FaArrowRight, FaUserTie } from "react-icons/fa";

import "../CSS/MCAOverview.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DEPARTMENT_SLUG = "master-of-technology";

const CSOverview = () => {
  const [overview, setOverview] = useState(null);

  const [department, setDepartment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD CS DEPARTMENT OVERVIEW
  ========================================================= */

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/department-overview/slug/${DEPARTMENT_SLUG}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load department overview",
          );
        }

        if (!result.data || result.data.status === "Inactive") {
          throw new Error("Department overview is currently unavailable.");
        }

        setOverview(result.data);

        setDepartment(result.department || result.data.departmentId || null);
      } catch (err) {
        console.error("CS Overview Error:", err);

        setError(err.message || "Failed to load department overview.");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="overviewContainer">
        <div className="overviewLoading">
          <div className="overviewSpinner"></div>

          <h3>Loading Department Overview...</h3>

          <p>Please wait while we load the latest information.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !overview) {
    return (
      <div className="overviewContainer">
        <div className="overviewError">
          <h3>Department Overview</h3>

          <p>{error || "Department overview is not available."}</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     DATA NORMALIZATION
  ========================================================= */

  const mission = Array.isArray(overview.mission) ? overview.mission : [];

  const highlights = Array.isArray(overview.departmentHighlights)
    ? overview.departmentHighlights
    : [];

  const whyChoose = Array.isArray(overview.whyChooseDepartment)
    ? overview.whyChooseDepartment
    : [];

  const placementStatistics = Array.isArray(overview.placementStatistics)
    ? [...overview.placementStatistics].sort(
        (a, b) => Number(a.priority || 1) - Number(b.priority || 1),
      )
    : [];

  const gallery = Array.isArray(overview.departmentGallery)
    ? [...overview.departmentGallery].sort(
        (a, b) => Number(a.priority || 1) - Number(b.priority || 1),
      )
    : [];

  const hod = overview.headOfDepartment || null;

  /* =========================================================
     MAIN OVERVIEW IMAGE
  ========================================================= */

  const overviewImage = overview.overviewImage || "";

  return (
    <div className="overviewContainer">
      {/* =====================================================
          DEPARTMENT HERO / BANNER
      ===================================================== */}

      <section className="overviewHero">
        <div className="overviewHeroContent">
          <span className="overviewEyebrow">MTECH DEPARTMENT</span>

          <h1>
            {overview.bannerTitle ||
              department?.name ||
              "Master of Computer Applications"}
          </h1>

          <p>
            {
              "Empowering students with advanced knowledge, practical skills and industry-oriented education."
            }
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN OVERVIEW IMAGE
      ===================================================== */}

      {overviewImage && (
        <section className="overviewImageSection">
          <div className="overviewImageWrapper">
            <img
              src={overviewImage}
              alt={overview.bannerTitle || department?.name || "CS Department"}
            />
          </div>
        </section>
      )}

      {/* =====================================================
          ABOUT DEPARTMENT
      ===================================================== */}

      {overview.aboutDepartment && (
        <section className="sectionCard">
          <h2>About Department</h2>

          <p>{overview.aboutDepartment}</p>
        </section>
      )}

      {/* =====================================================
          VISION
      ===================================================== */}

      {overview.vision && (
        <section className="sectionCard">
          <h2>Vision</h2>

          <p>{overview.vision}</p>
        </section>
      )}

      {/* =====================================================
          MISSION
      ===================================================== */}

      {mission.length > 0 && (
        <section className="sectionCard">
          <h2>Mission</h2>

          <ul className="missionList">
            {mission.map((item, index) => (
              <li key={index}>
                <FaCheck />

                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* =====================================================
          HEAD OF DEPARTMENT
      ===================================================== */}

      {/* =========================================================
    HEAD OF DEPARTMENT
========================================================= */}

      {overview?.headOfDepartment && (
        <section className="sectionCard">
          <h2>Head of Department</h2>

          <div className="hodSection">
            {/* HOD PHOTO */}
            <div className="hodImage">
              {overview.headOfDepartment.photo ? (
                <img
                  src={overview.headOfDepartment.photo}
                  alt={overview.headOfDepartment.name || "Head of Department"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="hodPlaceholder">
                  <FaUserTie />
                </div>
              )}
            </div>

            {/* HOD DETAILS */}
            <div className="hodContent">
              <h3>{overview.headOfDepartment.name || "Head of Department"}</h3>

              <h5>{overview.headOfDepartment.designation || ""}</h5>

              {overview.headOfDepartment.qualification && (
                <p className="hodQualification">
                  {overview.headOfDepartment.qualification}
                </p>
              )}

              {overview.headOfDepartment.email && (
                <div className="hodContact">
                  <a href={`mailto:${overview.headOfDepartment.email}`}>
                    {overview.headOfDepartment.email}
                  </a>
                </div>
              )}

              {overview.headOfDepartment.linkedinUrl && (
                <a
                  href={overview.headOfDepartment.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hodLinkedin"
                >
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          DEPARTMENT HIGHLIGHTS
      ===================================================== */}

      {highlights.length > 0 && (
        <section className="sectionCard">
          <h2>Department Highlights</h2>

          <div className="highlightGrid">
            {highlights.map((item, index) => (
              <div className="highlightCard" key={index}>
                <div className="highlightIcon">
                  <FaCheck />
                </div>

                <h4>{item}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          WHY CHOOSE CS
      ===================================================== */}

      {whyChoose.length > 0 && (
        <section className="sectionCard">
          <h2>Why Choose {department?.name || "MTECH"}?</h2>

          <div className="whyGrid">
            {whyChoose.map((item, index) => (
              <div className="whyCard" key={index}>
                <div className="whyIcon">
                  <FaCheck />
                </div>

                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          PLACEMENT
      ===================================================== */}

      {placementStatistics.length > 0 && (
        <section className="sectionCard">
          <h2>Placement</h2>

          <div className="placementGrid">
            {placementStatistics.map((item, index) => (
              <div className="placementCard" key={index}>
                <h1>{item.value}</h1>

                <h4>{item.label}</h4>

                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          DEPARTMENT GALLERY
      ===================================================== */}

      {gallery.length > 0 && (
        <section className="sectionCard">
          <h2>Department Gallery</h2>

          <div className="galleryGrid">
            {gallery.map((image, index) => (
              <div
                className="galleryItem"
                key={image.publicId || image.imageUrl || index}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title || `Department Gallery ${index + 1}`}
                />

                {image.title && (
                  <div className="galleryCaption">{image.title}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          JOIN DEPARTMENT / CTA
      ===================================================== */}

      {(overview.joinDepartmentTitle ||
        overview.joinDepartmentDescription ||
        overview.joinDepartmentUrl) && (
        <section className="ctaSection">
          {overview.joinDepartmentTitle && (
            <h2>{overview.joinDepartmentTitle}</h2>
          )}

          {overview.joinDepartmentDescription && (
            <p>{overview.joinDepartmentDescription}</p>
          )}

          {overview.joinDepartmentUrl && (
            <a
              href={overview.joinDepartmentUrl}
              className="ctaButton"
              target="_blank"
              rel="noreferrer"
            >
              Apply Now
              <FaArrowRight />
            </a>
          )}
        </section>
      )}
    </div>
  );
};

export default CSOverview;
