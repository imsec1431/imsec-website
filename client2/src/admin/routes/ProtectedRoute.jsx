import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import routePermissions from "../config/routePermissions";

/* =========================================================
   NORMALIZE PATH
========================================================= */

const normalizePath = (pathname) => {
  if (!pathname) return "/";

  const path = pathname.replace(/\/+/g, "/");

  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
};

/* =========================================================
   FIND ROUTE PERMISSION
========================================================= */

const findRoutePermission = (pathname) => {
  const cleanPath = normalizePath(pathname);

  return routePermissions.find((route) => route.pattern.test(cleanPath));
};

/* =========================================================
   GLOBAL PERMISSION
========================================================= */

const hasGlobalPermission = (admin, moduleKey, subModuleKey = null) => {
  if (!admin) return false;

  /* -------------------------------------------------------
     NORMAL ADMIN / SUPER ADMIN
     FULL ACCESS
  ------------------------------------------------------- */

  if (admin.role !== "Sub Admin") {
    return true;
  }

  /* -------------------------------------------------------
     INACTIVE SUB ADMIN
  ------------------------------------------------------- */

  if (admin.isActive === false) {
    return false;
  }

  if (!moduleKey) {
    return true;
  }

  const modules = Array.isArray(admin?.permissions?.modules)
    ? admin.permissions.modules
    : [];

  const modulePermission = modules.find((item) => item?.key === moduleKey);

  if (!modulePermission) {
    return false;
  }

  /* -------------------------------------------------------
     SPECIFIC SUB-MODULE
  ------------------------------------------------------- */

  if (subModuleKey) {
    const subModules = Array.isArray(modulePermission.subModules)
      ? modulePermission.subModules
      : [];

    const subModulePermission = subModules.find(
      (item) => item?.key === subModuleKey,
    );

    return subModulePermission?.enabled === true;
  }

  /* -------------------------------------------------------
     COMPLETE MODULE
  ------------------------------------------------------- */

  if (modulePermission.enabled === true) {
    return true;
  }

  /* -------------------------------------------------------
     MODULE DISABLED BUT SUB-MODULE ENABLED
  ------------------------------------------------------- */

  const subModules = Array.isArray(modulePermission.subModules)
    ? modulePermission.subModules
    : [];

  return subModules.some((item) => item?.enabled === true);
};

/* =========================================================
   FIND DEPARTMENT PERMISSION
========================================================= */

const findDepartmentPermission = (admin, departmentSlug) => {
  const departmentPermissions = Array.isArray(admin?.permissions?.departments)
    ? admin.permissions.departments
    : [];

  if (!departmentSlug) {
    return null;
  }

  const requestedValue = String(departmentSlug).trim().toLowerCase();

  return (
    departmentPermissions.find((department) => {
      const permissionSlug = String(department?.slug || "")
        .trim()
        .toLowerCase();

      const departmentId = String(department?.departmentId || "")
        .trim()
        .toLowerCase();

      const permissionId = String(department?._id || "")
        .trim()
        .toLowerCase();

      return (
        permissionSlug === requestedValue ||
        departmentId === requestedValue ||
        permissionId === requestedValue
      );
    }) || null
  );
};

/* =========================================================
   DEPARTMENT PERMISSION
========================================================= */

const hasDepartmentPermission = (
  admin,
  departmentSlug,
  moduleKey = null,
  subModuleKey = null,
) => {
  if (!admin) {
    return false;
  }

  /* -------------------------------------------------------
     NORMAL ADMIN / SUPER ADMIN
     FULL ACCESS
  ------------------------------------------------------- */

  if (admin.role !== "Sub Admin") {
    return true;
  }

  /* -------------------------------------------------------
     INACTIVE SUB ADMIN
  ------------------------------------------------------- */

  if (admin.isActive === false) {
    return false;
  }

  if (!departmentSlug) {
    return false;
  }

  /* -------------------------------------------------------
     FIND DEPARTMENT
  ------------------------------------------------------- */

  const departmentPermission = findDepartmentPermission(admin, departmentSlug);

  /*
   * IMPORTANT:
   *
   * Do NOT check:
   *
   * departmentPermission.enabled === true
   *
   * here.
   *
   * A Sub Admin may have access to individual department
   * modules even when the department-level enabled flag
   * itself is false.
   */

  if (!departmentPermission) {
    return false;
  }

  /* -------------------------------------------------------
     DEPARTMENT ROOT
     
     /departments/:slug
  ------------------------------------------------------- */

  if (!moduleKey) {
    /*
     * Department root is accessible when:
     *
     * 1. Department itself is enabled
     *
     * OR
     *
     * 2. Any department module is enabled
     *
     * OR
     *
     * 3. Any department sub-module is enabled
     */

    if (departmentPermission.enabled === true) {
      return true;
    }

    const departmentModules = Array.isArray(departmentPermission.modules)
      ? departmentPermission.modules
      : [];

    return departmentModules.some((module) => {
      if (module?.enabled === true) {
        return true;
      }

      const subModules = Array.isArray(module?.subModules)
        ? module.subModules
        : [];

      return subModules.some((subModule) => subModule?.enabled === true);
    });
  }

  /* -------------------------------------------------------
     DEPARTMENT MODULES
  ------------------------------------------------------- */

  const modules = Array.isArray(departmentPermission.modules)
    ? departmentPermission.modules
    : [];

  const modulePermission = modules.find((item) => item?.key === moduleKey);

  if (!modulePermission) {
    return false;
  }

  /* -------------------------------------------------------
     SPECIFIC SUB-MODULE
  ------------------------------------------------------- */

  if (subModuleKey) {
    const subModules = Array.isArray(modulePermission.subModules)
      ? modulePermission.subModules
      : [];

    const subModulePermission = subModules.find(
      (item) => item?.key === subModuleKey,
    );

    /*
     * Specific sub-module controls access.
     */

    return subModulePermission?.enabled === true;
  }

  /* -------------------------------------------------------
     COMPLETE MODULE
  ------------------------------------------------------- */

  if (modulePermission.enabled === true) {
    return true;
  }

  /* -------------------------------------------------------
     MODULE DISABLED BUT SUB-MODULE ENABLED
  ------------------------------------------------------- */

  const subModules = Array.isArray(modulePermission.subModules)
    ? modulePermission.subModules
    : [];

  return subModules.some((item) => item?.enabled === true);
};

/* =========================================================
   ACCESS DENIED
========================================================= */

const AccessDeniedRedirect = ({ currentPath, extraState = {} }) => {
  return (
    <Navigate
      to="/imsec-control-center/access-denied"
      replace
      state={{
        from: currentPath,
        ...extraState,
      }}
    />
  );
};

/* =========================================================
   PROTECTED ROUTE
========================================================= */

const ProtectedRoute = () => {
  const { admin, loading } = useAuth();

  const location = useLocation();

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 15px",
            }}
          />

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Checking authentication...
          </p>
        </div>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!admin) {
    return (
      <Navigate
        to="/imsec-control-center/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /* =======================================================
     INACTIVE SUB ADMIN
  ======================================================= */

  if (admin.role === "Sub Admin" && admin.isActive === false) {
    return (
      <Navigate
        to="/imsec-control-center/login"
        replace
        state={{
          inactive: true,
        }}
      />
    );
  }

  /* =======================================================
     NORMAL ADMIN / SUPER ADMIN
     FULL ACCESS
  ======================================================= */

  if (admin.role !== "Sub Admin") {
    return <Outlet />;
  }

  /* =======================================================
     CURRENT PATH
  ======================================================= */

  const currentPath = normalizePath(location.pathname);

  const basePath = "/imsec-control-center";

  let relativePath = currentPath;

  if (relativePath.startsWith(basePath)) {
    relativePath = relativePath.slice(basePath.length) || "/";
  }

  relativePath = normalizePath(relativePath);

  /* =======================================================
     UNRESTRICTED ROUTES
  ======================================================= */

  const unrestrictedRoutes = ["/access-denied", "/profile", "/change-password"];

  const isUnrestricted = unrestrictedRoutes.some(
    (route) => relativePath === route || relativePath.startsWith(`${route}/`),
  );

  if (isUnrestricted) {
    return <Outlet />;
  }

  /* =======================================================
     SUB ADMIN MANAGEMENT
     
     SUB ADMIN CANNOT MANAGE SUB ADMINS
  ======================================================= */

  if (
    relativePath === "/sub-admins" ||
    relativePath.startsWith("/sub-admins/")
  ) {
    return <AccessDeniedRedirect currentPath={currentPath} />;
  }

  /* =======================================================
     FIND ROUTE CONFIGURATION
  ======================================================= */

  const routePermission = findRoutePermission(relativePath);

  /*
   * Unknown route = denied.
   */

  if (!routePermission) {
    return <AccessDeniedRedirect currentPath={currentPath} />;
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  if (
    routePermission.type === "global" &&
    routePermission.module === "dashboard"
  ) {
    return <Outlet />;
  }

  /* =======================================================
     GLOBAL MODULE
  ======================================================= */

  if (routePermission.type === "global") {
    const allowed = hasGlobalPermission(
      admin,
      routePermission.module,
      routePermission.subModule || null,
    );

    if (!allowed) {
      return (
        <AccessDeniedRedirect
          currentPath={currentPath}
          extraState={{
            module: routePermission.module,
            subModule: routePermission.subModule || null,
          }}
        />
      );
    }

    return <Outlet />;
  }

  /* =======================================================
     DEPARTMENT MODULE
  ======================================================= */

  if (routePermission.type === "department") {
    const pathParts = relativePath.split("/").filter(Boolean);

    /*
     * Example:
     *
     * /departments/master-of-computer-application
     *
     * pathParts:
     *
     * [
     *   "departments",
     *   "master-of-computer-application"
     * ]
     *
     * Example:
     *
     * /departments/master-of-computer-application/faculty
     *
     * pathParts:
     *
     * [
     *   "departments",
     *   "master-of-computer-application",
     *   "faculty"
     * ]
     */

    const departmentSlug = pathParts[1];

    if (!departmentSlug) {
      return <AccessDeniedRedirect currentPath={currentPath} />;
    }

    const allowed = hasDepartmentPermission(
      admin,
      departmentSlug,
      routePermission.module || null,
      routePermission.subModule || null,
    );

    if (!allowed) {
      return (
        <AccessDeniedRedirect
          currentPath={currentPath}
          extraState={{
            department: departmentSlug,
            module: routePermission.module || null,
            subModule: routePermission.subModule || null,
          }}
        />
      );
    }

    return <Outlet />;
  }

  /* =======================================================
     DEFAULT DENY
  ======================================================= */

  return <AccessDeniedRedirect currentPath={currentPath} />;
};

export default ProtectedRoute;
