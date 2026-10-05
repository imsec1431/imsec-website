import React, { useEffect, useMemo, useState } from "react";
import "../CSS/Faculty.css";

import {
  FaSearch,
  FaGraduationCap,
  FaEnvelope,
  FaBriefcase,
  FaArrowRight,
  FaAward,
} from "react-icons/fa";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*=========================================================
      MCA DEPARTMENT SLUG
  =========================================================*/

  const departmentSlug = "computer-science-and-engineering-ai-and-ml";

  /*=========================================================
      FETCH FACULTY
      PUBLIC API - NO LOGIN / NO SUB ADMIN PERMISSION
  =========================================================*/

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError("");

        /*=====================================================
            PUBLIC FACULTY API

            IMPORTANT:
            Do NOT use:

            /api/department-faculty/department/:departmentId

            because that endpoint is protected for Admin/Sub Admin.

            Public website uses:

            /api/department-faculty/slug/:slug
        =====================================================*/

        const API_BASE_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000";
        const facultyResponse = await fetch(
          `${API_BASE_URL}/api/department-faculty/slug/${departmentSlug}`,
        );

        const facultyResult = await facultyResponse.json();

        if (!facultyResponse.ok) {
          throw new Error(facultyResult.message || "Unable to load faculty");
        }

        /*=====================================================
            GET FACULTY DATA
        =====================================================*/

        const facultyData = Array.isArray(facultyResult.data)
          ? facultyResult.data
          : [];

        /*=====================================================
            ONLY ACTIVE FACULTY
        =====================================================*/

        const activeFaculty = facultyData.filter(
          (item) => item?.status === "Active",
        );

        setFaculty(activeFaculty);
      } catch (err) {
        console.error("Faculty Fetch Error:", err);

        setError(err.message || "Failed to load faculty");

        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [departmentSlug]);

  /*=========================================================
      SORT + SEARCH
  =========================================================*/

  const sortedFaculty = useMemo(() => {
    return [...faculty]
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .filter((item) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return true;

        return (
          item.name?.toLowerCase().includes(keyword) ||
          item.designation?.toLowerCase().includes(keyword) ||
          item.qualification?.toLowerCase().includes(keyword) ||
          item.specialization?.toLowerCase().includes(keyword)
        );
      });
  }, [faculty, search]);

  /*=========================================================
      HOD
  =========================================================*/

  const hod = sortedFaculty.find((item) => item.isHOD === true);

  const others = sortedFaculty.filter((item) => item.isHOD !== true);

  /*=========================================================
      LOADING
  =========================================================*/

  if (loading) {
    return (
      <div className="facultyPage">
        <section className="facultyHero">
          <h1>Department Faculty</h1>

          <p style={{ color: "white" }}>Loading faculty information...</p>
        </section>

        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          Loading Faculty...
        </div>
      </div>
    );
  }

  /*=========================================================
      ERROR
  =========================================================*/

  if (error) {
    return (
      <div className="facultyPage">
        <section className="facultyHero">
          <h1>Department Faculty</h1>

          <p style={{ color: "white" }}>
            Meet our highly qualified and experienced faculty members.
          </p>
        </section>

        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "red",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="facultyPage">
      {/*======================================================
            HERO
      ======================================================*/}

      <section className="facultyHero">
        <h1>Department Faculty</h1>

        <p style={{ color: "white" }}>
          Meet our highly qualified and experienced faculty members dedicated to
          excellence in teaching, research and innovation.
        </p>
      </section>

      {/*======================================================
            SEARCH
      ======================================================*/}

      <section className="searchSection">
        <div
          className="searchBox"
          style={{
            border: "1px solid blue",
          }}
        >
          <FaSearch />

          <input
            type="text"
            placeholder="Search Faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/*======================================================
            HOD
      ======================================================*/}

      {hod && (
        <section className="hodCard">
          <div className="hodImage">
            <img src={hod.photo?.url || hod.photo} alt={hod.name} />
          </div>

          <div className="hodContent">
            <span className="hodBadge">Head of Department</span>

            <h2>{hod.name}</h2>

            <h4>{hod.designation}</h4>

            <p>
              {hod.description ||
                "The Department is committed to providing quality education, innovation, research excellence and industry-oriented learning."}
            </p>

            <div className="infoGrid">
              <div>
                <FaGraduationCap />
                <span>{hod.qualification}</span>
              </div>

              <div>
                <FaBriefcase />
                <span>{hod.experience}</span>
              </div>

              <div>
                <FaAward />
                <span>{hod.specialization}</span>
              </div>

              <div>
                <FaEnvelope />
                <span>{hod.email}</span>
              </div>
            </div>

            {/* HOD LINKEDIN */}

            {hod.linkedinUrl && (
              <a
                href={hod.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="profileBtn hodProfileBtn"
              >
                View LinkedIn Profile
                <FaArrowRight />
              </a>
            )}
          </div>
        </section>
      )}

      {/*======================================================
            FACULTY GRID
      ======================================================*/}

      <section className="facultyGrid">
        {others.map((member) => (
          <div className="facultyCard" key={member._id}>
            <div className="facultyImage">
              <img src={member.photo?.url || member.photo} alt={member.name} />
            </div>

            <div className="facultyBody">
              <h3>{member.name}</h3>

              <h5>{member.designation}</h5>

              <div className="facultyInfo">
                <div className="infoRow">
                  <FaGraduationCap />

                  <span>{member.qualification}</span>
                </div>

                <div className="infoRow">
                  <FaBriefcase />

                  <span>{member.experience}</span>
                </div>

                <div className="infoRow">
                  <FaAward />

                  <span>{member.specialization}</span>
                </div>

                <div className="infoRow">
                  <FaEnvelope />

                  <span>{member.email}</span>
                </div>
              </div>

              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profileBtn"
                >
                  View Profile
                  <FaArrowRight />
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/*======================================================
            NO FACULTY
      ======================================================*/}

      {sortedFaculty.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "50px 20px",
          }}
        >
          <h3>No Faculty Found</h3>

          <p>No active faculty members match your search.</p>
        </div>
      )}
    </div>
  );
};

export default Faculty;
