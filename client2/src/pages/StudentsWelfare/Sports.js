import React, { useEffect, useMemo, useState } from "react";
import {
  FaTrophy,
  FaRunning,
  FaDumbbell,
  FaFutbol,
  FaBasketballBall,
  FaTableTennis,
  FaChess,
  FaMedal,
  FaClock,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import sportsService from "../../services/sportsService";
import "./sports.css";

const DEFAULT_DATA = {
  title: "Sports",
  heroSubtitle: "Sports, Fitness & Recreation",
  breadcrumb: "Home / Student Welfare / Sports",
  heading: "Sports & Physical Fitness",
  description:
    "The institute encourages students to participate in sports and physical fitness activities as an important part of holistic education. Sports provide opportunities to develop discipline, teamwork, leadership, confidence and a healthy lifestyle.",

  coordinatorName: "Sports Coordinator",
  coordinatorDesignation: "Coordinator, Sports & Physical Education",
  coordinatorEmail: "sports@imsec.ac.in",
  coordinatorPhone: "+91-120-4081999",

  outdoorHeading: "Outdoor Sports Facilities",
  outdoorDescription:
    "The institute provides outdoor sports facilities that encourage students to participate in regular practice, recreational activities and competitive events.",

  indoorHeading: "Indoor Sports Facilities",
  indoorDescription:
    "Indoor sports facilities provide students with opportunities to practice recreational and competitive indoor games throughout the year.",

  fitnessHeading: "Fitness & Recreation",
  fitnessDescription:
    "Fitness and recreational activities help students maintain physical fitness, improve endurance and develop healthy lifestyle habits.",

  trainingHeading: "Coaching & Training",
  trainingDescription:
    "Students are encouraged to participate in regular practice and sports activities under appropriate guidance. Coaching and training opportunities may be organized for different sports according to institutional requirements.",

  activitiesHeading: "Sports Activities & Events",
  activitiesDescription:
    "The institute promotes participation in inter-college competitions, sports events, tournaments, fitness activities and other recreational programmes.",

  timingsHeading: "Sports Facility Timings",
  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",

  facilities: [
    {
      _id: "default-cricket",
      title: "Cricket",
      description: "Facilities for cricket practice and recreational play.",
      category: "Outdoor",
      isActive: true,
    },
    {
      _id: "default-football",
      title: "Football",
      description:
        "Outdoor football facility for practice and student activities.",
      category: "Outdoor",
      isActive: true,
    },
    {
      _id: "default-basketball",
      title: "Basketball",
      description:
        "Basketball facility for regular practice and recreational activities.",
      category: "Outdoor",
      isActive: true,
    },
    {
      _id: "default-volleyball",
      title: "Volleyball",
      description:
        "Volleyball facility for practice, recreation and competitions.",
      category: "Outdoor",
      isActive: true,
    },
    {
      _id: "default-badminton",
      title: "Badminton",
      description: "Indoor badminton facility for regular student practice.",
      category: "Indoor",
      isActive: true,
    },
    {
      _id: "default-table-tennis",
      title: "Table Tennis",
      description:
        "Indoor table tennis facility for recreational and competitive practice.",
      category: "Indoor",
      isActive: true,
    },
    {
      _id: "default-chess",
      title: "Chess & Carrom",
      description: "Indoor recreational games for students.",
      category: "Indoor",
      isActive: true,
    },
    {
      _id: "default-gym",
      title: "Gym & Fitness",
      description:
        "Fitness facilities supporting physical conditioning and healthy lifestyle activities.",
      category: "Fitness",
      isActive: true,
    },
  ],

  achievements: [
    {
      _id: "default-achievement-1",
      title: "Inter-College Sports Participation",
      description:
        "Students are encouraged to represent the institute in inter-college and university-level sporting events.",
      year: "2026",
      isActive: true,
    },
    {
      _id: "default-achievement-2",
      title: "Annual Sports Activities",
      description:
        "The institute promotes annual sports activities and competitions for student participation.",
      year: "2026",
      isActive: true,
    },
  ],

  images: [
    {
      _id: "default-image-1",
      title: "Sports & Fitness",
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=85",
      altText: "Sports and athletics facility",
      order: 1,
    },
    {
      _id: "default-image-2",
      title: "Basketball Facility",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=85",
      altText: "Basketball sports facility",
      order: 2,
    },
    {
      _id: "default-image-3",
      title: "Football Facility",
      imageUrl:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=85",
      altText: "Football sports facility",
      order: 3,
    },
    {
      _id: "default-image-4",
      title: "Fitness Activity",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85",
      altText: "Fitness activity",
      order: 4,
    },
  ],
};

const getFacilityIcon = (title = "") => {
  const value = title.toLowerCase();

  if (value.includes("cricket") || value.includes("football")) {
    return <FaFutbol />;
  }

  if (value.includes("basketball")) {
    return <FaBasketballBall />;
  }

  if (value.includes("badminton") || value.includes("table tennis")) {
    return <FaTableTennis />;
  }

  if (value.includes("chess") || value.includes("carrom")) {
    return <FaChess />;
  }

  if (value.includes("gym") || value.includes("fitness")) {
    return <FaDumbbell />;
  }

  return <FaRunning />;
};

const Sports = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const response = await sportsService.getSports();

        const pageData = response?.data?.data || response?.data || response;

        if (pageData && typeof pageData === "object") {
          setData({
            ...DEFAULT_DATA,
            ...pageData,
            facilities: Array.isArray(pageData.facilities)
              ? pageData.facilities
              : DEFAULT_DATA.facilities,
            achievements: Array.isArray(pageData.achievements)
              ? pageData.achievements
              : DEFAULT_DATA.achievements,
            images: Array.isArray(pageData.images)
              ? pageData.images
              : DEFAULT_DATA.images,
          });
        }
      } catch (error) {
        console.error("Sports Page Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSports();
  }, []);

  const outdoorFacilities = useMemo(
    () =>
      (data.facilities || []).filter(
        (item) => item?.isActive !== false && item?.category === "Outdoor",
      ),
    [data.facilities],
  );

  const indoorFacilities = useMemo(
    () =>
      (data.facilities || []).filter(
        (item) => item?.isActive !== false && item?.category === "Indoor",
      ),
    [data.facilities],
  );

  const fitnessFacilities = useMemo(
    () =>
      (data.facilities || []).filter(
        (item) => item?.isActive !== false && item?.category === "Fitness",
      ),
    [data.facilities],
  );

  const activeAchievements = useMemo(
    () => (data.achievements || []).filter((item) => item?.isActive !== false),
    [data.achievements],
  );

  const galleryImages = useMemo(
    () =>
      [...(data.images || [])]
        .filter((item) => item?.imageUrl)
        .sort((a, b) => (a.order || 1) - (b.order || 1)),
    [data.images],
  );

  if (loading) {
    return (
      <div className="sports-loading">
        <div className="sports-loading-spinner" />
        <p>Loading Sports information...</p>
      </div>
    );
  }

  return (
    <div className="sports-page">
      {/* HERO */}
      <section className="sports-hero">
        <div className="sports-hero-overlay">
          <div className="sports-container">
            <div className="sports-breadcrumb">{data.breadcrumb}</div>

            <h1>{data.title}</h1>

            <p>{data.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="sports-section sports-intro-section">
        <div className="sports-container">
          <div className="sports-section-heading">
            <span className="sports-heading-line" />
            <span>SPORTS &amp; FITNESS</span>
          </div>

          <div className="sports-intro-grid">
            <div>
              <h2>{data.heading}</h2>

              <p>{data.description}</p>
            </div>

            <div className="sports-intro-card">
              <div className="sports-intro-icon">
                <FaTrophy />
              </div>

              <h3>Holistic Development</h3>

              <p>
                Sports and fitness activities encourage teamwork, discipline,
                leadership, confidence and a healthy lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="sports-section sports-gallery-section">
          <div className="sports-container">
            <div className="sports-section-heading">
              <span className="sports-heading-line" />
              <span>SPORTS GALLERY</span>
            </div>

            <div className="sports-gallery">
              {galleryImages.map((image) => (
                <div
                  className="sports-gallery-card"
                  key={image._id || image.imageUrl}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || image.title || "Sports"}
                  />

                  <div className="sports-gallery-caption">{image.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OUTDOOR */}
      {outdoorFacilities.length > 0 && (
        <section className="sports-section">
          <div className="sports-container">
            <div className="sports-section-heading">
              <span className="sports-heading-line" />
              <span>OUTDOOR SPORTS</span>
            </div>

            <div className="sports-content-heading">
              <h2>{data.outdoorHeading}</h2>
              <p>{data.outdoorDescription}</p>
            </div>

            <div className="sports-facilities-grid">
              {outdoorFacilities.map((facility) => (
                <div
                  className="sports-facility-card"
                  key={facility._id || facility.title}
                >
                  <div className="sports-facility-icon">
                    {getFacilityIcon(facility.title)}
                  </div>

                  <div>
                    <h3>{facility.title}</h3>
                    <p>{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INDOOR */}
      {indoorFacilities.length > 0 && (
        <section className="sports-section sports-light-section">
          <div className="sports-container">
            <div className="sports-section-heading">
              <span className="sports-heading-line" />
              <span>INDOOR SPORTS</span>
            </div>

            <div className="sports-content-heading">
              <h2>{data.indoorHeading}</h2>
              <p>{data.indoorDescription}</p>
            </div>

            <div className="sports-facilities-grid">
              {indoorFacilities.map((facility) => (
                <div
                  className="sports-facility-card"
                  key={facility._id || facility.title}
                >
                  <div className="sports-facility-icon">
                    {getFacilityIcon(facility.title)}
                  </div>

                  <div>
                    <h3>{facility.title}</h3>
                    <p>{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FITNESS */}
      <section className="sports-section">
        <div className="sports-container">
          <div className="sports-section-heading">
            <span className="sports-heading-line" />
            <span>FITNESS &amp; RECREATION</span>
          </div>

          <div className="sports-feature-grid">
            <div className="sports-feature-card">
              <div className="sports-feature-icon">
                <FaDumbbell />
              </div>

              <h2>{data.fitnessHeading}</h2>

              <p>{data.fitnessDescription}</p>

              {fitnessFacilities.length > 0 && (
                <div className="sports-feature-list">
                  {fitnessFacilities.map((facility) => (
                    <div
                      key={facility._id || facility.title}
                      className="sports-feature-list-item"
                    >
                      <span>✓</span>
                      {facility.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sports-feature-card">
              <div className="sports-feature-icon">
                <FaRunning />
              </div>

              <h2>{data.trainingHeading}</h2>

              <p>{data.trainingDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="sports-section sports-light-section">
        <div className="sports-container">
          <div className="sports-section-heading">
            <span className="sports-heading-line" />
            <span>ACTIVITIES &amp; EVENTS</span>
          </div>

          <div className="sports-activities-card">
            <div className="sports-activities-icon">
              <FaMedal />
            </div>

            <div>
              <h2>{data.activitiesHeading}</h2>
              <p>{data.activitiesDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      {activeAchievements.length > 0 && (
        <section className="sports-section">
          <div className="sports-container">
            <div className="sports-section-heading">
              <span className="sports-heading-line" />
              <span>SPORTS HIGHLIGHTS</span>
            </div>

            <div className="sports-achievements-grid">
              {activeAchievements.map((achievement) => (
                <div
                  className="sports-achievement-card"
                  key={achievement._id || achievement.title}
                >
                  {achievement.year && (
                    <div className="sports-achievement-year">
                      {achievement.year}
                    </div>
                  )}

                  <div className="sports-achievement-icon">
                    <FaTrophy />
                  </div>

                  <h3>{achievement.title}</h3>

                  <p>{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMINGS */}
      <section className="sports-timing-section">
        <div className="sports-container">
          <div className="sports-timing-card">
            <div className="sports-timing-icon">
              <FaClock />
            </div>

            <div>
              <h2>{data.timingsHeading}</h2>
              <p>{data.timings}</p>
            </div>
          </div>
        </div>
      </section>

      {/* COORDINATOR */}
      <section className="sports-section">
        <div className="sports-container">
          <div className="sports-section-heading">
            <span className="sports-heading-line" />
            <span>SPORTS COORDINATION</span>
          </div>

          <div className="sports-contact-card">
            <div className="sports-contact-main">
              <div className="sports-contact-icon">
                <FaRunning />
              </div>

              <div>
                <h2>{data.coordinatorName}</h2>
                <p>{data.coordinatorDesignation}</p>
              </div>
            </div>

            <div className="sports-contact-details">
              {data.coordinatorEmail && (
                <a href={`mailto:${data.coordinatorEmail}`}>
                  <FaEnvelope />
                  <span>{data.coordinatorEmail}</span>
                </a>
              )}

              {data.coordinatorPhone && (
                <a href={`tel:${data.coordinatorPhone}`}>
                  <FaPhone />
                  <span>{data.coordinatorPhone}</span>
                </a>
              )}

              <div>
                <FaMapMarkerAlt />
                <span>Institute Campus</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sports;
