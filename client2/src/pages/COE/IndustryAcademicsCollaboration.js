import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import industryAcademicsService from "../../services/industryAcademicsService";
import "./industryAcademics.css";

const IndustryAcademicsCollaboration = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await industryAcademicsService.getIndustryAcademicsCollaboration();

        const pageData = response?.data?.data || response?.data || response;

        setData(pageData);
      } catch (err) {
        console.error("Industry Academics Collaboration Error:", err);

        setError(
          err?.message ||
            err?.response?.data?.message ||
            "Unable to load Industry Academics Collaboration.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =====================================================
     OPEN MODAL
     ===================================================== */

  const handleViewMore = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  /* =====================================================
     CLOSE MODAL
     ===================================================== */

  const handleClose = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="iac-loading">
        <div className="iac-spinner"></div>

        <p>Loading Industry Academics Collaboration...</p>
      </div>
    );
  }

  /* =====================================================
     ERROR
     ===================================================== */

  if (error) {
    return (
      <div className="iac-error">
        <h3>Unable to Load Information</h3>

        <p>{error}</p>
      </div>
    );
  }

  /* =====================================================
     PUBLISHED CHECK
     ===================================================== */

  if (!data || data.published === false) {
    return null;
  }

  /* =====================================================
     ACTIVE ITEMS
     ===================================================== */

  const items = Array.isArray(data.items)
    ? data.items
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.order || 1) - (b.order || 1))
    : [];

  return (
    <div className="iac-page">
      {/* =================================================
          HERO
          ================================================= */}

      <section className="iac-hero">
        <div className="iac-hero-overlay">
          <div className="iac-container">
            <span className="iac-eyebrow">CENTRE OF EXCELLENCE</span>

            <h1>{data.title || "Industry Academics Collaboration"}</h1>

            <div className="iac-breadcrumb">
              Home
              <span>/</span>
              COE
              <span>/</span>
              Industry Academics Collaboration
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRODUCTION
          ================================================= */}

      <section className="iac-intro">
        <div className="iac-container">
          <div className="iac-section-heading">
            <span>INDUSTRY • ACADEMIA • EXCELLENCE</span>

            <h2>{data.title || "Industry Academics Collaboration"}</h2>

            <div className="iac-heading-line"></div>
          </div>

          {data.description && (
            <p className="iac-intro-text">{data.description}</p>
          )}
        </div>
      </section>

      {/* =================================================
          CARDS
          ================================================= */}

      <section className="iac-list-section">
        <div className="iac-container">
          {items.length === 0 ? (
            <div className="iac-empty">
              <div className="iac-empty-icon">COE</div>

              <h3>No Information Available</h3>

              <p>
                Industry academics collaboration information will be updated
                soon.
              </p>
            </div>
          ) : (
            <div className="iac-card-grid">
              {items.map((item, index) => (
                <article className="iac-card" key={item._id || index}>
                  {/* ================================
                      PHOTO
                      ================================= */}

                  <div className="iac-card-image">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.title || "Centre of Excellence"}
                      />
                    ) : (
                      <div className="iac-no-image">
                        <span>COE</span>
                      </div>
                    )}
                  </div>

                  {/* ================================
                      CARD CONTENT
                      ================================= */}

                  <div className="iac-card-content">
                    <div className="iac-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3>{item.title}</h3>

                    <button
                      type="button"
                      className="iac-view-more"
                      onClick={() => handleViewMore(item)}
                    >
                      View More
                      <span>↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          BOOTSTRAP SCROLLABLE MODAL
          ================================================= */}

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        scrollable
        className="iac-modal"
      >
        {/* ==============================================
            MODAL HEADER
            ============================================== */}

        <Modal.Header closeButton>
          <Modal.Title>
            {selectedItem?.title || "Industry Academics Collaboration"}
          </Modal.Title>
        </Modal.Header>

        {/* ==============================================
            MODAL BODY
            ============================================== */}

        <Modal.Body>
          {/* PHOTO */}

          {selectedItem?.photoUrl && (
            <div className="iac-modal-image">
              <img
                src={selectedItem.photoUrl}
                alt={selectedItem.title || "Centre of Excellence"}
              />
            </div>
          )}

          {/* INFORMATION */}

          <div className="iac-modal-content">
            <div className="iac-modal-label">CENTRE OF EXCELLENCE</div>

            <h3>{selectedItem?.title}</h3>

            {/* DESCRIPTION */}

            {selectedItem?.description && (
              <div className="iac-description">
                <h4>About</h4>

                <p>{selectedItem.description}</p>
              </div>
            )}

            {/* ACTION BUTTONS */}

            {(selectedItem?.linkUrl || selectedItem?.certificateUrl) && (
              <div className="iac-modal-actions">
                {/* VIEW DETAILS */}

                {selectedItem?.linkUrl && (
                  <a
                    href={selectedItem.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="iac-modal-btn iac-modal-primary"
                  >
                    View Details
                    <span>↗</span>
                  </a>
                )}

                {/* CERTIFICATE */}

                {selectedItem?.certificateUrl && (
                  <a
                    href={selectedItem.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="iac-modal-btn iac-modal-certificate"
                  >
                    View Certificate
                    <span>↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </Modal.Body>

        {/* ==============================================
            MODAL FOOTER
            ============================================== */}

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IndustryAcademicsCollaboration;
