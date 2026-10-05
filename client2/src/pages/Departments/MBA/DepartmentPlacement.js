import React, { useEffect, useState } from "react";
import "../CSS/DepartmentPlacement.css";

import {
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaCheckCircle,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa";

import { getPublicDepartmentPlacement } from "../../../services/departmentPublicService";

const DEPARTMENT_SLUG = "master-of-business-administration";

const DepartmentPlacement = () => {
  const [placement, setPlacement] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     FETCH PLACEMENT DATA
  ========================================================= */

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicDepartmentPlacement(DEPARTMENT_SLUG);

        // console.log("MBA Placement Response:", response);

        if (!response?.success) {
          throw new Error(response?.message || "Failed to load placement data");
        }

        /* ================================================
           NO DATA
        ================================================= */

        if (response.exists === false || !response.data) {
          setPlacement(null);
          return;
        }

        setPlacement(response.data);
      } catch (err) {
        console.error("MBA Placement Error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load placement information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlacement();
  }, []);

  /* =========================================================
     DATA
  ========================================================= */

  const placementStatistics = placement?.placementStatistics || {};

  const recruiters = Array.isArray(placement?.recruiters)
    ? placement.recruiters
    : [];

  const placementHistory = Array.isArray(placement?.placementHistory)
    ? placement.placementHistory
    : [];

  const topPlacements = Array.isArray(placement?.topPlacements)
    ? placement.topPlacements
    : [];

  const trainings = Array.isArray(placement?.trainings)
    ? placement.trainings
    : [];

  const process = Array.isArray(placement?.process) ? placement.process : [];

  const testimonials = Array.isArray(placement?.testimonials)
    ? placement.testimonials
    : [];

  /* =========================================================
     HERO
  ========================================================= */

  const Hero = () => (
    <section className="placementHero">
      <div className="heroContent">
        <span className="heroTag">DEPARTMENT OF MBA</span>

        <h1>Placement & Career Opportunities</h1>

        <p>
          Our Department of MBA consistently achieves excellent placement
          records through industry collaborations, career development programs,
          coding culture, internships and dedicated placement training.
        </p>
      </div>

      <div className="heroImage">
        <div className="circle circle1"></div>

        <div className="circle circle2"></div>

        <div className="circle circle3"></div>

        <div className="placementIcon">
          <FaGraduationCap />
        </div>
      </div>
    </section>
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="placementPage">
        <Hero />

        <div className="placementLoading">
          <div className="placementLoader"></div>

          <h3>Loading Placement Information...</h3>

          <p>Please wait while placement information is being loaded.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="placementPage">
        <Hero />

        <div className="placementError">
          <h3>Unable to Load Placement Information</h3>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     NO PLACEMENT DATA
  ========================================================= */

  if (!placement) {
    return (
      <div className="placementPage">
        <Hero />

        <div className="placementEmpty">
          <FaBriefcase />

          <h3>Placement Information Coming Soon</h3>

          <p>
            Placement information for this department has not been published
            yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="placementPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <Hero />

      {/* =====================================================
          PLACEMENT STATISTICS
      ===================================================== */}

      <section className="statsSection">
        <div className="statCard">
          <div className="statIcon">
            <FaUsers />
          </div>

          <h2>{placementStatistics.placementRate || "—"}</h2>

          <p>Placement Rate</p>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <FaMoneyBillWave />
          </div>

          <h2>{placementStatistics.highestPackage || "—"}</h2>

          <p>Highest Package</p>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <FaChartLine />
          </div>

          <h2>{placementStatistics.averagePackage || "—"}</h2>

          <p>Average Package</p>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <FaBriefcase />
          </div>

          <h2>{placementStatistics.offersReceived || "—"}</h2>

          <p>Offers Received</p>
        </div>
      </section>

      {/* =====================================================
          RECRUITERS
      ===================================================== */}

      {recruiters.length > 0 && (
        <section className="recruiterSection">
          <div className="sectionHeading">
            <span>OUR RECRUITERS</span>

            <h2>Top Recruiting Companies</h2>

            <p>
              Our students are recruited by leading organizations across
              different sectors.
            </p>
          </div>

          <div className="recruiterGrid">
            {recruiters.map((recruiter, index) => (
              <div className="companyCard" key={recruiter._id || index}>
                <FaBuilding />

                <h4>{recruiter.companyName}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          YEAR-WISE PLACEMENT
      ===================================================== */}

      {placementHistory.length > 0 && (
        <section className="historySection">
          <div className="sectionHeading">
            <span>PLACEMENT PERFORMANCE</span>

            <h2>Year-wise Placement Statistics</h2>

            <p>Placement performance across different academic years.</p>
          </div>

          <div className="historyContainer">
            {[...placementHistory]
              .sort((a, b) => Number(b.year) - Number(a.year))
              .map((item, index) => (
                <div className="historyRow" key={item._id || index}>
                  <div className="historyYear">{item.year}</div>

                  <div className="historyBar">
                    <div
                      className="historyProgress"
                      style={{
                        width: `${Math.min(
                          Math.max(Number(item.percentage) || 0, 0),
                          100,
                        )}%`,
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* =====================================================
          HIGHEST PACKAGE ACHIEVERS
      ===================================================== */}

      {topPlacements.length > 0 && (
        <section className="placementHighlightSection">
          <div className="sectionHeading">
            <span>SUCCESS STORIES</span>

            <h2>Highest Package Achievers</h2>

            <p>
              Our students have secured outstanding placements with leading
              organizations.
            </p>
          </div>

          <div className="placementGrid">
            {topPlacements.map((student, index) => (
              <div className="placementCard" key={student._id || index}>
                <div className="studentAvatar">
                  {student.student?.charAt(0)?.toUpperCase()}
                </div>

                <h3>{student.student}</h3>

                <h4>{student.company}</h4>

                <div className="packageTag">{student.package}</div>

                <p>{student.role}</p>

                <span>Batch : {student.batch}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          TRAINING
      ===================================================== */}

      {trainings.length > 0 && (
        <section className="trainingSection">
          <div className="sectionHeading">
            <span>CAREER DEVELOPMENT</span>

            <h2>Placement Training Activities</h2>

            <p>
              Students undergo comprehensive training programs to enhance
              technical, communication and problem-solving skills.
            </p>
          </div>

          <div className="trainingGrid">
            {trainings.map((item, index) => (
              <div className="trainingCard" key={item._id || index}>
                <div className="trainingIcon">
                  <FaBriefcase />
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          PLACEMENT PROCESS
      ===================================================== */}

      {process.length > 0 && (
        <section className="processSection">
          <div className="sectionHeading">
            <span>PLACEMENT PROCESS</span>

            <h2>Campus Recruitment Journey</h2>

            <p>
              A structured placement process that prepares students from
              registration to final offer.
            </p>
          </div>

          <div className="processTimeline">
            {process.map((item, index) => (
              <div className="processStep" key={item._id || index}>
                <div className="stepNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h4>{item.title}</h4>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          STUDENT EXPERIENCES
      ===================================================== */}

      {testimonials.length > 0 && (
        <section className="testimonialSection">
          <div className="sectionHeading">
            <span>STUDENT EXPERIENCES</span>

            <h2>What Our Students Say</h2>
          </div>

          <div className="testimonialGrid">
            {testimonials.map((item, index) => (
              <div className="testimonialCard" key={item._id || index}>
                <FaQuoteLeft className="quoteIcon" />

                <div className="testimonialAvatar">
                  {item.student?.charAt(0)?.toUpperCase()}
                </div>

                <h3>{item.student}</h3>

                <h4>{item.company}</h4>

                <p>"{item.message}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="placementCTA">
        <h2>Build Your Career With Our MBA Department</h2>

        <p>
          Join an industry-oriented MBA program with excellent placement
          opportunities, experienced faculty, corporate training and strong
          industry collaborations.
        </p>
      </section>
    </div>
  );
};

export default DepartmentPlacement;
