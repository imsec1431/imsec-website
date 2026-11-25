import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
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
      item.applicationNo?.includes(search)
  );

  const dynamicStats = [
    {
      id: 1,
      number: stats.filed ? `${stats.filed}+` : "150+",
      title: "Patents Filed",
    },
    {
      id: 2,
      number: stats.granted ? `${stats.granted}+` : "40+",
      title: "Patents Granted",
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

  if (loading) {
    return (
      <div className="patents-page">
        <div className="patents-status">
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
            <p className="mt-3 text-muted">Loading Patents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="patents-page">
      {/* ================= Hero Banner ================= */}
      <section className="patents-hero">
        <div className="patents-hero-content">
          <h1>Patents &amp; Intellectual Property</h1>
        </div>
      </section>

      {/* ================= Content Area ================= */}
      <section className="patents-content">
        <div className="patents-container">
          {/* Introduction Box */}
          <div
            className="patents-introduction"
            style={{ textAlign: "justify" }}
          >
            <p style={{ textAlign: "justify" }}>
              {content?.description1 ||
                "IMS Engineering College promotes innovation, creativity and intellectual property through quality research and patent filing. Faculty members and students are encouraged to transform innovative ideas into valuable intellectual assets."}
            </p>
            <p style={{ textAlign: "justify" }}>
              {content?.description2 ||
                "The institute actively supports patent drafting, filing, publication and commercialization through its dedicated Research & Development Cell, fostering entrepreneurial mindsets and technological breakthroughs."}
            </p>
          </div>

          {/* Statistics */}
          <section className="patents-section">
            <h2>Intellectual Property Highlights</h2>
            <Row className="g-3 mt-1">
              {dynamicStats.map((item) => (
                <Col lg={3} sm={6} key={item.id}>
                  <div className="patent-stat-card">
                    <h3>{item.number}</h3>
                    <p>{item.title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Patent Timeline */}
          <section className="patents-section">
            <h2>Patent Filing Timeline</h2>
            <Row className="g-3 mt-1">
              {(content?.timeline && content.timeline.length > 0
                ? content.timeline
                : [
                    { year: "2022", count: "15 Filed" },
                    { year: "2023", count: "28 Filed" },
                    { year: "2024", count: "42 Filed" },
                    { year: "2025", count: "55 Filed" },
                  ]
              ).map((item, index) => (
                <Col lg={3} sm={6} key={index}>
                  <div className="patent-timeline-card">
                    <div className="patent-timeline-icon">
                      <FaAward />
                    </div>
                    <h4>{item.year}</h4>
                    <p>{item.count}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Patent Directory Table */}
          <section className="patents-section">
            <h2>Patents Directory</h2>
            <p style={{ textAlign: "justify" }}>
              Explore the comprehensive registry of patents filed, published,
              and granted by the Indian Patent Office and international patent
              authorities to IMS Engineering College faculty and student
              inventors.
            </p>

            {/* Search Bar */}
            <div className="patent-search-wrapper mt-3">
              <Row>
                <Col lg={6} md={8}>
                  <div className="patent-search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by Patent Title, Inventor or Application Number..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div className="patent-table-container mt-3">
              <table className="patent-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      S.No.
                    </th>
                    <th style={{ width: "150px" }}>Application No.</th>
                    <th>Inventor(s)</th>
                    <th>Patent Title</th>
                    <th>Applicant</th>
                    <th className="text-center" style={{ width: "105px" }}>
                      Filed Date
                    </th>
                    <th className="text-center" style={{ width: "120px" }}>
                      Published / Granted
                    </th>
                    <th className="text-center" style={{ width: "130px" }}>
                      Grant / Pub No.
                    </th>
                    <th className="text-center" style={{ width: "105px" }}>
                      Status
                    </th>
                    <th className="text-center" style={{ width: "95px" }}>
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatents.length > 0 ? (
                    filteredPatents.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="text-center">{index + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          {item.applicationNo}
                        </td>
                        <td>{item.inventors}</td>
                        <td className="patent-title-cell">{item.title}</td>
                        <td>{item.applicant}</td>
                        <td className="text-center">
                          {item.filedDate || "—"}
                        </td>
                        <td className="text-center">
                          {item.publishedDate || "—"}
                        </td>
                        <td className="text-center">
                          {item.patentNo || "—"}
                        </td>
                        <td className="text-center">
                          <span
                            className={`patent-status-badge ${
                              item.status ? item.status.toLowerCase() : "filed"
                            }`}
                          >
                            {item.status || "Filed"}
                          </span>
                        </td>
                        <td className="text-center">
                          {item.url && item.url !== "#" ? (
                            <a
                              href={
                                item.url.startsWith("http")
                                  ? item.url
                                  : `https://${item.url}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="patent-view-link"
                            >
                              <span>View</span>
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
                      <td colSpan={10} className="text-center py-4 text-muted">
                        No patent records found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Patents;
