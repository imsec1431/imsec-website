import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaHome,
  FaUniversity,
  FaUserGraduate,
  FaBook,
  FaBuilding,
  FaFlask,
  FaAward,
  FaBriefcase,
  FaBookReader,
  FaLandmark,
  FaBalanceScale,
  FaHeart,
  FaUsers,
  FaNewspaper,
  FaUserShield,
  FaSignOutAlt,
  FaEnvelope,
  FaBullhorn,
  FaGraduationCap,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    logout();
    navigate("/imsec-control-center/login");
  };

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  const handleChangePassword = () => {
    navigate("/imsec-control-center/change-password");
  };

  /* =========================================================
     CHECK GLOBAL PERMISSION
  ========================================================= */

  const hasGlobalPermission = (moduleKey, subModuleKey = null) => {
    // All non Sub Admin users have full access
    if (admin?.role !== "Sub Admin") {
      return true;
    }

    // Inactive Sub Admin has no access
    if (admin?.isActive === false) {
      return false;
    }

    if (!moduleKey) {
      return false;
    }

    const modules = Array.isArray(admin?.permissions?.modules)
      ? admin.permissions.modules
      : [];

    const modulePermission = modules.find((item) => item?.key === moduleKey);

    if (!modulePermission) {
      return false;
    }

    /* ---------------------------------------------------------
       Specific sub-module
    --------------------------------------------------------- */

    if (subModuleKey) {
      const subModules = Array.isArray(modulePermission.subModules)
        ? modulePermission.subModules
        : [];

      const subPermission = subModules.find(
        (item) => item?.key === subModuleKey,
      );

      return subPermission?.enabled === true;
    }

    /* ---------------------------------------------------------
       Complete module
    --------------------------------------------------------- */

    if (modulePermission.enabled === true) {
      return true;
    }

    /* ---------------------------------------------------------
       Parent disabled but at least one sub-module enabled
    --------------------------------------------------------- */

    const subModules = Array.isArray(modulePermission.subModules)
      ? modulePermission.subModules
      : [];

    return subModules.some((item) => item?.enabled === true);
  };

  /* =========================================================
     CHECK ANY DEPARTMENT ACCESS
  ========================================================= */

  const hasAnyDepartmentAccess = () => {
    if (admin?.role !== "Sub Admin") {
      return true;
    }

    if (admin?.isActive === false) {
      return false;
    }

    const departments = Array.isArray(admin?.permissions?.departments)
      ? admin.permissions.departments
      : [];

    return departments.some((department) => {
      if (department?.enabled === true) {
        return true;
      }

      /*
       * Also consider a department accessible when
       * any department module/sub-module is enabled.
       */

      const modules = Array.isArray(department?.modules)
        ? department.modules
        : [];

      return modules.some((module) => {
        if (module?.enabled === true) {
          return true;
        }

        return Array.isArray(module?.subModules)
          ? module.subModules.some((subModule) => subModule?.enabled === true)
          : false;
      });
    });
  };

  /* =========================================================
     CHECK DEPARTMENT MODULE ACCESS
  ========================================================= */

  const hasAnyDepartmentModuleAccess = (moduleKey, subModuleKey = null) => {
    if (admin?.role !== "Sub Admin") {
      return true;
    }

    if (admin?.isActive === false) {
      return false;
    }

    if (!moduleKey) {
      return false;
    }

    const departments = Array.isArray(admin?.permissions?.departments)
      ? admin.permissions.departments
      : [];

    return departments.some((department) => {
      /*
       * Department itself does not necessarily need
       * enabled=true when a specific module/sub-module
       * has been explicitly enabled.
       */

      const departmentEnabled = department?.enabled === true;

      const modules = Array.isArray(department?.modules)
        ? department.modules
        : [];

      const modulePermission = modules.find((item) => item?.key === moduleKey);

      if (!modulePermission) {
        return false;
      }

      /* -------------------------------------------------------
         Specific department sub-module
      ------------------------------------------------------- */

      if (subModuleKey) {
        const subModules = Array.isArray(modulePermission.subModules)
          ? modulePermission.subModules
          : [];

        const subPermission = subModules.find(
          (item) => item?.key === subModuleKey,
        );

        return (
          subPermission?.enabled === true &&
          (departmentEnabled || subPermission?.enabled === true)
        );
      }

      /* -------------------------------------------------------
         Complete department module
      ------------------------------------------------------- */

      if (modulePermission.enabled === true) {
        return true;
      }

      /* -------------------------------------------------------
         Module disabled but one sub-module enabled
      ------------------------------------------------------- */

      return Array.isArray(modulePermission.subModules)
        ? modulePermission.subModules.some((item) => item?.enabled === true)
        : false;
    });
  };

  /* =========================================================
     SIDEBAR MENUS
  ========================================================= */

  const menus = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/imsec-control-center/dashboard",
      module: "dashboard",
    },

    {
      name: "Home Page Popup",
      icon: <FaBullhorn />,
      path: "/imsec-control-center/homepage-popup",
      module: "website-content",
      subModule: "homepage-popup",
    },

    {
      name: "Homepage CMS",
      icon: <FaHome />,
      path: "/imsec-control-center/homepage",
      module: "homepage",
      subModule: "overview",
    },

    {
      name: "About IMSEC",
      icon: <FaUniversity />,
      path: "/imsec-control-center/about-imsec",
      module: "about-imsec",
      subModule: "overview",
    },

    {
      name: "Admissions",
      icon: <FaUserGraduate />,
      path: "/imsec-control-center/admissions",
      module: "admissions",
      subModule: "overview",
    },

    {
      name: "Academics",
      icon: <FaBook />,
      path: "/imsec-control-center/academics",
      module: "academics",
      subModule: "overview",
    },

    {
      name: "Departments",
      icon: <FaBuilding />,
      path: "/imsec-control-center/departments",
      module: "departments",
      subModule: "overview",
      type: "departments",
    },

    {
      name: "Research",
      icon: <FaFlask />,
      path: "/imsec-control-center/research",
      module: "research",
      subModule: "overview",
    },

    {
      name: "IQAC",
      icon: <FaAward />,
      path: "/imsec-control-center/iqac",
      module: "iqac",
      subModule: "overview",
    },

    {
      name: "Placements",
      icon: <FaBriefcase />,
      path: "/imsec-control-center/placements",
      module: "placements",
      subModule: "overview",
    },

    {
      name: "Library",
      icon: <FaBookReader />,
      path: "/imsec-control-center/library",
      module: "library",
      subModule: "overview",
    },

    {
      name: "COE",
      icon: <FaLandmark />,
      path: "/imsec-control-center/coe",
      module: "coe",
      subModule: "overview",
    },

    {
      name: "Grievance",
      icon: <FaBalanceScale />,
      path: "/imsec-control-center/grievance",
      module: "grievance",
      subModule: "overview",
    },

    {
      name: "Student Welfare",
      icon: <FaHeart />,
      path: "/imsec-control-center/student-welfare",
      module: "student-welfare",
      subModule: "overview",
    },

    {
      name: "Life@IMSEC",
      icon: <FaUsers />,
      path: "/imsec-control-center/life-imsec",
      module: "life-imsec",
      subModule: "overview",
    },

    {
      name: "Newsletter",
      icon: <FaNewspaper />,
      path: "/imsec-control-center/newsletter",
      module: "website-content",
      subModule: "newsletter",
    },

    /* =======================================================
       SUB ADMINS
    ======================================================= */

    {
      name: "Sub Admins",
      icon: <FaUserShield />,
      path: "/imsec-control-center/sub-admins",
      superAdminOnly: true,
    },

    /* =======================================================
       ADMINS
    ======================================================= */

    // {
    //   name: "Admins",
    //   icon: <FaUserShield />,
    //   path: "/imsec-control-center/admins",
    //   module: "admins",
    //   subModule: "management",
    //   adminOnly: true,
    // },

    {
      name: "Contact Us",
      icon: <FaEnvelope />,
      path: "/imsec-control-center/contact-us",
      module: "website-content",
      subModule: "contact-us",
    },

    {
      name: "Announcement",
      icon: <FaBullhorn />,
      path: "/imsec-control-center/announcement",
      module: "announcement",
      subModule: "management",
    },

    {
      name: "Alumni",
      icon: <FaGraduationCap />,
      path: "/imsec-control-center/alumni-section",
      module: "alumni",
      subModule: "overview",
    },

    {
      name: "News Ticker",
      icon: <FaBullhorn />,
      path: "/imsec-control-center/news-ticker",
      module: "website-content",
      subModule: "news-ticker",
    },

    {
      name: "Social Media Links",
      icon: <FaBullhorn />,
      path: "/imsec-control-center/social-media",
      module: "website-content",
      subModule: "social-media",
    },

    {
      name: "All Committees",
      icon: <FaUserShield />,
      path: "/imsec-control-center/all-committees",
      module: "website-content",
      subModule: "all-committees",
    },

    {
      name: "Mandatory-Disclosure",
      icon: <FaUserShield />,
      path: "/imsec-control-center/mandatory-disclosure",
      module: "website-content",
      subModule: "mandatory-disclosure",
    },

    {
      name: "Accreditations",
      icon: <FaUserShield />,
      path: "/imsec-control-center/accreditations",
      module: "accreditations",
      subModule: "overview",
    },

    {
      name: "Careers",
      icon: <FaUserShield />,
      path: "/imsec-control-center/careers",
      module: "website-content",
      subModule: "careers",
    },
  ];

  /* =========================================================
     FILTER MENUS
  ========================================================= */

  const visibleMenus = menus.filter((menu) => {
    /*
     * Normal users
     * Full sidebar.
     */

    if (admin?.role !== "Sub Admin") {
      return true;
    }

    /*
     * Dashboard is ALWAYS visible.
     */

    if (menu.module === "dashboard") {
      return true;
    }

    /*
     * Super Admin only.
     */

    if (menu.superAdminOnly) {
      return admin?.role === "Super Admin";
    }

    /*
     * Admin only.
     *
     * Sub Admin can never see Admin management.
     */

    if (menu.adminOnly) {
      return false;
    }

    /* =======================================================
       DEPARTMENTS
    ======================================================= */

    if (menu.type === "departments") {
      /*
       * A Sub Admin should see Departments if:
       *
       * 1. Global Departments permission is assigned
       *
       * OR
       *
       * 2. At least one department is assigned.
       */

      return (
        hasGlobalPermission("departments", "overview") ||
        hasAnyDepartmentAccess()
      );
    }

    /* =======================================================
       GLOBAL MODULES
    ======================================================= */

    return hasGlobalPermission(menu.module, menu.subModule);
  });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <aside className="sidebar">
      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="sidebar-logo">
        <h3>IMSEC CMS</h3>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <div className="sidebar-menu">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              isActive ? "menu-item active-menu" : "menu-item"
            }
          >
            <span>{menu.icon}</span>
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="sidebar-footer">
        <div className="admin-box">
          <strong>{admin?.name || "Administrator"}</strong>

          <small>{admin?.email || ""}</small>

          {admin?.role === "Sub Admin" && (
            <small
              style={{
                display: "block",
                marginTop: "4px",
                opacity: 0.75,
              }}
            >
              Sub Admin
            </small>
          )}
        </div>

        {/* ===================================================
            CHANGE PASSWORD
            Available to every logged-in user.
        =================================================== */}

        <button
          type="button"
          className="logout-btn"
          onClick={handleChangePassword}
          style={{
            background: "#1f6feb",
            marginBottom: "10px",
          }}
        >
          <FaLock style={{ marginRight: "8px" }} />
          Change Password
        </button>

        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
