import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPublicCareerOpenings } from "../../services/careerService";

import "./Career.css";

const Career = () => {
  const navigate = useNavigate();

  const [openings, setOpenings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD PUBLIC OPENINGS
  ===================================================== */

  const fetchOpenings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicCareerOpenings();

      // console.log("PUBLIC CAREER RESPONSE:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load career openings.");
      }

      const careerData = Array.isArray(response.data) ? response.data : [];

      setOpenings(careerData);
    } catch (err) {
      console.error("PUBLIC CAREER ERROR:", err);

      setError(err.message || "Unable to load career openings.");

      setOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="careerPage">
        <section className="careerLoading">
          <div className="careerLoadingSpinner" />

          <h3>Loading Career Opportunities</h3>

          <p>Please wait while we fetch the latest openings.</p>
        </section>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="careerPage">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="careerHero">
        <div className="careerHeroOverlay" />

        <div className="careerHeroContent">
          <span className="careerHeroLabel">CAREERS AT IMSEC</span>

          <h1>Build Your Future With IMSEC</h1>

          <p>
            Join our academic and professional community and contribute to
            excellence in education.
          </p>
        </div>
      </section>

      {/* =================================================
          CURRENT OPENINGS
      ================================================= */}

      <section className="careerOpeningsSection">
        <div className="careerContainer">
          {/* HEADER */}

          <div className="careerSectionHeader">
            <div>
              <span>OPPORTUNITIES</span>

              <h2>Current Openings</h2>
            </div>

            {openings.length > 0 && (
              <div className="careerOpeningCount">
                {openings.length}{" "}
                {openings.length === 1 ? "Opening" : "Openings"}
              </div>
            )}
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="careerError">
              <div>
                <strong>Unable to load openings</strong>

                <p>{error}</p>
              </div>

              <button type="button" onClick={fetchOpenings}>
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              OPENINGS AVAILABLE
          ================================================= */}

          {!error && openings.length > 0 && (
            <div className="careerOpeningList">
              {openings.map((opening) => (
                <article className="careerOpeningCard" key={opening._id}>
                  {/* LEFT */}

                  <div className="careerOpeningMain">
                    <div className="careerOpeningBadge">OPEN POSITION</div>

                    <h3>{opening.title || "Career Opportunity"}</h3>

                    <p className="careerDepartment">
                      {opening.department || "IMSEC"}
                    </p>

                    <div className="careerMeta">
                      <div className="careerMetaItem">
                        <span>LOCATION</span>

                        <strong>{opening.location || "Ghaziabad"}</strong>
                      </div>

                      <div className="careerMetaItem">
                        <span>EMPLOYMENT</span>

                        <strong>{opening.employmentType || "Full Time"}</strong>
                      </div>

                      <div className="careerMetaItem">
                        <span>VACANCIES</span>

                        <strong>{opening.vacancies || 1}</strong>
                      </div>

                      {opening.experience && (
                        <div className="careerMetaItem">
                          <span>EXPERIENCE</span>

                          <strong>{opening.experience}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="careerOpeningActions">
                    <button
                      type="button"
                      className="careerViewButton"
                      onClick={() => navigate(`/career/${opening._id}`)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="careerApplyButton"
                      onClick={() => navigate(`/career/${opening._id}/apply`)}
                    >
                      Apply Now
                      <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =================================================
              NO OPENINGS
          ================================================= */}

          {!error && openings.length === 0 && (
            <div className="careerNoOpening">
              <div className="careerNoOpeningIcon">+</div>

              <span className="careerNoOpeningLabel">
                CURRENTLY NO VACANCIES
              </span>

              <h2>No Current Openings</h2>

              <p>
                There are no active vacancies available at the moment. However,
                you can still submit your profile to our HR team for
                consideration for future opportunities.
              </p>

              <button
                type="button"
                className="careerGeneralApplyButton"
                onClick={() => navigate("/career/general-application")}
              >
                Submit Your Profile to HR
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Career;
