import React from "react";
import { useNavigate } from "react-router-dom";
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

import "./research-management.css";

const ResearchManagement = () => {
  const navigate = useNavigate();

  const researchModules = [
    {
      title: "About",
      description: "Manage research introduction and information",
      icon: <FaInfoCircle />,
      path: "/imsec-control-center/research/about",
    },
    {
      title: "Research Policy",
      description: "Manage research policies and documents",
      icon: <FaFileAlt />,
      path: "/imsec-control-center/research/research-policy",
    },
    {
      title: "Journals",
      description: "Manage journal publications",
      icon: <FaBook />,
      path: "/imsec-control-center/research/journals",
    },
    {
      title: "Conference Papers",
      description: "Manage conference publications",
      icon: <FaUsers />,
      path: "/imsec-control-center/research/conference-papers",
    },
    {
      title: "Books / Chapters",
      description: "Manage books and chapter publications",
      icon: <FaBookOpen />,
      path: "/imsec-control-center/research/books-chapters",
    },
    {
      title: "Patents",
      description: "Manage patents and intellectual property",
      icon: <FaLightbulb />,
      path: "/imsec-control-center/research/patents",
    },
    {
      title: "FDPs",
      description: "Manage faculty development programs",
      icon: <FaChalkboardTeacher />,
      path: "/imsec-control-center/research/fdps",
    },
  ];

  return (
    <div className="research-management">
      <div className="research-management-header">
        <div>
          <h2>Research Management</h2>
          <p>
            Manage research content, publications, patents and
            faculty development programs.
          </p>
        </div>
      </div>

      <div className="research-management-grid">
        {researchModules.map((module) => (
          <div
            key={module.title}
            className="research-management-card"
            onClick={() => navigate(module.path)}
          >
            <div className="research-management-icon">
              {module.icon}
            </div>

            <div className="research-management-content">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>

            <div className="research-management-arrow">
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchManagement;