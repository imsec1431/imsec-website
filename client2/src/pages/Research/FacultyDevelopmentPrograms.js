import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Spinner } from "react-bootstrap";
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
      item.speaker?.toLowerCase().includes(search.toLowerCase()),
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

  return (
    <>
      {/*================ Hero =================*/}
      <section className="fdp-hero">
        <Container>
          <div className="hero-content">
            <h1>Faculty Development Programs</h1>
            <p style={{ color: "white" }}>
              Home <span>/</span> Research <span>/</span> Faculty Development
              Programs
            </p>
          </div>
        </Container>
      </section>

      {/*================ About =================*/}
      <section className="fdp-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src={
                  content?.aboutImage ||
                  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80"
                }
                alt="Faculty Development Program"
                className="img-fluid about-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "var(--primary)" }}>
                {content?.sectionTag || "CONTINUOUS LEARNING"}
              </h6>

              <h2 className="section-title">
                {content?.title || "Faculty Development Programs"}
              </h2>

              <p>
                {content?.description1 ||
                  "IMS Engineering College regularly organizes Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), Workshops and Refresher Courses to enhance the teaching, research and professional competencies of faculty members."}
              </p>

              <p>
                {content?.description2 ||
                  "These programs bridge the gap between academia and industry by providing exposure to emerging technologies, innovative teaching methodologies, research practices and leadership development."}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Statistics =================*/}
      <section className="fdp-stats py-5">
        <Container>
          <Row className="g-4">
            {(content?.stats?.length > 0 ? content.stats : defaultStats).map(
              (item, idx) => (
                <Col lg={3} md={6} key={idx}>
                  <div className="stat-card">
                    <h2>{item.number}</h2>
                    <p>{item.title}</p>
                  </div>
                </Col>
              ),
            )}
          </Row>
        </Container>
      </section>
      {/*================ Annual Timeline =================*/}
      <section className="fdp-timeline py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              YEAR WISE FDPs
            </h6>

            <h2 className="section-title">
              Annual <span>Timeline</span>
            </h2>
          </div>

          <Row className="g-4">
            {(content?.timeline?.length > 0
              ? content.timeline
              : defaultTimeline
            ).map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="timeline-card">
                  <FaCalendarAlt className="timeline-icon" />
                  <h3>{item.year}</h3>
                  <p>{item.count}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ FDP Categories =================*/}
      <section className="fdp-category py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              FDP <span>Domains</span>
            </h2>
          </div>

          <Row className="g-4">
            {(content?.categories?.length > 0
              ? content.categories
              : defaultCategories
            ).map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="category-card">
                  <FaLaptop className="category-icon" />
                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/*================ Search =================*/}
      <section className="search-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />
                <Form.Control
                  type="text"
                  placeholder="Search by FDP Title, Department or Speaker..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/*================ FDP Repository =================*/}
      <section className="fdp-table-section pb-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading FDP Repository...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="fdp-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>FDP Title</th>
                    <th>Department</th>
                    <th>Resource Person</th>
                    <th>Duration</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>Organizer</th>
                    <th>Brochure</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFDP.length > 0 ? (
                    filteredFDP.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.department}</td>
                        <td>{item.speaker}</td>
                        <td>{item.duration}</td>
                        <td>
                          <span className="mode-badge">{item.mode}</span>
                        </td>
                        <td>{item.date}</td>
                        <td>{item.organizer}</td>
                        <td>
                          {item.brochure && item.brochure !== "#" ? (
                            <a
                              href={
                                item.brochure.startsWith("http")
                                  ? item.brochure
                                  : `https://${item.brochure}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="download-link"
                            >
                              Download
                              <FaExternalLinkAlt className="ms-2" />
                            </a>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        No faculty development programs match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </section>

      {/*================ Benefits =================*/}
      <section className="fdp-benefits py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              BENEFITS
            </h6>

            <h2 className="section-title">
              Why Attend <span>FDPs?</span>
            </h2>
          </div>

          <Row className="g-4">
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
              <Col lg={3} md={6} key={index}>
                <div className="benefit-card">
                  <div className="benefit-icon">{item.icon}</div>
                  <h5>{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default FacultyDevelopmentPrograms;
