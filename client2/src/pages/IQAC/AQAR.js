import React, { useEffect, useState } from "react";
import { FaFilePdf, FaEye, FaDownload } from "react-icons/fa";

import aqarService from "../../services/aqarService";
import "./aqar.css";

const AQAR = () => {
  const [data, setData] = useState({
    title: "AQAR",
    pdfUrl: "",
    published: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAQAR = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await aqarService.getAQAR();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData) {
          setData(pageData);
        }
      } catch (err) {
        console.error(err);

        setError(err?.message || "Unable to load AQAR information.");
      } finally {
        setLoading(false);
      }
    };

    loadAQAR();
  }, []);

  if (loading) {
    return (
      <div className="aqar-public-page">
        <div className="aqar-public-loading">Loading AQAR...</div>
      </div>
    );
  }

  return (
    <div className="aqar-public-page">
      {/* Hero */}
      <section className="aqar-public-hero">
        <div className="aqar-hero-overlay">
          <div className="aqar-container">
            <span className="aqar-hero-label">IQAC</span>

            <h1>{data.title || "AQAR"}</h1>

            <p>Annual Quality Assurance Report</p>

            <div className="aqar-breadcrumb">Home / IQAC / AQAR</div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="aqar-container aqar-content">
        {error && <div className="aqar-error">{error}</div>}

        {!error && data.published && data.pdfUrl ? (
          <section className="aqar-document-section">
            <div className="aqar-section-heading">
              <span></span>
              <h2>{data.title || "AQAR"}</h2>
              <span></span>
            </div>

            <div className="aqar-document-card">
              <div className="aqar-pdf-icon">
                <FaFilePdf />
              </div>

              <div className="aqar-document-info">
                <h3>{data.title || "AQAR"}</h3>

                <p>Annual Quality Assurance Report</p>

                <div className="aqar-document-actions">
                  <a
                    href={data.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aqar-view-button"
                  >
                    <FaEye />
                    View PDF
                  </a>

                  <a
                    href={data.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aqar-download-button"
                  >
                    <FaDownload />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="aqar-empty-section">
            <div className="aqar-empty-icon">
              <FaFilePdf />
            </div>

            <h2>AQAR</h2>

            <p>The Annual Quality Assurance Report is currently unavailable.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AQAR;
