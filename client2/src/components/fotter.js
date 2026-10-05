import footerlogo from "./images/imseclogo.png";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa6";
import axios from "axios";

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // =========================================================
  // FETCH SOCIAL MEDIA LINKS
  // =========================================================

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/social-media`);

        setSocialMedia(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch social media links:", error);

        setSocialMedia([]);
      }
    };

    fetchSocialMedia();
  }, [API_BASE_URL]);

  // =========================================================
  // GET SOCIAL MEDIA ICON
  // =========================================================

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "facebook":
        return <FaFacebookF />;

      case "linkedin":
        return <FaLinkedinIn />;

      case "instagram":
        return <FaInstagram />;

      case "x":
      case "twitter":
        return <FaXTwitter />;

      case "youtube":
        return <FaYoutube />;

      default:
        return null;
    }
  };

  return (
    <footer
      style={{
        background: "#0A2E5C",
        color: "#fff",
        height: "auto",
        transform: "translateY(180px)",
      }}
    >
      <Container className="py-5">
        <Row>
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Col
            lg={3}
            md={6}
            xs={12}
            className="mb-4 text-center text-lg-start"
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <img
              src={footerlogo}
              alt="IMSEC"
              style={{
                width: "100%",
                maxWidth: "250px",
                marginBottom: "15px",
                filter:
                  "brightness(0) saturate(100%) invert(19%) sepia(35%) saturate(1700%) hue-rotate(175deg) brightness(85%) contrast(105%)",
              }}
            />
          </Col>

          {/* =====================================================
              IMPORTANT LINKS
          ===================================================== */}

          <Col lg={3} md={6} xs={6} className="mb-4 text-center text-lg-start">
            <h5
              className="mb-3"
              style={{
                color: "#FDB913",
                fontWeight: "700",
                borderBottom: "2px solid #FDB913",
                display: "inline-block",
                paddingBottom: "6px",
              }}
            >
              Important
            </h5>

            {[
              {
                title: "Accreditations",
                path: "/accreditations/accreditations",
              },
              {
                title: "Rankings, Ratings and Awards",
                path: "/accreditations/recognition",
              },
              {
                title: "Student Grievance",
                path: "/Grievance/StudentGrievance",
              },
              {
                title: "Employee Grievance",
                path: "/Grievance/EmployeeGrievance",
              },
              {
                title: "Internal Complaint Committee",
                path: "/Grievance/InternalGrievanceCommittee",
              },
              {
                title: "CAREERS",
                path: "/career",
              },
            ].map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FDB913";
                  e.currentTarget.style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span style={{ marginRight: "8px" }}>➜</span>

                {item.title}
              </NavLink>
            ))}
          </Col>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <Col lg={3} md={6} xs={6} className="mb-4 text-center text-lg-start">
            <h5
              className="mb-3"
              style={{
                color: "#FDB913",
                fontWeight: "700",
                borderBottom: "2px solid #FDB913",
                display: "inline-block",
                paddingBottom: "6px",
              }}
            >
              Quick Links
            </h5>

            {[
              {
                title: "NIRF",
                path: "/iqac/nirf",
              },
              {
                title: "NBA",
                path: "/iqac/nba",
              },
              {
                title: "NAAC",
                path: "/iqac/naac",
              },
              {
                title: "Anti Ragging Committee",
                path: "/all-committees",
              },
              {
                title: "Mandatory Disclosure",
                path: "/mandatory-disclosure",
              },
              {
                title: "All Committees",
                path: "/all-committees",
              },
            ].map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FDB913";
                  e.currentTarget.style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span style={{ marginRight: "8px" }}>➜</span>

                {item.title}
              </NavLink>
            ))}
          </Col>

          {/* =====================================================
              CONTACT
          ===================================================== */}

          <Col lg={3} md={6} xs={12}>
            <h5
              className="mb-3"
              style={{
                color: "#FDB913",
                fontWeight: "700",
              }}
            >
              Contact Us
            </h5>

            <p style={{ color: "white" }}>
              <FaLocationDot className="me-2" />
              Ghaziabad, Uttar Pradesh
            </p>

            <p style={{ color: "white" }}>
              <FaPhone className="me-2" />
              0120-4940000
            </p>

            <p style={{ color: "white" }}>
              <FaEnvelope className="me-2" />
              imsec@imsec.ac.in
            </p>

            <p style={{ color: "white" }}>
              <FaGlobe className="me-2" />
              www.imsec.ac.in
            </p>
          </Col>
        </Row>

        <hr
          style={{
            borderColor: "rgba(255,255,255,.2)",
          }}
        />

        {/* =====================================================
            DYNAMIC SOCIAL ICONS
        ===================================================== */}

        <div className="d-flex justify-content-center gap-3 mb-3">
          {socialMedia.map((item) => {
            const icon = getSocialIcon(item.platform);

            if (!icon || !item.url) {
              return null;
            }

            return (
              <SocialIcon
                key={item._id || item.id || item.platform}
                href={item.url}
                icon={icon}
              />
            );
          })}
        </div>
        <hr
          style={{
            borderColor: "rgba(255,255,255,.2)",
          }}
        />
        <div className="d-flex justify-content-center gap-3 mb-3">
          <p
            style={{
              color: "#ffffff",
              fontSize: "14px",
              marginBottom: "12px",
              whiteSpace: "nowrap",
            }}
          >
            An IMS Group Institution&nbsp;&nbsp;|&nbsp;&nbsp;
            <a
              href="https://www.imsgroup.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#FDB913",
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#FDB913";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              www.imsgroup.ac.in
            </a>
          </p>
        </div>
        <hr
          style={{
            borderColor: "rgba(255,255,255,.2)",
          }}
        />

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
          <small>© 2026 IMS Engineering College. All Rights Reserved.</small>

          <div className="d-flex gap-3 mt-2 mt-lg-0">
            <small>Design & Development by Team-IT-IMSEC</small>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// =============================================================
// SOCIAL ICON COMPONENT
// =============================================================

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Social media"
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "#123F7A",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      transition: "0.3s",
      fontSize: "18px",
      textDecoration: "none",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#FDB913";
      e.currentTarget.style.color = "#0A2E5C";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#123F7A";
      e.currentTarget.style.color = "#fff";
    }}
  >
    {icon}
  </a>
);

export default Footer;
