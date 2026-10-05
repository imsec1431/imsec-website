import React, { useEffect, useState } from "react";

import { Alert, Button, Spinner } from "react-bootstrap";

import { getPublicPaymentProcedure } from "../../services/paymentProcedureService.js";

import "./PaymentProcedure.css";

const PaymentProcedure = () => {
  const [paymentProcedure, setPaymentProcedure] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadPaymentProcedure = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicPaymentProcedure();

      // console.log("Public Payment Procedure:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load payment procedure.",
        );
      }

      setPaymentProcedure(response?.data || null);
    } catch (err) {
      console.error("Payment Procedure Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment procedure.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadPaymentProcedure();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="payment-procedure-public-loading">
        <Spinner animation="border" />

        <p>Loading payment procedure...</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="payment-procedure-public-page">
        <div className="payment-procedure-public-container">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT AVAILABLE
  ========================================================= */

  if (!paymentProcedure) {
    return (
      <div className="payment-procedure-public-page">
        <div className="payment-procedure-public-container">
          <div className="payment-procedure-public-empty">
            <div className="payment-empty-icon">₹</div>

            <h1>Payment Procedure</h1>

            <p>Payment procedure information is currently not available.</p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERP URL
  ========================================================= */

  const erpUrl = paymentProcedure.erpOnlineTransactionUrl;

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="payment-procedure-public-page">
      <div className="payment-procedure-public-container">
        {/* ===================================================
            BREADCRUMB
        =================================================== */}

        <div className="payment-procedure-public-breadcrumb">
          <span>Admissions</span>

          <span>/</span>

          <strong>Payment Procedure</strong>
        </div>

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="payment-procedure-public-hero">
          <span className="payment-public-eyebrow">ADMISSIONS</span>

          <h1>Payment Procedure</h1>

          <p>
            Follow the payment instructions below for making your academic or
            hostel fee payment.
          </p>
        </section>

        {/* ===================================================
            ONLINE TRANSACTION
        =================================================== */}

        <section className="payment-online-section">
          <div className="payment-online-content">
            <span className="payment-section-label">
              FOR ONLINE TRANSACTION
            </span>

            <h2>Online Fee Payment</h2>

            <p>
              After completing your online transaction, kindly upload your
              payment details on the ERP / Portal using the Online Transaction
              option.
            </p>

            {erpUrl && (
              <Button
                type="button"
                className="payment-erp-button"
                onClick={() =>
                  window.open(erpUrl, "_blank", "noopener,noreferrer")
                }
              >
                Online Transaction
              </Button>
            )}
          </div>

          {/* =================================================
              QR CODE
          ================================================= */}

          <div className="payment-public-qr">
            <span className="payment-qr-label">SCAN & PAY</span>

            {paymentProcedure.qrCodeUrl ? (
              <img
                src={paymentProcedure.qrCodeUrl}
                alt="Payment QR Code"
                className="payment-public-qr-image"
              />
            ) : (
              <div className="payment-public-qr-empty">
                <span>QR</span>

                <p>QR Code not available</p>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            BANK DETAILS
        =================================================== */}

        <section className="payment-bank-section">
          <div className="payment-section-heading">
            <span>BANK INFORMATION</span>

            <h2>Payment Account Details</h2>
          </div>

          <div className="payment-bank-table-wrapper">
            <table className="payment-bank-table">
              <tbody>
                <tr>
                  <th>1</th>

                  <td>Name of Account Holder</td>

                  <td>{paymentProcedure.accountHolderName}</td>
                </tr>

                <tr>
                  <th>2</th>

                  <td>Bank Name</td>

                  <td>{paymentProcedure.bankName}</td>
                </tr>

                <tr>
                  <th>3</th>

                  <td>Bank Branch Address</td>

                  <td>{paymentProcedure.branchAddress}</td>
                </tr>

                <tr>
                  <th>4</th>

                  <td>Bank A/C No.</td>

                  <td className="payment-account-number">
                    {paymentProcedure.bankAccountNumber}
                  </td>
                </tr>

                <tr>
                  <th>5</th>

                  <td>Type of Bank A/c</td>

                  <td>{paymentProcedure.accountType}</td>
                </tr>

                <tr>
                  <th>6</th>

                  <td>RTGS / IFSC Code</td>

                  <td className="payment-code">{paymentProcedure.ifscCode}</td>
                </tr>

                <tr>
                  <th>7</th>

                  <td>MICR Code</td>

                  <td className="payment-code">{paymentProcedure.micrCode}</td>
                </tr>

                <tr>
                  <th>8</th>

                  <td>Bank Branch Code</td>

                  <td className="payment-code">
                    {paymentProcedure.branchCode}
                  </td>
                </tr>

                <tr>
                  <th>9</th>

                  <td>Remarks</td>

                  <td className="payment-remarks">
                    {paymentProcedure.remarks
                      ?.split("\n")
                      .map((line, index) => (
                        <React.Fragment key={index}>
                          {line}

                          {index <
                            paymentProcedure.remarks.split("\n").length - 1 && (
                            <br />
                          )}
                        </React.Fragment>
                      ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================================================
            AFTER PAYMENT
        =================================================== */}

        <section className="payment-after-section">
          <div className="payment-after-icon">✓</div>

          <div>
            <span>AFTER ONLINE TRANSACTION</span>

            <h2>Upload Your Payment Details</h2>

            <p>
              After completing the online transaction, kindly upload your
              payment details on your ERP / Portal using the
              <strong> Online Transaction </strong>
              option.
            </p>

            {erpUrl && (
              <Button
                type="button"
                className="payment-after-button"
                onClick={() =>
                  window.open(erpUrl, "_blank", "noopener,noreferrer")
                }
              >
                Go to Online Transaction
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentProcedure;
