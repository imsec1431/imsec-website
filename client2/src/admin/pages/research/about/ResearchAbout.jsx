import React, { useState } from "react";

import VisionMissionManagement from "./VisionMissionManagement";
import PartnerManagement from "./PartnerManagement";

import "./research-about.css";

const ResearchAbout = () => {
  const [activeTab, setActiveTab] = useState("vision");

  return (
    <div className="container-fluid research-about-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="page-header mb-4">
        <h2>Research About</h2>

        <p>
          Manage research vision, mission, partners and
          sustainable development goals.
        </p>
      </div>

      {/* =========================================
          TABS
      ========================================= */}

      <div className="research-about-tabs">

        {/* Vision & Mission */}

        <button
          type="button"
          className={
            activeTab === "vision"
              ? "research-about-tab active"
              : "research-about-tab"
          }
          onClick={() => setActiveTab("vision")}
        >
          <strong>Vision & Mission</strong>

          <span>
            Manage Content
          </span>
        </button>

        {/* Industry & Academic Partners */}

        <button
          type="button"
          className={
            activeTab === "partners"
              ? "research-about-tab active"
              : "research-about-tab"
          }
          onClick={() => setActiveTab("partners")}
        >
          <strong>
            Industry & Academic Partners
          </strong>

          <span>
            Manage Partners
          </span>
        </button>

       

      </div>

      {/* =========================================
          TAB CONTENT
      ========================================= */}

      <div className="research-about-content">

        {activeTab === "vision" && (
          <VisionMissionManagement />
        )}

        {activeTab === "partners" && (
          <PartnerManagement />
        )}

        

      </div>

    </div>
  );
};

export default ResearchAbout;