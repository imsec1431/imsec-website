import React from "react";

const DashboardSection = ({ title, children }) => {
  return (
    <div className="dashboard-section">

      <div className="section-header">
        <h5>{title}</h5>
      </div>

      <div className="section-body">
        {children}
      </div>

    </div>
  );
};

export default DashboardSection;