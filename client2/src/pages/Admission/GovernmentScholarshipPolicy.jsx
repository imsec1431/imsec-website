import React, { useEffect, useState } from "react";

import { Alert, Button, Spinner } from "react-bootstrap";

import {
  getPublicGovernmentScholarshipPolicy,
  getGovernmentScholarshipPdfUrl,
} from "../../services/governmentScholarshipPolicyService.js";

import "./GovernmentScholarshipPolicy.css";

const GovernmentScholarshipPolicy = () => {
  /* =========================================================
     DATA
  ========================================================= */

  const [policy, setPolicy] = useState(null);

  /* =========================================================
     LOADING
  ========================================================= */

  const [loading, setLoading] = useState(true);

  /* =========================================================
     ERROR
  ========================================================= */

  const [error, setError] = useState("");

  /* =========================================================
     LOAD PUBLIC POLICY
  ========================================================= */

  const loadPolicy = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPublicGovernmentScholarshipPolicy();

      // console.log("Public Government Scholarship Policy:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load government scholarship policy.",
        );
      }

      setPolicy(response?.data || null);
    } catch (err) {
      console.error("Public Government Scholarship Policy Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load government scholarship policy.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadPolicy();
  }, []);

  /* =========================================================
     VIEW PDF
  ========================================================= */

  const handleViewPdf = () => {
    const url = getGovernmentScholarshipPdfUrl(policy?.pdfUrl);

    if (!url) {
      setError("Government scholarship policy PDF is not available.");

      return;
    }

    /*
     * Open only after the user clicks.
     *
     * Nothing is automatically downloaded
     * when the page is refreshed.
     */

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     DOWNLOAD PDF
  ========================================================= */

  const handleDownloadPdf = () => {
    const url = getGovernmentScholarshipPdfUrl(policy?.pdfUrl);

    if (!url) {
      setError("Government scholarship policy PDF is not available.");

      return;
    }

    /*
     * Download happens ONLY after clicking
     * the Download button.
     */

    const link = document.createElement("a");

    link.href = url;

    link.target = "_blank";

    link.rel = "noopener noreferrer";

    link.download = "Government-Scholarship-Policy.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="government-scholarship-public-page">
        <div className="government-scholarship-loading">
          <Spinner animation="border" />

          <p>Loading scholarship policy...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !policy) {
    return (
      <div className="government-scholarship-public-page">
        <div className="government-scholarship-container">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT AVAILABLE
  ========================================================= */

  if (!policy) {
    return (
      <div className="government-scholarship-public-page">
        <div className="government-scholarship-container">
          <div className="government-scholarship-empty">
            <div className="government-scholarship-empty-icon">📄</div>

            <h1>Government Scholarship Policies</h1>

            <p>
              The government scholarship policy document is currently not
              available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PDF URL
  ========================================================= */

  const pdfUrl = getGovernmentScholarshipPdfUrl(policy.pdfUrl);

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="government-scholarship-public-page">
      <div className="government-scholarship-container">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="government-scholarship-breadcrumb">
          <span>Admissions</span>

          <span>/</span>

          <strong>Government Scholarship Policies</strong>
        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="government-scholarship-hero">
          <div className="government-scholarship-hero-content">
            <span className="government-scholarship-eyebrow">ADMISSIONS</span>

            <h1>{policy.title || "Government Scholarship Policies"}</h1>

            <p>
              View the official government scholarship policy and related
              information.
            </p>

            <div className="government-scholarship-actions">
              <Button
                type="button"
                className="government-scholarship-view-btn"
                onClick={handleViewPdf}
                disabled={!pdfUrl}
              >
                View PDF
              </Button>

              <Button
                type="button"
                className="government-scholarship-download-btn"
                onClick={handleDownloadPdf}
                disabled={!pdfUrl}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* =================================================
              DOCUMENT INFORMATION
          ================================================= */}

          <div className="government-scholarship-document">
            <div className="government-scholarship-pdf-icon">PDF</div>

            <div className="government-scholarship-document-info">
              <strong>
                {policy.title || "Government Scholarship Policies"}
              </strong>

              <span>Official Government Scholarship Policy</span>
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            variant="warning"
            className="government-scholarship-alert"
            dismissible
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            PDF VIEWER
        ================================================= */}

        <section className="government-scholarship-pdf-section">
          <div className="government-scholarship-pdf-header">
            <div>
              <span>OFFICIAL DOCUMENT</span>

              <h2>Scholarship Policy Document</h2>
            </div>

            {pdfUrl && (
              <Button
                type="button"
                className="government-scholarship-header-download"
                onClick={handleDownloadPdf}
              >
                Download PDF
              </Button>
            )}
          </div>

          {pdfUrl ? (
            <div className="government-scholarship-pdf-wrapper">
              <iframe
                src={pdfUrl}
                title="Government Scholarship Policy PDF"
                className="government-scholarship-pdf-frame"
              />
            </div>
          ) : (
            <div className="government-scholarship-pdf-unavailable">
              <div>📄</div>

              <h3>PDF Not Available</h3>

              <p>The scholarship policy PDF has not been uploaded yet.</p>
            </div>
          )}
        </section>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <section className="government-scholarship-information">
          <div className="government-scholarship-information-icon">i</div>

          <div>
            <h3>Government Scholarship Information</h3>

            <p>
              Please refer to the official scholarship policy document above for
              eligibility, application requirements, important instructions and
              other scholarship-related information.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GovernmentScholarshipPolicy;
