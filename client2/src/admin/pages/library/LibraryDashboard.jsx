import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaChartBar,
  FaImages,
  FaClipboardList,
  FaClock,
  FaUserTie,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import "./LibraryDashboard.css";

const modules = [
  {
    title: "Library Statistics",
    description: "Manage and update library statistics and resources.",
    icon: <FaChartBar />,
    path: "/imsec-control-center/library/statistics",
    className: "blue",
  },
  {
    title: "Library Gallery",
    description: "Manage library images and gallery content.",
    icon: <FaImages />,
    path: "/imsec-control-center/library/gallery",
    className: "green",
  },
  {
    title: "Library Guidelines",
    description: "Manage rules, policies and library guidelines.",
    icon: <FaClipboardList />,
    path: "/imsec-control-center/library/guidelines",
    className: "orange",
  },
  {
    title: "Library Timings",
    description: "Manage library opening and closing timings.",
    icon: <FaClock />,
    path: "/imsec-control-center/library/timings",
    className: "purple",
  },
  {
    title: "Librarian Profile",
    description: "Manage librarian profile and contact information.",
    icon: <FaUserTie />,
    path: "/imsec-control-center/library/librarian",
    className: "red",
  },
];

const LibraryDashboard = () => {
  return (
    <div className="library-dashboard">
      <Container fluid>
        {/* Header */}
        <div className="library-dashboard-header">
          <div className="library-title-section">
            <div className="library-main-icon">
              <FaBookOpen />
            </div>

            <div>
              <h2>Library Management</h2>
              <p>
                Manage library information, resources, timings and content from
                one place.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics / Overview */}
        <Row className="library-overview g-3 mb-4">
          <Col xl={4} md={6}>
            <div className="library-overview-card">
              <div className="overview-icon blue">
                <FaBookOpen />
              </div>

              <div>
                <span>Management Modules</span>
                <strong>{modules.length}</strong>
              </div>
            </div>
          </Col>

          <Col xl={4} md={6}>
            <div className="library-overview-card">
              <div className="overview-icon green">
                <FaImages />
              </div>

              <div>
                <span>Content Management</span>
                <strong>Active</strong>
              </div>
            </div>
          </Col>

          <Col xl={4} md={6}>
            <div className="library-overview-card">
              <div className="overview-icon purple">
                <FaClipboardList />
              </div>

              <div>
                <span>Library Administration</span>
                <strong>Ready</strong>
              </div>
            </div>
          </Col>
        </Row>

        {/* Section Heading */}
        <div className="library-section-heading">
          <div>
            <h3>Library Modules</h3>
            <p>Select a module to manage its information.</p>
          </div>
        </div>

        {/* Modules */}
        <Row className="g-4">
          {modules.map((module) => (
            <Col xl={4} lg={4} md={6} sm={12} key={module.title}>
              <Link to={module.path} className="library-module-link">
                <Card className="library-module-card border-0 h-100">
                  <Card.Body>
                    <div className="module-top">
                      <div className={`module-icon ${module.className}`}>
                        {module.icon}
                      </div>

                      <div className="module-arrow">
                        <FaArrowRight />
                      </div>
                    </div>

                    <div className="module-content">
                      <h4>{module.title}</h4>

                      <p>{module.description}</p>
                    </div>

                    <div className="module-footer">
                      <span>Manage Module</span>
                      <FaArrowRight />
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default LibraryDashboard;
