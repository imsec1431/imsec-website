import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaBookOpen,
  FaImages,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./Convocation.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Convocation = () => {
  const [convocations, setConvocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConvocations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_BASE_URL}/api/convocation`);

        setConvocations(response.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch convocations:", err);

        setError(
          "Unable to load convocation information. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConvocations();
  }, []);

  const getSocialLinks = (item) => {
    return [
      {
        key: "facebook",
        url: item.socialMedia?.facebook,
        icon: <FaFacebookF />,
        label: "Facebook",
      },
      {
        key: "instagram",
        url: item.socialMedia?.instagram,
        icon: <FaInstagram />,
        label: "Instagram",
      },
      {
        key: "youtube",
        url: item.socialMedia?.youtube,
        icon: <FaYoutube />,
        label: "YouTube",
      },
      {
        key: "linkedin",
        url: item.socialMedia?.linkedin,
        icon: <FaLinkedinIn />,
        label: "LinkedIn",
      },
      {
        key: "x",
        url: item.socialMedia?.x,
        icon: <FaXTwitter />,
        label: "X",
      },
    ].filter((social) => social.url);
  };

  return (
    <div className="convocationPage">
      {/* ==========================================
          Hero (FULL WIDTH)
      ========================================== */}
      <section className="convocationHero">
        <div className="convocationHeroContainer text-center">
          {/* <span className="convocationEyebrow">ACADEMICS</span> */}
          <h1 className="text-center">Convocation</h1>
          <p className="text-center">
            Celebrating academic excellence, achievements, and milestones at IMSEC.
          </p>
        </div>
      </section>

      <div className="convocationContainer">
        {/* ==========================================
            Content Section
        ========================================== */}
        <div className="convocationContent">
          {/* Loading */}
          {loading && (
            <div className="convocationLoading">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">
                Loading convocation information...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && convocations.length === 0 && (
            <div className="convocationEmpty">
              <h4>Convocation Information</h4>
              <p>
                Convocation information will be available here soon.
              </p>
            </div>
          )}

          {/* Convocations */}
          {!loading && !error && convocations.length > 0 && (
            <>
              {/* Priority Convocation */}
              {(() => {
                const item = convocations[0];
                const socialLinks = getSocialLinks(item);

                return (
                  <div className="convocationPriorityCard">
                    {/* Priority Header */}
                    <div className="convocationPriorityHeader">
                      <span className="convocationPriorityBadge">
                        PRIORITY CONVOCATION
                      </span>

                      <span className="convocationPriorityYearBadge">
                        {item.year}
                      </span>
                    </div>

                    <div className="convocationPriorityBody">
                      <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                          <div className="convocationPriorityEyebrow">
                            Convocation {item.year}
                          </div>

                          <h2 className="convocationPriorityTitle">
                            {item.title}
                          </h2>

                          <p className="convocationPriorityDesc">
                            {item.description}
                          </p>

                          <div className="d-flex flex-wrap align-items-center gap-3">
                            {item.pdfLink && (
                              <a
                                href={item.pdfLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="convocationViewBtn"
                              >
                                <FaImages />
                                View Convocation Photos
                              </a>
                            )}

                            {socialLinks.length > 0 && (
                              <div className="convocationSocialList">
                                {socialLinks.map((social) => (
                                  <a
                                    key={social.key}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.label}
                                    aria-label={social.label}
                                  >
                                    {social.icon}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="convocationYearBox">
                            <div className="convocationYearBoxLabel">
                              CONVOCATION YEAR
                            </div>

                            <div className="convocationYearBoxNum">
                              {item.year}
                            </div>

                            <div className="convocationYearBoxBar" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Previous Convocations */}
              {convocations.length > 1 && (
                <div className="mt-4">
                  <h3 className="convocationSectionTitle">
                    Previous Convocations
                  </h3>
                  <div className="convocationSectionBar" />

                  <div className="row g-4">
                    {convocations.slice(1).map((item) => {
                      const socialLinks = getSocialLinks(item);

                      return (
                        <div className="col-lg-6" key={item._id}>
                          <div className="convocationCard">
                            <div className="convocationCardHeader">
                              <h4>{item.title}</h4>
                              <span>{item.year}</span>
                            </div>

                            <p className="convocationCardDesc">
                              {item.description}
                            </p>

                            <div className="convocationCardActions">
                              {item.pdfLink && (
                                <a
                                  href={item.pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="convocationViewBtn"
                                >
                                  <FaImages />
                                  View Photos
                                </a>
                              )}

                              {socialLinks.length > 0 && (
                                <div className="convocationSocialList">
                                  {socialLinks.map((social) => (
                                    <a
                                      key={social.key}
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={social.label}
                                      aria-label={social.label}
                                    >
                                      {social.icon}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Convocation;
