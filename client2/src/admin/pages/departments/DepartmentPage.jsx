import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaChalkboardTeacher,
  FaTrophy,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaBuilding,
  FaUserGraduate,
  FaUserTie,
  FaUsers,
  FaFlask,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import "./department-page.css";

/* =========================================================
   DEPARTMENT MODULES
========================================================= */

const modules = [
  {
    title: "Overview",
    description:
      "Manage department introduction, vision, mission and objectives.",
    icon: <FaBookOpen />,
    key: "overview",
    permissionModule: "overview",
    route: "overview",
  },

  {
    title: "HOD's Message",
    description: "Manage the message from the Head of Department.",
    icon: <FaUserTie />,
    key: "hod-message",
    permissionModule: "overview",
    permissionSubModule: "hod-message",
    route: "hod-message",
  },

  {
    title: "Faculty",
    description: "Manage department faculty members and their profiles.",
    icon: <FaChalkboardTeacher />,
    key: "faculty",
    permissionModule: "faculty",
    permissionSubModule: "faculty-list",
    route: "faculty",
  },

  {
    title: "Achievements",
    description: "Manage department achievements, awards and recognitions.",
    icon: <FaTrophy />,
    key: "achievements",
    permissionModule: "achievements",
    route: "achievements",
  },

  {
    title: "Placement",
    description: "Manage department placement information and records.",
    icon: <FaBriefcase />,
    key: "placement",
    permissionModule: "placement",
    route: "placement",
  },

  {
    title: "Academic Results",
    description: "Manage semester-wise academic results and performance.",
    icon: <FaGraduationCap />,
    key: "academic-results",
    permissionModule: "academic-results",
    route: "results",
  },

  {
    title: "Department Events",
    description:
      "Manage seminars, workshops, activities and department events.",
    icon: <FaCalendarAlt />,
    key: "department-events",
    permissionModule: "department-events",
    route: "events",
  },

  {
    title: "Alumni",
    description:
      "Manage alumni information and alumni-related content for this department.",
    icon: <FaUsers />,
    key: "alumni",
    permissionModule: "alumni",
    route: "alumni-section",
  },

  {
    title: "Research",
    description:
      "Manage research information, publications, patents and research activities.",
    icon: <FaFlask />,
    key: "research",
    permissionModule: "research",
    route: "research",
  },

  {
    title: "Infrastructure",
    description: "Manage laboratories, classrooms and department facilities.",
    icon: <FaBuilding />,
    key: "infrastructure",
    permissionModule: "infrastructure",
    route: "infrastructure",
  },

  {
    title: "Student Corner",
    description: "Manage notices, syllabus, timetable and student resources.",
    icon: <FaUserGraduate />,
    key: "student-corner",
    permissionModule: "student-corner",
    route: "student-corner",
  },
];

/* =========================================================
   DEPARTMENT PAGE
========================================================= */

const DepartmentPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin } = useAuth();

  const isSubAdmin = admin?.role === "Sub Admin";

  /* =======================================================
     DEPARTMENT NAME
  ======================================================= */

  const departmentName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Department";

  /* =======================================================
     FIND CURRENT DEPARTMENT PERMISSION
     
     IMPORTANT:
     Match using:
     - departmentId
     - _id
     - slug
     
     Different backend versions may return
     different identifiers.
  ======================================================= */

  const departmentPermission = useMemo(() => {
    if (!isSubAdmin) {
      return null;
    }

    const departments = Array.isArray(admin?.permissions?.departments)
      ? admin.permissions.departments
      : [];

    if (!slug) {
      return null;
    }

    return (
      departments.find((department) => {
        const permissionSlug = String(department?.slug || "").toLowerCase();

        const departmentId = String(department?.departmentId || "");

        const permissionId = String(department?._id || "");

        const currentSlug = String(slug).toLowerCase();

        return (
          permissionSlug === currentSlug ||
          departmentId === currentSlug ||
          permissionId === currentSlug
        );
      }) || null
    );
  }, [admin, isSubAdmin, slug]);

  /* =======================================================
     CHECK MODULE ACCESS
  ======================================================= */

  const hasModulePermission = (moduleKey) => {
    /*
     * Normal Admin / Super Admin
     */

    if (!isSubAdmin) {
      return true;
    }

    /*
     * Department not assigned
     */

    if (!departmentPermission) {
      return false;
    }

    const module = modules.find((item) => item.key === moduleKey);

    if (!module) {
      return false;
    }

    const departmentModules = Array.isArray(departmentPermission.modules)
      ? departmentPermission.modules
      : [];

    const modulePermission = departmentModules.find(
      (item) => item?.key === module.permissionModule,
    );

    if (!modulePermission) {
      return false;
    }

    /*
     * Whole module enabled
     */

    if (modulePermission.enabled === true) {
      return true;
    }

    /*
     * Specific sub-module enabled
     */

    if (module.permissionSubModule) {
      const subModules = Array.isArray(modulePermission.subModules)
        ? modulePermission.subModules
        : [];

      return subModules.some(
        (subModule) =>
          subModule?.key === module.permissionSubModule &&
          subModule?.enabled === true,
      );
    }

    /*
     * Module itself disabled but at least one
     * sub-module is enabled.
     */

    const subModules = Array.isArray(modulePermission.subModules)
      ? modulePermission.subModules
      : [];

    return subModules.some((subModule) => subModule?.enabled === true);
  };

  /* =======================================================
     FILTER MODULES
  ======================================================= */

  const permittedModules = useMemo(() => {
    if (!isSubAdmin) {
      return modules;
    }

    return modules.filter((module) => hasModulePermission(module.key));
  }, [admin, isSubAdmin, slug, departmentPermission]);

  /* =======================================================
     OPEN MODULE
  ======================================================= */

  const handleModuleClick = (module) => {
    if (!hasModulePermission(module.key)) {
      navigate("/imsec-control-center/access-denied", {
        state: {
          department: slug,
          module: module.permissionModule,
        },
      });

      return;
    }

    navigate(`/imsec-control-center/departments/${slug}/${module.route}`);
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    navigate("/imsec-control-center/departments");
  };

  /* =======================================================
     ACCESS DENIED
  ======================================================= */

  if (isSubAdmin && !departmentPermission) {
    return (
      <div className="department-page">
        <div className="department-page-header">
          <div className="department-page-header-left">
            <button
              type="button"
              className="department-back-btn"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Back to Departments
            </button>

            <div className="department-page-title">
              <span>DEPARTMENT MANAGEMENT</span>

              <h1>{departmentName}</h1>

              <p>You do not have access to this department.</p>
            </div>
          </div>
        </div>

        <section
          style={{
            padding: "60px 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              padding: "45px 30px",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f1f5f9",
                color: "#64748b",
                fontSize: "28px",
              }}
            >
              <FaLock />
            </div>

            <h2>Access Denied</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              You have not been assigned access to the{" "}
              <strong>{departmentName}</strong> department.
            </p>

            <button
              type="button"
              className="department-back-btn"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Back to Departments
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="department-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="department-page-header">
        <div className="department-page-header-left">
          <button
            type="button"
            className="department-back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back to Departments
          </button>

          <div className="department-page-title">
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{departmentName}</h1>

            <p>
              {isSubAdmin
                ? "Manage only the department modules assigned to you."
                : "Manage all content and information related to this department."}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          MODULES
      ================================================= */}

      <section className="department-modules-section">
        <div className="department-modules-heading">
          <div>
            <span>DEPARTMENT MODULES</span>

            <h2>Manage Department Content</h2>
          </div>

          <p>
            {isSubAdmin
              ? "Only modules assigned by the Administrator are available."
              : "Select a module below to manage department-specific content."}
          </p>
        </div>

        {/* =================================================
            MODULE GRID
        ================================================= */}

        {permittedModules.length === 0 ? (
          <div
            style={{
              padding: "50px 20px",
              textAlign: "center",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <FaLock
              style={{
                fontSize: "35px",
                marginBottom: "15px",
                color: "#64748b",
              }}
            />

            <h3>No Modules Assigned</h3>

            <p style={{ color: "#64748b" }}>
              The Administrator has not assigned any department modules to your
              account.
            </p>
          </div>
        ) : (
          <div className="department-modules-grid">
            {permittedModules.map((module) => (
              <button
                type="button"
                className="department-module-card"
                key={module.key}
                onClick={() => handleModuleClick(module)}
              >
                <div className="department-module-icon">{module.icon}</div>

                <div className="department-module-content">
                  <h3>{module.title}</h3>

                  <p>{module.description}</p>

                  <span>Manage Module →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentPage;
