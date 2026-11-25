import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import {
  FaSearch,
  FaExternalLinkAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaCalendarAlt,
  FaLaptop,
} from "react-icons/fa";
import {
  getPublicFDPs,
  getPublicFDPContent,
} from "../../services/facultyDevelopmentProgramService.js";
import "./FacultyDevelopmentPrograms.css";

const FacultyDevelopmentPrograms = () => {
  const [fdpData, setFdpData] = useState([]);
  const [content, setContent] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fdpRes, contentRes] = await Promise.all([
          getPublicFDPs(),
          getPublicFDPContent(),
        ]);
        setFdpData(fdpRes.data || []);
        if (contentRes.data) {
          setContent(contentRes.data);
        }
      } catch (err) {
        console.error("Failed to load FDP data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFDP = fdpData.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.department?.toLowerCase().includes(search.toLowerCase()) ||
      item.speaker?.toLowerCase().includes(search.toLowerCase())
  );

  const defaultStats = [
    { id: 1, number: "150+", title: "FDPs Conducted" },
    { id: 2, number: "3500+", title: "Faculty Participants" },
    { id: 3, number: "85+", title: "Industry Experts" },
    { id: 4, number: "40+", title: "Collaborating Organizations" },
  ];

  const defaultCategories = [
    "Artificial Intelligence",
    "Machine Learning",
    "Cyber Security",
    "Cloud Computing",
    "Data Science",
    "Research Methodology",
    "Outcome Based Education",
    "NEP 2020",
    "Teaching Pedagogy",
    "Innovation & IPR",
    "Leadership Development",
    "Industry Training",
  ];

  const defaultTimeline = [
    { year: "2021", count: "18 FDPs" },
    { year: "2022", count: "24 FDPs" },
    { year: "2023", count: "31 FDPs" },
    { year: "2024", count: "39 FDPs" },
  ];

  if (loading) {
    return (
      <div className="fdp-page">
        <div className="fdp-status-page">
          <div className="text-center">
            <Spinner
              animation="border"
              role="status"
              style={{
                width: "42px",
                height: "42px",
                color: "#002147",
              }}
            />
            <p className="mt-3 text-muted">Loading FDP Repository...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="fdp-page">
      {/* ================= Hero Banner ================= */}
      <section className="fdp-hero">
        <div className="fdp-hero-content">
          <h1>Faculty Development Programs</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="fdp-content">
        <div className="fdp-container">
          {/* Introduction Box */}
          <div className="fdp-introduction" style={{ textAlign: "justify" }}>
            <p style={{ textAlign: "justify" }}>
              {content?.description1 ||
                "IMS Engineering College regularly organizes Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), Workshops and Refresher Courses to enhance the teaching, research and professional competencies of faculty members."}
            </p>
            <p style={{ textAlign: "justify" }}>
              {content?.description2 ||
                "These programs bridge the gap between academia and industry by providing exposure to emerging technologies, innovative teaching methodologies, advanced research practices and academic leadership development."}
            </p>
          </div>

          {/* Statistics */}
          <section className="fdp-section">
            <h2>Key FDP Statistics</h2>
            <Row className="g-3 mt-1">
              {(content?.stats?.length > 0 ? content.stats : defaultStats).map(
                (item, idx) => (
                  <Col lg={3} sm={6} key={idx}>
                    <div className="fdp-stat-card">
                      <h3>{item.number}</h3>
                      <p>{item.title}</p>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </section>

          {/* Annual Timeline */}
          <section className="fdp-section">
            <h2>Annual FDP Timeline</h2>
            <Row className="g-3 mt-1">
              {(content?.timeline?.length > 0
                ? content.timeline
                : defaultTimeline
              ).map((item, index) => (
                <Col lg={3} sm={6} key={index}>
                  <div className="fdp-timeline-card">
                    <div className="fdp-timeline-icon">
                      <FaCalendarAlt />
                    </div>
                    <h4>{item.year}</h4>
                    <p>{item.count}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* FDP Domains */}
          <section className="fdp-section">
            <h2>FDP Specialization Domains</h2>
            <Row className="g-3 mt-1">
              {(content?.categories?.length > 0
                ? content.categories
                : defaultCategories
              ).map((item, index) => (
                <Col lg={3} sm={6} key={index}>
                  <div className="fdp-domain-card">
                    <div className="fdp-domain-icon">
                      <FaLaptop />
                    </div>
                    <h5>{item}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* FDP Table Section */}
          <section className="fdp-section">
            <h2>FDP Repository &amp; Directory</h2>
            <p style={{ textAlign: "justify" }}>
              Search and explore institutional faculty development programs,
              pedagogical enrichment sessions, and technical training workshops
              conducted at IMS Engineering College.
            </p>

            {/* Search Bar */}
            <div className="fdp-search-wrapper mt-3">
              <Row>
                <Col lg={6} md={8}>
                  <div className="fdp-search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by FDP Title, Department or Resource Person..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div className="fdp-table-container mt-3">
              <table className="fdp-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      S.No.
                    </th>
                    <th>FDP Title</th>
                    <th>Department</th>
                    <th>Resource Person</th>
                    <th className="text-center" style={{ width: "100px" }}>
                      Duration
                    </th>
                    <th className="text-center" style={{ width: "95px" }}>
                      Mode
                    </th>
                    <th className="text-center" style={{ width: "115px" }}>
                      Date
                    </th>
                    <th>Organizer</th>
                    <th className="text-center" style={{ width: "110px" }}>
                      Brochure
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFDP.length > 0 ? (
                    filteredFDP.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="fdp-title-cell">{item.title}</td>
                        <td>{item.department}</td>
                        <td>{item.speaker}</td>
                        <td className="text-center">{item.duration}</td>
                        <td className="text-center">
                          <span className="fdp-mode-badge">{item.mode}</span>
                        </td>
                        <td className="text-center">{item.date}</td>
                        <td>{item.organizer}</td>
                        <td className="text-center">
                          {item.brochure && item.brochure !== "#" ? (
                            <a
                              href={
                                item.brochure.startsWith("http")
                                  ? item.brochure
                                  : `https://${item.brochure}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="fdp-download-link"
                            >
                              <span>Brochure</span>
                              <FaExternalLinkAlt style={{ fontSize: "10px" }} />
                            </a>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        No faculty development programs found matching your
                        search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Benefits */}
          <section className="fdp-section">
            <h2>Why Attend Faculty Development Programs?</h2>
            <Row className="g-3 mt-1">
              {[
                {
                  icon: <FaChalkboardTeacher />,
                  title: "Teaching Excellence",
                },
                {
                  icon: <FaUsers />,
                  title: "Professional Networking",
                },
                {
                  icon: <FaLaptop />,
                  title: "Latest Technologies",
                },
                {
                  icon: <FaCalendarAlt />,
                  title: "Career Development",
                },
              ].map((item, index) => (
                <Col lg={3} sm={6} key={index}>
                  <div className="fdp-domain-card">
                    <div className="fdp-domain-icon">{item.icon}</div>
                    <h5>{item.title}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        </div>
      </section>
    </main>
  );
};

export default FacultyDevelopmentPrograms;
