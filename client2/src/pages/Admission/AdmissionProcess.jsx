import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Alert, Spinner } from "react-bootstrap";

import {
  FaCheckCircle,
  FaFileAlt,
  FaSearch,
  FaEdit,
  FaUniversity,
  FaCreditCard,
  FaArrowRight,
  FaClipboardCheck,
  FaCalendarAlt,
} from "react-icons/fa";

import { getPublicAdmissionProcess } from "../../services/admissionProcessPublicService.js";

import "./AdmissionProcess.css";

/* =========================================================
   ICON HELPER
========================================================= */

const getStepIcon = (icon) => {
  switch (String(icon || "").toLowerCase()) {
    case "search":
      return <FaSearch />;

    case "check":
      return <FaCheckCircle />;

    case "edit":
      return <FaEdit />;

    case "file":
      return <FaFileAlt />;

    case "payment":
      return <FaCreditCard />;

    case "university":
      return <FaUniversity />;

    case "clipboard":
      return <FaClipboardCheck />;

    default:
      return <FaFileAlt />;
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const AdmissionProcess = () => {
  /* =======================================================
     DATA
  ======================================================= */

  const [admissionProcess, setAdmissionProcess] = useState(null);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] = useState(true);

  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] = useState("");

  /* =======================================================
     LOAD PUBLIC DATA
  ======================================================= */

  const loadAdmissionProcess = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPublicAdmissionProcess();

      // console.log("Public Admission Process response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load Admission Process.",
        );
      }

      setAdmissionProcess(response?.data || null);
    } catch (err) {
      console.error("Public Admission Process error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load Admission Process.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadAdmissionProcess();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admissionProcessPage">
        <div className="admissionProcessLoading">
          <Spinner animation="border" />

          <h3>Loading Admission Process</h3>

          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !admissionProcess) {
    return (
      <div className="admissionProcessPage">
        <div className="admissionProcessError">
          <Alert variant="danger">{error}</Alert>

          <button type="button" onClick={loadAdmissionProcess}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO DATA
  ======================================================= */

  if (!admissionProcess) {
    return (
      <div className="admissionProcessPage">
        <div className="admissionProcessEmpty">
          <div className="admissionEmptyIcon">
            <FaFileAlt />
          </div>

          <span>ADMISSIONS</span>

          <h1>Admission Process</h1>

          <p>Admission process information is currently unavailable.</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     SAFE ARRAYS
  ======================================================= */

  const admissionSteps = Array.isArray(admissionProcess.admissionSteps)
    ? admissionProcess.admissionSteps
    : [];

  const eligibility = Array.isArray(admissionProcess.eligibility)
    ? admissionProcess.eligibility
    : [];

  const admissionModes = Array.isArray(admissionProcess.admissionModes)
    ? admissionProcess.admissionModes
    : [];

  const requiredDocuments = Array.isArray(admissionProcess.requiredDocuments)
    ? admissionProcess.requiredDocuments
    : [];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="admissionProcessPage">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="admissionHero">
        <div className="admissionHeroOverlay">
          <div className="admissionProcessContainer">
            <div className="admissionHeroContent">
              <span className="admissionHeroTag">{admissionProcess.heroTag || "Admissions Open"}</span>

              <h1 className="text-center">
                {admissionProcess.heroTitle || "Admission"}
                <span> {admissionProcess.heroTitleHighlight || "Process"}</span>
              </h1>

              <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{admissionProcess.heroDescription}</p>

              <div className="admissionHeroActions">
                {/* React Router Navigation */}
                <Link
                  to="/Admissions/ApplyforAdmission"
                  className="admissionPrimaryButton"
                >
                  {admissionProcess.applyButtonText || "Apply Now"}

                  <FaArrowRight />
                </Link>

                <button type="button" className="admissionSecondaryButton">
                  {admissionProcess.brochureButtonText || "Download Brochure"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ADMISSION JOURNEY
      ================================================= */}

      <section className="admissionJourneySection">
        <div className="admissionProcessContainer">
          <div className="admissionSectionHeading">
            {/* <span>{admissionProcess.journeyLabel || "Admission Journey"}</span> */}

            <h2>{admissionProcess.journeyTitle || "Your Admission in 6 Simple Steps"}</h2>

            <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{admissionProcess.journeyDescription}</p>
          </div>

          <div className="admissionStepsGrid">
            {admissionSteps.map((step, index) => (
              <article className="admissionStepCard" key={step.id || index}>
                <div className="admissionStepTop">
                  <div className="admissionStepIcon">
                    {getStepIcon(step.icon)}
                  </div>

                  <span>STEP {String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3>{step.title}</h3>

                <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{step.description}</p>

                <div className="admissionStepNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          ELIGIBILITY
      ================================================= */}

      <section className="admissionEligibilitySection">
        <div className="admissionProcessContainer">
          <div className="admissionSectionHeading">
            {/* <span>{admissionProcess.eligibilityLabel || "Eligibility"}</span> */}

            <h2>{admissionProcess.eligibilityTitle || "Programme Eligibility Criteria"}</h2>

            <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{admissionProcess.eligibilityDescription}</p>
          </div>

          <div className="admissionEligibilityTableWrapper">
            <table className="admissionEligibilityTable">
              <thead>
                <tr>
                  <th>Programme</th>

                  <th>Qualification</th>

                  <th>Marks / Requirement</th>
                </tr>
              </thead>

              <tbody>
                {eligibility.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{item.course || item.programme || item.program}</strong>
                    </td>

                    <td style={{ textAlign: "justify", textJustify: "inter-word" }}>
                      {item.qualification || item.eligibilityCriteria || item.criteria}
                    </td>

                    <td style={{ textAlign: "justify", textJustify: "inter-word" }}>
                      {item.marks || item.requirement || item.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =================================================
          ADMISSION MODES
      ================================================= */}

      <section className="admissionModesSection">
        <div className="admissionProcessContainer">
          <div className="admissionSectionHeading">
            {/* <span>{admissionProcess.admissionModeLabel || "Admission Modes"}</span> */}

            <h2>{admissionProcess.admissionModeTitle || "Choose Your Admission Path"}</h2>

            <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{admissionProcess.admissionModeDescription}</p>
          </div>

          <div className="admissionModesGrid">
            {admissionModes.map((item, index) => (
              <article className="admissionModeCard" key={index}>
                <div className="admissionModeIcon">
                  {index === 0 ? (
                    <FaUniversity />
                  ) : index === 1 ? (
                    <FaEdit />
                  ) : index === 2 ? (
                    <FaClipboardCheck />
                  ) : (
                    <FaArrowRight />
                  )}
                </div>

                <span>OPTION {String(index + 1).padStart(2, "0")}</span>

                <h3>{item.title}</h3>

                <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          REQUIRED DOCUMENTS
      ================================================= */}

      <section className="admissionDocumentsSection">
        <div className="admissionProcessContainer">
          <div className="admissionDocumentsLayout">
            <div className="admissionDocumentsIntro">
              {/* <span>{admissionProcess.documentLabel || "Documents Required"}</span> */}

              <h2>{admissionProcess.documentTitle || "Admission Checklist"}</h2>

              <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{admissionProcess.documentDescription}</p>

              <div className="admissionDocumentsBadge">
                <FaClipboardCheck />

                <span>Keep your documents ready</span>
              </div>
            </div>

            <div className="admissionDocumentsList">
              {requiredDocuments.map((item, index) => (
                <div className="admissionDocumentRow" key={index}>
                  <div className="admissionDocumentCheck">
                    <FaCheckCircle />
                  </div>

                  <span style={{ textAlign: "justify", textJustify: "inter-word" }}>{typeof item === "string" ? item : (item.title || item.name || item.document || "")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          IMPORTANT DATES
      ================================================= */}

      {admissionProcess.importantDatesEnabled && (
        <section className="admissionDatesSection">
          <div className="admissionProcessContainer">
            <div className="admissionDatesCard">
              <div className="admissionDatesIcon">
                <FaCalendarAlt />
              </div>

              <div>
                <span>{admissionProcess.importantDateLabel || "Important Dates"}</span>

                <h2>{admissionProcess.importantDateTitle || "Admission Schedule"}</h2>

                <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
                  Please check the latest admission notifications for current
                  dates and deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <section className="admissionBottomCTA">
        <div className="admissionProcessContainer">
          <div className="admissionCTAContent">
            {/* <span>START YOUR JOURNEY</span> */}

            <h2>Ready to Begin Your Admission Journey?</h2>

            <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
              Take the next step toward your academic and professional future at
              IMS Engineering College.
            </p>

            {/* React Router Navigation */}
            <Link
              to="/Admissions/ApplyforAdmission"
              className="admissionPrimaryButton"
            >
              {admissionProcess.applyButtonText || "Apply Now"}

              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdmissionProcess;
