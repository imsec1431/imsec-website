import React, { useEffect, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  getAdmissionApplications,
  getAdmissionApplication,
  updateAdmissionApplicationStatus,
  deleteAdmissionApplication,
  downloadAdmissionApplicationsExcel,
} from "../../services/admissionApplicationService.js";

import "./AdmissionApplications.css";

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Approved",
  "Rejected",
];

/* =========================================================
   COMPONENT
========================================================= */

const AdmissionApplications = () => {
  /* =======================================================
     DATA
  ======================================================= */

  const [applications, setApplications] = useState([]);

  const [selectedApplication, setSelectedApplication] = useState(null);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [session, setSession] = useState("");

  const [programme, setProgramme] = useState("");

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  });

  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [excelLoading, setExcelLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  /* =======================================================
     LOAD APPLICATIONS
  ======================================================= */

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdmissionApplications({
        page,

        limit: 25,

        search: search.trim(),

        status,

        session,

        programme,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load applications.");
      }

      setApplications(response.data || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (err) {
      console.error("Load Applications Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admission applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL / FILTER LOAD
  ======================================================= */

  useEffect(() => {
    loadApplications();
  }, [page, status, session, programme]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPage(1);

    loadApplications();
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setSession("");
    setProgramme("");
    setPage(1);
  };

  /* =======================================================
     VIEW DETAILS
  ======================================================= */

  const handleView = async (id) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await getAdmissionApplication(id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load application.");
      }

      setSelectedApplication(response.data);
    } catch (err) {
      console.error("Application Details Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load application details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange = (event) => {
    setSelectedApplication((previous) => ({
      ...previous,

      status: event.target.value,
    }));
  };

  /* =======================================================
     REMARK CHANGE
  ======================================================= */

  const handleRemarkChange = (event) => {
    setSelectedApplication((previous) => ({
      ...previous,

      adminRemarks: event.target.value,
    }));
  };

  /* =======================================================
     SAVE STATUS
  ======================================================= */

  const handleSaveStatus = async () => {
    if (!selectedApplication?._id) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateAdmissionApplicationStatus(
        selectedApplication._id,
        {
          status: selectedApplication.status,

          adminRemarks: selectedApplication.adminRemarks || "",
        },
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update application.");
      }

      setMessage("Application updated successfully.");

      setSelectedApplication(response.data);

      await loadApplications();
    } catch (err) {
      console.error("Update Application Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update application.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setMessage("");

      const response = await deleteAdmissionApplication(id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete application.");
      }

      setSelectedApplication(null);

      setMessage("Application deleted successfully.");

      await loadApplications();
    } catch (err) {
      console.error("Delete Application Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete application.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     EXCEL DOWNLOAD
  ======================================================= */

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      setError("");

      await downloadAdmissionApplicationsExcel({
        search: search.trim(),

        status,

        session,

        programme,
      });

      setMessage("Excel file downloaded successfully.");
    } catch (err) {
      console.error("Excel Download Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to download Excel file.",
      );
    } finally {
      setExcelLoading(false);
    }
  };

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const getStatusBadge = (value) => {
    switch (value) {
      case "Approved":
        return "success";

      case "Rejected":
        return "danger";

      case "Shortlisted":
        return "primary";

      case "Under Review":
        return "warning";

      default:
        return "secondary";
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && applications.length === 0) {
    return (
      <div className="admission-admin-loading">
        <Spinner animation="border" />

        <p>Loading admission applications...</p>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="admission-applications-admin-page">
      <div className="admission-applications-admin-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admission-admin-header">
          <div>
            <span>ADMISSIONS</span>

            <h1>Admission Applications</h1>

            <p>Manage and review submitted admission applications.</p>
          </div>

          <Button
            type="button"
            className="admission-excel-button"
            disabled={excelLoading}
            onClick={handleDownloadExcel}
          >
            {excelLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Preparing Excel...
              </>
            ) : (
              "Download Excel"
            )}
          </Button>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* =================================================
            FILTER CARD
        ================================================= */}

        <Card className="admission-admin-card">
          <Card.Body>
            <Form onSubmit={handleSearchSubmit}>
              <Row className="g-3 align-items-end">
                <Col lg={4}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>

                    <Form.Control
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Application No., name, email or mobile"
                    />
                  </Form.Group>
                </Col>

                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>

                    <Form.Select
                      value={status}
                      onChange={(event) => {
                        setStatus(event.target.value);

                        setPage(1);
                      }}
                    >
                      <option value="">All Status</option>

                      {STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Session</Form.Label>

                    <Form.Select
                      value={session}
                      onChange={(event) => {
                        setSession(event.target.value);

                        setPage(1);
                      }}
                    >
                      <option value="">All Sessions</option>

                      <option value="2026-27">2026-27</option>

                      <option value="2025-26">2025-26</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} lg={2}>
                  <Form.Group>
                    <Form.Label>Programme</Form.Label>

                    <Form.Control
                      type="text"
                      value={programme}
                      onChange={(event) => {
                        setProgramme(event.target.value);

                        setPage(1);
                      }}
                      placeholder="MCA / MBA / B.Tech"
                    />
                  </Form.Group>
                </Col>

                <Col md={4} lg={2}>
                  <div className="admission-filter-actions">
                    <Button type="submit" variant="dark">
                      Search
                    </Button>

                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* =================================================
            APPLICATION TABLE
        ================================================= */}

        <Card className="admission-admin-card">
          <Card.Header>
            <div>
              <span>APPLICATIONS</span>

              <h2>{pagination.total || 0} Applications</h2>
            </div>
          </Card.Header>

          <div className="admission-table-wrapper">
            <Table hover responsive className="admission-applications-table">
              <thead>
                <tr>
                  <th>Application No.</th>

                  <th>Applicant</th>

                  <th>Contact</th>

                  <th>Programme</th>

                  <th>Session</th>

                  <th>Status</th>

                  <th>Submitted</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admission-empty-cell">
                      No admission applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <strong>{application.applicationNo}</strong>
                      </td>

                      <td>
                        <strong>
                          {[
                            application.firstName,
                            application.middleName,
                            application.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </strong>
                      </td>

                      <td>
                        <div>{application.email}</div>

                        <small>{application.mobile}</small>
                      </td>

                      <td>
                        <div>{application.programme}</div>

                        {application.branch && (
                          <small>{application.branch}</small>
                        )}
                      </td>

                      <td>{application.session}</td>

                      <td>
                        <Badge bg={getStatusBadge(application.status)}>
                          {application.status}
                        </Badge>
                      </td>

                      <td>
                        {application.submittedAt
                          ? new Date(
                              application.submittedAt,
                            ).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                      <td>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline-dark"
                          onClick={() => handleView(application._id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {pagination.totalPages > 1 && (
            <Card.Footer>
              <div className="admission-pagination">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((previous) => previous - 1)}
                >
                  Previous
                </Button>

                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                >
                  Next
                </Button>
              </div>
            </Card.Footer>
          )}
        </Card>
      </div>

      {/* =====================================================
          APPLICATION DETAILS MODAL
      ===================================================== */}

      <Modal
        show={Boolean(selectedApplication)}
        onHide={handleCloseDetails}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Admission Application
            {selectedApplication?.applicationNo && (
              <span className="ms-2">#{selectedApplication.applicationNo}</span>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {detailsLoading ? (
            <div className="admission-modal-loading">
              <Spinner animation="border" />

              <p>Loading application...</p>
            </div>
          ) : selectedApplication ? (
            <div className="admission-application-details">
              {/* ===========================================
                  STATUS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>APPLICATION</span>

                  <h3>Application Status</h3>
                </div>

                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Status</Form.Label>

                    <Form.Select
                      value={selectedApplication.status || "Submitted"}
                      onChange={handleStatusChange}
                    >
                      {STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={8}>
                    <Form.Label>Admin Remarks</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={selectedApplication.adminRemarks || ""}
                      onChange={handleRemarkChange}
                    />
                  </Col>
                </Row>
              </section>

              {/* ===========================================
                  PERSONAL DETAILS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>PERSONAL DETAILS</span>

                  <h3>Applicant Information</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="First Name"
                    value={selectedApplication.firstName}
                  />

                  <Detail
                    label="Middle Name"
                    value={selectedApplication.middleName}
                  />

                  <Detail
                    label="Last Name"
                    value={selectedApplication.lastName}
                  />

                  <Detail label="Email" value={selectedApplication.email} />

                  <Detail label="Mobile" value={selectedApplication.mobile} />

                  <Detail
                    label="Alternate Mobile"
                    value={selectedApplication.alternateMobile}
                  />

                  <Detail
                    label="Date of Birth"
                    value={
                      selectedApplication.dob
                        ? new Date(selectedApplication.dob).toLocaleDateString(
                            "en-IN",
                          )
                        : ""
                    }
                  />

                  <Detail label="Gender" value={selectedApplication.gender} />

                  <Detail
                    label="Category"
                    value={selectedApplication.category}
                  />

                  <Detail
                    label="Nationality"
                    value={selectedApplication.nationality}
                  />

                  <Detail
                    label="Blood Group"
                    value={selectedApplication.bloodGroup}
                  />

                  <Detail label="Aadhaar" value={selectedApplication.aadhaar} />
                </div>
              </section>

              {/* ===========================================
                  PARENT DETAILS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>FAMILY</span>

                  <h3>Parent Details</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="Father Name"
                    value={selectedApplication.fatherName}
                  />

                  <Detail
                    label="Father Occupation"
                    value={selectedApplication.fatherOccupation}
                  />

                  <Detail
                    label="Mother Name"
                    value={selectedApplication.motherName}
                  />

                  <Detail
                    label="Mother Occupation"
                    value={selectedApplication.motherOccupation}
                  />

                  <Detail
                    label="Annual Income"
                    value={selectedApplication.annualIncome}
                  />

                  <Detail
                    label="Religion"
                    value={selectedApplication.religion}
                  />
                </div>
              </section>

              {/* ===========================================
                  ADDRESS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>ADDRESS</span>

                  <h3>Address Details</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="Address"
                    value={selectedApplication.address}
                    wide
                  />

                  <Detail label="State" value={selectedApplication.state} />

                  <Detail
                    label="District"
                    value={selectedApplication.district}
                  />

                  <Detail label="City" value={selectedApplication.city} />

                  <Detail
                    label="PIN Code"
                    value={selectedApplication.pinCode}
                  />
                </div>
              </section>

              {/* ===========================================
                  ACADEMIC DETAILS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>ACADEMIC</span>

                  <h3>Academic Details</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="10th Board"
                    value={selectedApplication.board10}
                  />

                  <Detail
                    label="10th School"
                    value={selectedApplication.school10}
                  />

                  <Detail
                    label="10th Roll No."
                    value={selectedApplication.roll10}
                  />

                  <Detail
                    label="10th Year"
                    value={selectedApplication.year10}
                  />

                  <Detail
                    label="10th Marks"
                    value={selectedApplication.marks10}
                  />

                  <Detail
                    label="10th Medium"
                    value={selectedApplication.medium10}
                  />

                  <Detail
                    label="12th Board"
                    value={selectedApplication.board12}
                  />

                  <Detail
                    label="12th School"
                    value={selectedApplication.school12}
                  />

                  <Detail
                    label="12th Roll No."
                    value={selectedApplication.roll12}
                  />

                  <Detail
                    label="12th Year"
                    value={selectedApplication.year12}
                  />

                  <Detail
                    label="12th Marks"
                    value={selectedApplication.marks12}
                  />

                  <Detail
                    label="12th Stream"
                    value={selectedApplication.stream12}
                  />

                  <Detail
                    label="Graduation University"
                    value={selectedApplication.graduationUniversity}
                  />

                  <Detail
                    label="Graduation College"
                    value={selectedApplication.graduationCollege}
                  />

                  <Detail
                    label="Graduation Programme"
                    value={selectedApplication.graduationProgramme}
                  />

                  <Detail
                    label="Graduation Branch"
                    value={selectedApplication.graduationBranch}
                  />

                  <Detail
                    label="Graduation Year"
                    value={selectedApplication.graduationYear}
                  />

                  <Detail
                    label="Graduation Marks"
                    value={selectedApplication.graduationMarks}
                  />
                </div>
              </section>

              {/* ===========================================
                  ENTRANCE
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>ENTRANCE EXAM</span>

                  <h3>Entrance Details</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="Entrance Exam"
                    value={selectedApplication.entranceExam}
                  />

                  <Detail
                    label="Application No."
                    value={selectedApplication.entranceAppNo}
                  />

                  <Detail
                    label="Roll No."
                    value={selectedApplication.entranceRollNo}
                  />

                  <Detail
                    label="Rank"
                    value={selectedApplication.entranceRank}
                  />

                  <Detail
                    label="Score"
                    value={selectedApplication.entranceScore}
                  />

                  <Detail
                    label="Year"
                    value={selectedApplication.entranceYear}
                  />

                  <Detail
                    label="Achievements"
                    value={selectedApplication.achievements}
                    wide
                  />
                </div>
              </section>

              {/* ===========================================
                  COURSE
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>ADMISSION</span>

                  <h3>Course Preferences</h3>
                </div>

                <div className="admission-details-grid">
                  <Detail
                    label="Programme"
                    value={selectedApplication.programme}
                  />

                  <Detail label="Branch" value={selectedApplication.branch} />

                  <Detail
                    label="Admission Type"
                    value={selectedApplication.admissionType}
                  />

                  <Detail label="Session" value={selectedApplication.session} />

                  <Detail label="Hostel" value={selectedApplication.hostel} />

                  <Detail
                    label="Transport"
                    value={selectedApplication.transport}
                  />

                  <Detail
                    label="Scholarship"
                    value={selectedApplication.scholarship}
                  />

                  <Detail
                    label="Declaration"
                    value={
                      selectedApplication.declarationAccepted
                        ? "Accepted"
                        : "Not Accepted"
                    }
                  />
                </div>
              </section>

              {/* ===========================================
                  DOCUMENTS
              =========================================== */}

              <section>
                <div className="admission-detail-heading">
                  <span>DOCUMENTS</span>

                  <h3>Uploaded Documents</h3>
                </div>

                <div className="admission-document-list">
                  <DocumentLink
                    label="Photograph"
                    url={selectedApplication.photographUrl}
                  />

                  <DocumentLink
                    label="Aadhaar"
                    url={selectedApplication.aadhaarDocumentUrl}
                  />

                  <DocumentLink
                    label="10th Marksheet"
                    url={selectedApplication.marksheet10Url}
                  />

                  <DocumentLink
                    label="12th Marksheet"
                    url={selectedApplication.marksheet12Url}
                  />

                  <DocumentLink
                    label="Other Document"
                    url={selectedApplication.otherDocumentUrl}
                  />
                </div>
              </section>
            </div>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-danger"
            disabled={deleting || !selectedApplication}
            onClick={() => handleDelete(selectedApplication?._id)}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>

          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>

          <Button variant="dark" disabled={saving} onClick={handleSaveStatus}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

/* =========================================================
   DETAIL COMPONENT
========================================================= */

const Detail = ({ label, value, wide = false }) => {
  return (
    <div
      className={wide ? "admission-detail-item wide" : "admission-detail-item"}
    >
      <span>{label}</span>

      <strong>{value || "-"}</strong>
    </div>
  );
};

/* =========================================================
   DOCUMENT LINK
========================================================= */

const DocumentLink = ({ label, url }) => {
  return (
    <div className="admission-document-item">
      <span>{label}</span>

      {url ? (
        <Button
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          variant="outline-dark"
        >
          View
        </Button>
      ) : (
        <small>Not uploaded</small>
      )}
    </div>
  );
};

export default AdmissionApplications;
