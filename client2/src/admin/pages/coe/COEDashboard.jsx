import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandshake, FaFileContract, FaUniversity } from "react-icons/fa";

import "./coe.css";

const COEDashboard = () => {
  const navigate = useNavigate();

  const coeModules = [
    {
      title: "Industry Academics Collaboration / Centres of Excellence",
      description:
        "Manage industry-academia collaboration information, partnerships and related content.Manage Centres of Excellence, their details, activities and related information. ",
      icon: <FaHandshake />,
      path: "/imsec-control-center/coe/industry-academics-collaboration",
    },
    {
      title: "MOUs",
      description:
        "Manage Memoranda of Understanding, partner details and MOU documents.",
      icon: <FaFileContract />,
      path: "/imsec-control-center/coe/mous",
    },
  ];

  return (
    <div className="coe-dashboard">
      {/* Header */}
      <div className="coe-dashboard-header">
        <div className="coe-header-icon">
          <FaUniversity />
        </div>

        <div>
          <h1>COE</h1>
          <p>
            Manage Centre of Excellence and Industry-Academia related
            information
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="coe-card-grid">
        {coeModules.map((module) => (
          <div
            className="coe-module-card"
            key={module.title}
            onClick={() => navigate(module.path)}
          >
            <div className="coe-module-icon">{module.icon}</div>

            <div className="coe-module-content">
              <h2>{module.title}</h2>

              <p>{module.description}</p>

              <button type="button">
                Manage
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default COEDashboard;
