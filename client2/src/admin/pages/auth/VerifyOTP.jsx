import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyOTP, forgotPassword } from "../../services/authService";

import {
  FaArrowRight,
  FaCheck,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import "./VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!email) {
    navigate("/imsec-control-center/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await verifyOTP({
        email,
        otp,
      });

      toast.success(data.message);

      navigate("/imsec-control-center/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      const { data } = await forgotPassword({
        email,
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  return (
    <div className="verify-otp-page">
      {/* Background */}
      <div className="otp-orb otp-orb-1"></div>
      <div className="otp-orb otp-orb-2"></div>
      <div className="otp-orb otp-orb-3"></div>

      <div className="otp-grid"></div>

      {/* Main Card */}
      <div className="otp-premium-card">
        {/* =================================================
            LEFT VISUAL SECTION
        ================================================= */}
        <div className="otp-visual">
          <div className="visual-content">
            {/* Logo */}
            <div className="visual-logo">
              <img src="/images/imsec-logo.png" alt="IMSEC Logo" />
            </div>

            <div className="visual-label">IMSEC • ADMINISTRATION</div>

            <h1>
              Secure
              <br />
              <span>Access.</span>
            </h1>

            <p>
              Your security is our priority. Complete the verification process
              to securely access the IMSEC Content Management System.
            </p>

            {/* Verification Illustration */}
            <div className="verification-visual">
              <div className="verification-ring ring-one"></div>
              <div className="verification-ring ring-two"></div>

              <div className="verification-lock">
                <FaLock />
              </div>

              <div className="verification-check">
                <FaCheck />
              </div>
            </div>

            {/* Steps */}
            <div className="verification-steps">
              <div className="step completed">
                <div className="step-number">
                  <FaCheck />
                </div>

                <div>
                  <strong>Credentials</strong>

                  <span>Account identified</span>
                </div>
              </div>

              <div className="step active">
                <div className="step-number">2</div>

                <div>
                  <strong>Verify OTP</strong>

                  <span>Confirm your identity</span>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>

                <div>
                  <strong>Reset Password</strong>

                  <span>Create new password</span>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <span>
              <FaShieldAlt />
              Secure authentication
            </span>

            <span>© {new Date().getFullYear()} IMSEC</span>
          </div>
        </div>

        {/* =================================================
            RIGHT FORM SECTION
        ================================================= */}
        <div className="otp-form-section">
          <div className="otp-form-inner">
            {/* Mobile Logo */}
            <div className="otp-mobile-logo">
              <img src="/images/imsec-logo.png" alt="IMSEC Logo" />
            </div>

            {/* Top icon */}
            <div className="otp-top-icon">
              <FaShieldAlt />
            </div>

            {/* Heading */}
            <div className="otp-title">
              <div className="otp-overline">ACCOUNT VERIFICATION</div>

              <h2>
                Verify your
                <br />
                <span>identity</span>
              </h2>

              <p>
                We've sent a verification code to your registered email address.
              </p>
            </div>

            {/* Email */}
            <div className="otp-email-card">
              <div className="email-icon">
                <FaEnvelope />
              </div>

              <div className="email-details">
                <span>VERIFICATION CODE SENT TO</span>

                <strong>{email}</strong>
              </div>

              <div className="email-status">
                <FaCheck />
              </div>
            </div>

            {/* OTP Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="otp-input-group">
                <div className="otp-label-row">
                  <Form.Label>Enter verification code</Form.Label>

                  <span>6 digits</span>
                </div>

                <Form.Control
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="••••••"
                  className="premium-otp-input"
                  autoFocus
                />

                {/* Progress dots */}
                <div className="otp-progress">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <span
                      key={index}
                      className={index < otp.length ? "filled" : ""}
                    ></span>
                  ))}
                </div>
              </Form.Group>

              {/* Verify button */}
              <Button
                type="submit"
                className="premium-verify-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />

                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>

                    <FaArrowRight />
                  </>
                )}
              </Button>
            </Form>

            {/* Resend */}
            <div className="resend-area">
              <span>Didn't receive the code?</span>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            {/* Security message */}
            <div className="secure-message">
              <div className="secure-icon">
                <FaLock />
              </div>

              <div>
                <strong>Keep your code private</strong>

                <span>
                  IMSEC administrators will never ask you to share your OTP.
                </span>
              </div>
            </div>

            {/* Bottom branding */}
            <div className="form-bottom">
              <span>IMSEC Content Management System</span>

              <div className="bottom-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
