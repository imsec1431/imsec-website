import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaGraduationCap,
  FaUsers,
  FaBookOpen,
  FaUniversity,
  FaArrowRight,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "./IMSGroup.css";

import { fetchIMSGroup } from "../../services/imsGroupService";

/*=========================================
IMS GROUP PUBLIC PAGE
=========================================*/

const IMSGroup = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*=========================================
  LOAD DATA
  =========================================*/

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchIMSGroup();

        setGroup(result?.data || null);
      } catch (err) {
        console.error("IMS Group loading error:", err);

        setError(err?.message || "Unable to load IMS Group information.");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, []);

  /*=========================================
  LOADING
  =========================================*/

  if (loading) {
    return (
      <div className="ims-group-page">
        <div className="ims-group-status">
          <div className="ims-group-status-icon">
            <FaUniversity />
          </div>

          <h2>Loading IMS Group...</h2>

          <p>Please wait while we load the information.</p>
        </div>
      </div>
    );
  }

  /*=========================================
  ERROR
  =========================================*/

  if (error) {
    return (
      <div className="ims-group-page">
        <div className="ims-group-status">
          <div className="ims-group-status-icon">
            <FaUniversity />
          </div>

          <h2>Unable to Load Information</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  /*=========================================
  EMPTY
  =========================================*/

  if (!group) {
    return (
      <div className="ims-group-page">
        <div className="ims-group-status">
          <h2>IMS Group information is currently unavailable.</h2>
        </div>
      </div>
    );
  }

  /*=========================================
  RENDER
  =========================================*/

  return (
    <main className="ims-group-page">
      {/*=====================================
      HERO
      =====================================*/}

      <section className="ims-group-hero">
        <div className="ims-group-hero-overlay" />

        <div className="ims-group-hero-content">
          <span className="ims-group-eyebrow">About Us</span>

          <h1>{group.title}</h1>

          {group.subtitle && <p>{group.subtitle}</p>}
        </div>
      </section>

      {/*=====================================
      INTRODUCTION
      =====================================*/}

      <section className="ims-group-introduction">
        <div className="ims-group-container">
          <div className="ims-group-section-heading">
            <span>IMS Group</span>

            <h2>Excellence in Education</h2>
          </div>

          {group.subtitle && (
            <p className="ims-group-intro-text">{group.subtitle}</p>
          )}
        </div>
      </section>

      {/*=====================================
      STATISTICS
      =====================================*/}

      {group.stats && (
        <section className="ims-group-stats">
          <div className="ims-group-container">
            <div className="ims-group-stats-grid">
              {/* CAMPUSES */}

              <div className="ims-group-stat-card">
                <div className="ims-group-stat-icon">
                  <FaBuilding />
                </div>

                <div className="ims-group-stat-number">
                  {group.stats.campuses}
                </div>

                <div className="ims-group-stat-label">Campuses</div>
              </div>

              {/* STUDENTS */}

              <div className="ims-group-stat-card">
                <div className="ims-group-stat-icon">
                  <FaUsers />
                </div>

                <div className="ims-group-stat-number">
                  {group.stats.students}
                </div>

                <div className="ims-group-stat-label">Students</div>
              </div>

              {/* PROGRAMS */}

              <div className="ims-group-stat-card">
                <div className="ims-group-stat-icon">
                  <FaBookOpen />
                </div>

                <div className="ims-group-stat-number">
                  {group.stats.programs}
                </div>

                <div className="ims-group-stat-label">Programs</div>
              </div>

              {/* EXPERIENCE */}

              <div className="ims-group-stat-card">
                <div className="ims-group-stat-icon">
                  <FaGraduationCap />
                </div>

                <div className="ims-group-stat-number">
                  {group.stats.experience}
                </div>

                <div className="ims-group-stat-label">Academic Excellence</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*=====================================
      INSTITUTIONS
      =====================================*/}

      <section className="ims-group-institutions">
        <div className="ims-group-container">
          <div className="ims-group-section-heading">
            <span>Our Institutions</span>

            <h2>Institutions Under IMS Group</h2>

            <p>
              Explore the institutions and academic programmes offered under the
              IMS Group of Institutions.
            </p>
          </div>

          <div className="ims-group-institution-grid">
            {group.institutions?.map((institution, index) => (
              <article
                className="ims-group-institution-card"
                key={institution._id || index}
              >
                {/*=================================
                  INSTITUTION ICON
                  =================================*/}

                <div className="ims-group-institution-icon">
                  <FaUniversity />
                </div>

                {/*=================================
                  NUMBER
                  =================================*/}

                <div className="ims-group-institution-number">0{index + 1}</div>

                {/*=================================
                  NAME
                  =================================*/}

                <h3>{institution.name}</h3>

                {/*=================================
                  LOCATION
                  =================================*/}

                {institution.location && (
                  <div className="ims-group-location">
                    <FaMapMarkerAlt />

                    <span>{institution.location}</span>
                  </div>
                )}

                {/*=================================
                  DESCRIPTION
                  =================================*/}

                {institution.description && (
                  <p className="ims-group-institution-description">
                    {institution.description}
                  </p>
                )}

                {/*=================================
                  COURSES
                  =================================*/}

                {institution.courses?.length > 0 && (
                  <div className="ims-group-courses">
                    <h4>Courses Offered</h4>

                    <ul>
                      {institution.courses
                        .filter((course) => course?.trim())
                        .map((course, courseIndex) => (
                          <li key={courseIndex}>
                            <FaArrowRight />

                            <span>{course}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/*=================================
                  WEBSITE
                  =================================*/}

                {institution.website && (
                  <a
                    className="ims-group-institution-link"
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                    <FaExternalLinkAlt />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/*=====================================
      BOTTOM CTA
      =====================================*/}

      <section className="ims-group-cta">
        <div className="ims-group-container">
          <div className="ims-group-cta-content">
            <div className="ims-group-cta-icon">
              <FaGraduationCap />
            </div>

            <h2>Building the Future Through Education</h2>

            <p>
              The IMS Group of Institutions continues to provide opportunities
              for academic growth, professional development and innovation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IMSGroup;
