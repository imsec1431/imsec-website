import React from "react";
import { Link } from "react-router-dom";

import {
  FaBriefcase,
  FaUsers,
  FaSitemap,
  FaChartLine,
  FaBuilding,
  FaFilePdf,
  FaClipboardList,
  FaBullhorn,
  FaTasks,
  FaArrowRight,
} from "react-icons/fa";

import "./PlacementsAdmin.css";

/* =========================================
   PLACEMENT MODULES
========================================= */

const placementModules = [
  {
    title: "CDC Team",
    description: "Manage Career Development Centre team information.",
    icon: FaUsers,
    path: "/imsec-control-center/placements/cdc-team",
  },
  {
    title: "TID Team",
    description: "Manage Training and Internship team information.",
    icon: FaUsers,
    path: "/imsec-control-center/placements/training-internship",
  },

  {
    title: "CDC Structure",
    description: "Upload and manage the Career Development Centre structure.",
    icon: FaSitemap,
    path: "/imsec-control-center/placements/cdc-structure",
  },

  {
    title: "Placement Records",
    description: "Manage placement records and placement statistics.",
    icon: FaChartLine,
    path: "/imsec-control-center/placements/placement-record",
  },

  {
    title: "Shining Stars",
    description: "Manage student placement achievements and success stories.",
    icon: FaUsers,
    path: "/imsec-control-center/placements/shining-stars",
  },

  {
    title: "Major Recruiters",
    description: "Manage major recruiters and recruiting companies.",
    icon: FaBuilding,
    path: "/imsec-control-center/placements/major-recruiters",
    // path: "/imsec-control-center/placements/cdc-structure",
    //
  },

  {
    title: "Placement Policy",
    description: "Manage Training and Placement policy information.",
    icon: FaClipboardList,
    path: "/imsec-control-center/placements/placement-policy",
  },

  {
    title: "Placement Notice",
    description: "Manage placement notices and announcements.",
    icon: FaBullhorn,
    path: "/imsec-control-center/placements/placement-notices",
  },

  {
    title: "T&P Activities",
    description: "Manage Training and Placement activities.",
    icon: FaTasks,
    path: "/imsec-control-center/placements/tp-activities",
  },
];

/* =========================================
   COMPONENT
========================================= */

const PlacementsAdmin = () => {
  return (
    <div className="placements-admin-page">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="placements-admin-header">
        <div className="placements-admin-header-icon">
          <FaBriefcase />
        </div>

        <div>
          <h1>Placements</h1>

          <p>
            Manage Career Development Centre, placement activities, recruiters,
            student achievements and related information.
          </p>
        </div>
      </div>

      {/* =====================================
          MODULES
      ===================================== */}

      <div className="placements-admin-section">
        <div className="placements-admin-section-header">
          <h2>Placement Management</h2>

          <p>Select a module to manage its information.</p>
        </div>

        <div className="placements-admin-grid">
          {placementModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                to={module.path}
                className="placements-admin-card"
              >
                <div className="placements-admin-card-header">
                  <div className="placements-admin-card-icon">
                    <Icon />
                  </div>

                  <FaArrowRight className="placements-admin-card-arrow" />
                </div>

                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlacementsAdmin;
