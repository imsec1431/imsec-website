import React, { useEffect, useMemo, useState } from "react";
import "../CSS/DepartmentAchievements.css";

import {
  FaSearch,
  FaTrophy,
  FaGlobe,
  FaBriefcase,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";

import { getPublicDepartmentAchievements } from "../../../services/departmentPublicService";

import { getPublicDepartmentAchievementItems } from "../../../services/departmentAchievementItemPublicService";

import { getPublicFacultyAchievementItems } from "../../../services/facultyAchievementItemPublicService";

const DEPARTMENT_SLUG = "electronics-and-communication";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ITEMS_PER_PAGE = 10;

const DepartmentAchievements = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [achievements, setAchievements] = useState(null);

  const [departmentId, setDepartmentId] = useState("");

  const [departmentAchievements, setDepartmentAchievements] = useState([]);

  const [facultyAchievements, setFacultyAchievements] = useState([]);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [departmentPage, setDepartmentPage] = useState(1);

  const [facultyPage, setFacultyPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     FILTERS
  ========================================================= */

  const filters = [
    "All",
    "Department Achievements",
    "Faculty Achievements",
    "University Toppers",
    "Global Achievements",
    "Internships",
  ];

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError("");

        /* =====================================================
           EXISTING 3 MODULES
        ===================================================== */

        const response = await getPublicDepartmentAchievements(DEPARTMENT_SLUG);

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
        } else {
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
        }

        /* =====================================================
           GET DEPARTMENT ID
        ===================================================== */

        const departmentResponse = await fetch(
          `${API}/api/departments/slug/${DEPARTMENT_SLUG}`,
        );

        const departmentResult = await departmentResponse.json();

        if (!departmentResponse.ok) {
          throw new Error(
            departmentResult?.message || "Failed to load department",
          );
        }

        const department = departmentResult?.data;

        if (!department?._id) {
          throw new Error("Department ID not found");
        }

        setDepartmentId(department._id);

        /* =====================================================
           1. DEPARTMENT ACHIEVEMENTS
        ===================================================== */

        try {
          const response = await getPublicDepartmentAchievementItems(
            department._id,
          );

          const data = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setDepartmentAchievements(
            data
              .filter((item) => item?.isActive !== false)
              .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
          );
        } catch (err) {
          console.error("Department Achievement Error:", err);

          setDepartmentAchievements([]);
        }

        /* =====================================================
           2. FACULTY ACHIEVEMENTS
        ===================================================== */

        try {
          const response = await getPublicFacultyAchievementItems(
            department._id,
          );

          const data = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          setFacultyAchievements(
            data
              .filter((item) => item?.isActive !== false)
              .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
          );
        } catch (err) {
          console.error("Faculty Achievement Error:", err);

          setFacultyAchievements([]);
        }
      } catch (err) {
        console.error("Department Achievements Error:", err);

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
     EXISTING DATA
  ========================================================= */

  const universityToppers = achievements?.collegeBranchToppers || [];

  const globalAchievements = achievements?.globalAchievements || [];

  const internships = achievements?.internships || [];

  /* =========================================================
     SEARCH - DEPARTMENT ACHIEVEMENTS
  ========================================================= */

  const departmentAchievementData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...departmentAchievements].filter((item) => {
      if (!keyword) return true;

      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      );
    });
  }, [departmentAchievements, search]);

  /* =========================================================
     SEARCH - FACULTY ACHIEVEMENTS
  ========================================================= */

  const facultyAchievementData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...facultyAchievements].filter((item) => {
      const faculty =
        typeof item.facultyId === "object" ? item.facultyId : null;

      const facultyName = faculty?.name || "";

      const designation = faculty?.designation || "";

      if (!keyword) return true;

      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        facultyName.toLowerCase().includes(keyword) ||
        designation.toLowerCase().includes(keyword)
      );
    });
  }, [facultyAchievements, search]);

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
        String(item.cashPrize || "")
          .toLowerCase()
          .includes(keyword) ||
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
        String(item.stipend || "")
          .toLowerCase()
          .includes(keyword) ||
        item.studentBatch?.toLowerCase().includes(keyword)
      );
    });
  }, [internships, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const departmentTotalPages = Math.max(
    1,
    Math.ceil(departmentAchievementData.length / ITEMS_PER_PAGE),
  );

  const facultyTotalPages = Math.max(
    1,
    Math.ceil(facultyAchievementData.length / ITEMS_PER_PAGE),
  );

  const paginatedDepartmentAchievements = departmentAchievementData.slice(
    (departmentPage - 1) * ITEMS_PER_PAGE,
    departmentPage * ITEMS_PER_PAGE,
  );

  const paginatedFacultyAchievements = facultyAchievementData.slice(
    (facultyPage - 1) * ITEMS_PER_PAGE,
    facultyPage * ITEMS_PER_PAGE,
  );

  /* =========================================================
     RESET PAGINATION
  ========================================================= */

  useEffect(() => {
    setDepartmentPage(1);
    setFacultyPage(1);
  }, [search]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="achievementPage">
        <section className="achievementHero">
          <h1>Department Achievements</h1>

          <p
            style={{
              color: "white",
            }}
          >
            Celebrating academic excellence, department achievements, faculty
            achievements and student success of MBA.
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

          <p
            style={{
              color: "white",
            }}
          >
            Celebrating academic excellence, department achievements, faculty
            achievements and student success of MBA.
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

  /* =========================================================
     MAIN PAGE
     
     ORDER:
     1. Department Achievements
     2. Faculty Achievements
     3. College Branch Toppers
     4. Student Global Achievements
     5. Internship Details
  ========================================================= */

  return (
    <div className="achievementPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="achievementHero">
        <h1>Department Achievements</h1>

        <p
          style={{
            color: "white",
          }}
        >
          Celebrating academic excellence, department achievements, faculty
          achievements and student success of MBA.
        </p>
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

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
            placeholder="Search Student, Faculty or Achievement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="filterSection">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filterBtn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* =====================================================
          1. DEPARTMENT ACHIEVEMENTS
      ===================================================== */}

      {(activeFilter === "All" ||
        activeFilter === "Department Achievements") && (
        <section className="tableCard">
          <div className="tableTitle">
            <FaBuilding />

            <h2>Department Achievements</h2>
          </div>

          <div className="tableResponsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {paginatedDepartmentAchievements.length > 0 ? (
                  paginatedDepartmentAchievements.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>
                        {(departmentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td>
                        <strong>{item.title}</strong>
                      </td>

                      <td>{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No department achievements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {departmentTotalPages > 1 && (
            <div className="achievementPagination">
              <button
                type="button"
                disabled={departmentPage === 1}
                onClick={() =>
                  setDepartmentPage((page) => Math.max(1, page - 1))
                }
              >
                Previous
              </button>

              <span>
                Page {departmentPage} of {departmentTotalPages}
              </span>

              <button
                type="button"
                disabled={departmentPage === departmentTotalPages}
                onClick={() =>
                  setDepartmentPage((page) =>
                    Math.min(departmentTotalPages, page + 1),
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          2. FACULTY ACHIEVEMENTS
      ===================================================== */}

      {(activeFilter === "All" || activeFilter === "Faculty Achievements") && (
        <section className="tableCard">
          <div className="tableTitle">
            <FaUserTie />

            <h2>Faculty Achievements</h2>
          </div>

          <div className="tableResponsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Faculty Member</th>
                  <th>Designation</th>
                  <th>Achievement</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {paginatedFacultyAchievements.length > 0 ? (
                  paginatedFacultyAchievements.map((item, index) => {
                    const faculty =
                      typeof item.facultyId === "object"
                        ? item.facultyId
                        : null;

                    return (
                      <tr key={item._id || index}>
                        <td>
                          {(facultyPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>

                        <td>
                          <strong>{faculty?.name || "-"}</strong>
                        </td>

                        <td>{faculty?.designation || "-"}</td>

                        <td>
                          <strong>{item.title || "-"}</strong>
                        </td>

                        <td>{item.description || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No faculty achievements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {facultyTotalPages > 1 && (
            <div className="achievementPagination">
              <button
                type="button"
                disabled={facultyPage === 1}
                onClick={() => setFacultyPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>

              <span>
                Page {facultyPage} of {facultyTotalPages}
              </span>

              <button
                type="button"
                disabled={facultyPage === facultyTotalPages}
                onClick={() =>
                  setFacultyPage((page) =>
                    Math.min(facultyTotalPages, page + 1),
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          3. COLLEGE BRANCH TOPPERS
      ===================================================== */}

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

      {/* =====================================================
          4. STUDENT GLOBAL ACHIEVEMENTS
      ===================================================== */}

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

      {/* =====================================================
          5. INTERNSHIP DETAILS
      ===================================================== */}

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
