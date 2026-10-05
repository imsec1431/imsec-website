import React from "react";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div
      className="dashboard-card"
      style={{ borderTop: `5px solid ${color}` }}
    >
      <div className="card-icon">{icon}</div>

      <h3>{value}</h3>

      <p>{title}</p>
    </div>
  );
};

export default DashboardCard;