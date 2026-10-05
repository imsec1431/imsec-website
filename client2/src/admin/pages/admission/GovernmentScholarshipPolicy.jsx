import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

import {
  getAdminGovernmentScholarshipPolicy,
  updateGovernmentScholarshipPolicy,
  publishGovernmentScholarshipPolicy,
  unpublishGovernmentScholarshipPolicy,
} from "../../services/governmentScholarshipPolicyService.js";

import "./GovernmentScholarshipPolicy.css";

const GovernmentScholarshipPolicy = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [policy, setPolicy] = useState({
    title: "Government Scholarship Policies",
    pdfUrl: "",
    isPublished: true,
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  /* =========================================================
     LOAD POLICY
  ========================================================= */

  const loadPolicy = async () => {
    try {
      setLoading(true);
      setError("");

      // console.log("Loading Government Scholarship Policy...");

      const response = await getAdminGovernmentScholarshipPolicy();

      // console.log("Government Scholarship Policy response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load government scholarship policy.",
        );
      }

      setPolicy({
        title: response?.data?.title || "Government Scholarship Policies",

        pdfUrl: response?.data?.pdfUrl || "",

        isPublished: response?.data?.isPublished !== false,
      });
    } catch (err) {
      console.error("======================================");

      console.error("GOVERNMENT SCHOLARSHIP POLICY ERROR");

      console.error("Message:", err?.message);

      console.error("Status:", err?.response?.status);

      console.error("Response:", err?.response?.data);

      console.error("Request URL:", err?.config?.url);

      console.error("Request Headers:", err?.config?.headers);

      console.error("======================================");

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
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
     FIELD CHANGE
  ========================================================= */

  const handleChange = (field, value) => {
    setPolicy((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =========================================================
     CLEAR MESSAGE
  ========================================================= */

  const clearMessages = () => {
    setError("");

    setMessage("");
  };

  /* =========================================================
     VALIDATE
  ========================================================= */

  const validatePolicy = () => {
    if (!policy.title || !policy.title.trim()) {
      setError("Please enter the scholarship policy title.");

      return false;
    }

    if (!policy.pdfUrl || !policy.pdfUrl.trim()) {
      setError("Please enter the PDF URL.");

      return false;
    }

    return true;
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    clearMessages();

    if (!validatePolicy()) {
      return;
    }

    try {
      setSaving(true);

      const response = await updateGovernmentScholarshipPolicy({
        title: policy.title.trim(),

        pdfUrl: policy.pdfUrl.trim(),

        isPublished: policy.isPublished,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to save scholarship policy.",
        );
      }

      if (response.data) {
        setPolicy({
          title: response.data.title || "",

          pdfUrl: response.data.pdfUrl || "",

          isPublished: response.data.isPublished !== false,
        });
      }

      setMessage("Government scholarship policy saved successfully.");
    } catch (err) {
      console.error("Government Scholarship Policy Save Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save government scholarship policy.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     VIEW PDF
  ========================================================= */

  const handleViewPDF = () => {
    clearMessages();

    if (!policy.pdfUrl || !policy.pdfUrl.trim()) {
      setError("Please enter a PDF URL first.");

      return;
    }

    window.open(policy.pdfUrl.trim(), "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     DOWNLOAD PDF
  ========================================================= */

  const handleDownloadPDF = () => {
    clearMessages();

    if (!policy.pdfUrl || !policy.pdfUrl.trim()) {
      setError("Please enter a PDF URL first.");

      return;
    }

    const link = document.createElement("a");

    link.href = policy.pdfUrl.trim();

    link.target = "_blank";

    link.rel = "noopener noreferrer";

    link.download = "Government-Scholarship-Policy.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =========================================================
     PUBLISH
  ========================================================= */

  const handlePublish = async () => {
    clearMessages();

    if (!validatePolicy()) {
      return;
    }

    try {
      setPublishing(true);

      /*
       * Save the latest Admin edits first.
       */

      const saveResponse = await updateGovernmentScholarshipPolicy({
        title: policy.title.trim(),

        pdfUrl: policy.pdfUrl.trim(),

        isPublished: true,
      });

      if (!saveResponse?.success) {
        throw new Error(saveResponse?.message || "Unable to save policy.");
      }

      const response = await publishGovernmentScholarshipPolicy();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to publish policy.");
      }

      if (response.data) {
        setPolicy({
          title: response.data.title || "",

          pdfUrl: response.data.pdfUrl || "",

          isPublished: response.data.isPublished !== false,
        });
      } else {
        setPolicy((previous) => ({
          ...previous,
          isPublished: true,
        }));
      }

      setMessage("Government scholarship policy published successfully.");
    } catch (err) {
      console.error("Government Scholarship Policy Publish Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish government scholarship policy.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =========================================================
     UNPUBLISH
  ========================================================= */

  const handleUnpublish = async () => {
    clearMessages();

    try {
      setPublishing(true);

      const response = await unpublishGovernmentScholarshipPolicy();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to unpublish policy.");
      }

      if (response.data) {
        setPolicy({
          title: response.data.title || "",

          pdfUrl: response.data.pdfUrl || "",

          isPublished: response.data.isPublished !== false,
        });
      } else {
        setPolicy((previous) => ({
          ...previous,
          isPublished: false,
        }));
      }

      setMessage("Government scholarship policy unpublished successfully.");
    } catch (err) {
      console.error("Government Scholarship Policy Unpublish Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish government scholarship policy.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="governmentScholarshipAdminPage">
        <div className="governmentScholarshipLoading">
          <Spinner animation="border" />

          <p>Loading scholarship policy...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="governmentScholarshipAdminPage">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="governmentScholarshipHeader">
        <div>
          <span className="governmentScholarshipEyebrow">ADMISSIONS</span>

          <h1>Government Scholarship Policies</h1>

          <p>
            Manage the government scholarship policy document displayed on the
            public website.
          </p>
        </div>

        <div className="governmentScholarshipHeaderActions">
          <div
            className={
              policy.isPublished
                ? "governmentScholarshipStatus published"
                : "governmentScholarshipStatus unpublished"
            }
          >
            <span />

            {policy.isPublished ? "Published" : "Unpublished"}
          </div>

          {policy.isPublished ? (
            <Button
              type="button"
              className="governmentScholarshipUnpublishButton"
              onClick={handleUnpublish}
              disabled={publishing || saving}
            >
              {publishing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Unpublish"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              className="governmentScholarshipPublishButton"
              onClick={handlePublish}
              disabled={publishing || saving}
            >
              {publishing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Publish"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <section className="governmentScholarshipCard">
        <div className="governmentScholarshipSectionHeader">
          <div>
            <span>POLICY DOCUMENT</span>

            <h2>Scholarship Policy</h2>
          </div>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <Form.Group className="governmentScholarshipField">
          <Form.Label>Policy Title</Form.Label>

          <Form.Control
            type="text"
            value={policy.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="Government Scholarship Policies"
          />
        </Form.Group>

        {/* =================================================
            PDF URL
        ================================================= */}

        <Form.Group className="governmentScholarshipField">
          <Form.Label>PDF URL</Form.Label>

          <Form.Control
            type="url"
            value={policy.pdfUrl}
            onChange={(event) => handleChange("pdfUrl", event.target.value)}
            placeholder="https://res.cloudinary.com/.../scholarship-policy.pdf"
          />

          <Form.Text>Paste the public Cloudinary PDF URL here.</Form.Text>
        </Form.Group>

        {/* =================================================
            DOCUMENT PREVIEW CARD
        ================================================= */}

        <div className="governmentScholarshipDocument">
          <div className="governmentScholarshipPdfIcon">PDF</div>

          <div className="governmentScholarshipDocumentInfo">
            <strong>{policy.title || "Government Scholarship Policies"}</strong>

            <span>
              {policy.pdfUrl ? "PDF URL configured" : "No PDF URL added yet"}
            </span>
          </div>

          <div className="governmentScholarshipDocumentActions">
            <Button
              type="button"
              className="governmentScholarshipViewButton"
              onClick={handleViewPDF}
              disabled={!policy.pdfUrl}
            >
              View PDF
            </Button>

            <Button
              type="button"
              className="governmentScholarshipDownloadButton"
              onClick={handleDownloadPDF}
              disabled={!policy.pdfUrl}
            >
              Download
            </Button>
          </div>
        </div>

        {/* =================================================
            PUBLISH SWITCH
        ================================================= */}

        <div className="governmentScholarshipPublishBox">
          <div>
            <strong>Display on Public Website</strong>

            <p>
              When enabled and published, visitors can view the scholarship
              policy.
            </p>
          </div>

          <Form.Check
            type="switch"
            id="government-scholarship-published"
            checked={policy.isPublished}
            onChange={(event) =>
              handleChange("isPublished", event.target.checked)
            }
          />
        </div>
      </section>

      {/* =====================================================
          SAVE BAR
      ===================================================== */}

      <div className="governmentScholarshipSaveBar">
        <div>
          <strong>
            {policy.isPublished
              ? "Policy is published"
              : "Policy is unpublished"}
          </strong>

          <span>Save your changes after updating the title or PDF URL.</span>
        </div>

        <Button
          type="button"
          className="governmentScholarshipSaveButton"
          onClick={handleSave}
          disabled={saving || publishing}
        >
          {saving ? (
            <>
              <Spinner size="sm" animation="border" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="xl"
        centered
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>{policy.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {policy.pdfUrl ? (
            <iframe
              src={policy.pdfUrl}
              title="Government Scholarship Policy"
              style={{
                width: "100%",
                height: "75vh",
                border: 0,
              }}
            />
          ) : (
            <div>PDF is not available.</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GovernmentScholarshipPolicy;
