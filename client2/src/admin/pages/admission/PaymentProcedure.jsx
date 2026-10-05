import React, { useEffect, useRef, useState } from "react";

import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";

import {
  getAdminPaymentProcedure,
  updatePaymentProcedure,
  publishPaymentProcedure,
  unpublishPaymentProcedure,
} from "../../services/paymentProcedureService.js";

import "./PaymentProcedure.css";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  accountHolderName: "IMS ENGINEERING COLLEGE",

  bankName: "PUNJAB NATIONAL BANK",

  branchAddress: "IMS, LAL KUAN, GHAZIABAD-201009",

  bankAccountNumber: "51461010000140",

  accountType: "CURRENT A/C",

  ifscCode: "PUNB0514610",

  micrCode: "110024640",

  branchCode: "514610",

  remarks:
    "Kindly mention the Name/ ID/ Fees- Academic or Hostel under Remarks Column while making payment.\n\nExample: Prashant Sharma, A2017ME4012, Academic",

  erpOnlineTransactionUrl: "http://52.66.16.110/academic#/online_txn",

  qrCodeUrl: "",

  qrCodePublicId: "",

  qrCodeOriginalName: "",

  isPublished: false,
};

/* =========================================================
   COMPONENT
========================================================= */

const PaymentProcedure = () => {
  /* =======================================================
     FORM DATA
  ======================================================= */

  const [formData, setFormData] = useState(DEFAULT_DATA);

  /* =======================================================
     QR FILE
  ======================================================= */

  const [qrFile, setQrFile] = useState(null);

  const [qrPreview, setQrPreview] = useState("");

  const fileInputRef = useRef(null);

  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =======================================================
     LOAD PAYMENT PROCEDURE
  ======================================================= */

  const loadPaymentProcedure = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminPaymentProcedure();

      // console.log("Payment Procedure:", response);

      if (response?.success && response?.data) {
        const data = {
          ...DEFAULT_DATA,
          ...response.data,
        };

        setFormData(data);

        if (data.qrCodeUrl) {
          setQrPreview(data.qrCodeUrl);
        } else {
          setQrPreview("");
        }
      }
    } catch (err) {
      console.error("Payment Procedure Load Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment procedure.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadPaymentProcedure();
  }, []);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  /* =======================================================
     QR FILE CHANGE
  ======================================================= */

  const handleQrFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    /* ---------------------------------------------------
         FILE TYPE
      --------------------------------------------------- */

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, JPEG, PNG or WEBP image.");

      event.target.value = "";

      return;
    }

    /* ---------------------------------------------------
         FILE SIZE
      --------------------------------------------------- */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("QR Code image must be less than 5 MB.");

      event.target.value = "";

      return;
    }

    /* ---------------------------------------------------
         STORE FILE
      --------------------------------------------------- */

    setQrFile(file);

    /* ---------------------------------------------------
         PREVIEW
      --------------------------------------------------- */

    const previewUrl = URL.createObjectURL(file);

    setQrPreview(previewUrl);
  };

  /* =======================================================
     REMOVE SELECTED QR
  ======================================================= */

  const handleRemoveQr = () => {
    setQrFile(null);

    setQrPreview(formData.qrCodeUrl || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =======================================================
     SAVE PAYMENT PROCEDURE
  ======================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      setMessage("");

      setError("");

      /* -------------------------------------------------
           FORM DATA
        ------------------------------------------------- */

      const data = new FormData();

      data.append("accountHolderName", formData.accountHolderName || "");

      data.append("bankName", formData.bankName || "");

      data.append("branchAddress", formData.branchAddress || "");

      data.append("bankAccountNumber", formData.bankAccountNumber || "");

      data.append("accountType", formData.accountType || "");

      data.append("ifscCode", formData.ifscCode || "");

      data.append("micrCode", formData.micrCode || "");

      data.append("branchCode", formData.branchCode || "");

      data.append("remarks", formData.remarks || "");

      data.append(
        "erpOnlineTransactionUrl",
        formData.erpOnlineTransactionUrl || "",
      );

      data.append("isPublished", String(Boolean(formData.isPublished)));

      /* -------------------------------------------------
           QR CODE
        ------------------------------------------------- */

      if (qrFile) {
        data.append("qrCode", qrFile);
      }

      /* -------------------------------------------------
           UPDATE
        ------------------------------------------------- */

      const response = await updatePaymentProcedure(data);

      // console.log("Payment Procedure Save Response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to save payment procedure.",
        );
      }

      /* -------------------------------------------------
           UPDATE LOCAL STATE
        ------------------------------------------------- */

      const updatedData = {
        ...DEFAULT_DATA,
        ...response.data,
      };

      setFormData(updatedData);

      setQrFile(null);

      setQrPreview(updatedData.qrCodeUrl || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(response.message || "Payment procedure saved successfully.");
    } catch (err) {
      console.error("Payment Procedure Save Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save payment procedure.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish = async () => {
    try {
      setPublishing(true);

      setMessage("");

      setError("");

      const response = await publishPaymentProcedure();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to publish payment procedure.",
        );
      }

      setFormData((previous) => ({
        ...previous,

        isPublished: true,
      }));

      setMessage(
        response.message || "Payment procedure published successfully.",
      );
    } catch (err) {
      console.error("Publish Payment Procedure Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish payment procedure.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =======================================================
     UNPUBLISH
  ======================================================= */

  const handleUnpublish = async () => {
    try {
      setPublishing(true);

      setMessage("");

      setError("");

      const response = await unpublishPaymentProcedure();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to unpublish payment procedure.",
        );
      }

      setFormData((previous) => ({
        ...previous,

        isPublished: false,
      }));

      setMessage(
        response.message || "Payment procedure unpublished successfully.",
      );
    } catch (err) {
      console.error("Unpublish Payment Procedure Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish payment procedure.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="payment-procedure-admin-loading">
        <Spinner animation="border" />

        <p>Loading payment procedure...</p>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="payment-procedure-admin-page">
      <div className="payment-procedure-admin-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="payment-procedure-admin-header">
          <div>
            <span className="payment-procedure-admin-eyebrow">ADMISSIONS</span>

            <h1>Payment Procedure</h1>

            <p>Manage online payment details, bank information and QR code.</p>
          </div>

          <div
            className={
              formData.isPublished
                ? "payment-status published"
                : "payment-status unpublished"
            }
          >
            <span />

            {formData.isPublished ? "Published" : "Unpublished"}
          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSave}>
          {/* =================================================
              BANK INFORMATION
          ================================================= */}

          <Card className="payment-procedure-admin-card">
            <Card.Header>
              <div>
                <span>BANK INFORMATION</span>

                <h2>For Online Transaction</h2>
              </div>
            </Card.Header>

            <Card.Body>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name of Account Holder</Form.Label>

                    <Form.Control
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bank Name</Form.Label>

                    <Form.Control
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Bank Branch Address</Form.Label>

                    <Form.Control
                      type="text"
                      name="branchAddress"
                      value={formData.branchAddress}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bank A/C No.</Form.Label>

                    <Form.Control
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Type of Bank A/C</Form.Label>

                    <Form.Control
                      type="text"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>RTGS / IFSC Code</Form.Label>

                    <Form.Control
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>MICR Code</Form.Label>

                    <Form.Control
                      type="text"
                      name="micrCode"
                      value={formData.micrCode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Bank Branch Code</Form.Label>

                    <Form.Control
                      type="text"
                      name="branchCode"
                      value={formData.branchCode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* =================================================
              REMARKS
          ================================================= */}

          <Card className="payment-procedure-admin-card">
            <Card.Header>
              <div>
                <span>PAYMENT INSTRUCTIONS</span>

                <h2>Remarks</h2>
              </div>
            </Card.Header>

            <Card.Body>
              <Form.Group>
                <Form.Label>Remarks While Making Payment</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={6}
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />

                <Form.Text>
                  Students will see these instructions on the public page.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* =================================================
              ERP
          ================================================= */}

          <Card className="payment-procedure-admin-card">
            <Card.Header>
              <div>
                <span>ERP / PORTAL</span>

                <h2>Online Transaction</h2>
              </div>
            </Card.Header>

            <Card.Body>
              <Form.Group>
                <Form.Label>Online Transaction URL</Form.Label>

                <Form.Control
                  type="url"
                  name="erpOnlineTransactionUrl"
                  value={formData.erpOnlineTransactionUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />

                <Form.Text>
                  Students will use this link to upload their payment details
                  after making payment.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* =================================================
              QR CODE
          ================================================= */}

          <Card className="payment-procedure-admin-card">
            <Card.Header>
              <div>
                <span>PAYMENT QR CODE</span>

                <h2>Upload QR Code</h2>
              </div>
            </Card.Header>

            <Card.Body>
              <Row className="g-4 align-items-center">
                {/* =========================================
                    PREVIEW
                ========================================= */}

                <Col lg={5}>
                  <div className="payment-qr-upload-box">
                    {qrPreview ? (
                      <img
                        src={qrPreview}
                        alt="Payment QR Code"
                        className="payment-qr-preview"
                      />
                    ) : (
                      <div className="payment-qr-placeholder">
                        <span>QR</span>

                        <p>No QR code uploaded</p>
                      </div>
                    )}
                  </div>
                </Col>

                {/* =========================================
                    UPLOAD
                ========================================= */}

                <Col lg={7}>
                  <Form.Group>
                    <Form.Label>Select QR Code Image</Form.Label>

                    <Form.Control
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleQrFileChange}
                    />

                    <Form.Text>
                      Allowed formats: JPG, JPEG, PNG and WEBP. Maximum size: 5
                      MB.
                    </Form.Text>
                  </Form.Group>

                  {/* =======================================
                      SELECTED FILE
                  ======================================= */}

                  {qrFile && (
                    <div className="selected-qr-file">
                      <div>
                        <strong>New QR:</strong>

                        <span>{qrFile.name}</span>
                      </div>

                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={handleRemoveQr}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  {/* =======================================
                      CURRENT FILE
                  ======================================= */}

                  {!qrFile && formData.qrCodeOriginalName && (
                    <div className="current-qr-file">
                      Current QR file:
                      <strong> {formData.qrCodeOriginalName}</strong>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="payment-procedure-admin-actions">
            <Button
              type="submit"
              className="payment-save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>

            {formData.isPublished ? (
              <Button
                type="button"
                variant="outline-warning"
                disabled={publishing}
                onClick={handleUnpublish}
              >
                {publishing ? "Processing..." : "Unpublish"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline-success"
                disabled={publishing}
                onClick={handlePublish}
              >
                {publishing ? "Processing..." : "Publish"}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentProcedure;
