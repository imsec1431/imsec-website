import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Spinner } from "react-bootstrap";
import { FaSearch, FaExternalLinkAlt, FaAward } from "react-icons/fa";
import {
  getPublicPatents,
  getPublicPatentContent,
} from "../../services/patentService.js";
import "./Patents.css";

const Patents = () => {
  const [patents, setPatents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    filed: 0,
    granted: 0,
    published: 0,
  });
  const [content, setContent] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patentsRes, contentRes] = await Promise.all([
          getPublicPatents(),
          getPublicPatentContent(),
        ]);

        setPatents(patentsRes.data || []);
        if (patentsRes.stats) {
          setStats(patentsRes.stats);
        }
        if (contentRes.data) {
          setContent(contentRes.data);
        }
      } catch (err) {
        console.error("Failed to load patent page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatents = patents.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.inventors?.toLowerCase().includes(search.toLowerCase()) ||
      item.applicationNo?.includes(search),
  );

  const dynamicStats = [
    {
      id: 1,
      number: stats.filed ? `${stats.filed}+` : "150+",
      title: "Patent Filed",
    },
    {
      id: 2,
      number: stats.granted ? `${stats.granted}+` : "40+",
      title: "Patent Granted",
    },
    {
      id: 3,
      number: stats.published ? `${stats.published}` : "12",
      title: "Copyrights / Published",
    },
    {
      id: 4,
      number: stats.total ? `${stats.total}` : "18",
      title: "Total Innovations",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="patent-hero">
        <Container>
          <div className="hero-content">
            <h1>Patents</h1>
            <p style={{ color: "white" }}>
              Home <span>/</span> Research <span>/</span> Patents
            </p>
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="patent-about py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <img
                src={
                  content?.aboutImage ||
                  "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&q=80"
                }
                alt="Research"
                className="img-fluid about-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag" style={{ color: "black" }}>
                {content?.sectionTag || "RESEARCH & INNOVATION"}
              </h6>

              <h2 className="section-title">
                {content?.title || "Intellectual Property & Patents"}
              </h2>

              <p>
                {content?.description1 ||
                  "IMS Engineering College promotes innovation, creativity and intellectual property through quality research and patent filing. Faculty members and students are encouraged to transform innovative ideas into valuable intellectual assets."}
              </p>

              <p>
                {content?.description2 ||
                  "The institute actively supports patent drafting, filing, publication and commercialization through its Research & Development Cell."}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics */}
      <section className="stats-section py-5">
        <Container>
          <Row className="g-4">
            {dynamicStats.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="stat-card">
                  <h2>{item.number}</h2>
                  <p>{item.title}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* Patent Timeline */}
      <section className="timeline-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              PATENT TIMELINE
            </h6>
            <h2 className="section-title">
              Year Wise <span>Progress</span>
            </h2>
          </div>

          <Row className="g-4">
            {(content?.timeline && content.timeline.length > 0
              ? content.timeline
              : [
                  { year: "2022", count: "15 Filed" },
                  { year: "2023", count: "28 Filed" },
                  { year: "2024", count: "42 Filed" },
                  { year: "2025", count: "55 Filed" },
                ]
            ).map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="timeline-card">
                  <FaAward className="timeline-icon" />
                  <h3>{item.year}</h3>
                  <p>{item.count}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* Search */}
      <section className="search-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />
                <Form.Control
                  type="text"
                  placeholder="Search by Patent Title, Inventor or Application Number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Patent Table */}
      <section className="table-section pb-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading Patents...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="patent-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Application No.</th>
                    <th>Inventor(s)</th>
                    <th>Patent Title</th>
                    <th>Applicant</th>
                    <th>Filed Date</th>
                    <th>Published / Granted Date</th>
                    <th>Publication / Grant No.</th>
                    <th>Status</th>
                    <th>Patent URL</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatents.length > 0 ? (
                    filteredPatents.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{item.applicationNo}</td>
                        <td>{item.inventors}</td>
                        <td>{item.title}</td>
                        <td>{item.applicant}</td>
                        <td>{item.filedDate || "-"}</td>
                        <td>{item.publishedDate || "-"}</td>
                        <td>{item.patentNo || "-"}</td>
                        <td>
                          <span
                            className={`status ${item.status?.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.url && item.url !== "#" ? (
                            <a
                              href={
                                item.url.startsWith("http")
                                  ? item.url
                                  : `https://${item.url}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="view-link"
                            >
                              View
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
                      <td colSpan={10} className="text-center py-4 text-muted">
                        No patent records match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default Patents;
