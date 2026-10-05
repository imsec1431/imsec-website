import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/layout/Sidebar";

import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* PAGE CONTENT */}
      <main className="admin-main-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;