import React, { useEffect, useMemo, useState } from "react";
import "../CSS/DepartmentAchievements.css";

import { FaSearch, FaTrophy, FaGlobe, FaBriefcase } from "react-icons/fa";

import { getPublicDepartmentAchievements } from "../../../services/departmentPublicService";

const DepartmentAchievements = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [achievements, setAchievements] = useState(null);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const DEPARTMENT_SLUG = "master-of-technology";

  /* =========================================================
     FILTERS
  ========================================================= */

  const filters = [
    "All",
    "University Toppers",
    "Global Achievements",
    "Internships",
  ];

  /* =========================================================
     FETCH CS ACHIEVEMENTS
  ========================================================= */

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicDepartmentAchievements(DEPARTMENT_SLUG);

        // console.log("CS Achievements Response:", response);

        if (!response?.success) {
          throw new Error(
            response?.message || "Failed to load department achievements",
          );
        }

        if (!response?.exists || !response?.data) {
          setAchievements({
            collegeBranchToppers: [],
            globalAchievements: [],
            internships: [],
          });

          return;
        }

        setAchievements({
          collegeBranchToppers: Array.isArray(
            response.data.collegeBranchToppers,
          )
            ? response.data.collegeBranchToppers
            : [],

          globalAchievements: Array.isArray(response.data.globalAchievements)
            ? response.data.globalAchievements
            : [],

          internships: Array.isArray(response.data.internships)
            ? response.data.internships
            : [],
        });
      } catch (err) {
        console.error("CS Achievements Error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load department achievements",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  /* =========================================================
     DATA
  ========================================================= */

  const universityToppers = achievements?.collegeBranchToppers || [];

  const globalAchievements = achievements?.globalAchievements || [];

  const internships = achievements?.internships || [];

  /* =========================================================
     SEARCH - TOPPERS
  ========================================================= */

  const topperData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...universityToppers].filter((item) => {
      if (!keyword) return true;

      return (
        item.studentName?.toLowerCase().includes(keyword) ||
        item.rollNo?.toLowerCase().includes(keyword) ||
        item.studentBatch?.toLowerCase().includes(keyword) ||
        item.semester?.toLowerCase().includes(keyword)
      );
    });
  }, [universityToppers, search]);

  /* =========================================================
     SEARCH - GLOBAL ACHIEVEMENTS
  ========================================================= */

  const achievementData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...globalAchievements].filter((item) => {
      if (!keyword) return true;

      return (
        item.studentName?.toLowerCase().includes(keyword) ||
        item.programName?.toLowerCase().includes(keyword) ||
        item.cashPrize?.toLowerCase().includes(keyword) ||
        item.studentBatch?.toLowerCase().includes(keyword) ||
        item.position?.toLowerCase().includes(keyword)
      );
    });
  }, [globalAchievements, search]);

  /* =========================================================
     SEARCH - INTERNSHIPS
  ========================================================= */

  const internshipData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...internships].filter((item) => {
      if (!keyword) return true;

      return (
        item.studentName?.toLowerCase().includes(keyword) ||
        item.companyName?.toLowerCase().includes(keyword) ||
        item.stipend?.toLowerCase().includes(keyword) ||
        item.studentBatch?.toLowerCase().includes(keyword)
      );
    });
  }, [internships, search]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="achievementPage">
        <section className="achievementHero">
          <h1>Department Achievements</h1>

          <p style={{ color: "white" }}>
            Celebrating the academic excellence, global achievements and
            internship success of MTECH students.
          </p>
        </section>

        <div
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          Loading achievements...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="achievementPage">
        <section className="achievementHero">
          <h1>Department Achievements</h1>

          <p style={{ color: "white" }}>
            Celebrating the academic excellence, global achievements and
            internship success of MTECH students.
          </p>
        </section>

        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#dc3545",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="achievementPage">
      {/* ================= HERO ================= */}

      <section className="achievementHero">
        <h1>Department Achievements</h1>

        <p style={{ color: "white" }}>
          Celebrating the academic excellence, global achievements and
          internship success of MTECH students.
        </p>
      </section>

      {/* ================= SEARCH ================= */}

      <section className="searchSection">
        <div
          className="searchBox"
          style={{
            border: "1px solid #0A2E5C",
          }}
        >
          <FaSearch />

          <input
            type="text"
            placeholder="Search Student Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ================= FILTER ================= */}

      <section className="filterSection">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filterBtn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* ==========================================
          UNIVERSITY TOPPERS
      ========================================== */}

      {(activeFilter === "All" || activeFilter === "University Toppers") && (
        <section className="tableCard">
          <div className="tableTitle">
            <FaTrophy />

            <h2>College Branch Toppers</h2>
          </div>

          <div className="tableResponsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                  <th>SGPA</th>
                  <th>Student Batch</th>
                  <th>Semester</th>
                </tr>
              </thead>

              <tbody>
                {topperData.length > 0 ? (
                  topperData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>{item.studentName}</td>

                      <td>{item.rollNo}</td>

                      <td>{item.sgpa}</td>

                      <td>{item.studentBatch}</td>

                      <td>{item.semester}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No university toppers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ==========================================
          GLOBAL ACHIEVEMENTS
      ========================================== */}

      {(activeFilter === "All" || activeFilter === "Global Achievements") && (
        <section className="tableCard">
          <div className="tableTitle">
            <FaGlobe />

            <h2>Student Global Achievements</h2>
          </div>

          <div className="tableResponsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Student Name</th>
                  <th>Program Name</th>
                  <th>Cash / Prize</th>
                  <th>Student Batch</th>
                  <th>Position</th>
                </tr>
              </thead>

              <tbody>
                {achievementData.length > 0 ? (
                  achievementData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>{item.studentName}</td>

                      <td>{item.programName}</td>

                      <td>{item.cashPrize}</td>

                      <td>{item.studentBatch}</td>

                      <td>{item.position}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No global achievements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ==========================================
          INTERNSHIP DETAILS
      ========================================== */}

      {(activeFilter === "All" || activeFilter === "Internships") && (
        <section className="tableCard">
          <div className="tableTitle">
            <FaBriefcase />

            <h2>Internship Details</h2>
          </div>

          <div className="tableResponsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Student Name</th>
                  <th>Company Name</th>
                  <th>Stipend</th>
                  <th>Student Batch</th>
                </tr>
              </thead>

              <tbody>
                {internshipData.length > 0 ? (
                  internshipData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>{item.studentName}</td>

                      <td>{item.companyName}</td>

                      <td>{item.stipend}</td>

                      <td>{item.studentBatch}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No internship records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default DepartmentAchievements;
