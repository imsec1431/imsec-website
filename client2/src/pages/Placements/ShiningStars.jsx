import React, { useEffect, useState } from "react";

import { FaTimes, FaExpand } from "react-icons/fa";

import { getPublishedShiningStars } from "../../services/shiningStarService";

import "./ShiningStars.css";

const ShiningStars = () => {
  const [stars, setStars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedStar, setSelectedStar] = useState(null);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    const loadStars = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getPublishedShiningStars();

        const data = response?.data || [];

        data.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

        setStars(data);
      } catch (err) {
        console.error("Load public shining stars error:", err);

        setError(
          err?.response?.data?.message || "Unable to load Shining Stars.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStars();
  }, []);

  /* =====================================================
     ESCAPE
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedStar(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="shining-stars-page">
        <div className="shining-stars-container">
          <div className="shining-stars-loading">
            <div className="shining-stars-spinner" />

            <p>Loading Shining Stars...</p>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="shining-stars-page">
        <div className="shining-stars-container">
          <div className="shining-stars-error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <main className="shining-stars-page">
        {/* HERO */}

        <section className="shining-stars-hero">
          <div className="shining-stars-container">
            <div className="shining-stars-heading">
              <h1>Shining Stars</h1>

              <p>Celebrating the outstanding achievements of our students.</p>
            </div>
          </div>
        </section>

        {/* GALLERY */}

        <section className="shining-stars-gallery-section">
          <div className="shining-stars-container">
            {stars.length === 0 ? (
              <div className="shining-stars-empty">
                <h3>Shining Stars</h3>

                <p>No Shining Stars are currently available.</p>
              </div>
            ) : (
              <div className="shining-stars-grid">
                {stars.map((star) => (
                  <article
                    key={star._id}
                    className="shining-star-card"
                    onClick={() => setSelectedStar(star)}
                  >
                    {/* IMAGE */}

                    <div className="shining-star-image-wrapper">
                      <img
                        src={star.image}
                        alt={star.imageAlt || "IMSEC Shining Star"}
                        loading="lazy"
                      />

                      <div className="shining-star-overlay">
                        <div className="shining-star-view-icon">
                          <FaExpand />
                        </div>

                        <span>View</span>
                      </div>
                    </div>

                    {/* BATCH */}

                    {star.batch && (
                      <div className="shining-star-batch">{star.batch}</div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedStar && (
        <div
          className="shining-star-modal"
          onClick={() => setSelectedStar(null)}
        >
          <div
            className="shining-star-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="shining-star-modal-close"
              onClick={() => setSelectedStar(null)}
              aria-label="Close image"
            >
              <FaTimes />
            </button>

            <img
              src={selectedStar.image}
              alt={selectedStar.imageAlt || "IMSEC Shining Star"}
              className="shining-star-modal-image"
            />

            {selectedStar.batch && (
              <div className="shining-star-modal-batch">
                {selectedStar.batch}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShiningStars;
