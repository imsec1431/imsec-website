import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword } from "../../services/authService";

import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    navigate("/imsec-control-center/forgot-password");
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await resetPassword({
        email,
        otp,
        password,
      });

      toast.success(data.message);

      navigate("/imsec-control-center/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <Container>
        <div className="reset-wrapper">
          <Card className="reset-card shadow">

            <Card.Body>

              <div className="text-center mb-4">

                <h2>Reset Password</h2>

                <p>Create your new password</p>

              </div>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">

                  <Form.Label>New Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter New Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Form.Group className="mb-4">

                  <Form.Label>Confirm Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Button
                  className="w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                      />{" "}
                      Updating...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

              </Form>

            </Card.Body>

          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ResetPassword;