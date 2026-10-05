import { useEffect, useState } from "react";

import { FaUserGraduate, FaEnvelope, FaPhone, FaHeart } from "react-icons/fa";

import counsellingSupportService from "../../services/counsellingSupportService";

import "./counsellingSupport.css";

const DEFAULT_DATA = {
  title: "Counselling Support",

  heading: "Student Counselling Support",

  description:
    "The institute provides counselling support to help students address academic, personal and career-related concerns.",

  counsellorName: "Student Counsellor",

  designation: "Student Counsellor",

  email: "",

  phone: "",

  published: true,
};

const CounsellingSupport = () => {
  const [data, setData] = useState(DEFAULT_DATA);

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
          await counsellingSupportService.getCounsellingSupport();

        const pageData = response?.data?.data || response?.data || response;

        setData({
          ...DEFAULT_DATA,
          ...(pageData || {}),
        });
      } catch (err) {
        console.error(err);

        setError(
          err?.message || "Unable to load counselling support information.",
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
      <div className="counselling-public-loading">
        <div className="counselling-loading-spinner"></div>

        <p>Loading Counselling Support...</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="counselling-public-error">
        <h3>Unable to load Counselling Support</h3>

        <p>{error}</p>
      </div>
    );
  }

  /* =========================================================
     PUBLIC PAGE
  ========================================================= */

  return (
    <div className="counselling-public-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="counselling-public-hero">
        <div className="counselling-hero-circle counselling-circle-one"></div>

        <div className="counselling-hero-circle counselling-circle-two"></div>

        <div className="counselling-hero-content">
          <div className="counselling-breadcrumb">
            Home / Student Welfare / Counselling Support
          </div>

          <div className="counselling-hero-line"></div>

          <h1>{data.title}</h1>

          <p>Student Welfare &amp; Support Services</p>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="counselling-intro-section">
        <div className="counselling-container">
          <div className="counselling-section-heading">
            <span>STUDENT WELFARE</span>

            <h2>{data.heading}</h2>
          </div>

          <div className="counselling-intro-content">
            <div className="counselling-intro-icon">
              <FaHeart />
            </div>

            <p>{data.description}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          COUNSELLOR
      ===================================================== */}

      <section className="counselling-support-section">
        <div className="counselling-container">
          <div className="counselling-support-card">
            <div className="counselling-person-icon">
              <FaUserGraduate />
            </div>

            <div className="counselling-person-content">
              <span className="counselling-card-label">
                COUNSELLING SUPPORT
              </span>

              <h3>{data.counsellorName}</h3>

              {data.designation && (
                <p className="counselling-designation">{data.designation}</p>
              )}

              <div className="counselling-contact-list">
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="counselling-contact-item"
                  >
                    <FaEnvelope />

                    <span>{data.email}</span>
                  </a>
                )}

                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="counselling-contact-item"
                  >
                    <FaPhone />

                    <span>{data.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <section className="counselling-info-section">
        <div className="counselling-container">
          <div className="counselling-info-box">
            <div className="counselling-info-accent"></div>

            <span>STUDENT SUPPORT</span>

            <h2>We Are Here to Support You</h2>

            <p>
              Students can seek counselling support for academic concerns,
              personal challenges, career guidance and other issues affecting
              their overall student experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounsellingSupport;
