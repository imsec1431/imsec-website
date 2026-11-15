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
import "./fotter.css";

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
    <footer className="imsec-main-footer">
      <Container className="py-5">
        <Row className="gy-4">
          {/* =====================================================
              LOGO
          ===================================================== */}
          <Col
            lg={3}
            md={6}
            xs={12}
            className="d-flex align-items-center justify-content-center justify-content-lg-start"
          >
            <div className="footer-logo-card">
              <img
                src={footerlogo}
                alt="IMSEC"
                className="footer-logo-img"
              />
            </div>
          </Col>

          {/* =====================================================
              IMPORTANT LINKS
          ===================================================== */}
          <Col lg={3} md={6} xs={6} className="footer-col-mobile">
            <h5 className="footer-heading">Important</h5>

            <div className="footer-links-list">
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
                  title: "Career",
                  path: "/career",
                },
              ].map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className="footer-link-item"
                >
                  <span className="footer-link-arrow">➜</span>
                  <span className="footer-link-text">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </Col>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}
          <Col lg={3} md={6} xs={6} className="footer-col-mobile">
            <h5 className="footer-heading">Quick Links</h5>

            <div className="footer-links-list">
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
                  title: "Anti-Ragging Committee",
                  path: "/all-committees",
                },
                {
                  title: "Mandatory Disclosure",
                  path: "/mandatory-disclosure",
                },
                {
                  title: "Important Committees",
                  path: "/all-committees",
                },
              ].map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className="footer-link-item"
                >
                  <span className="footer-link-arrow">➜</span>
                  <span className="footer-link-text">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </Col>

          {/* =====================================================
              CONTACT US
          ===================================================== */}
          <Col lg={3} md={6} xs={12} className="footer-col-mobile">
            <h5 className="footer-heading">Contact Us</h5>

            <div className="footer-contact-list">
              <p className="footer-contact-item">
                <FaLocationDot className="footer-contact-icon" />
                <span>Ghaziabad, Uttar Pradesh</span>
              </p>

              <p className="footer-contact-item">
                <FaPhone className="footer-contact-icon" />
                <span>0120-4940000</span>
              </p>

              <p className="footer-contact-item">
                <FaEnvelope className="footer-contact-icon" />
                <span>imsec@imsec.ac.in</span>
              </p>

              <p className="footer-contact-item">
                <FaGlobe className="footer-contact-icon" />
                <span>www.imsec.ac.in</span>
              </p>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "rgba(255,255,255,.2)" }} className="my-4" />

        {/* =====================================================
            DYNAMIC SOCIAL ICONS
        ===================================================== */}
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-3">
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

        <hr style={{ borderColor: "rgba(255,255,255,.2)" }} className="my-3" />

        {/* =====================================================
            GROUP INSTITUTION
        ===================================================== */}
        <div className="d-flex justify-content-center px-2 mb-3 text-center">
          <p className="footer-group-text">
            <span>An IMS Group Institution</span>
            <span className="d-none d-sm-inline" style={{ opacity: 0.6 }}>|</span>
            <a
              href="https://www.imsgroup.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-group-link"
            >
              www.imsgroup.ac.in
            </a>
          </p>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,.2)" }} className="my-3" />

        {/* =====================================================
            BOTTOM COPYRIGHT
        ===================================================== */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start gap-2">
          <small>© 2026 IMS Engineering College. All Rights Reserved.</small>
          <small>Design & Development by Team-IT-IMSEC</small>
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
    className="footer-social-icon"
  >
    {icon}
  </a>
);

export default Footer;
