import React, { useEffect, useMemo, useState } from "react";
import {
  FaBullhorn,
  FaBook,
  FaCalendarAlt,
  FaFilePdf,
  FaEye,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../CSS/StudentCorner.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;
const DEPARTMENT_SLUG = "computer-science-engineering";

const StudentCorner = () => {
  const [studentCorner, setStudentCorner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Notice Pagination */
  const [currentNoticePage, setCurrentNoticePage] = useState(1);
  const noticesPerPage = 10;

  useEffect(() => {
    const loadStudentCorner = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/student-corner/${encodeURIComponent(DEPARTMENT_SLUG)}`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load Student Corner");
        }

        if (result?.exists === false || !result?.data) {
          setStudentCorner(null);
          return;
        }

        setStudentCorner(result.data);
      } catch (err) {
        console.error("Student Corner Error:", err);
        setError(err.message || "Failed to load Student Corner");
      } finally {
        setLoading(false);
      }
    };

    loadStudentCorner();
  }, []);

  const notices = useMemo(() => {
    if (!studentCorner || !Array.isArray(studentCorner.notices)) return [];
    return studentCorner.notices
      .filter((item) => item.isActive !== false)
      .sort(
        (a, b) => Number(a.displayOrder || 999) - Number(b.displayOrder || 999),
      );
  }, [studentCorner]);

  const timeTables = useMemo(() => {
    if (!studentCorner || !Array.isArray(studentCorner.timeTables)) return [];
    return studentCorner.timeTables
      .filter((item) => item.isActive !== false)
      .sort(
        (a, b) => Number(a.displayOrder || 999) - Number(b.displayOrder || 999),
      );
  }, [studentCorner]);

  const syllabus = useMemo(() => {
    if (!studentCorner || !Array.isArray(studentCorner.syllabus)) return [];
    return studentCorner.syllabus
      .filter((item) => item.isActive !== false)
      .sort(
        (a, b) => Number(a.displayOrder || 999) - Number(b.displayOrder || 999),
      );
  }, [studentCorner]);

  const totalNoticePages = Math.ceil(notices.length / noticesPerPage);
  const noticeStartIndex = (currentNoticePage - 1) * noticesPerPage;
  const currentNotices = notices.slice(
    noticeStartIndex,
    noticeStartIndex + noticesPerPage,
  );

  useEffect(() => {
    setCurrentNoticePage(1);
  }, [notices.length]);

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="student-corner-page">
        <section className="student-corner-hero">
          <div className="student-corner-overlay">
            <div className="container">
              <div className="student-corner-hero-content">
                <span>CSE DEPARTMENT</span>
                <h1>Student Corner</h1>
                <p style={{ color: "white" }}>
                  Important academic information, notices and resources for CSE
                  students.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div style={{ textAlign: "center", padding: "70px 20px" }}>
          <h3>Loading Student Corner...</h3>
          <p>Please wait while the latest student resources are loaded.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-corner-page">
        <section className="student-corner-hero">
          <div className="student-corner-overlay">
            <div className="container">
              <div className="student-corner-hero-content">
                <span>CS DEPARTMENT</span>
                <h1>Student Corner</h1>
                <p style={{ color: "white" }}>
                  Important academic information, notices and resources for CSE
                  students.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div style={{ textAlign: "center", padding: "70px 20px" }}>
          <h3>Unable to Load Student Corner</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-corner-page">
      {/* HERO */}
      <section className="student-corner-hero">
        <div className="student-corner-overlay">
          <div className="container">
            <div className="student-corner-hero-content">
              <span>CS DEPARTMENT</span>
              <h1>Student Corner</h1>
              <p style={{ color: "white" }}>
                Important academic information, notices and resources for CSE
                students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE INTRO */}
      <section className="student-corner-intro">
        <div className="container">
          <div className="student-corner-heading">
            <span>STUDENT RESOURCES</span>
            <h2>CS Student Corner</h2>
            <p>
              Access the latest notices, academic timetable and syllabus
              documents of the CSE Department.
            </p>
          </div>
        </div>
      </section>

      {/* NOTICES */}
      <section id="student-notices" className="student-corner-section">
        <div className="container">
          <div className="student-section-header">
            <div className="student-section-title">
              <div className="student-section-icon">
                <FaBullhorn />
              </div>
              <div>
                <span>LATEST UPDATES</span>
                <h2>Notices</h2>
              </div>
            </div>
            <div className="student-section-count">
              {notices.length} Notices
            </div>
          </div>

          {notices.length > 0 ? (
            <div className="student-notice-list">
              {currentNotices.map((notice, index) => (
                <div className="student-notice-item" key={notice._id || index}>
                  <div className="student-notice-number">
                    {String(noticeStartIndex + index + 1).padStart(2, "0")}
                  </div>
                  <div className="student-notice-icon">
                    <FaFilePdf />
                  </div>
                  <div className="student-notice-content">
                    <h3>{notice.title}</h3>
                    {notice.date && (
                      <span>Published on {formatDate(notice.date)}</span>
                    )}
                  </div>
                  <div className="student-notice-actions">
                    {notice.driveLink && (
                      <>
                        <a
                          href={notice.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="student-view-btn"
                        >
                          <FaEye /> View Document
                        </a>
                        <a
                          href={notice.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="student-download-btn"
                        >
                          <FaDownload /> Open PDF
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "45px 20px" }}>
              <FaBullhorn style={{ fontSize: "40px", marginBottom: "15px" }} />
              <h3>No Notices Available</h3>
              <p>New notices will be published here by the department.</p>
            </div>
          )}

          {totalNoticePages > 1 && (
            <div className="student-pagination">
              <button
                type="button"
                disabled={currentNoticePage === 1}
                onClick={() => setCurrentNoticePage((prev) => prev - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
              <div className="student-page-numbers">
                {Array.from({ length: totalNoticePages }, (_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={currentNoticePage === index + 1 ? "active" : ""}
                    onClick={() => setCurrentNoticePage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={currentNoticePage === totalNoticePages}
                onClick={() => setCurrentNoticePage((prev) => prev + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TIME TABLE */}
      <section
        id="student-timetable"
        className="student-corner-section timetable-section"
      >
        <div className="container">
          <div className="student-section-header">
            <div className="student-section-title">
              <div className="student-section-icon">
                <FaCalendarAlt />
              </div>
              <div>
                <span>ACADEMIC SCHEDULE</span>
                <h2>Time Table</h2>
              </div>
            </div>
            <div className="student-section-count">
              {timeTables.length} Available
            </div>
          </div>

          {timeTables.length > 0 ? (
            <div className="timetable-list">
              {timeTables.map((table, index) => (
                <div key={table._id || index} className="timetable-item">
                  <div className="timetable-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="timetable-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="timetable-content">
                    <h3>{table.title}</h3>
                    <p>{table.subtitle || "Class Time Table"}</p>
                  </div>
                  {table.semester && (
                    <div className="timetable-badge">
                      Semester {table.semester}
                    </div>
                  )}
                  <div className="timetable-actions">
                    <a
                      href={table.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="student-view-btn"
                    >
                      <FaEye /> View PDF
                    </a>
                    <a
                      href={table.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="student-download-btn"
                    >
                      <FaDownload /> Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "45px 20px" }}>
              <FaCalendarAlt
                style={{ fontSize: "40px", marginBottom: "15px" }}
              />
              <h3>No Time Table Available</h3>
              <p>Time table information will be published here.</p>
            </div>
          )}
        </div>
      </section>

      {/* SYLLABUS */}
      <section
        id="student-syllabus"
        className="student-corner-section syllabus-section"
      >
        <div className="container">
          <div className="student-section-header">
            <div className="student-section-title">
              <div className="student-section-icon">
                <FaBook />
              </div>
              <div>
                <span>ACADEMIC CURRICULUM</span>
                <h2>Syllabus</h2>
              </div>
            </div>
            <div className="student-section-count">
              {syllabus.length} Available
            </div>
          </div>

          {syllabus.length > 0 ? (
            <div className="syllabus-list">
              {syllabus.map((item, index) => (
                <div className="syllabus-item" key={item._id || index}>
                  <div className="syllabus-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="syllabus-icon">
                    <FaFilePdf />
                  </div>
                  <div className="syllabus-content">
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  {item.semester && (
                    <div className="syllabus-badge">
                      Semester {item.semester}
                    </div>
                  )}
                  <div className="syllabus-actions">
                    <a
                      href={item.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="student-view-btn"
                    >
                      <FaEye /> View PDF
                    </a>
                    <a
                      href={item.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="student-download-btn"
                    >
                      <FaDownload /> Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "45px 20px" }}>
              <FaBook style={{ fontSize: "40px", marginBottom: "15px" }} />
              <h3>No Syllabus Available</h3>
              <p>Syllabus documents will be published here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentCorner;
