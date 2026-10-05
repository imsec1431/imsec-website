import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaLock, FaShieldAlt } from "react-icons/fa";

const AccessDenied = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const message =
    location.state?.message ||
    "You do not have permission to access this page.";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        background: "linear-gradient(135deg, #f5f7fb 0%, #eef2f7 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "55px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
        }}
      >
        {/* Icon */}

        <div
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 25px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff1f2",
            color: "#dc2626",
            fontSize: "38px",
          }}
        >
          <FaLock />
        </div>

        {/* Security Icon */}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "15px",
            padding: "7px 14px",
            borderRadius: "30px",
            background: "#f1f5f9",
            color: "#475569",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          <FaShieldAlt />
          ACCESS RESTRICTED
        </div>

        {/* Heading */}

        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "36px",
            fontWeight: "800",
            color: "#111827",
          }}
        >
          Access Denied
        </h1>

        {/* Message */}

        <p
          style={{
            margin: "0 auto",
            maxWidth: "500px",
            fontSize: "16px",
            lineHeight: "1.7",
            color: "#64748b",
          }}
        >
          {message}
        </p>

        {/* Sub Admin message */}

        <div
          style={{
            marginTop: "25px",
            padding: "15px 18px",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          Your Sub Admin account can access only the modules and sub-modules
          assigned by the administrator.
        </div>

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              padding: "12px 22px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaArrowLeft />
            Go Back
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/imsec-control-center/dashboard", {
                replace: true,
              })
            }
            style={{
              border: "none",
              background: "#111827",
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaHome />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
