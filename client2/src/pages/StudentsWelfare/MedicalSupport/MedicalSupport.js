import React, { useEffect, useState } from "react";
import {
  FaHeartbeat,
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaHospital,
  FaShieldAlt,
} from "react-icons/fa";

import medicalSupportService from "../../../services/medicalSupportService";
import "./medicalSupport.css";

const DEFAULT_DATA = {
  title: "Medical Support",
  heading: "Student Medical Support",
  description:
    "The institute provides medical support and basic healthcare facilities to students and staff to promote their health, safety and overall well-being.",
  supportPersonName: "Campus Health Support Team",
  designation: "Medical Support Services",
  email: "medicalsupport@imsec.ac.in",
  phone: "+91-120-4081999",
  medicalFacility:
    "The institute provides basic medical assistance, first-aid facilities and necessary health support on campus. Students and staff can contact the designated support team whenever medical assistance is required.",
  published: true,
};

const MedicalSupport = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalSupport = async () => {
      try {
        const response = await medicalSupportService.getMedicalSupport();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData) {
          setData({
            ...DEFAULT_DATA,
            ...pageData,
          });
        }
      } catch (error) {
        console.error("Medical Support Page Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalSupport();
  }, []);

  if (loading) {
    return (
      <div className="medical-support-loading">Loading Medical Support...</div>
    );
  }

  return (
    <div className="medical-support-page">
      {/* Hero */}
      <section className="medical-support-hero">
        <div className="container">
          <div className="medical-support-breadcrumb">
            Home / Student Welfare / Medical Support
          </div>

          <div className="medical-support-hero-content">
            <div className="medical-support-hero-icon">
              <FaHeartbeat />
            </div>

            <h1>{data.title}</h1>

            <p>
              Supporting the health, safety and well-being of our students and
              staff.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="medical-support-section">
        <div className="container">
          <div className="medical-support-intro">
            <span className="medical-support-label">HEALTH & WELL-BEING</span>

            <h2>{data.heading}</h2>

            <div className="medical-support-line"></div>

            <p>{data.description}</p>
          </div>

          {/* Support Person */}
          <div className="medical-support-contact-card">
            <div className="medical-support-contact-icon">
              <FaUserMd />
            </div>

            <div className="medical-support-contact-content">
              <span className="medical-support-card-label">
                MEDICAL SUPPORT CONTACT
              </span>

              <h3>{data.supportPersonName}</h3>

              <p className="medical-support-designation">{data.designation}</p>

              <div className="medical-support-contact-details">
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="medical-support-contact-item"
                  >
                    <FaEnvelope />
                    <span>{data.email}</span>
                  </a>
                )}

                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="medical-support-contact-item"
                  >
                    <FaPhone />
                    <span>{data.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Facility */}
          <div className="medical-support-facility">
            <div className="medical-support-facility-icon">
              <FaHospital />
            </div>

            <div>
              <h3>Medical Facilities & Support</h3>

              <p>{data.medicalFacility}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="medical-support-info-grid">
            <div className="medical-support-info-card">
              <div className="medical-support-info-icon">
                <FaHeartbeat />
              </div>

              <h3>Health Support</h3>

              <p>
                Students and staff can seek appropriate medical assistance
                whenever required.
              </p>
            </div>

            <div className="medical-support-info-card">
              <div className="medical-support-info-icon">
                <FaShieldAlt />
              </div>

              <h3>Student Well-being</h3>

              <p>
                The institute promotes a safe and healthy campus environment for
                everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalSupport;
