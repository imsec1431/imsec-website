import React, { useEffect, useState } from "react";
import { FaSitemap, FaExpand, FaTimes } from "react-icons/fa";

import "./CDCStructure.css";

import { fetchCDCStructure } from "../../services/cdcStructureService";

const CDCStructure = () => {
  const [page, setPage] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showImage, setShowImage] = useState(false);

  /* =========================================
     LOAD PUBLIC DATA
  ========================================= */

  useEffect(() => {
    const loadCDCStructure = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchCDCStructure();

        setPage(result?.data || null);
      } catch (err) {
        console.error("CDC Structure error:", err);

        setError(err?.message || "Unable to load CDC Structure.");
      } finally {
        setLoading(false);
      }
    };

    loadCDCStructure();
  }, []);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="cdc-public-page">
        <div className="cdc-public-status">
          <div className="cdc-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>

          <h2>Loading CDC Structure...</h2>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <main className="cdc-public-page">
        <div className="cdc-public-status">
          <FaSitemap />

          <h2>Unable to load CDC Structure</h2>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  /* =========================================
     NO DATA
  ========================================= */

  if (!page || !page.image) {
    return (
      <main className="cdc-public-page">
        <div className="cdc-public-status">
          <FaSitemap />

          <h2>CDC Structure Unavailable</h2>

          <p>CDC Structure information is currently unavailable.</p>
        </div>
      </main>
    );
  }

  /* =========================================
     PUBLIC PAGE
  ========================================= */

  return (
    <main className="cdc-public-page">
      {/* =====================================
          HERO
      ===================================== */}

      <section className="cdc-public-hero">
        <div className="cdc-public-hero-overlay" />

        <div className="container">
          <div className="cdc-public-hero-content">
            <span>
              <FaSitemap />
              Career Development Centre
            </span>

            <h1>{page.title || "CDC Structure"}</h1>
          </div>
        </div>
      </section>

      {/* =====================================
          IMAGE SECTION
      ===================================== */}

      <section className="cdc-public-content">
        <div className="container">
          <div className="cdc-public-card">
            <div className="cdc-public-card-header">
              <div>
                <span>CDC</span>

                <h2>{page.title || "CDC Structure"}</h2>
              </div>

              <button
                type="button"
                className="cdc-expand-button"
                onClick={() => setShowImage(true)}
                aria-label="View full CDC structure"
              >
                <FaExpand />

                <span style={{ color: "white" }}>View Full Image</span>
              </button>
            </div>

            {/* =================================
                IMAGE

                IMPORTANT:
                No object-fit: cover.
                Complete image remains visible.
            ================================= */}

            <div className="cdc-public-image-wrapper">
              <img
                src={page.image}
                alt={page.imageAlt || page.title || "CDC Structure"}
                className="cdc-public-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          FULL IMAGE MODAL
      ===================================== */}

      {showImage && (
        <div className="cdc-image-modal" onClick={() => setShowImage(false)}>
          <button
            type="button"
            className="cdc-modal-close"
            onClick={() => setShowImage(false)}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div
            className="cdc-modal-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={page.image}
              alt={page.imageAlt || page.title || "CDC Structure"}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default CDCStructure;
