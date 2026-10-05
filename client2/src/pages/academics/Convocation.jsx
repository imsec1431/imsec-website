import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
    <>
      {/* ==========================================
          Page Header
      ========================================== */}
      <section
        style={{
          background: "linear-gradient(135deg, #0A2E5C 0%, #123f75 100%)",
          padding: "70px 20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "inline-block",
              background: "#FDB913",
              color: "#0A2E5C",
              padding: "7px 18px",
              borderRadius: "25px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "18px",
              letterSpacing: "0.5px",
            }}
          >
            IMSEC
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            Convocation
          </h1>

          <p
            style={{
              fontSize: "17px",
              marginBottom: 0,
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            Celebrating academic excellence and achievements
          </p>
        </div>
      </section>

      {/* ==========================================
          Main Content
      ========================================== */}
      <section
        style={{
          background: "#f7f9fc",
          padding: "60px 20px 80px",
        }}
      >
        <div className="container">
          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{
                  color: "#0A2E5C",
                  width: "3rem",
                  height: "3rem",
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>

              <p
                style={{
                  marginTop: "15px",
                  color: "#666",
                }}
              >
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
            <div
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "60px 25px",
                textAlign: "center",
                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
              }}
            >
              <h4
                style={{
                  color: "#0A2E5C",
                  fontWeight: "600",
                }}
              >
                Convocation Information
              </h4>

              <p
                style={{
                  color: "#777",
                  marginBottom: 0,
                }}
              >
                Convocation information will be available here soon.
              </p>
            </div>
          )}

          {/* ========================================
              Convocations
          ======================================== */}
          {!loading && !error && convocations.length > 0 && (
            <>
              {/* Priority Convocation */}
              <div className="mb-5">
                {(() => {
                  const item = convocations[0];
                  const socialLinks = getSocialLinks(item);

                  return (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(10,46,92,0.12)",
                        border: "1px solid #e8edf4",
                      }}
                    >
                      {/* Priority Header */}
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #0A2E5C, #16477f)",
                          padding: "14px 25px",
                          color: "#fff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                          }}
                        >
                          PRIORITY CONVOCATION
                        </span>

                        <span
                          style={{
                            background: "#FDB913",
                            color: "#0A2E5C",
                            padding: "5px 14px",
                            borderRadius: "20px",
                            fontWeight: "700",
                            fontSize: "13px",
                          }}
                        >
                          {item.year}
                        </span>
                      </div>

                      <div className="p-4 p-md-5">
                        <div className="row align-items-center">
                          <div className="col-lg-8">
                            <div
                              style={{
                                color: "#FDB913",
                                fontSize: "14px",
                                fontWeight: "700",
                                marginBottom: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                              }}
                            >
                              Convocation {item.year}
                            </div>

                            <h2
                              style={{
                                color: "#0A2E5C",
                                fontSize: "32px",
                                fontWeight: "700",
                                marginBottom: "18px",
                              }}
                            >
                              {item.title}
                            </h2>

                            <p
                              style={{
                                color: "#5f6368",
                                fontSize: "16px",
                                lineHeight: "1.8",
                                marginBottom: "25px",
                              }}
                            >
                              {item.description}
                            </p>

                            <div
                              className="d-flex flex-wrap align-items-center"
                              style={{
                                gap: "12px",
                              }}
                            >
                              {item.pdfLink && (
                                <a
                                  href={item.pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "#0A2E5C",
                                    color: "#fff",
                                    padding: "11px 20px",
                                    borderRadius: "7px",
                                    textDecoration: "none",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                  }}
                                >
                                  <i className="bi bi-file-earmark-pdf"></i>
                                  View Convocation Photos
                                </a>
                              )}

                              {socialLinks.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  {socialLinks.map((social) => (
                                    <a
                                      key={social.key}
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={social.label}
                                      aria-label={social.label}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#f0f3f8",
                                        color: "#0A2E5C",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {social.icon}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-4 mt-4 mt-lg-0">
                            <div
                              style={{
                                background: "#f7f9fc",
                                borderRadius: "15px",
                                padding: "35px 20px",
                                textAlign: "center",
                                border: "1px solid #e7ebf1",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#777",
                                  fontWeight: "600",
                                  marginBottom: "8px",
                                }}
                              >
                                CONVOCATION YEAR
                              </div>

                              <div
                                style={{
                                  fontSize: "55px",
                                  lineHeight: "1",
                                  fontWeight: "800",
                                  color: "#0A2E5C",
                                }}
                              >
                                {item.year}
                              </div>

                              <div
                                style={{
                                  height: "3px",
                                  width: "55px",
                                  background: "#FDB913",
                                  margin: "18px auto 0",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Older Convocations */}
              {convocations.length > 1 && (
                <>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#0A2E5C",
                        fontWeight: "700",
                        marginBottom: "8px",
                      }}
                    >
                      Previous Convocations
                    </h3>

                    <div
                      style={{
                        height: "3px",
                        width: "55px",
                        background: "#FDB913",
                        margin: "0 auto",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <div className="row g-4">
                    {convocations.slice(1).map((item) => {
                      const socialLinks = getSocialLinks(item);

                      return (
                        <div className="col-lg-6" key={item._id}>
                          <div
                            style={{
                              height: "100%",
                              background: "#fff",
                              borderRadius: "14px",
                              padding: "25px",
                              border: "1px solid #e8edf4",
                              boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                            }}
                          >
                            <div
                              className="d-flex justify-content-between align-items-start"
                              style={{
                                gap: "15px",
                                marginBottom: "15px",
                              }}
                            >
                              <h4
                                style={{
                                  color: "#0A2E5C",
                                  fontSize: "20px",
                                  fontWeight: "700",
                                  margin: 0,
                                }}
                              >
                                {item.title}
                              </h4>

                              <span
                                style={{
                                  flexShrink: 0,
                                  background: "#FDB913",
                                  color: "#0A2E5C",
                                  padding: "5px 12px",
                                  borderRadius: "20px",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                }}
                              >
                                {item.year}
                              </span>
                            </div>

                            <p
                              style={{
                                color: "#666",
                                fontSize: "14px",
                                lineHeight: "1.7",
                                marginBottom: "20px",
                              }}
                            >
                              {item.description}
                            </p>

                            <div
                              className="d-flex flex-wrap align-items-center"
                              style={{
                                gap: "10px",
                              }}
                            >
                              {item.pdfLink && (
                                <a
                                  href={item.pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    background: "#0A2E5C",
                                    color: "#fff",
                                    padding: "9px 15px",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <i className="bi bi-file-earmark-pdf"></i>
                                  View Photos
                                </a>
                              )}

                              {socialLinks.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                  }}
                                >
                                  {socialLinks.map((social) => (
                                    <a
                                      key={social.key}
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={social.label}
                                      aria-label={social.label}
                                      style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#f0f3f8",
                                        color: "#0A2E5C",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                      }}
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
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Convocation;
