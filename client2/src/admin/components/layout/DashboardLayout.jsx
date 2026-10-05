import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;