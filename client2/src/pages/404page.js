import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHouse, FaCircleArrowLeft } from "react-icons/fa6";

import logo from "../components/images/imslogofottersmall.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
      .error-page {
        min-height: 75vh;
        background: linear-gradient(135deg, #111827, #1F2937);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #F9FAFB;
        padding: 20px;
      }

      .error-box {
        max-width: 700px;
        width: 100%;
      }

      .error-logo {
        width: 220px;
        margin-bottom: 25px;
        animation: float 3s ease-in-out infinite;
        max-width: 100%;
        height: auto;
      }

      .error404 {
        font-size: 120px;
        font-weight: 800;
        color: #EAB308;
        line-height: 1;
        text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      .title {
        font-size: 38px;
        font-weight: 700;
        margin-top: 15px;
        color: #FFFFFF;
      }

      .subtitle {
        color: #9CA3AF;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 35px;
      }

      .btn-custom {
        background: #EAB308 !important;
        color: #111827 !important;
        border: none !important;
        font-weight: 600;
        padding: 12px 30px;
        border-radius: 40px;
        transition: .35s;
      }

      .btn-custom:hover {
        background: #FFFFFF !important;
        color: #111827 !important;
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(234, 179, 8, 0.3);
      }

      .btn-outline-custom {
        border: 2px solid #EAB308 !important;
        color: #EAB308 !important;
        background: transparent !important;
        padding: 12px 30px;
        border-radius: 40px;
        font-weight: 600;
        transition: .35s;
      }

      .btn-outline-custom:hover {
        background: #EAB308 !important;
        color: #111827 !important;
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(234, 179, 8, 0.2);
      }

      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0px); }
      }

      @media(max-width: 768px) {
        .error404 {
          font-size: 80px;
        }
        .title {
          font-size: 26px;
        }
        .subtitle {
          font-size: 15px;
          margin-bottom: 25px;
        }
        .error-logo {
          width: 160px;
        }
      }
      `}</style>

      <div className="error-page">
        <Container>
          <div className="error-box mx-auto">
            <img src={logo} alt="IMSEC" className="error-logo" />

            <div className="error404">404</div>

            <h1 className="title">Oops! Page Not Found</h1>

            <p className="subtitle">
              The page you are looking for might have been removed, renamed or
              is temporarily unavailable.
            </p>

            {/* Responsive button container */}
            <div className="d-grid d-md-flex gap-3 justify-content-center">
              <Button className="btn-custom" onClick={() => navigate("/")}>
                <FaHouse className="me-2" />
                Back to Home
              </Button>

              <Button
                className="btn-outline-custom"
                onClick={() => navigate(-1)}
              >
                <FaCircleArrowLeft className="me-2" />
                Go Back
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default NotFound;
