import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Approvals = () => {
  const [documents, setDocuments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/api/approvals-affiliations`,
        );

        setDocuments(response.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch approvals and affiliations:", err);

        setError(
          "Unable to load approvals and affiliations. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const documentTypes = [
    "All",
    "Approval",
    "Affiliation",
    "Certificate",
    "Other",
  ];

  const filteredDocuments = useMemo(() => {
    if (activeFilter === "All") {
      return documents;
    }

    return documents.filter((item) => item.documentType === activeFilter);
  }, [documents, activeFilter]);

  const getDocumentTypeName = (item) => {
    if (item.documentType === "Other") {
      return item.otherDocumentType || "Other";
    }

    return item.documentType;
  };

  return (
    <>
      {/* Page Header (Solid Footer Theme #002147) */}
      <section
        style={{
          background: "#002147",
          borderBottom: "2px solid #fdb913",
          padding: "35px 20px",
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: "800",
              marginBottom: "8px",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Approvals & Affiliations
          </h1>

          <p
            style={{
              fontSize: "14.5px",
              marginBottom: 0,
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Approvals, affiliations, certificates and official institutional
            documents
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section
        style={{
          padding: "38px 20px 50px",
          background: "#f7f9fc",
        }}
      >
        <div className="container">
          {/* Filter Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            {documentTypes.map((type) => {
              const isActive = activeFilter === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  style={{
                    border: isActive
                      ? "1px solid #002147"
                      : "1px solid #d7dce5",
                    background: isActive ? "#002147" : "#fff",
                    color: isActive ? "#fff" : "#333",
                    padding: "8px 20px",
                    borderRadius: "25px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
              }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{ color: "#002147" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>

              <p
                style={{
                  marginTop: "15px",
                  color: "#666",
                }}
              >
                Loading documents...
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
          {!loading && !error && filteredDocuments.length === 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "50px 20px",
                textAlign: "center",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              <h4
                style={{
                  color: "#002147",
                  fontWeight: "600",
                }}
              >
                No Documents Available
              </h4>

              <p
                style={{
                  color: "#777",
                  marginBottom: 0,
                }}
              >
                No published documents are available in this category.
              </p>
            </div>
          )}

          {/* Documents */}
          {!loading && !error && filteredDocuments.length > 0 && (
            <div className="row g-4">
              {filteredDocuments.map((item) => (
                <div className="col-lg-6 col-md-6" key={item._id}>
                  <div
                    style={{
                      height: "100%",
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "25px",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                      border: "1px solid #edf0f5",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* Type */}
                    <div
                      style={{
                        display: "inline-block",
                        background: "#002147",
                        color: "#fff",
                        padding: "4px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "15px",
                      }}
                    >
                      {getDocumentTypeName(item)}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#002147",
                        marginBottom: "10px",
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          lineHeight: "1.7",
                          marginBottom: "15px",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    {/* Details */}
                    <div
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      {item.issuingAuthority && (
                        <div
                          style={{
                            fontSize: "14px",
                            marginBottom: "7px",
                            color: "#555",
                          }}
                        >
                          <strong>Issuing Authority:</strong>{" "}
                          {item.issuingAuthority}
                        </div>
                      )}

                      {item.session && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#555",
                          }}
                        >
                          <strong>Session:</strong> {item.session}
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    {item.pdfLink && (
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#002147",
                          color: "#fff",
                          padding: "10px 18px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf"></i>
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Approvals;
