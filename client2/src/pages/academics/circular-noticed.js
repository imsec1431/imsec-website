import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  FaBullhorn,
  FaFilePdf,
  FaSearch,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaThumbtack,
} from "react-icons/fa";

import "./circular-noticed.css";
import { getCircularNotices } from "../../services/circularNoticeService";

/* =====================================================
        Static Data
        Later From Admin Panel
===================================================== */

const CircularNotice = () => {
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const fetchNotices = async () => {
    try {
      const res = await getCircularNotices();

      if (res.data?.data) {
        const activeNotices = res.data.data.filter((item) => item.active);

        setNotices(activeNotices);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);
  const categories = ["All", ...new Set(notices.map((item) => item.category))];
  const filteredData = notices
    .filter((item) => {
      const searchMatch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch = category === "All" || item.category === category;

      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (a.important !== b.important) {
        return b.important - a.important;
      }

      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }

      return new Date(b.publishDate) - new Date(a.publishDate);
    });
  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      {/* ================= Hero ================= */}

      <section className="notice-hero">
        <Container>
          <div className="hero-content">
            <h1>Circulars & Notices</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Academics
              <span>/</span>
              Circulars & Notices
            </p>
          </div>
        </Container>
      </section>

      {/* ================= Search ================= */}

      <section className="search-section py-5">
        <Container>
          <Row className="g-4">
            <Col lg={8}>
              <div className="search-box">
                <FaSearch />

                <Form.Control
                  type="text"
                  placeholder="Search Circular or Notice..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>

            <Col lg={4}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Notices ================= */}

      <section className="notice-section pb-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              Circulars &<span> Notices</span>
            </h2>
          </div>

          <Row className="g-4">
            {filteredData.map((item) => (
              <Col lg={6} key={item._id}>
                <div className="notice-card">
                  {item.important && (
                    <div className="important-tag">
                      <FaThumbtack />
                      Important
                    </div>
                  )}

                  <div className="notice-icon">
                    <FaBullhorn />
                  </div>

                  <div className="notice-content">
                    <span className="notice-category">{item.category}</span>

                    <h4>{item.title}</h4>

                    <p>{item.description}</p>

                    <div className="notice-date">
                      <FaCalendarAlt />
                      Published :{" "}
                      {new Date(item.publishDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <div className="notice-buttons mt-4">
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary rounded-pill"
                      >
                        <FaEye />
                        View
                      </a>

                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="btn btn-warning rounded-pill"
                      >
                        <FaDownload />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="notice-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>
                Stay Updated With Every Announcement
              </h2>

              <p style={{ color: "white" }}>
                Check the latest circulars, notices, office orders and academic
                announcements regularly.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CircularNotice;
