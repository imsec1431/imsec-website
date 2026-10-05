import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPublicCareerOpening } from "../../services/careerService";

import "./CareerDetails.css";

const CareerDetails = () => {
  const { openingId } = useParams();

  const navigate = useNavigate();

  const [opening, setOpening] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD OPENING
  // =====================================================

  useEffect(() => {
    const loadOpening = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getPublicCareerOpening(openingId);

        console.log("CAREER OPENING:", response);

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load career opening.",
          );
        }

        setOpening(response.data);
      } catch (err) {
        console.error("Career Details Error:", err);

        setError(err.message || "Unable to load career opening.");
      } finally {
        setLoading(false);
      }
    };

    if (openingId) {
      loadOpening();
    }
  }, [openingId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="careerDetailsPage">
        <div className="careerDetailsLoading">
          <div className="careerDetailsSpinner" />

          <h3>Loading Opening</h3>

          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !opening) {
    return (
      <div className="careerDetailsPage">
        <div className="careerDetailsError">
          <h2>Career Opening Not Found</h2>

          <p>{error || "This career opening is no longer available."}</p>

          <button type="button" onClick={() => navigate("/career")}>
            ← Back to Careers
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="careerDetailsPage">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="careerDetailsHero">
        <div className="careerDetailsHeroInner">
          <button
            type="button"
            className="careerBackButton"
            onClick={() => navigate("/career")}
          >
            ← Back to Careers
          </button>

          <span className="careerDetailsLabel">OPEN POSITION</span>

          <h1>{opening.title}</h1>

          <p>{opening.department}</p>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="careerDetailsContent">
        <div className="careerDetailsContainer">
          <div className="careerDetailsGrid">
            {/* =================================================
                MAIN INFORMATION
            ================================================= */}

            <div className="careerDetailsMain">
              {/* OVERVIEW */}

              <section className="careerDetailsCard">
                <div className="careerDetailsCardHeader">
                  <span>POSITION OVERVIEW</span>

                  <h2>About the Role</h2>
                </div>

                {opening.description ? (
                  <p className="careerDescription">{opening.description}</p>
                ) : (
                  <p className="careerMuted">
                    Please refer to the eligibility and requirements below for
                    details about this position.
                  </p>
                )}
              </section>

              {/* ELIGIBILITY */}

              {opening.eligibility && (
                <section className="careerDetailsCard">
                  <div className="careerDetailsCardHeader">
                    <span>REQUIREMENTS</span>

                    <h2>Eligibility</h2>
                  </div>

                  <div className="careerDetailsText">{opening.eligibility}</div>
                </section>
              )}

              {/* EXPERIENCE */}

              {opening.experience && (
                <section className="careerDetailsCard">
                  <div className="careerDetailsCardHeader">
                    <span>EXPERIENCE</span>

                    <h2>Required Experience</h2>
                  </div>

                  <div className="careerDetailsText">{opening.experience}</div>
                </section>
              )}

              {/* NOTIFICATION */}

              {opening.notificationFile && (
                <section className="careerDetailsCard">
                  <div className="careerDetailsCardHeader">
                    <span>OFFICIAL DOCUMENT</span>

                    <h2>Recruitment Notification</h2>
                  </div>

                  <a
                    href={opening.notificationFile}
                    target="_blank"
                    rel="noreferrer"
                    className="careerNotificationButton"
                  >
                    View Notification
                    <span>↗</span>
                  </a>
                </section>
              )}
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="careerDetailsSidebar">
              {/* QUICK DETAILS */}

              <div className="careerDetailsCard">
                <div className="careerDetailsCardHeader">
                  <span>DETAILS</span>

                  <h2>Position Details</h2>
                </div>

                <div className="careerInfoList">
                  <div className="careerInfoItem">
                    <small>LOCATION</small>

                    <strong>{opening.location || "Ghaziabad"}</strong>
                  </div>

                  <div className="careerInfoItem">
                    <small>EMPLOYMENT TYPE</small>

                    <strong>{opening.employmentType || "Full Time"}</strong>
                  </div>

                  <div className="careerInfoItem">
                    <small>VACANCIES</small>

                    <strong>{opening.vacancies || 1}</strong>
                  </div>

                  {opening.applicationStartDate && (
                    <div className="careerInfoItem">
                      <small>APPLICATION START</small>

                      <strong>
                        {new Date(
                          opening.applicationStartDate,
                        ).toLocaleDateString("en-IN")}
                      </strong>
                    </div>
                  )}

                  {opening.applicationEndDate && (
                    <div className="careerInfoItem">
                      <small>APPLICATION DEADLINE</small>

                      <strong>
                        {new Date(
                          opening.applicationEndDate,
                        ).toLocaleDateString("en-IN")}
                      </strong>
                    </div>
                  )}
                </div>

                {/* APPLY */}

                <button
                  type="button"
                  className="careerDetailsApplyButton"
                  onClick={() => navigate(`/career/${opening._id}/apply`)}
                >
                  Apply Now
                  <span>→</span>
                </button>

                <p className="careerApplyNote">
                  Submit your application and resume online.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetails;
