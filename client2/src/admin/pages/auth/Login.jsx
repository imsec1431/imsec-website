import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRight, FaLock, FaShieldAlt, FaUser } from "react-icons/fa";

import { loginAdmin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import imsecLogo from "./imseclogo.jpg";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await loginAdmin(formData);

      /*
      |--------------------------------------------------------------------------
      | SUB ADMIN
      |--------------------------------------------------------------------------
      | Sub Admin does NOT require OTP.
      | Login directly using the returned JWT.
      |--------------------------------------------------------------------------
      */

      if (data.success && data.requiresOtp === false && data.token) {
        login(data.token, data.admin);

        toast.success(data.message || "Login successful.");

        navigate("/imsec-control-center/dashboard", {
          replace: true,
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | NORMAL ADMIN
      |--------------------------------------------------------------------------
      | Existing OTP login flow remains unchanged.
      |--------------------------------------------------------------------------
      */

      if (data.success && data.requiresOtp !== false) {
        toast.success(data.message || "OTP sent successfully.");

        navigate("/imsec-control-center/verify-login-otp", {
          state: {
            email: data.email,
          },
        });

        return;
      }

      toast.error(data.message || "Unable to login.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Decorative background */}
      <div className="login-bg-shape login-bg-shape-one"></div>
      <div className="login-bg-shape login-bg-shape-two"></div>
      <div className="login-bg-grid"></div>

      <div className="login-container">
        {/* =========================================
            LEFT PREMIUM BRAND PANEL
        ========================================== */}

        <div className="login-brand-panel">
          <div className="brand-content">
            <div className="brand-logo-wrapper">
              <img src={imsecLogo} alt="IMSEC Logo" className="login-logo" />
            </div>

            <div className="brand-small-title">
              INSTITUTE OF MANAGEMENT STUDIES
            </div>

            <h1>
              IMSEC
              <span> CMS</span>
            </h1>

            <div className="brand-line"></div>

            <h3>
              Content Management
              <br />
              System
            </h3>

            <p>
              A secure digital platform for managing institutional content,
              announcements, academics and administration.
            </p>

            <div className="security-badge">
              <FaShieldAlt />
            </div>
          </div>

          <div className="brand-footer">
            © {new Date().getFullYear()} IMSEC Ghaziabad
          </div>
        </div>

        {/* =========================================
            RIGHT LOGIN PANEL
        ========================================== */}

        <div className="login-form-panel">
          <div className="login-form-content">
            <div className="mobile-logo">
              <img src="/images/imsec-logo.png" alt="IMSEC Logo" />
            </div>

            <div className="login-heading">
              <span className="welcome-text">WELCOME BACK</span>

              <h2>
                Administrator
                <br />
                <strong>Sign In</strong>
              </h2>

              <p>Sign in to access the IMSEC Content Management System.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Email */}

              <Form.Group className="login-field">
                <Form.Label>Email Address</Form.Label>

                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaUser />
                  </span>

                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </Form.Group>

              {/* Password */}

              <Form.Group className="login-field password-field">
                <Form.Label>Password</Form.Label>

                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaLock />
                  </span>

                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
              </Form.Group>

              {/* Forgot Password */}

              <div className="login-options">
                <span
                  className="forgot-link"
                  onClick={() =>
                    navigate("/imsec-control-center/forgot-password")
                  }
                >
                  Forgot Password?
                </span>
              </div>

              {/* Login Button */}

              <Button
                type="submit"
                className="premium-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Please Wait...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight />
                  </>
                )}
              </Button>
            </Form>

            {/* Security Note */}

            <div className="login-security-note">
              <FaLock />

              <span>Your login is protected by secure authentication.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
