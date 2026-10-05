import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaInfoCircle,
  FaFileAlt,
  FaBook,
  FaUsers,
  FaBookOpen,
  FaLightbulb,
  FaUniversity,
  FaChalkboardTeacher,
} from "react-icons/fa";

import "./department-research.css";

const DepartmentResearch = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Convert slug into readable department name
  const departmentName = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Department";

  const researchModules = [
    {
      title: "About",
      description: "Manage department research introduction and information",
      icon: <FaInfoCircle />,
      path: "about",
    },
    {
      title: "Research Policy",
      description: "Manage research policies and guidelines",
      icon: <FaFileAlt />,
      path: "research-policy",
    },
    {
      title: "Journals",
      description: "Manage department research journals",
      icon: <FaBook />,
      path: "journals",
    },
    {
      title: "Conference Papers",
      description: "Manage conference papers and publications",
      icon: <FaUsers />,
      path: "conference-papers",
    },
    {
      title: "Books / Chapters",
      description: "Manage books and book chapters",
      icon: <FaBookOpen />,
      path: "books-chapters",
    },
    {
      title: "Patents",
      description: "Manage department patents and intellectual property",
      icon: <FaLightbulb />,
      path: "patents",
    },

    {
      title: "FDPs",
      description: "Manage Faculty Development Programmes",
      icon: <FaChalkboardTeacher />,
      path: "fdps",
    },
  ];

  const handleModuleClick = (modulePath) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/${modulePath}`,
    );
  };

  return (
    <div className="department-research-page">
      {/* Header */}
      <div className="department-research-header">
        <div>
          <span className="department-research-label">DEPARTMENT RESEARCH</span>

          <h1>{departmentName}</h1>

          <p>
            Manage research related information, publications, policies and
            activities for the {departmentName} department.
          </p>
        </div>

        <div className="department-research-badge">
          <FaLightbulb />
          <span>Research Management</span>
        </div>
      </div>

      {/* Module Grid */}
      <div className="department-research-content">
        <div className="research-section-title">
          <h2>Research Modules</h2>
          <p>Select a module to manage department research information.</p>
        </div>

        <div className="research-module-grid">
          {researchModules.map((module) => (
            <button
              type="button"
              className="research-module-card"
              key={module.path}
              onClick={() => handleModuleClick(module.path)}
            >
              <div className="research-module-icon">{module.icon}</div>

              <div className="research-module-info">
                <h3>{module.title}</h3>
                <p>{module.description}</p>

                <span className="research-module-action">Manage Module →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentResearch;
