import React, { useEffect, useMemo, useState } from "react";

import {
  FaBookOpen,
  FaExternalLinkAlt,
  FaDownload,
  FaGraduationCap,
} from "react-icons/fa";

import { getPublishedCourses } from "../../services/courseService";

import "./Courses.css";

/* =========================================================
   YEAR ORDER
========================================================= */

const yearOrder = {
  "1st Year": 1,
  "2nd Year": 2,
  "3rd Year": 3,
  "4th Year": 4,
};

/* =========================================================
   COMPONENT
========================================================= */

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const [activeCategory, setActiveCategory] = useState("UG");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD COURSES
  ======================================================= */

  const loadCourses = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPublishedCourses();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setCourses(data);
    } catch (err) {
      console.error("Public course loading error:", err);

      setError(err?.response?.data?.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* =======================================================
     FILTER CATEGORY
  ======================================================= */

  const categoryCourses = useMemo(() => {
    return courses
      .filter((item) => item.category === activeCategory)
      .sort((a, b) => {
        const courseCompare = String(a.courseName || "").localeCompare(
          String(b.courseName || ""),
        );

        if (courseCompare !== 0) {
          return courseCompare;
        }

        const yearCompare =
          (yearOrder[a.year] || 99) - (yearOrder[b.year] || 99);

        if (yearCompare !== 0) {
          return yearCompare;
        }

        return Number(a.displayOrder || 0) - Number(b.displayOrder || 0);
      });
  }, [courses, activeCategory]);

  /* =======================================================
     GROUP COURSES
  ======================================================= */

  const groupedCourses = useMemo(() => {
    return categoryCourses.reduce((groups, item) => {
      const courseName = item.courseName || "Course";

      if (!groups[courseName]) {
        groups[courseName] = [];
      }

      groups[courseName].push(item);

      return groups;
    }, {});
  }, [categoryCourses]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="coursesPage">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="coursesHero">
        <div className="coursesHeroContent">
          <div className="coursesHeroIcon">
            <FaGraduationCap />
          </div>

          <span>ACADEMIC PROGRAMMES</span>

          <h1>Courses</h1>
        </div>
      </section>

      {/* ===================================================
          CATEGORY TABS
      =================================================== */}

      <section className="coursesContainer">
        <div className="coursesTabs">
          <button
            type="button"
            className={activeCategory === "UG" ? "active" : ""}
            onClick={() => setActiveCategory("UG")}
          >
            <FaGraduationCap />

            <span style={{ color: "black" }}>Undergraduate</span>
          </button>

          <button
            type="button"
            className={activeCategory === "PG" ? "active" : ""}
            onClick={() => setActiveCategory("PG")}
          >
            <FaBookOpen />

            <span style={{ color: "black" }}>Postgraduate</span>
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className="coursesError">{error}</div>}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="coursesLoading">
            <div className="coursesSpinner" />

            <p>Loading courses...</p>
          </div>
        ) : categoryCourses.length === 0 ? (
          /* ===============================================
             EMPTY
          =============================================== */

          <div className="coursesEmpty">
            <div className="coursesEmptyIcon">
              <FaBookOpen />
            </div>

            <h2>No Courses Available</h2>

            <p>Course information for this category will be available soon.</p>
          </div>
        ) : (
          /* ===============================================
             COURSE GROUPS
          =============================================== */

          <div className="coursesGroups">
            {Object.entries(groupedCourses).map(([courseName, items]) => (
              <section className="publicCourseGroup" key={courseName}>
                {/* =====================================
                      COURSE HEADER
                  ===================================== */}

                <div className="publicCourseHeader">
                  <div className="publicCourseTitle">
                    <div className="publicCourseIcon">
                      <FaBookOpen />
                    </div>

                    <div>
                      <span>
                        {activeCategory === "UG"
                          ? "UNDERGRADUATE"
                          : "POSTGRADUATE"}
                      </span>

                      <h2>{courseName}</h2>
                    </div>
                  </div>

                  <div className="publicCourseCount">
                    {items.length} {items.length === 1 ? "Year" : "Years"}
                  </div>
                </div>

                {/* =====================================
                      YEAR LIST
                  ===================================== */}

                <div className="publicCourseYears">
                  {items.map((item) => (
                    <article className="publicCourseCard" key={item._id}>
                      <div className="publicCourseYear">
                        <span>{item.year}</span>
                      </div>

                      <div className="publicCourseInfo">
                        <h3>{item.title}</h3>

                        {item.description && <p>{item.description}</p>}
                      </div>

                      {/* =================================
                              ACTIONS
                          ================================= */}

                      <div className="publicCourseActions">
                        <a
                          href={item.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="publicViewPdf"
                        >
                          <FaExternalLinkAlt />
                          View PDF
                        </a>

                        <a
                          href={item.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="publicDownloadPdf"
                        >
                          <FaDownload />
                          Download
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Courses;
