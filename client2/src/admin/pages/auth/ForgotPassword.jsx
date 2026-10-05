import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../../services/authService";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await forgotPassword({
        email,
      });

      toast.success(data.message);

      navigate("/imsec-control-center/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <Container>
        <div className="forgot-wrapper">

          <Card className="forgot-card shadow">

            <Card.Body>

              <div className="text-center mb-4">

                <h2>Forgot Password</h2>

                <p>
                  Enter your registered email address.
                </p>

              </div>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-4">

                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                      />{" "}
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>

              </Form>

              <div className="text-center mt-4">

                <Button
                  variant="link"
                  onClick={() =>
                    navigate("/imsec-control-center/login")
                  }
                >
                  Back to Login
                </Button>

              </div>

            </Card.Body>

          </Card>

        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;