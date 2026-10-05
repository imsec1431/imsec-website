import React, { useEffect, useState } from "react";

import "./PlacementPolicy.css";

import { Container, Spinner, Button } from "react-bootstrap";

import {
  FaFilePdf,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaDownload,
} from "react-icons/fa";

import { fetchPlacementPolicies } from "../../services/placementPolicyService";

/* =========================================================
   PLACEMENT POLICY
========================================================= */

const PlacementPolicy = () => {
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD POLICIES
  ======================================================= */

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);

        setError("");

        const result = await fetchPlacementPolicies();

        setPolicies(result?.data || []);
      } catch (err) {
        console.error("Placement Policy Public Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load Placement Policy.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="placement-policy-page">
        <section className="placement-policy-status">
          <Spinner animation="border" variant="primary" />

          <h3>Loading Placement Policy...</h3>

          <p>Please wait while we load the latest policy information.</p>
        </section>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <main className="placement-policy-page">
        <section className="placement-policy-status">
          <FaInfoCircle />

          <h3>Unable to Load Placement Policy</h3>

          <p>{error}</p>
        </section>
      </main>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!policies.length) {
    return (
      <main className="placement-policy-page">
        <section className="placement-policy-hero">
          <Container>
            <h1>Placement Policy</h1>

            <p>
              Important guidelines and policies related to campus placements.
            </p>
          </Container>
        </section>

        <section className="placement-policy-status">
          <FaInfoCircle />

          <h3>Placement Policy</h3>

          <p>Placement policy information is currently unavailable.</p>
        </section>
      </main>
    );
  }

  /* =======================================================
     PUBLIC PAGE
  ======================================================= */

  return (
    <main className="placement-policy-page">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="placement-policy-hero">
        <Container>
          <div className="placement-policy-hero-content">
            <h1>Placement Policy</h1>

            <p style={{ color: "white" }}>
              Guidelines, rules and important information governing the
              placement process at IMSEC.
            </p>
          </div>
        </Container>
      </section>

      {/* ===================================================
          POLICY CONTENT
      =================================================== */}

      <section className="placement-policy-section">
        <Container>
          <div className="placement-policy-list">
            {policies.map((policy) => (
              <article className="placement-policy-card" key={policy._id}>
                {/* ======================================
                      POLICY HEADER
                  ====================================== */}

                <div className="placement-policy-card-header">
                  <div className="placement-policy-icon">
                    <FaFilePdf />
                  </div>

                  <div>
                    <h3>{policy.title}</h3>

                    {policy.shortDescription && (
                      <p>{policy.shortDescription}</p>
                    )}
                  </div>
                </div>

                {/* ======================================
                      CONTENT
                  ====================================== */}

                {policy.content && (
                  <div className="placement-policy-content">
                    <div className="placement-policy-content-text">
                      {policy.content}
                    </div>
                  </div>
                )}

                {/* ======================================
                      PDF
                  ====================================== */}

                {policy.pdfLink && (
                  <div className="placement-policy-document">
                    <div className="placement-policy-document-info">
                      <FaFilePdf />

                      <div>
                        <strong>
                          {policy.documentTitle || "Placement Policy PDF"}
                        </strong>

                        <span>Official policy document</span>
                      </div>
                    </div>

                    <div className="placement-policy-document-actions">
                      <Button
                        as="a"
                        href={policy.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="placement-policy-view-btn"
                      >
                        <FaExternalLinkAlt />
                        View PDF
                      </Button>

                      <Button
                        as="a"
                        href={policy.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="placement-policy-download-btn"
                      >
                        <FaDownload />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
};

export default PlacementPolicy;
