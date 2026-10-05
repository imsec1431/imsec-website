import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";

import {
  FaCalendarAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaBuilding,
  FaImages,
  FaYoutube,
  FaTwitter,
  FaTimes,
} from "react-icons/fa";

import { fetchTPActivities } from "../../services/tpActivityService";

// import "./";
import "./TPActivity.css";

/* =========================================================
   COMPONENT
========================================================= */

const TrainingPlacementActivity = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  /* =========================================================
     LOAD ACTIVITIES
  ========================================================= */

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchTPActivities();

        setActivities(result?.data || []);
      } catch (err) {
        console.error("Public T&P activities error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load T&P activities.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* =========================================================
     SHORT DATE
  ========================================================= */

  const getDay = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
    });
  };

  const getMonth = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
    });
  };

  /* =========================================================
     CATEGORY
  ========================================================= */

  const categoryLabel = (category) => {
    if (!category) {
      return "T&P Activity";
    }

    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /* =========================================================
     OPEN ACTIVITY
  ========================================================= */

  const openActivity = (activity) => {
    setSelectedActivity(activity);

    setShowModal(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setShowModal(false);

    setSelectedActivity(null);

    setSelectedGalleryImage(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="tp-public-status">
        <Spinner animation="border" className="tp-public-spinner" />

        <h2>Loading T&amp;P Activities</h2>

        <p>Please wait while we load the latest activities.</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="tp-public-status">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!activities.length) {
    return (
      <div className="tp-public-page">
        <section className="tp-public-hero">
          <div className="tp-public-hero-overlay" />

          <Container>
            <div className="tp-public-hero-content">
              <span>Training &amp; Placement</span>

              <h1>T&amp;P Activities</h1>

              <p>
                Training, industry interaction, career development and placement
                activities at IMSEC.
              </p>
            </div>
          </Container>
        </section>

        <div className="tp-public-empty">
          <FaImages />

          <h2>No Activities Available</h2>

          <p>T&amp;P activities will be published here soon.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="tp-public-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="tp-public-hero">
        <div className="tp-public-hero-overlay" />

        <Container>
          <div className="tp-public-hero-content">
            <span>Training &amp; Placement</span>

            <h1>T&amp;P Activities</h1>
          </div>
        </Container>
      </section>

      {/* =====================================================
          ACTIVITIES
      ===================================================== */}

      <section className="tp-public-content">
        <Container>
          <div className="tp-public-section-heading">
            <div>
              <span>Corporate Development Cell</span>

              <h2>Training &amp; Placement Activities</h2>
            </div>
          </div>

          <Row className="g-4">
            {activities.map((activity) => (
              <Col key={activity._id} lg={4} md={6}>
                <Card className="tp-activity-public-card">
                  {/* IMAGE */}

                  <div className="tp-activity-public-image">
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.imageAlt || activity.title}
                      />
                    ) : (
                      <div className="tp-activity-no-image">
                        <FaImages />
                      </div>
                    )}

                    {/* DATE */}

                    <div className="tp-activity-date-badge">
                      <strong>{getDay(activity.activityDate)}</strong>

                      <span>{getMonth(activity.activityDate)}</span>
                    </div>

                    {/* CATEGORY */}

                    <div className="tp-activity-category-badge">
                      {categoryLabel(activity.category)}
                    </div>
                  </div>

                  {/* BODY */}

                  <Card.Body>
                    <div className="tp-activity-card-meta">
                      <span>
                        <FaCalendarAlt />

                        {formatDate(activity.activityDate)}
                      </span>
                    </div>

                    <h3>{activity.title}</h3>

                    {activity.description && (
                      <p className="tp-activity-description">
                        {activity.description.length > 150
                          ? `${activity.description.slice(0, 150)}...`
                          : activity.description}
                      </p>
                    )}

                    <div className="tp-activity-info-row">
                      {activity.organization && (
                        <span>
                          <FaBuilding />

                          {activity.organization}
                        </span>
                      )}

                      {activity.venue && (
                        <span>
                          <FaMapMarkerAlt />

                          {activity.venue}
                        </span>
                      )}
                    </div>

                    {/* FOOTER */}

                    <div className="tp-activity-card-footer">
                      <Button
                        className="tp-view-activity-button"
                        onClick={() => openActivity(activity)}
                      >
                        View Activity
                      </Button>

                      {/* SOCIAL */}

                      <div className="tp-activity-social">
                        {activity.socialMedia?.facebook && (
                          <a
                            href={activity.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                          >
                            <FaFacebookF />
                          </a>
                        )}

                        {activity.socialMedia?.instagram && (
                          <a
                            href={activity.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        )}

                        {activity.socialMedia?.linkedin && (
                          <a
                            href={activity.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                          >
                            <FaLinkedinIn />
                          </a>
                        )}

                        {activity.socialMedia?.youtube && (
                          <a
                            href={activity.socialMedia.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                          >
                            <FaYoutube />
                          </a>
                        )}

                        {activity.socialMedia?.twitter && (
                          <a
                            href={activity.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                          >
                            <FaTwitter />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <Modal
        show={showModal}
        onHide={closeModal}
        size="xl"
        centered
        scrollable
        className="tp-public-detail-modal"
      >
        {selectedActivity && (
          <>
            <Modal.Header closeButton>
              <div>
                <small>Training &amp; Placement</small>

                <Modal.Title>{selectedActivity.title}</Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Row className="g-4">
                <Col lg={6}>
                  {selectedActivity.image ? (
                    <img
                      className="tp-detail-main-image"
                      src={selectedActivity.image}
                      alt={selectedActivity.imageAlt || selectedActivity.title}
                    />
                  ) : (
                    <div className="tp-detail-no-image">
                      <FaImages />
                    </div>
                  )}
                </Col>

                <Col lg={6}>
                  <div className="tp-detail-content">
                    <span className="tp-detail-category">
                      {categoryLabel(selectedActivity.category)}
                    </span>

                    <h2>{selectedActivity.title}</h2>

                    <div className="tp-detail-meta">
                      <div>
                        <FaCalendarAlt />

                        <div>
                          <strong>Date</strong>

                          <span>
                            {formatDate(selectedActivity.activityDate)}
                          </span>
                        </div>
                      </div>

                      {selectedActivity.venue && (
                        <div>
                          <FaMapMarkerAlt />

                          <div>
                            <strong>Venue</strong>

                            <span>{selectedActivity.venue}</span>
                          </div>
                        </div>
                      )}

                      {selectedActivity.organization && (
                        <div>
                          <FaBuilding />

                          <div>
                            <strong>Organization</strong>

                            <span>{selectedActivity.organization}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedActivity.description && (
                      <div className="tp-detail-description">
                        <h4>About the Activity</h4>

                        <p>{selectedActivity.description}</p>
                      </div>
                    )}

                    <div className="tp-detail-social">
                      {selectedActivity.socialMedia?.facebook && (
                        <a
                          href={selectedActivity.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebookF />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.instagram && (
                        <a
                          href={selectedActivity.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.linkedin && (
                        <a
                          href={selectedActivity.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.youtube && (
                        <a
                          href={selectedActivity.socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaYoutube />
                        </a>
                      )}

                      {selectedActivity.socialMedia?.twitter && (
                        <a
                          href={selectedActivity.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter />
                        </a>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* =================================================
                  GALLERY
              ================================================= */}

              {Array.isArray(selectedActivity.gallery) &&
                selectedActivity.gallery.length > 0 && (
                  <div className="tp-detail-gallery">
                    <div className="tp-detail-gallery-heading">
                      <div>
                        <span>Activity Photos</span>

                        <h3>Gallery</h3>
                      </div>

                      <FaImages />
                    </div>

                    <div className="tp-detail-gallery-grid">
                      {selectedActivity.gallery.map((item, index) => (
                        <button
                          type="button"
                          key={item.publicId || `${item.url}-${index}`}
                          onClick={() => setSelectedGalleryImage(item.url)}
                        >
                          <img
                            src={item.url}
                            alt={
                              item.alt ||
                              `${selectedActivity.title} ${index + 1}`
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* =====================================================
          GALLERY IMAGE VIEWER
      ===================================================== */}

      {selectedGalleryImage && (
        <div
          className="tp-gallery-lightbox"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            type="button"
            className="tp-gallery-lightbox-close"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <FaTimes />
          </button>

          <img
            src={selectedGalleryImage}
            alt="Activity gallery"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default TrainingPlacementActivity;
