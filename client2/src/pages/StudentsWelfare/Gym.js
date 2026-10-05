import React, { useEffect, useState } from "react";
import {
  FaDumbbell,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHeartbeat,
} from "react-icons/fa";

import gymService from "../../services/gymService";
import "./gym.css";

const DEFAULT_DATA = {
  title: "Gym",
  heading: "Gym & Fitness Centre",
  description:
    "The institute provides a well-equipped gym and fitness facility to encourage students and staff to maintain a healthy and active lifestyle.",
  facilityDescription:
    "The gym provides a suitable environment for regular exercise, fitness activities and physical well-being. Students can make use of the available fitness equipment and facilities during the designated timings.",
  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",
  location: "Institute Campus",
  contactPerson: "Gym & Fitness Centre Coordinator",
  contactEmail: "gym@imsec.ac.in",
  contactPhone: "+91-120-4081999",
  photo1:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  photo2:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85",
  published: true,
};

const Gym = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await gymService.getGym();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData) {
          setData({
            ...DEFAULT_DATA,
            ...pageData,
          });
        }
      } catch (error) {
        console.error("Gym Page Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGym();
  }, []);

  if (loading) {
    return <div className="gym-loading">Loading Gym...</div>;
  }

  return (
    <div className="gym-page">
      {/* =================================================
          HERO
          ================================================= */}

      <section className="gym-hero">
        <div className="container">
          <div className="gym-breadcrumb">Home / Student Welfare / Gym</div>

          <div className="gym-hero-content">
            <div className="gym-hero-icon">
              <FaDumbbell />
            </div>

            <h1>{data.title}</h1>

            <p>
              Fitness, health and well-being for a healthier campus community.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRODUCTION
          ================================================= */}

      <section className="gym-section">
        <div className="container">
          <div className="gym-intro">
            <span className="gym-label">FITNESS & WELL-BEING</span>

            <h2>{data.heading}</h2>

            <div className="gym-line"></div>

            <p>{data.description}</p>
          </div>

          {/* =================================================
              PHOTOS
              ================================================= */}

          <div className="gym-photo-grid">
            {data.photo1 && (
              <div className="gym-photo-card">
                <img src={data.photo1} alt="Gym facility" />
              </div>
            )}

            {data.photo2 && (
              <div className="gym-photo-card">
                <img src={data.photo2} alt="Gym and fitness facility" />
              </div>
            )}
          </div>

          {/* =================================================
              FACILITY INFORMATION
              ================================================= */}

          <div className="gym-facility-card">
            <div className="gym-facility-icon">
              <FaHeartbeat />
            </div>

            <div>
              <h3>Gym & Fitness Facilities</h3>

              <p>{data.facilityDescription}</p>
            </div>
          </div>

          {/* =================================================
              DETAILS
              ================================================= */}

          <div className="gym-details-grid">
            <div className="gym-detail-card">
              <div className="gym-detail-icon">
                <FaClock />
              </div>

              <div>
                <span>GYM TIMINGS</span>
                <h3>{data.timings}</h3>
              </div>
            </div>

            <div className="gym-detail-card">
              <div className="gym-detail-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>LOCATION</span>
                <h3>{data.location}</h3>
              </div>
            </div>
          </div>

          {/* =================================================
              CONTACT
              ================================================= */}

          <div className="gym-contact-card">
            <div className="gym-contact-icon">
              <FaUser />
            </div>

            <div className="gym-contact-content">
              <span className="gym-contact-label">GYM CONTACT</span>

              <h3>{data.contactPerson}</h3>

              <div className="gym-contact-details">
                {data.contactEmail && (
                  <a href={`mailto:${data.contactEmail}`}>
                    <FaEnvelope />
                    {data.contactEmail}
                  </a>
                )}

                {data.contactPhone && (
                  <a href={`tel:${data.contactPhone}`}>
                    <FaPhone />
                    {data.contactPhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gym;
