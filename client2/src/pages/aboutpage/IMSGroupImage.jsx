import React, { useEffect, useState } from "react";
import { FaUniversity, FaInfoCircle, FaArrowRight } from "react-icons/fa";

import "./IMSGroupImage.css";

import { fetchIMSGroupImage } from "../../services/imsGroupImageService";

const IMSGroupImage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*=========================================
  LOAD PUBLIC DATA
  =========================================*/

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchIMSGroupImage();

        setPage(result?.data || null);
      } catch (err) {
        console.error("IMS Group Image error:", err);

        setError(err?.message || "Unable to load information.");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  /*=========================================
  LOADING
  =========================================*/

  if (loading) {
    return (
      <main className="ims-group-image-page">
        <div className="ims-group-image-status">
          <div className="ims-group-image-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>

          <h2>Loading...</h2>

          <p>Please wait while we load the information.</p>
        </div>
      </main>
    );
  }

  /*=========================================
  ERROR
  =========================================*/

  if (error) {
    return (
      <main className="ims-group-image-page">
        <div className="container">
          <div className="alert alert-danger mt-5">{error}</div>
        </div>
      </main>
    );
  }

  /*=========================================
  NO DATA
  =========================================*/

  if (!page) {
    return (
      <main className="ims-group-image-page">
        <div className="ims-group-image-status">
          <FaUniversity />

          <h2>Information unavailable</h2>

          <p>IMS Group information is currently unavailable.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="ims-group-image-page">
      {/*=====================================
      HERO
      =====================================*/}

      <section className="ims-group-image-hero">
        <div className="ims-group-image-hero-overlay" />

        <div className="container">
          <div className="ims-group-image-hero-content">
            <h1>{page.title}</h1>
          </div>
        </div>
      </section>

      {/*=====================================
      IMAGE SECTION
      =====================================*/}

      <section className="ims-group-image-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="ims-group-image-card">
                {/* IMAGE */}

                {page.image && (
                  <div className="ims-group-public-image">
                    <img src={page.image} alt={page.imageAlt || page.title} />
                  </div>
                )}

                {/* TEXT */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*=====================================
      BOOTSTRAP MODAL
      =====================================*/}

      <div
        className="modal fade"
        id="imsGroupInfoModal"
        tabIndex="-1"
        aria-labelledby="imsGroupInfoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content ims-group-modal">
            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <small>About IMS Group</small>

                <h5 className="modal-title" id="imsGroupInfoModalLabel">
                  {page.title}
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {/* MODAL BODY */}

            <div className="modal-body">
              {page.image && (
                <div className="ims-group-modal-image">
                  <img src={page.image} alt={page.imageAlt || page.title} />
                </div>
              )}

              <div className="ims-group-modal-text">
                {page.description
                  ?.split("\n")
                  .filter((paragraph) => paragraph.trim())
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IMSGroupImage;
