import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyLoginOTP, resendLoginOTP } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";
import imsecLogo from "./imseclogo.jpg";

import {
  FaArrowRight,
  FaCheck,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import "./VerifyLoginOTP.css";

const VerifyLoginOTP = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /*
   * ==========================================================
   * OTP TIMER
   *
   * OTP is valid for 3 minutes.
   * ==========================================================
   */

  const [timeLeft, setTimeLeft] = useState(180);

  /*
   * ==========================================================
   * OTP ATTEMPTS
   *
   * Maximum = 10
   * ==========================================================
   */

  const [remainingAttempts, setRemainingAttempts] = useState(10);

  /*
   * ==========================================================
   * OTP LOCK
   *
   * Becomes true when backend says 10 attempts exceeded.
   * ==========================================================
   */

  const [otpBlocked, setOtpBlocked] = useState(false);

  /*
   * ==========================================================
   * RESEND COOLDOWN
   *
   * Backend allows another OTP request after 60 seconds.
   * ==========================================================
   */

  const [resendCooldown, setResendCooldown] = useState(0);

  /*
   * ==========================================================
   * REDIRECT IF EMAIL IS MISSING
   * ==========================================================
   */

  useEffect(() => {
    if (!email) {
      navigate("/imsec-control-center/login", {
        replace: true,
      });
    }
  }, [email, navigate]);

  /*
   * ==========================================================
   * OTP COUNTDOWN TIMER
   * ==========================================================
   */

  useEffect(() => {
    if (!email || otpBlocked || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, otpBlocked, timeLeft]);

  /*
   * ==========================================================
   * RESEND COUNTDOWN
   * ==========================================================
   */

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  /*
   * ==========================================================
   * FORMAT TIME
   * ==========================================================
   */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  /*
   * ==========================================================
   * VERIFY OTP
   * ==========================================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpBlocked) {
      toast.error("Maximum OTP attempts exceeded. Please request a new OTP.");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new OTP.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await verifyLoginOTP({
        email,
        otp,
      });

      /*
       * ======================================================
       * SUCCESS
       * ======================================================
       */

      login(data.token, data.admin);

      toast.success(data.message || "Login successful.");

      navigate("/imsec-control-center/dashboard", {
        replace: true,
      });
    } catch (error) {
      const responseData = error.response?.data;

      /*
       * ======================================================
       * REMAINING ATTEMPTS
       *
       * Backend returns:
       *
       * remainingAttempts: 9
       * remainingAttempts: 8
       * ...
       * remainingAttempts: 0
       * ======================================================
       */

      if (typeof responseData?.remainingAttempts === "number") {
        setRemainingAttempts(responseData.remainingAttempts);
      }

      /*
       * ======================================================
       * 10 ATTEMPTS EXCEEDED
       * ======================================================
       */

      if (
        responseData?.remainingAttempts === 0 ||
        error.response?.status === 429
      ) {
        setOtpBlocked(true);
        setOtp("");
        setRemainingAttempts(0);

        toast.error(
          responseData?.message ||
            "Maximum 10 OTP attempts exceeded. Please request a new OTP.",
        );

        return;
      }

      /*
       * ======================================================
       * NORMAL INVALID OTP
       * ======================================================
       */

      toast.error(responseData?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * RESEND OTP
   * ==========================================================
   */

  const handleResendOTP = async () => {
    if (resendCooldown > 0) {
      toast.info(
        `Please wait ${resendCooldown} second(s) before requesting another OTP.`,
      );
      return;
    }

    try {
      setResendLoading(true);

      const { data } = await resendLoginOTP({
        email,
      });

      /*
       * ======================================================
       * NEW OTP
       *
       * Reset frontend state.
       * ======================================================
       */

      setOtp("");
      setTimeLeft(180);
      setRemainingAttempts(10);
      setOtpBlocked(false);

      /*
       * Backend cooldown = 60 seconds.
       */

      setResendCooldown(60);

      toast.success(data.message || "OTP resent successfully.");
    } catch (error) {
      const responseData = error.response?.data;

      /*
       * ======================================================
       * RATE LIMIT RESPONSE
       *
       * Backend returns retryAfter in seconds.
       * ======================================================
       */

      if (typeof responseData?.retryAfter === "number") {
        setResendCooldown(responseData.retryAfter);
      }

      toast.error(responseData?.message || "Unable to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  /*
   * ==========================================================
   * OTP INPUT
   *
   * Only numbers
   * Maximum 6 digits
   * ==========================================================
   */

  const handleOtpChange = (e) => {
    if (otpBlocked) {
      return;
    }

    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  /*
   * ==========================================================
   * DO NOT RENDER IF EMAIL IS MISSING
   * ==========================================================
   */

  if (!email) {
    return null;
  }

  return (
    <div className="login-otp-page">
      {/* Background graphics */}

      <div className="login-otp-orb login-otp-orb-1"></div>

      <div className="login-otp-orb login-otp-orb-2"></div>

      <div className="login-otp-orb login-otp-orb-3"></div>

      <div className="login-otp-grid"></div>

      {/* =========================================
          MAIN CARD
      ========================================== */}

      <div className="login-otp-card">
        {/* =========================================
            LEFT BRAND PANEL
        ========================================== */}

        <div className="login-otp-brand">
          <div className="login-otp-brand-content">
            {/* Logo */}

            <div className="login-otp-logo">
              <img src={imsecLogo} alt="IMSEC Logo" />
            </div>

            <div className="login-otp-brand-label">IMSEC • ADMINISTRATION</div>

            <h1>
              Welcome
              <br />
              <span>Back.</span>
            </h1>

            <p>
              Complete one final security check to access your IMSEC Content
              Management System.
            </p>

            {/* Login verification graphic */}

            <div className="login-security-visual">
              <div className="login-ring ring-a"></div>

              <div className="login-ring ring-b"></div>

              <div className="login-ring ring-c"></div>

              <div className="login-shield">
                <FaShieldAlt />
              </div>

              <div className="login-check">
                <FaCheck />
              </div>
            </div>

            {/* Security points */}

            <div className="login-security-points">
              <div>
                <FaCheck />

                <span>Secure login verification</span>
              </div>

              <div>
                <FaCheck />

                <span>Protected administrator access</span>
              </div>

              <div>
                <FaCheck />

                <span>One-time authentication code</span>
              </div>
            </div>
          </div>

          <div className="login-otp-brand-footer">
            <span>
              <FaLock />
              Secure authentication
            </span>

            <span>© {new Date().getFullYear()} IMSEC</span>
          </div>
        </div>

        {/* =========================================
            RIGHT OTP PANEL
        ========================================== */}

        <div className="login-otp-form">
          <div className="login-otp-form-inner">
            {/* Mobile logo */}

            <div className="login-otp-mobile-logo">
              <img src="/images/imsec-logo.png" alt="IMSEC Logo" />
            </div>

            {/* Top icon */}

            <div className="login-otp-top-icon">
              <FaLock />
            </div>

            {/* Heading */}

            <div className="login-otp-heading">
              <div className="login-otp-overline">SECURE LOGIN</div>

              <h2>
                Verify your
                <br />
                <span>login</span>
              </h2>

              <p>
                A one-time verification code has been sent to your registered
                email.
              </p>
            </div>

            {/* Email card */}

            <div className="login-email-card">
              <div className="login-email-icon">
                <FaEnvelope />
              </div>

              <div className="login-email-info">
                <span>VERIFICATION CODE SENT TO</span>

                <strong>{email}</strong>
              </div>

              <div className="login-email-check">
                <FaCheck />
              </div>
            </div>

            {/* ======================================
                OTP SECURITY STATUS
            ======================================= */}

            <div
              className="login-otp-security-status"
              style={{
                marginBottom: "18px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: otpBlocked
                  ? "rgba(220, 53, 69, 0.10)"
                  : "rgba(25, 135, 84, 0.08)",
                border: `1px solid ${
                  otpBlocked
                    ? "rgba(220, 53, 69, 0.25)"
                    : "rgba(25, 135, 84, 0.20)"
                }`,
                fontSize: "13px",
              }}
            >
              {otpBlocked ? (
                <strong>OTP blocked. Please request a new OTP.</strong>
              ) : timeLeft <= 0 ? (
                <strong>OTP expired. Please request a new OTP.</strong>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    OTP expires in <strong>{formatTime(timeLeft)}</strong>
                  </span>

                  <span>
                    Attempts remaining: <strong>{remainingAttempts}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Form */}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="login-otp-field">
                <div className="login-otp-label-row">
                  <Form.Label>Enter Login OTP</Form.Label>

                  <span>6 digits</span>
                </div>

                <Form.Control
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={handleOtpChange}
                  className="login-otp-input"
                  autoFocus
                  disabled={loading || otpBlocked || timeLeft <= 0}
                />

                {/* Progress */}

                <div className="login-otp-progress">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <span
                      key={index}
                      className={index < otp.length ? "active" : ""}
                    ></span>
                  ))}
                </div>
              </Form.Group>

              {/* Verify button */}

              <Button
                type="submit"
                className="login-otp-button"
                disabled={
                  loading || otpBlocked || timeLeft <= 0 || otp.length !== 6
                }
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />

                    <span>Verifying Login...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Sign In</span>

                    <FaArrowRight />
                  </>
                )}
              </Button>
            </Form>

            {/* Resend */}

            <div className="login-resend">
              <span>Didn't receive the code?</span>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
              </button>
            </div>

            {/* Security information */}

            <div className="login-secure-box">
              <div className="login-secure-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected Login</strong>

                <span>
                  This verification helps protect your administrator account
                  from unauthorized access.
                </span>
              </div>
            </div>

            {/* Bottom */}

            <div className="login-form-footer">
              <span>IMSEC Content Management System</span>

              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyLoginOTP;
