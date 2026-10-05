import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaBuilding, FaUsers } from "react-icons/fa";

import departmentAlumniPublicService from "../../../services/departmentAlumniPublicService";

import "../CSS/DepartmentAlumni.css";

const DEPARTMENT_SLUG = "computer-science-engineering";

const DepartmentAlumni = () => {
  const [department, setDepartment] = useState(null);
  const [alumni, setAlumni] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD ALUMNI
  ========================================================= */

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);
        setError("");

        /* -----------------------------------------------------
           GET DEPARTMENT
        ----------------------------------------------------- */

        const departmentResponse =
          await departmentAlumniPublicService.getDepartmentBySlug(
            DEPARTMENT_SLUG,
          );

        if (!departmentResponse?.success || !departmentResponse?.data) {
          throw new Error("Department information not found.");
        }

        const departmentData = departmentResponse.data;

        setDepartment(departmentData);

        /* -----------------------------------------------------
           GET DEPARTMENT ALUMNI
        ----------------------------------------------------- */

        const alumniResponse =
          await departmentAlumniPublicService.getPublicDepartmentAlumni(
            departmentData._id,
          );

        if (!alumniResponse?.success) {
          throw new Error(alumniResponse?.message || "Failed to load alumni.");
        }

        const alumniData = Array.isArray(alumniResponse.data)
          ? alumniResponse.data
          : [];

        /* -----------------------------------------------------
           ONLY ACTIVE ALUMNI
        ----------------------------------------------------- */

        const activeAlumni = alumniData.filter(
          (item) => item.isActive !== false,
        );

        setAlumni(activeAlumni);
      } catch (err) {
        console.error("Department Alumni Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load department alumni.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlumni();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="department-alumni-public">
        <div className="department-alumni-loading">
          <div className="department-alumni-spinner" />

          <h3>Loading Alumni...</h3>

          <p>Please wait while we load our alumni information.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="department-alumni-public">
        <div className="department-alumni-error">
          <FaUsers />

          <h2>Alumni Information</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="department-alumni-public">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="department-alumni-hero">
        <div className="department-alumni-hero-overlay" />

        <div className="department-alumni-container">
          <div className="department-alumni-hero-content">
            <span className="department-alumni-eyebrow">
              {department?.shortName || department?.code || "MCA"} DEPARTMENT
            </span>

            <h1>Our Alumni</h1>

            <p>
              Celebrating the achievements and success of our alumni who
              continue to make a difference in the industry and society.
            </p>

            <div className="department-alumni-hero-line" />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="department-alumni-intro">
        <div className="department-alumni-container">
          <div className="department-alumni-intro-content">
            <span className="department-alumni-section-label">
              ALUMNI NETWORK
            </span>

            <h2>
              {department?.name || "Master of Computer Applications"} Alumni
            </h2>

            <p>
              Our alumni are an integral part of the department family. Their
              professional achievements and contributions inspire current
              students and strengthen our academic and industry network.
            </p>
          </div>

          <div className="department-alumni-intro-icon">
            <FaGraduationCap />
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="department-alumni-statistics">
        <div className="department-alumni-container">
          <div className="department-alumni-stat-grid">
            <div className="department-alumni-stat-card">
              <div className="department-alumni-stat-icon">
                <FaUsers />
              </div>

              <strong>{alumni.length}</strong>

              <span>Alumni Profiles</span>
            </div>

            <div className="department-alumni-stat-card">
              <div className="department-alumni-stat-icon">
                <FaGraduationCap />
              </div>

              <strong>
                {
                  new Set(
                    alumni.map((item) => item.course?.trim()).filter(Boolean),
                  ).size
                }
              </strong>

              <span>Courses</span>
            </div>

            <div className="department-alumni-stat-card">
              <div className="department-alumni-stat-icon">
                <FaBuilding />
              </div>

              <strong>
                {
                  new Set(
                    alumni.map((item) => item.company?.trim()).filter(Boolean),
                  ).size
                }
              </strong>

              <span>Organizations</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ALUMNI LIST
      ===================================================== */}

      <section className="department-alumni-list-section">
        <div className="department-alumni-container">
          <div className="department-alumni-section-heading">
            <span className="department-alumni-section-label">OUR ALUMNI</span>

            <h2>Meet Our Alumni</h2>

            <p>
              Meet the professionals who are part of our growing alumni
              community.
            </p>
          </div>

          {alumni.length === 0 ? (
            <div className="department-alumni-empty">
              <FaUsers />

              <h3>Alumni Information Coming Soon</h3>

              <p>Alumni profiles for this department will be updated soon.</p>
            </div>
          ) : (
            <div className="department-alumni-grid">
              {alumni.map((item, index) => (
                <article
                  className="department-alumni-card"
                  key={item._id || index}
                >
                  {/* =================================================
                      LARGE IMAGE - LEFT
                  ================================================= */}

                  <div className="department-alumni-image-wrapper">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Department Alumni"}
                        className="department-alumni-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const placeholder =
                            e.currentTarget.parentElement.querySelector(
                              ".department-alumni-image-placeholder",
                            );

                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    {/* IMAGE FALLBACK */}

                    <div
                      className="department-alumni-image-placeholder"
                      style={{
                        display: item.image ? "none" : "flex",
                      }}
                    >
                      <FaGraduationCap />
                    </div>
                  </div>

                  {/* =================================================
                      INFORMATION - RIGHT
                  ================================================= */}

                  <div className="department-alumni-card-content">
                    <span className="department-alumni-card-label">ALUMNI</span>

                    <h3>{item.name || "Alumni"}</h3>

                    {item.course && (
                      <div className="department-alumni-course">
                        <span className="department-alumni-icon">
                          <FaGraduationCap />
                        </span>

                        <span>{item.course}</span>
                      </div>
                    )}

                    {item.company && (
                      <div className="department-alumni-company">
                        <span className="department-alumni-icon">
                          <FaBuilding />
                        </span>

                        <span>{item.company}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="department-alumni-cta">
        <div className="department-alumni-container">
          <div className="department-alumni-cta-content">
            <span>STAY CONNECTED</span>

            <h2>Once a Student, Always a Part of Our Family</h2>

            <p>
              Our alumni network continues to grow through professional
              achievements, collaboration and meaningful connections.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentAlumni;
