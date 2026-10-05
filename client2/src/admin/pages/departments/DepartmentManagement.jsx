import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaLock,
} from "react-icons/fa";

import {
  getDepartments,
  deleteDepartment,
} from "../../services/departmentService";

import { useAuth } from "../../context/AuthContext";

import "./department-management.css";

const DepartmentManagement = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSubAdmin = admin?.role === "Sub Admin";

  /* =========================================================
     LOAD DEPARTMENTS
  ========================================================= */

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDepartments();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setDepartments(data);
    } catch (err) {
      console.error("Department Load Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load departments",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     GET DEPARTMENT PERMISSION
  ========================================================= */

  const getDepartmentPermission = (department) => {
    /*
      Super Admin / normal Admin:
      Full access.
    */

    if (!isSubAdmin) {
      return {
        enabled: true,
        modules: [],
      };
    }

    const permissions = admin?.permissions?.departments || [];

    const permission = permissions.find((item) => {
      const permissionDepartmentId = String(
        item?.departmentId?._id || item?.departmentId || "",
      );

      const currentDepartmentId = String(department?._id || "");

      return (
        permissionDepartmentId === currentDepartmentId ||
        item?.slug === department?.slug
      );
    });

    if (!permission || permission.enabled === false) {
      return {
        enabled: false,
        modules: [],
      };
    }

    return {
      enabled: true,
      modules: Array.isArray(permission.modules) ? permission.modules : [],
    };
  };

  /* =========================================================
     PERMITTED DEPARTMENTS
  ========================================================= */

  const permittedDepartments = useMemo(() => {
    if (!isSubAdmin) {
      return departments;
    }

    return departments.filter((department) => {
      const permission = getDepartmentPermission(department);

      if (!permission.enabled) {
        return false;
      }

      /*
        Department should be visible when:
        1. Department itself is enabled
        AND
        2. At least one department module/sub-module is enabled.
      */

      return permission.modules.some(
        (module) =>
          module?.enabled === true ||
          module?.subModules?.some((sub) => sub?.enabled === true),
      );
    });
  }, [departments, admin, isSubAdmin]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredDepartments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return permittedDepartments;
    }

    return permittedDepartments.filter((department) => {
      return (
        department?.name?.toLowerCase().includes(keyword) ||
        department?.code?.toLowerCase().includes(keyword) ||
        department?.shortName?.toLowerCase().includes(keyword) ||
        department?.type?.toLowerCase().includes(keyword) ||
        department?.slug?.toLowerCase().includes(keyword) ||
        department?.publicPath?.toLowerCase().includes(keyword) ||
        department?.description?.toLowerCase().includes(keyword)
      );
    });
  }, [permittedDepartments, search]);

  /* =========================================================
     OPEN DEPARTMENT
  ========================================================= */

  const handleView = (department) => {
    const permission = getDepartmentPermission(department);

    if (isSubAdmin && !permission.enabled) {
      navigate("/imsec-control-center/access-denied");
      return;
    }

    if (!department?.slug) {
      navigate("/imsec-control-center/access-denied");
      return;
    }

    navigate(`/imsec-control-center/departments/${department.slug}`);
  };

  /* =========================================================
     EDIT DEPARTMENT
  ========================================================= */

  const handleEdit = (department) => {
    /*
      Department Master editing remains
      Super Admin / normal Admin only.
    */

    if (isSubAdmin) {
      navigate("/imsec-control-center/access-denied");
      return;
    }

    navigate(`/imsec-control-center/departments/edit/${department._id}`);
  };

  /* =========================================================
     DELETE DEPARTMENT
  ========================================================= */

  const handleDelete = async (department) => {
    if (isSubAdmin) {
      navigate("/imsec-control-center/access-denied");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${department?.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDepartment(department._id);
      await loadDepartments();
    } catch (err) {
      console.error("Delete Department Error:", err);

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete department",
      );
    }
  };

  /* =========================================================
     ENABLED MODULE COUNT
  ========================================================= */

  const getEnabledModuleCount = (department) => {
    if (!isSubAdmin) {
      return "Full Access";
    }

    const permission = getDepartmentPermission(department);

    const count = permission.modules.filter(
      (module) =>
        module?.enabled === true ||
        module?.subModules?.some((sub) => sub?.enabled === true),
    ).length;

    return `${count} Module${count === 1 ? "" : "s"}`;
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getDepartmentStatus = (department) => {
    /*
      Department model uses:
      status: "Active" / "Inactive"
    */

    return department?.status === "Active";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="department-management-page">
        <div className="department-management-loading">
          Loading Departments...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="department-management-page">
        <div className="department-management-error">
          <h3>Unable to Load Departments</h3>

          <p>{error}</p>

          <button type="button" onClick={loadDepartments}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="department-management-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="department-page-header">
        <div className="department-title-wrapper">
          <div className="department-title-icon">
            <FaBuilding />
          </div>

          <div>
            <span className="department-section-label">
              DEPARTMENT MANAGEMENT
            </span>

            <h2>Departments</h2>

            <p>
              {isSubAdmin
                ? "Manage only the departments and modules assigned to you."
                : "Manage all academic departments of IMSEC."}
            </p>
          </div>
        </div>

        {!isSubAdmin && (
          <button
            type="button"
            className="department-add-btn"
            onClick={() => navigate("/imsec-control-center/departments/add")}
          >
            <FaPlus />
            Add Department
          </button>
        )}
      </div>

      {/* =====================================================
          SUB ADMIN INFO
      ===================================================== */}

      {isSubAdmin && (
        <div className="department-subadmin-info">
          <FaLock />

          <span>
            You can access only departments and modules assigned by the
            Administrator.
          </span>
        </div>
      )}

      {/* =====================================================
          SEARCH + SUMMARY
      ===================================================== */}

      <div className="department-toolbar">
        <div className="department-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name, code, type, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="department-summary">
          <strong>{filteredDepartments.length}</strong>

          <span>
            Department
            {filteredDepartments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredDepartments.length === 0 ? (
        <div className="department-table-card">
          <div className="department-empty">
            <FaBuilding />

            <h5>
              {isSubAdmin ? "No Assigned Departments" : "No Departments Found"}
            </h5>

            <p>
              {isSubAdmin
                ? "No department has been assigned to your account yet."
                : search
                  ? "No department matches your search."
                  : "No departments are available."}
            </p>
          </div>
        </div>
      ) : (
        /* ===================================================
           TABLE
        =================================================== */

        <div className="department-table-card">
          <div className="department-table-wrapper">
            <table className="department-table">
              <thead>
                <tr>
                  <th>S.No.</th>

                  <th>Department Name</th>

                  <th>Code</th>

                  <th>Short Name</th>

                  <th>Type</th>

                  <th>Slug</th>

                  <th>Public Path</th>

                  <th>Priority</th>

                  <th>Access</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department, index) => {
                  const isActive = getDepartmentStatus(department);

                  return (
                    <tr key={department?._id || index}>
                      {/* =================================================
                          S.NO.
                      ================================================= */}

                      <td className="department-serial">{index + 1}</td>

                      {/* =================================================
                          DEPARTMENT NAME + DESCRIPTION
                      ================================================= */}

                      <td>
                        <div className="department-name-cell">
                          <span className="department-name">
                            {department?.name || "—"}
                          </span>

                          {department?.description && (
                            <small
                              className="department-description"
                              title={department.description}
                            >
                              {department.description}
                            </small>
                          )}
                        </div>
                      </td>

                      {/* =================================================
                          CODE
                      ================================================= */}

                      <td>
                        {department?.code ? (
                          <span className="department-code-badge">
                            {department.code}
                          </span>
                        ) : (
                          <span className="department-na">—</span>
                        )}
                      </td>

                      {/* =================================================
                          SHORT NAME
                      ================================================= */}

                      <td>
                        {department?.shortName ? (
                          <span className="department-short-name">
                            {department.shortName}
                          </span>
                        ) : (
                          <span className="department-na">—</span>
                        )}
                      </td>

                      {/* =================================================
                          TYPE
                      ================================================= */}

                      <td>
                        {department?.type ? (
                          <span className="department-type-badge">
                            {department.type}
                          </span>
                        ) : (
                          <span className="department-na">—</span>
                        )}
                      </td>

                      {/* =================================================
                          SLUG
                      ================================================= */}

                      <td>
                        {department?.slug ? (
                          <span
                            className="department-slug-badge"
                            title={department.slug}
                          >
                            {department.slug}
                          </span>
                        ) : (
                          <span className="department-na">—</span>
                        )}
                      </td>

                      {/* =================================================
                          PUBLIC PATH
                      ================================================= */}

                      <td>
                        {department?.publicPath ? (
                          <span
                            className="department-public-path"
                            title={department.publicPath}
                          >
                            {department.publicPath}
                          </span>
                        ) : (
                          <span className="department-na">—</span>
                        )}
                      </td>

                      {/* =================================================
                          PRIORITY
                      ================================================= */}

                      <td>
                        <span className="department-priority">
                          {department?.priority ?? "—"}
                        </span>
                      </td>

                      {/* =================================================
                          ACCESS
                      ================================================= */}

                      <td>
                        <span
                          className={
                            isSubAdmin
                              ? "department-access-badge assigned"
                              : "department-access-badge full"
                          }
                        >
                          {getEnabledModuleCount(department)}
                        </span>
                      </td>

                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td>
                        {isActive ? (
                          <span className="department-status-active">
                            Active
                          </span>
                        ) : (
                          <span className="department-status-inactive">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td>
                        <div className="department-actions">
                          {/* VIEW */}

                          <button
                            type="button"
                            className="department-view-btn"
                            onClick={() => handleView(department)}
                            title="Open Department"
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}

                          {!isSubAdmin && (
                            <button
                              type="button"
                              className="department-edit-btn"
                              onClick={() => handleEdit(department)}
                              title="Edit Department"
                            >
                              <FaEdit />
                            </button>
                          )}

                          {/* DELETE */}

                          {!isSubAdmin && (
                            <button
                              type="button"
                              className="department-delete-btn"
                              onClick={() => handleDelete(department)}
                              title="Delete Department"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
