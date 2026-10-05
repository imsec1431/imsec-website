import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../CSS/McaPanel.css";

import Faculty from "./Faculty";
import AIMLOverview from "./AIMLOverview";
import DepartmentEvents from "./DepartmentEvents";
import AcademicResults from "./AcademicResults";
import DepartmentAchievements from "./DepartmentAchievements";
import DepartmentPlacement from "./DepartmentPlacement";
import Infrastructure from "./Infrastructure";
import StudentCorner from "./StudentCorner";
import DepartmentAlumni from "./DepartmentAlumni";
import DepartmentResearch from "./DepartmentResearch";

import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaTrophy,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaBuilding,
  FaUserFriends,
  FaFlask,
} from "react-icons/fa";

// Single source of truth for the tabs - add/remove/reorder tabs here only.
const TABS = [
  {
    key: "profile",
    label: "Overview",
    icon: FaTachometerAlt,
  },
  {
    key: "faculty",
    label: "Faculty",
    icon: FaChalkboardTeacher,
  },
  {
    key: "Research",
    label: "Research",
    icon: FaFlask,
  },
  {
    key: "DepartmentEvents",
    label: "Department Events",
    icon: FaCalendarAlt,
  },
  {
    key: "DepartmentAchievements",
    label: "Achievements",
    icon: FaTrophy,
  },
  {
    key: "DepartmentPlacement",
    label: "Placement",
    icon: FaBriefcase,
  },

  {
    key: "StudentCorner",
    label: "StudentCorner",
    icon: FaBuilding,
  },
  {
    key: "Alumni",
    label: "Alumni",
    icon: FaUserFriends,
  },
  {
    key: "Infrastructure",
    label: "Infrastructure",
    icon: FaBuilding,
  },
  {
    key: "AcademicResults",
    label: "Academic Results",
    icon: FaGraduationCap,
  },
];

const AIMLPanel = () => {
  const [show, setShow] = useState("profile");

  const changePage = (page) => {
    setShow(page);
  };

  return (
    <div className="csPanel">
      {/* Department Title */}
      <div className="csPanelTitle text-center py-3">
        <h2 className="fw-bold text-dark mb-1">AIML Department</h2>

        <div
          className="mx-auto bg-warning rounded"
          style={{
            width: "55px",
            height: "4px",
          }}
        />
      </div>
      {/* Horizontal Tab Bar - scrolls sideways on small screens instead
          of collapsing into a hamburger/sidebar drawer. */}
      <div className="tabBarWrapper">
        <nav className="tabBar">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              className={`tabItem ${show === key ? "active" : ""}`}
              onClick={() => changePage(key)}
            >
              <Icon className="tabIcon" />
              <span className="tabLabel">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Optional nested routes (kept from original sidebar version) */}
      <Outlet />

      {/* Main Content Area */}
      <main className="contentPanel">
        {show === "profile" && <AIMLOverview />}
        {show === "faculty" && <Faculty />}
        {show === "DepartmentAchievements" && <DepartmentAchievements />}
        {show === "DepartmentPlacement" && <DepartmentPlacement />}
        {show === "AcademicResults" && <AcademicResults />}
        {show === "DepartmentEvents" && <DepartmentEvents />}
        {show === "Infrastructure" && <Infrastructure />}
        {show === "Alumni" && <DepartmentAlumni />}
        {show === "Research" && <DepartmentResearch />}
        {show === "StudentCorner" && <StudentCorner />}
      </main>
    </div>
  );
};

export default AIMLPanel;
