import React, { useEffect, useState } from "react";
import { FaUsers, FaEye, FaTimes, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import "./StudentClubs.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_HERO = {
  title: "Student Clubs",
  subtitle: "Explore student clubs and activities at IMSEC",
  breadcrumb: "Home / Life @ IMSEC / Student Clubs",
};

const StudentClubs = () => {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [clubs, setClubs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedClub, setSelectedClub] = useState(null);

  /* =========================================================
     FETCH PUBLIC STUDENT CLUBS
     ========================================================= */

  const fetchStudentClubs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/student-clubs`);

      if (!response.ok) {
        throw new Error("Failed to load student clubs.");
      }

      const result = await response.json();

      const data = result?.data || result;

      setHero({
        title: data?.hero?.title || DEFAULT_HERO.title,
        subtitle: data?.hero?.subtitle || DEFAULT_HERO.subtitle,
        breadcrumb: data?.hero?.breadcrumb || DEFAULT_HERO.breadcrumb,
      });

      setClubs(Array.isArray(data?.clubs) ? data.clubs : []);
    } catch (err) {
      console.error("Student Clubs Public Error:", err);

      setError(
        err?.message || "Unable to load student clubs. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentClubs();
  }, []);

  /* =========================================================
     VIEW CLUB
     ========================================================= */

  const handleView = (club) => {
    setSelectedClub(club);
  };

  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  const handleCloseModal = () => {
    setSelectedClub(null);
  };

  /* =========================================================
     CLOSE MODAL WHEN CLICKING BACKDROP
     ========================================================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  /* =========================================================
     ESCAPE KEY
     ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    if (selectedClub) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedClub]);

  /* =========================================================
     BODY SCROLL LOCK WHEN MODAL IS OPEN
     ========================================================= */

  useEffect(() => {
    if (selectedClub) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedClub]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="student-clubs-public-page">
        <section className="student-clubs-public-hero">
          <div className="student-clubs-public-hero-content">
            <div className="student-clubs-public-hero-icon">
              <FaUsers />
            </div>

            <h1>{DEFAULT_HERO.title}</h1>

            <div className="student-clubs-public-hero-line"></div>

            <p className="student-clubs-public-hero-subtitle">
              {DEFAULT_HERO.subtitle}
            </p>

            <div className="student-clubs-public-breadcrumb">
              {DEFAULT_HERO.breadcrumb}
            </div>
          </div>
        </section>

        <div className="student-clubs-public-loading">
          <div className="student-clubs-public-loading-inner">
            <div className="student-clubs-public-spinner"></div>
            <div>Loading student clubs...</div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="student-clubs-public-page">
        <section className="student-clubs-public-hero">
          <div className="student-clubs-public-hero-content">
            <div className="student-clubs-public-hero-icon">
              <FaUsers />
            </div>

            <h1>{hero.title}</h1>

            <div className="student-clubs-public-hero-line"></div>

            <p className="student-clubs-public-hero-subtitle">
              {hero.subtitle}
            </p>

            <div className="student-clubs-public-breadcrumb">
              {hero.breadcrumb}
            </div>
          </div>
        </section>

        <div className="student-clubs-public-content">
          <div className="student-clubs-public-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-clubs-public-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="student-clubs-public-hero">
        <div className="student-clubs-public-hero-content">
          <div className="student-clubs-public-hero-icon">
            <FaUsers />
          </div>

          <h1>{hero.title}</h1>

          <div className="student-clubs-public-hero-line"></div>

          <p className="student-clubs-public-hero-subtitle">{hero.subtitle}</p>

          <div className="student-clubs-public-breadcrumb">
            {hero.breadcrumb}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="student-clubs-public-content">
        <div className="student-clubs-public-heading">
          <h2>Our Student Clubs</h2>

          <p>
            Discover the clubs and activities that provide students with
            opportunities to learn, participate, collaborate and grow beyond the
            classroom.
          </p>
        </div>

        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {clubs.length === 0 ? (
          <div className="student-clubs-public-table-card">
            <div className="student-clubs-public-empty">
              <div className="student-clubs-public-empty-icon">
                <FaUsers />
              </div>

              <h3>No Student Clubs Available</h3>

              <p>Student club information will be available here soon.</p>
            </div>
          </div>
        ) : (
          /* =================================================
             TABLE
             ================================================= */

          <div className="student-clubs-public-table-card">
            <div className="student-clubs-public-table-wrapper">
              <table className="student-clubs-public-table">
                <thead>
                  <tr>
                    <th className="student-clubs-public-sr">S.N.</th>

                    <th>Club Name</th>

                    <th>Coordinator</th>

                    <th>More Details</th>
                  </tr>
                </thead>

                <tbody>
                  {clubs.map((club, index) => (
                    <tr key={club._id || index}>
                      {/* S.N. */}
                      <td className="student-clubs-public-sr">{index + 1}</td>

                      {/* CLUB NAME */}
                      <td className="student-clubs-public-club-name">
                        {club.name || "-"}
                      </td>

                      {/* COORDINATOR */}
                      <td>
                        <div className="student-clubs-public-coordinator">
                          {club.coordinator?.image?.url ? (
                            <img
                              src={club.coordinator.image.url}
                              alt={club.coordinator?.name || "Coordinator"}
                              className="student-clubs-public-coordinator-image"
                            />
                          ) : (
                            <div className="student-clubs-public-coordinator-no-image">
                              <FaUserTie />
                            </div>
                          )}

                          <div className="student-clubs-public-coordinator-info">
                            <div className="student-clubs-public-coordinator-name">
                              {club.coordinator?.name || "-"}
                            </div>

                            {club.coordinator?.mobile && (
                              <div className="student-clubs-public-coordinator-mobile">
                                <FaPhoneAlt />
                                <span>{club.coordinator.mobile}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* VIEW BUTTON */}
                      <td>
                        <button
                          type="button"
                          className="student-clubs-public-details-btn"
                          onClick={() => handleView(club)}
                        >
                          <FaEye />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================
          VIEW CLUB MODAL
          ===================================================== */}

      {selectedClub && (
        <div
          className="student-clubs-public-modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="student-clubs-public-modal">
            {/* =================================================
                MODAL HEADER
                ================================================= */}

            <div className="student-clubs-public-modal-header">
              <h3>{selectedClub.name || "Student Club"}</h3>

              <button
                type="button"
                className="student-clubs-public-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* =================================================
                MODAL BODY
                ================================================= */}

            <div className="student-clubs-public-modal-body">
              {/* =================================================
                  FULL CLUB IMAGE
                  ================================================= */}

              {selectedClub?.image?.url ? (
                <div className="student-clubs-public-main-image">
                  <img
                    src={selectedClub.image.url}
                    alt={selectedClub.name || "Club"}
                  />
                </div>
              ) : (
                <div className="student-clubs-public-main-image student-clubs-public-main-image-empty">
                  <FaUsers />

                  <span>No Club Image Available</span>
                </div>
              )}

              {/* =================================================
                  CLUB INFORMATION
                  ================================================= */}

              <div className="student-clubs-public-modal-section">
                <h4 className="student-clubs-public-modal-section-title">
                  Club Information
                </h4>

                <div className="student-clubs-public-info-box">
                  <div className="student-clubs-public-info-label">
                    Club Name
                  </div>

                  <div className="student-clubs-public-info-value">
                    {selectedClub.name || "-"}
                  </div>

                  <div className="student-clubs-public-info-label">
                    Description
                  </div>

                  <div className="student-clubs-public-info-value">
                    {selectedClub.description || (
                      <span className="student-clubs-public-muted">
                        No description available.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  COORDINATOR
                  ================================================= */}

              <div className="student-clubs-public-modal-section">
                <h4 className="student-clubs-public-modal-section-title">
                  Club Coordinator
                </h4>

                <div className="student-clubs-public-modal-coordinator">
                  {/* Coordinator Image */}

                  {selectedClub?.coordinator?.image?.url ? (
                    <div className="student-clubs-public-modal-coordinator-image">
                      <img
                        src={selectedClub.coordinator.image.url}
                        alt={selectedClub.coordinator?.name || "Coordinator"}
                      />
                    </div>
                  ) : (
                    <div className="student-clubs-public-modal-coordinator-no-image">
                      <FaUserTie />
                    </div>
                  )}

                  {/* Coordinator Details */}

                  <div className="student-clubs-public-modal-coordinator-details">
                    <h4 className="student-clubs-public-modal-coordinator-name">
                      {selectedClub.coordinator?.name || "Coordinator"}
                    </h4>

                    {selectedClub.coordinator?.mobile && (
                      <div className="student-clubs-public-modal-coordinator-mobile">
                        <FaPhoneAlt />

                        <span>{selectedClub.coordinator.mobile}</span>
                      </div>
                    )}

                    <p className="student-clubs-public-modal-coordinator-description">
                      {selectedClub.coordinator?.description ||
                        "No coordinator description available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                MODAL FOOTER
                ================================================= */}

            <div className="student-clubs-public-modal-footer">
              <button type="button" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClubs;
