import React, { useEffect, useState } from "react";

import { Row, Col, Card, Spinner } from "react-bootstrap";

import { FaBuilding, FaGlobe, FaExternalLinkAlt } from "react-icons/fa";

import { fetchMajorRecruiters } from "../../services/majorRecruiterService";

import "./OurRecruiters.css";

/* =========================================================
   COMPONENT
========================================================= */

const OurRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    const loadRecruiters = async () => {
      try {
        setLoading(true);

        setError("");

        const result = await fetchMajorRecruiters();

        setRecruiters(result?.data || []);
      } catch (err) {
        console.error("Major Recruiters public error:", err);

        setError(err?.message || "Unable to load major recruiters.");
      } finally {
        setLoading(false);
      }
    };

    loadRecruiters();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="major-public-status">
        <Spinner animation="border" className="major-public-spinner" />

        <h4>Loading Major Recruiters...</h4>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="major-public-status">
        <FaBuilding />

        <h4>Unable to load recruiters</h4>

        <p>{error}</p>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="major-public-page">
      {/* =====================================================
          HERO (FULL WIDTH)
      ===================================================== */}

      <section className="major-public-hero">
        <div className="major-hero-container text-center">
          <div className="major-public-hero-content text-center">
            <h1 className="text-center">Major Recruiters</h1>

            <p className="text-center">
              Our leading corporate recruiters and industry partners.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="major-public-content">
        <div className="major-recruiters-container">
          <div className="major-public-section-heading">
            <span>Corporate Connect</span>

            <h2>Our Major Recruiters</h2>
          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {recruiters.length === 0 ? (
            <div className="major-public-empty">
              <div className="major-public-empty-icon">
                <FaBuilding />
              </div>

              <h3>Recruiter information will be updated soon.</h3>

              <p>
                Please check back later for the latest recruiter information.
              </p>
            </div>
          ) : (
            /* ================================================
               RECRUITER GRID
            ================================================ */

            <Row className="g-4">
              {recruiters.map((recruiter) => (
                <Col key={recruiter._id || recruiter.id} xl={3} lg={4} md={6}>
                  <Card className="major-recruiter-card">
                    {/* ====================================
                          LOGO
                      ==================================== */}

                    <div className="major-recruiter-logo">
                      {recruiter.logo ? (
                        <img
                          src={recruiter.logo}
                          alt={recruiter.logoAlt || recruiter.companyName}
                        />
                      ) : (
                        <FaBuilding />
                      )}
                    </div>

                    {/* ====================================
                          CONTENT
                      ==================================== */}

                    <Card.Body>
                      <h3>{recruiter.companyName}</h3>

                      {recruiter.description && (
                        <p className="major-recruiter-description">
                          {recruiter.description}
                        </p>
                      )}

                      {/* ==================================
                            WEBSITE
                        ================================== */}

                      {recruiter.website && (
                        <a
                          href={recruiter.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="major-recruiter-website"
                        >
                          <FaGlobe />

                          <span>Visit Website</span>

                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>
    </main>
  );
};

export default OurRecruiters;
