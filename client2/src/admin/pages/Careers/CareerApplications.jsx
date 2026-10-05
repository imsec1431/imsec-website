import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getCareerApplications,
  downloadCareerApplicationsExcel,
} from "../../services/careerService.js";

import "./CareerApplications.css";

const CareerApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // ======================================================
  // LOAD APPLICATIONS
  // ======================================================

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCareerApplications();

      // console.log("Career applications response:", response);

      setApplications(response?.data || []);
    } catch (error) {
      console.error("Career applications error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load career applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // ======================================================
  // DOWNLOAD EXCEL
  // ======================================================

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);

      const blob = await downloadCareerApplicationsExcel();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "career-applications.xlsx";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel download error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to download Excel file.",
      );
    } finally {
      setDownloading(false);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredApplications = applications.filter((application) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      String(application.candidateName || "")
        .toLowerCase()
        .includes(query) ||
      String(application.emailId || "")
        .toLowerCase()
        .includes(query) ||
      String(application.mobileNo || "")
        .toLowerCase()
        .includes(query) ||
      String(application.postApplied || "")
        .toLowerCase()
        .includes(query) ||
      String(application.department || "")
        .toLowerCase()
        .includes(query)
    );
  });

  // ======================================================
  // DATE
  // ======================================================

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

  // ======================================================
  // VIEW APPLICATION
  // ======================================================

  const handleView = (applicationId) => {
    if (!applicationId) {
      console.error("Missing application ID.");
      return;
    }

    /*
     * IMPORTANT:
     *
     * AdminApp.jsx is already mounted under:
     *
     * /imsec-control-center/*
     *
     * Therefore we navigate to the complete admin URL here.
     *
     * We use React Router's navigate() instead of
     * window.location.href so the application stays
     * inside the React admin application.
     */

    navigate(`/imsec-control-center/careers/applications/${applicationId}`);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="career-applications-page">
        <div className="career-applications-loading">
          <div className="career-applications-spinner" />

          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="career-applications-page">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="career-applications-header">
        <div>
          <span className="career-applications-eyebrow">HR / RECRUITMENT</span>

          <h2>Candidate Applications</h2>

          <p>View candidate details submitted for your career openings.</p>
        </div>

        <button
          type="button"
          className="career-download-excel"
          onClick={handleDownloadExcel}
          disabled={downloading}
        >
          {downloading ? "Preparing Excel..." : "↓ Download Excel"}
        </button>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="career-applications-error">
          <span>{error}</span>

          <button type="button" onClick={loadApplications}>
            Retry
          </button>
        </div>
      )}

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="career-applications-toolbar">
        <div className="career-applications-count">
          <strong>{filteredApplications.length}</strong>

          <span>Applications</span>
        </div>

        <div className="career-applications-search">
          <span>🔍</span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search candidate, email, post..."
          />
        </div>
      </div>

      {/* ==================================================
          EMPTY
      ================================================== */}

      {filteredApplications.length === 0 ? (
        <div className="career-applications-empty">
          <div className="career-applications-empty-icon">👤</div>

          <h3>No Applications Found</h3>

          <p>
            {search
              ? "No application matches your search."
              : "Candidates who apply for your jobs will appear here."}
          </p>
        </div>
      ) : (
        /* ==================================================
           TABLE
        ================================================== */

        <div className="career-applications-table-container">
          <table className="career-applications-table">
            <thead>
              <tr>
                <th>Candidate</th>

                <th>Post Applied</th>

                <th>Department</th>

                <th>Mobile</th>

                <th>Email</th>

                <th>Submitted</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application._id}>
                  {/* CANDIDATE */}

                  <td>
                    <div className="career-candidate">
                      <div className="career-candidate-avatar">
                        {(application.candidateName || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="career-candidate-info">
                        <strong>{application.candidateName || "-"}</strong>

                        <span>DOB: {formatDate(application.dateOfBirth)}</span>
                      </div>
                    </div>
                  </td>

                  {/* POST */}

                  <td>
                    <div className="career-post-info">
                      <strong>{application.postApplied || "-"}</strong>
                    </div>
                  </td>

                  {/* DEPARTMENT */}

                  <td>{application.department || "-"}</td>

                  {/* MOBILE */}

                  <td>{application.mobileNo || "-"}</td>

                  {/* EMAIL */}

                  <td>
                    <span className="career-email">
                      {application.emailId || "-"}
                    </span>
                  </td>

                  {/* SUBMITTED */}

                  <td>{formatDate(application.submittedAt)}</td>

                  {/* ACTION */}

                  <td>
                    <button
                      type="button"
                      className="career-view-application"
                      onClick={() => handleView(application._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CareerApplications;
