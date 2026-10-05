import React, { useEffect, useState } from "react";

import {
  FaFilePdf,
  FaDownload,
  FaExternalLinkAlt,
  FaUniversity,
} from "react-icons/fa";

import {
  getPublicUptacCounselling,
  getUptacPdfViewUrl,
  getUptacPdfDownloadUrl,
} from "../../services/uptacCounsellingService";

import "./UPTACCounselling.css";

const UPTACCounselling = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [counselling, setCounselling] = useState(null);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // SHOW PDF
  //
  // IMPORTANT:
  // false on initial page load.
  //
  // Therefore iframe is NOT created during reload.
  // =====================================================

  const [showPdf, setShowPdf] = useState(false);

  // =====================================================
  // LOAD PUBLIC DATA
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadCounselling = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getPublicUptacCounselling();

        // console.log("UPTAC public response:", response);

        if (!mounted) {
          return;
        }

        const data = response?.data || null;

        setCounselling(data);
      } catch (err) {
        console.error("UPTAC public loading error:", err);

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message || "Unable to load UPTAC counselling.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCounselling();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleViewPdf = () => {
    if (!counselling?.pdfFile) {
      setError("UPTAC counselling PDF is not available.");

      return;
    }

    setError("");

    /*
     * We do NOT use the Cloudinary URL here.
     *
     * We use our backend PDF endpoint.
     */

    setShowPdf(true);
  };

  // =====================================================
  // CLOSE PDF
  // =====================================================

  const handleClosePdf = () => {
    setShowPdf(false);
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownloadPdf = () => {
    if (!counselling?.pdfFile) {
      setError("UPTAC counselling PDF is not available.");

      return;
    }

    setError("");

    const downloadUrl = getUptacPdfDownloadUrl();

    const link = document.createElement("a");

    link.href = downloadUrl;

    link.download = counselling.pdfOriginalName || "UPTAC-Counselling.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================================
  // OPEN IN NEW TAB
  // =====================================================

  const handleOpenPdf = () => {
    if (!counselling?.pdfFile) {
      setError("UPTAC counselling PDF is not available.");

      return;
    }

    const viewUrl = getUptacPdfViewUrl();

    window.open(viewUrl, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="uptacPublicPage">
        <div className="uptacPublicLoading">
          <div className="uptacPublicSpinner"></div>

          <p>Loading UPTAC Counselling...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !counselling) {
    return (
      <div className="uptacPublicPage">
        <div className="uptacPublicMessage">
          <FaUniversity />

          <h2>UPTAC Counselling</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO COUNSELLING
  // =====================================================

  if (!counselling) {
    return (
      <div className="uptacPublicPage">
        <div className="uptacPublicMessage">
          <FaFilePdf />

          <h2>UPTAC Counselling</h2>

          <p>The current UPTAC counselling notification is not available.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PDF VIEW URL
  // =====================================================

  const pdfViewUrl = getUptacPdfViewUrl();

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="uptacPublicPage">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="uptacPublicHero">
        <div className="uptacPublicHeroContent">
          <div className="uptacPublicHeroIcon">
            <FaUniversity />
          </div>

          <span className="uptacPublicHeroLabel">ADMISSIONS</span>

          <h1>{counselling.title || "UPTAC Counselling"}</h1>

          <p>
            {counselling.description ||
              "View the latest UPTAC counselling notification and admission information."}
          </p>

          <div className="uptacSession">
            <span>Current Session</span>

            <strong>{counselling.session || "-"}</strong>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="uptacPublicContent">
        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className="uptacPublicInlineError">{error}</div>}

        {/* =================================================
            PDF CARD
        ================================================= */}

        <div className="uptacPdfCard">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="uptacPdfHeader">
            <div className="uptacPdfTitle">
              <div className="uptacPdfIcon">
                <FaFilePdf />
              </div>

              <div>
                <span>OFFICIAL DOCUMENT</span>

                <h2>UPTAC Counselling Notification</h2>

                <p>
                  {counselling.pdfOriginalName ||
                    "UPTAC Counselling Notification.pdf"}
                </p>
              </div>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="uptacPdfButtons">
              <button
                type="button"
                className="uptacOpenButton"
                onClick={handleViewPdf}
                disabled={!counselling.pdfFile}
              >
                <FaFilePdf />

                <span>View PDF</span>
              </button>

              <button
                type="button"
                className="uptacDownloadButton"
                onClick={handleDownloadPdf}
                disabled={!counselling.pdfFile}
              >
                <FaDownload />

                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* =================================================
              PDF PLACEHOLDER
          ================================================= */}

          {!showPdf && (
            <div className="uptacPdfPreviewPlaceholder">
              <div className="uptacPdfPreviewIcon">
                <FaFilePdf />
              </div>

              <h3>UPTAC Counselling Notification</h3>

              <p>
                Click <strong>View PDF</strong> to display the official UPTAC
                counselling notification.
              </p>

              <button
                type="button"
                className="uptacPreviewButton"
                onClick={handleViewPdf}
              >
                <FaFilePdf />

                <span>View PDF</span>
              </button>
            </div>
          )}

          {/* =================================================
              PDF VIEWER
          ================================================= */}

          {showPdf && (
            <div className="uptacPdfViewer">
              {/* ---------------------------------------------
                  TOOLBAR
              --------------------------------------------- */}

              <div className="uptacPdfViewerToolbar">
                <span>
                  {counselling.pdfOriginalName || "UPTAC Counselling.pdf"}
                </span>

                <div>
                  <button type="button" onClick={handleOpenPdf}>
                    <FaExternalLinkAlt />
                    Open
                  </button>

                  <button type="button" onClick={handleDownloadPdf}>
                    <FaDownload />
                    Download
                  </button>

                  <button type="button" onClick={handleClosePdf}>
                    Close
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------
                  IFRAME
              --------------------------------------------- */}

              <iframe
                src={pdfViewUrl}
                title="UPTAC Counselling Notification"
                className="uptacPdfFrame"
              />
            </div>
          )}
        </div>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="uptacInformation">
          <div className="uptacInformationIcon">
            <FaUniversity />
          </div>

          <div>
            <h3>UPTAC Counselling Information</h3>

            <p>
              Please refer to the official counselling notification above for
              eligibility, important dates, counselling procedure and other
              admission-related information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UPTACCounselling;
