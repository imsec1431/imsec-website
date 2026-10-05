import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCareerApplication,
  downloadCareerApplicationResume,
} from "../../services/careerService.js";

import "./CareerApplicationDetails.css";

const CareerApplicationDetails = () => {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getCareerApplication(applicationId);

        setApplication(response?.data || response);
      } catch (err) {
        console.error("Application details error:", err);

        setError(err?.message || "Unable to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const display = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return String(value);
  };
  // =====================================================
  // DOWNLOAD CV
  // =====================================================

  const handleDownloadResume = async () => {
    try {
      if (!application?.resumeFile) {
        alert("CV / Resume is not available.");
        return;
      }

      const result = await downloadCareerApplicationResume(applicationId);

      if (!result?.blob) {
        throw new Error("CV / Resume file was not returned by the server.");
      }

      const blobUrl = window.URL.createObjectURL(result.blob);

      const fileName = application.resumeOriginalName || "candidate-cv";

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("CV download error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to download CV / Resume.",
      );
    }
  };

  // =====================================================
  // VIEW CV
  // =====================================================

  const handleViewResume = async () => {
    try {
      if (!application?.resumeFile) {
        alert("CV / Resume is not available.");
        return;
      }

      const result = await downloadCareerApplicationResume(applicationId);

      if (!result?.blob) {
        throw new Error("CV / Resume file was not returned by the server.");
      }

      const blobUrl = window.URL.createObjectURL(result.blob);

      const newWindow = window.open("", "_blank");

      if (!newWindow) {
        window.URL.revokeObjectURL(blobUrl);

        alert("Please allow pop-ups to view the CV.");

        return;
      }

      newWindow.location.href = blobUrl;

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60000);
    } catch (error) {
      console.error("CV view error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to open CV / Resume.",
      );
    }
  };
  if (loading) {
    return (
      <div className="career-application-details-page">
        <div className="career-application-details-loading">
          <div className="career-application-details-spinner" />

          <h3>Loading Application</h3>

          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="career-application-details-page">
        <div className="career-application-details-error">
          <h2>Application Not Found</h2>

          <p>{error || "Unable to find this application."}</p>

          <button
            type="button"
            onClick={() => navigate("/imsec-control-center/careers")}
          >
            ← Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="career-application-details-page">
      {/* HEADER */}

      <div className="career-application-details-header">
        <button
          type="button"
          className="career-application-back"
          onClick={() => navigate("/imsec-control-center/careers")}
        >
          ← Back to Applications
        </button>

        <div>
          <span>HR / RECRUITMENT</span>

          <h1>Candidate Details</h1>

          <p>Complete application submitted by the candidate.</p>
        </div>
      </div>

      {/* CANDIDATE */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>PERSONAL DETAILS</span>

          <h2>{display(application.candidateName)}</h2>
        </div>

        <div className="career-detail-grid">
          <Detail label="Email" value={application.emailId} />

          <Detail label="Mobile" value={application.mobileNo} />

          <Detail
            label="Date of Birth"
            value={formatDate(application.dateOfBirth)}
          />

          <Detail
            label="Submitted At"
            value={formatDate(application.submittedAt)}
          />
        </div>
      </section>

      {/* POSITION */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>APPLICATION</span>

          <h2>Position Applied</h2>
        </div>

        <div className="career-detail-grid">
          <Detail label="Post Applied" value={application.postApplied} />

          <Detail label="Department" value={application.department} />

          <Detail
            label="Opening ID"
            value={
              application.careerOpeningId?._id || application.careerOpeningId
            }
          />
        </div>
      </section>

      {/* EDUCATION */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>ACADEMIC QUALIFICATIONS</span>

          <h2>Education</h2>
        </div>

        <div className="career-detail-grid">
          <Detail label="10th Division" value={application.tenthDivision} />

          <Detail
            label="12th Percentage"
            value={application.twelfthPercentage}
          />

          <Detail label="12th Division" value={application.twelfthDivision} />

          <Detail
            label="Graduation Stream"
            value={application.graduationStream}
          />

          <Detail
            label="Graduation University"
            value={application.graduationUniversity}
          />

          <Detail label="UG Percentage" value={application.ugPercentage} />

          <Detail label="UG Division" value={application.ugDivision} />

          <Detail label="PG Stream" value={application.postGraduationStream} />

          <Detail
            label="PG University"
            value={application.postGraduationUniversity}
          />

          <Detail
            label="PG Specialisation"
            value={application.postGraduationSpecialisation}
          />

          <Detail label="PG Percentage" value={application.pgPercentage} />

          <Detail label="PG Division" value={application.pgDivision} />
        </div>
      </section>

      {/* RESEARCH */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>RESEARCH</span>

          <h2>NET & Ph.D.</h2>
        </div>

        <div className="career-detail-grid">
          <Detail label="NET Qualified" value={application.netQualified} />

          <Detail label="Ph.D. Status" value={application.phdStatus} />

          <Detail label="Ph.D. University" value={application.phdUniversity} />

          <Detail
            label="Ph.D. Specialisation"
            value={application.phdSpecialisation}
          />

          <Detail
            label="Ph.D. Registration Date"
            value={formatDate(application.phdRegistrationDate)}
          />

          <Detail
            label="Ph.D. Awarded On"
            value={formatDate(application.phdAwardedOn)}
          />
        </div>

        {application.phdDetail && (
          <div className="career-detail-long">
            <strong>Ph.D. Details</strong>

            <p>{application.phdDetail}</p>
          </div>
        )}
      </section>

      {/* EXPERIENCE */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>EXPERIENCE</span>

          <h2>Professional Experience</h2>
        </div>

        <div className="career-detail-grid">
          <Detail
            label="Teaching Experience"
            value={application.teachingExperience}
          />

          <Detail
            label="Industry Experience"
            value={application.industryExperience}
          />
        </div>

        {application.otherExperience && (
          <div className="career-detail-long">
            <strong>Other Experience</strong>

            <p>{application.otherExperience}</p>
          </div>
        )}
      </section>

      {/* PUBLICATIONS */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>PUBLICATIONS</span>

          <h2>Research Publications</h2>
        </div>

        <div className="career-detail-grid">
          <Detail
            label="Total Publications"
            value={application.totalPublication}
          />

          <Detail
            label="National Journals"
            value={application.nationalJournals}
          />

          <Detail
            label="International Journals"
            value={application.internationalJournals}
          />

          <Detail
            label="National Conferences"
            value={application.nationalConference}
          />

          <Detail
            label="International Conferences"
            value={application.internationalConference}
          />

          <Detail label="SCI Indexed" value={application.sciIndexed} />

          <Detail label="Scopus Indexed" value={application.scopusIndexed} />

          <Detail label="UGC CARE Indexed" value={application.ugcCareIndexed} />

          <Detail label="Other Indexed" value={application.otherIndexed} />
        </div>
      </section>

      {/* GRANT */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>RESEARCH GRANT</span>

          <h2>Grant Information</h2>
        </div>

        <div className="career-detail-grid">
          <Detail label="Grant Received" value={application.grantReceived} />

          <Detail label="Grant Head" value={application.grantHead} />

          <Detail label="Funding Agency" value={application.fundingAgency} />

          <Detail label="Grant Amount" value={application.grantAmount} />
        </div>
      </section>

      {/* OTHER */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>OTHER INFORMATION</span>

          <h2>Additional Qualification</h2>
        </div>

        <div className="career-detail-long">
          <p>{display(application.otherQualification)}</p>
        </div>
      </section>

      {/* RESUME */}

      <section className="career-detail-card">
        <div className="career-detail-card-title">
          <span>DOCUMENT</span>

          <h2>CV / Resume</h2>
        </div>

        {application.resumeFile ? (
          <div className="career-resume-actions">
            <button
              type="button"
              className="career-resume-button"
              onClick={handleViewResume}
            >
              View CV
              <span>↗</span>
            </button>

            <button
              type="button"
              className="career-resume-download-button"
              onClick={handleDownloadResume}
            >
              ↓ Download CV
            </button>
          </div>
        ) : (
          <p className="career-detail-empty">No CV / Resume uploaded.</p>
        )}
      </section>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="career-detail-item">
    <span>{label}</span>

    <strong>
      {value === null || value === undefined || value === ""
        ? "-"
        : String(value)}
    </strong>
  </div>
);

export default CareerApplicationDetails;
