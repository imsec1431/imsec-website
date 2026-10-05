import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/ui/DashboardCard";
import DashboardSection from "../../components/ui/DashboardSection";
import "./Dashboard.css";

import {
  FaBuilding,
  FaUsers,
  FaImages,
  FaBullhorn,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaChartLine,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   HELPER
   Convert different API response formats into an array
========================================================= */

const extractArray = (result) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.events)) {
    return result.events;
  }

  if (Array.isArray(result?.results)) {
    return result.results;
  }

  if (Array.isArray(result?.data?.events)) {
    return result.data.events;
  }

  if (Array.isArray(result?.data?.results)) {
    return result.data.results;
  }

  return [];
};

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const [stats, setStats] = useState({
    departments: 0,
    faculty: 0,
    gallery: 0,
    notices: 0,
    events: 0,
    downloads: 0,
    visitors: 0,
  });

  const [recentDepartments, setRecentDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        /* =================================================
           DEPARTMENTS
        ================================================= */

        let departments = [];

        try {
          const response = await fetch(`${API_URL}/departments`);

          const result = await response.json();

          // console.log("Departments API:", result);

          if (response.ok) {
            departments = extractArray(result);
          } else {
            console.error(
              "Departments API Error:",
              result?.message || "Failed",
            );
          }
        } catch (err) {
          console.error("Department dashboard error:", err);
        }

        /* =================================================
           FACULTY
        ================================================= */

        let faculty = [];

        try {
          const response = await fetch(`${API_URL}/department-faculty`);

          const result = await response.json();

          // console.log("Faculty API:", result);

          if (response.ok) {
            faculty = extractArray(result);
          } else {
            console.error("Faculty API Error:", result?.message || "Failed");
          }
        } catch (err) {
          console.error("Faculty dashboard error:", err);
        }

        /* =================================================
           NOTICES
        ================================================= */

        let notices = [];

        try {
          const response = await fetch(`${API_URL}/circular-notice`);

          const result = await response.json();

          // console.log("Notices API:", result);

          if (response.ok) {
            notices = extractArray(result);
          } else {
            console.error("Notice API Error:", result?.message || "Failed");
          }
        } catch (err) {
          console.error("Notice dashboard error:", err);
        }

        /* =================================================
           EVENTS
        ================================================= */

        let events = [];

        try {
          const response = await fetch(`${API_URL}/department-events`);

          const result = await response.json();

          /*
             IMPORTANT:
             Open browser console and check this output.
          */

          // console.log("================================");
          // console.log("DEPARTMENT EVENTS API RESPONSE");
          // console.log(result);
          // console.log("================================");

          if (response.ok) {
            events = extractArray(result);

            /*
              If backend sends count/total but data is not
              directly an array, use that count.
            */

            const backendEventCount =
              Number(result?.count) ||
              Number(result?.total) ||
              Number(result?.data?.count) ||
              Number(result?.data?.total) ||
              events.length;

            // console.log("Events Array:", events);

            // console.log("Events Count:", backendEventCount);

            /*
              Store backend count separately below.
            */

            window.__IMSEC_EVENT_COUNT__ = backendEventCount;
          } else {
            console.error(
              "Events API Error:",
              result?.message || "Failed to fetch events",
            );

            setError(result?.message || "Unable to load department events.");
          }
        } catch (err) {
          console.error("Events dashboard error:", err);

          setError("Department events could not be loaded.");
        }

        /* =================================================
           EVENT COUNT
        ================================================= */

        const eventCount =
          typeof window.__IMSEC_EVENT_COUNT__ === "number"
            ? window.__IMSEC_EVENT_COUNT__
            : events.length;

        /* =================================================
           UPDATE STATS
        ================================================= */

        setStats({
          departments: departments.length,

          faculty: faculty.length,

          gallery: 0,

          notices: notices.length,

          events: eventCount,

          downloads: 0,

          visitors: 0,
        });

        /* =================================================
           RECENT DEPARTMENTS
        ================================================= */

        setRecentDepartments(
          departments
            .slice()
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.updatedAt || 0);

              const dateB = new Date(b.createdAt || b.updatedAt || 0);

              return dateB - dateA;
            })
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Dashboard Error:", err);

        setError(err.message || "Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =======================================================
     QUICK ACTIONS
  ======================================================= */

  const quickActions = [
    {
      title: "Manage Departments",

      description: "Create and update department information",

      path: "/imsec-control-center/departments",

      icon: <FaBuilding />,
    },

    {
      title: "Manage Faculty",

      description: "Manage faculty and HOD information",

      path: "/imsec-control-center/departments",

      icon: <FaUsers />,
    },

    {
      title: "Manage Notices",

      description: "Publish academic and campus notices",

      path: "/imsec-control-center/academics/circular-notice",

      icon: <FaBullhorn />,
    },

    {
      title: "Manage Events",

      description: "Add and manage department events",

      path: "/imsec-control-center/departments",

      icon: <FaCalendarAlt />,
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FaSpinner className="dashboard-spinner" />

        <h3>Loading Dashboard...</h3>

        <p>Please wait while the latest website information is being loaded.</p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">IMSEC CONTROL CENTER</span>

          <h1 className="page-title">Dashboard</h1>

          <p className="dashboard-subtitle">
            Manage and monitor the IMS Engineering College website from one
            central place.
          </p>
        </div>

        <div className="dashboard-status">
          <FaCheckCircle />

          <div>
            <strong>System Online</strong>

            <span>Website administration is running normally</span>
          </div>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="dashboard-alert">
          <FaExclamationTriangle />

          <div>
            <strong>Some dashboard data could not be loaded.</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="dashboard-statistics">
        <div className="dashboard-grid">
          <DashboardCard
            title="Departments"
            value={stats.departments}
            icon={<FaBuilding />}
            color="#0A2E5C"
          />

          <DashboardCard
            title="Faculty"
            value={stats.faculty}
            icon={<FaUsers />}
            color="#198754"
          />

          <DashboardCard
            title="Gallery Images"
            value={stats.gallery}
            icon={<FaImages />}
            color="#0dcaf0"
          />

          <DashboardCard
            title="Notices"
            value={stats.notices}
            icon={<FaBullhorn />}
            color="#ffc107"
          />

          <DashboardCard
            title="Events"
            value={stats.events}
            icon={<FaCalendarAlt />}
            color="#6f42c1"
          />

          <DashboardCard
            title="Downloads"
            value={stats.downloads}
            icon={<FaDownload />}
            color="#20c997"
          />

          <DashboardCard
            title="Visitors"
            value={stats.visitors}
            icon={<FaEye />}
            color="#fd7e14"
          />

          <DashboardCard
            title="Content Modules"
            value="20+"
            icon={<FaChartLine />}
            color="#dc3545"
          />
        </div>
      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <DashboardSection title="Quick Actions">
        <div className="dashboard-quick-grid">
          {quickActions.map((item, index) => (
            <Link to={item.path} className="dashboard-quick-card" key={index}>
              <div className="dashboard-quick-icon">{item.icon}</div>

              <div className="dashboard-quick-content">
                <h4>{item.title}</h4>

                <p>{item.description}</p>
              </div>

              <FaArrowRight className="dashboard-quick-arrow" />
            </Link>
          ))}
        </div>
      </DashboardSection>

      {/* =================================================
          RECENT DEPARTMENTS
      ================================================= */}

      <DashboardSection title="Recent Departments">
        {recentDepartments.length === 0 ? (
          <div className="dashboard-empty">
            <FaBuilding />

            <h4>No departments available</h4>

            <p>Add departments from Department Management.</p>

            <Link
              to="/imsec-control-center/departments"
              className="dashboard-primary-btn"
            >
              Manage Departments
            </Link>
          </div>
        ) : (
          <div className="dashboard-department-list">
            {recentDepartments.map((department, index) => (
              <div
                className="dashboard-department-item"
                key={department._id || index}
              >
                <div className="dashboard-department-icon">
                  <FaBuilding />
                </div>

                <div className="dashboard-department-info">
                  <h4>
                    {department.name ||
                      department.departmentName ||
                      "Department"}
                  </h4>

                  <span>
                    {department.code || department.slug || "Department"}
                  </span>
                </div>

                <span
                  className={
                    department.status === "Inactive"
                      ? "dashboard-badge inactive"
                      : "dashboard-badge active"
                  }
                >
                  {department.status || "Active"}
                </span>

                <Link
                  to={`/imsec-control-center/departments/${
                    department.slug || department._id
                  }`}
                  className="dashboard-view-btn"
                >
                  View
                  <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      {/* =================================================
          SYSTEM INFORMATION
      ================================================= */}

      <DashboardSection title="System Information">
        <div className="dashboard-system-grid">
          <div className="system-info-card">
            <div className="system-info-icon online">
              <FaCheckCircle />
            </div>

            <div>
              <span>Website Status</span>

              <strong>Online</strong>
            </div>
          </div>

          <div className="system-info-card">
            <div className="system-info-icon">
              <FaChartLine />
            </div>

            <div>
              <span>CMS Version</span>

              <strong>Version 1.0</strong>
            </div>
          </div>

          <div className="system-info-card">
            <div className="system-info-icon">
              <FaClock />
            </div>

            <div>
              <span>Dashboard Status</span>

              <strong>Live Data</strong>
            </div>
          </div>

          <div className="system-info-card">
            <div className="system-info-icon online">
              <FaCheckCircle />
            </div>

            <div>
              <span>API Server</span>

              <strong>Running</strong>
            </div>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default Dashboard;
