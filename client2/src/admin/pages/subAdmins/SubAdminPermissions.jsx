import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaShieldAlt,
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getSubAdmin,
  getPermissionConfig,
  updateSubAdminPermissions,
} from "../../services/subAdminService";

import "./SubAdminPermissions.css";

const SubAdminPermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subAdmin, setSubAdmin] = useState(null);

  const [globalModules, setGlobalModules] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [expandedModules, setExpandedModules] = useState({});

  const [expandedDepartments, setExpandedDepartments] = useState({});

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [subAdminResponse, configResponse] = await Promise.all([
        getSubAdmin(id),
        getPermissionConfig(),
      ]);

      const subAdminData =
        subAdminResponse?.data?.data || subAdminResponse?.data || null;

      const configData =
        configResponse?.data?.data || configResponse?.data || {};

      setSubAdmin(subAdminData);

      /* -----------------------------------------------------
         GLOBAL MODULES
      ----------------------------------------------------- */

      const configModules = Array.isArray(configData.modules)
        ? configData.modules
        : [];

      const savedModules = Array.isArray(subAdminData?.permissions?.modules)
        ? subAdminData.permissions.modules
        : [];

      const mergedGlobalModules = configModules.map((module) => {
        const savedModule = savedModules.find(
          (item) => item.key === module.key,
        );

        const savedSubModules = Array.isArray(savedModule?.subModules)
          ? savedModule.subModules
          : [];

        return {
          ...module,

          enabled: savedModule?.enabled === true,

          subModules: Array.isArray(module.subModules)
            ? module.subModules.map((subModule) => {
                const savedSubModule = savedSubModules.find(
                  (item) => item.key === subModule.key,
                );

                return {
                  ...subModule,
                  enabled: savedSubModule?.enabled === true,
                };
              })
            : [],
        };
      });

      setGlobalModules(mergedGlobalModules);

      /* -----------------------------------------------------
         DEPARTMENTS
      ----------------------------------------------------- */

      const configDepartments = Array.isArray(configData.departments)
        ? configData.departments
        : [];

      const savedDepartments = Array.isArray(
        subAdminData?.permissions?.departments,
      )
        ? subAdminData.permissions.departments
        : [];

      const mergedDepartments = configDepartments.map((department) => {
        const savedDepartment = savedDepartments.find(
          (item) => String(item.departmentId) === String(department._id),
        );

        const savedModules = Array.isArray(savedDepartment?.modules)
          ? savedDepartment.modules
          : [];

        return {
          ...department,

          enabled: savedDepartment?.enabled === true,

          modules: Array.isArray(department.modules)
            ? department.modules.map((module) => {
                const savedModule = savedModules.find(
                  (item) => item.key === module.key,
                );

                const savedSubModules = Array.isArray(savedModule?.subModules)
                  ? savedModule.subModules
                  : [];

                return {
                  ...module,

                  enabled: savedModule?.enabled === true,

                  subModules: Array.isArray(module.subModules)
                    ? module.subModules.map((subModule) => {
                        const savedSubModule = savedSubModules.find(
                          (item) => item.key === subModule.key,
                        );

                        return {
                          ...subModule,

                          enabled: savedSubModule?.enabled === true,
                        };
                      })
                    : [],
                };
              })
            : [],
        };
      });

      setDepartments(mergedDepartments);
    } catch (error) {
      console.error("Load Sub Admin Permissions Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load permissions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  /* =========================================================
     GLOBAL MODULE TOGGLE
  ========================================================= */

  const toggleGlobalModule = (moduleIndex) => {
    setGlobalModules((previous) => {
      const updated = [...previous];

      const module = updated[moduleIndex];

      const enabled = !module.enabled;

      updated[moduleIndex] = {
        ...module,
        enabled,

        /*
         * When parent module is disabled,
         * all sub-modules are also disabled.
         *
         * When enabled, sub-modules remain
         * independently controllable.
         */
        subModules: Array.isArray(module.subModules)
          ? module.subModules.map((subModule) => ({
              ...subModule,
              enabled: enabled ? subModule.enabled : false,
            }))
          : [],
      };

      return updated;
    });
  };

  /* =========================================================
     GLOBAL SUB-MODULE TOGGLE
  ========================================================= */

  const toggleGlobalSubModule = (moduleIndex, subModuleIndex) => {
    setGlobalModules((previous) => {
      const updated = [...previous];

      const module = updated[moduleIndex];

      const subModules = [...(module.subModules || [])];

      subModules[subModuleIndex] = {
        ...subModules[subModuleIndex],
        enabled: !subModules[subModuleIndex].enabled,
      };

      const anyEnabled = subModules.some((item) => item.enabled === true);

      updated[moduleIndex] = {
        ...module,

        /*
         * Parent module becomes enabled
         * automatically when a child is selected.
         */
        enabled: anyEnabled || module.enabled === true,

        subModules,
      };

      return updated;
    });
  };

  /* =========================================================
     DEPARTMENT TOGGLE
  ========================================================= */

  const toggleDepartment = (departmentIndex) => {
    setDepartments((previous) => {
      const updated = [...previous];

      const department = updated[departmentIndex];

      const enabled = !department.enabled;

      updated[departmentIndex] = {
        ...department,

        enabled,

        modules: Array.isArray(department.modules)
          ? department.modules.map((module) => ({
              ...module,

              enabled: enabled ? module.enabled : false,

              subModules: Array.isArray(module.subModules)
                ? module.subModules.map((subModule) => ({
                    ...subModule,
                    enabled: enabled ? subModule.enabled : false,
                  }))
                : [],
            }))
          : [],
      };

      return updated;
    });
  };

  /* =========================================================
     DEPARTMENT MODULE TOGGLE
  ========================================================= */

  const toggleDepartmentModule = (departmentIndex, moduleIndex) => {
    setDepartments((previous) => {
      const updated = [...previous];

      const department = updated[departmentIndex];

      const modules = [...(department.modules || [])];

      const module = modules[moduleIndex];

      const enabled = !module.enabled;

      modules[moduleIndex] = {
        ...module,

        enabled,

        subModules: Array.isArray(module.subModules)
          ? module.subModules.map((subModule) => ({
              ...subModule,

              enabled: enabled ? subModule.enabled : false,
            }))
          : [],
      };

      updated[departmentIndex] = {
        ...department,

        /*
         * Department automatically becomes
         * enabled if a module is selected.
         */
        enabled: enabled || department.enabled === true,

        modules,
      };

      return updated;
    });
  };

  /* =========================================================
     DEPARTMENT SUB-MODULE TOGGLE
  ========================================================= */

  const toggleDepartmentSubModule = (
    departmentIndex,
    moduleIndex,
    subModuleIndex,
  ) => {
    setDepartments((previous) => {
      const updated = [...previous];

      const department = updated[departmentIndex];

      const modules = [...(department.modules || [])];

      const module = modules[moduleIndex];

      const subModules = [...(module.subModules || [])];

      subModules[subModuleIndex] = {
        ...subModules[subModuleIndex],

        enabled: !subModules[subModuleIndex].enabled,
      };

      const anySubModuleEnabled = subModules.some(
        (item) => item.enabled === true,
      );

      modules[moduleIndex] = {
        ...module,

        enabled: anySubModuleEnabled || module.enabled === true,

        subModules,
      };

      updated[departmentIndex] = {
        ...department,

        enabled: department.enabled === true || anySubModuleEnabled,

        modules,
      };

      return updated;
    });
  };

  /* =========================================================
     SELECT / DESELECT ALL GLOBAL
  ========================================================= */

  const selectAllGlobal = () => {
    setGlobalModules((previous) =>
      previous.map((module) => ({
        ...module,

        enabled: true,

        subModules: Array.isArray(module.subModules)
          ? module.subModules.map((subModule) => ({
              ...subModule,
              enabled: true,
            }))
          : [],
      })),
    );
  };

  const clearAllGlobal = () => {
    setGlobalModules((previous) =>
      previous.map((module) => ({
        ...module,

        enabled: false,

        subModules: Array.isArray(module.subModules)
          ? module.subModules.map((subModule) => ({
              ...subModule,
              enabled: false,
            }))
          : [],
      })),
    );
  };

  /* =========================================================
     SELECT / DESELECT ALL DEPARTMENT
  ========================================================= */

  const selectAllDepartment = (departmentIndex) => {
    setDepartments((previous) => {
      const updated = [...previous];

      const department = updated[departmentIndex];

      updated[departmentIndex] = {
        ...department,

        enabled: true,

        modules: Array.isArray(department.modules)
          ? department.modules.map((module) => ({
              ...module,

              enabled: true,

              subModules: Array.isArray(module.subModules)
                ? module.subModules.map((subModule) => ({
                    ...subModule,
                    enabled: true,
                  }))
                : [],
            }))
          : [],
      };

      return updated;
    });
  };

  const clearAllDepartment = (departmentIndex) => {
    setDepartments((previous) => {
      const updated = [...previous];

      const department = updated[departmentIndex];

      updated[departmentIndex] = {
        ...department,

        enabled: false,

        modules: Array.isArray(department.modules)
          ? department.modules.map((module) => ({
              ...module,

              enabled: false,

              subModules: Array.isArray(module.subModules)
                ? module.subModules.map((subModule) => ({
                    ...subModule,
                    enabled: false,
                  }))
                : [],
            }))
          : [],
      };

      return updated;
    });
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        modules: globalModules.map((module) => ({
          key: module.key,
          enabled: module.enabled === true,

          subModules: Array.isArray(module.subModules)
            ? module.subModules.map((subModule) => ({
                key: subModule.key,

                enabled: subModule.enabled === true,
              }))
            : [],
        })),

        departments: departments.map((department) => ({
          departmentId: department._id,

          enabled: department.enabled === true,

          modules: Array.isArray(department.modules)
            ? department.modules.map((module) => ({
                key: module.key,

                enabled: module.enabled === true,

                subModules: Array.isArray(module.subModules)
                  ? module.subModules.map((subModule) => ({
                      key: subModule.key,

                      enabled: subModule.enabled === true,
                    }))
                  : [],
              }))
            : [],
        })),
      };

      const response = await updateSubAdminPermissions(id, payload);

      if (response?.data?.success) {
        toast.success("Permissions saved successfully.");

        /*
         * Reload so the UI reflects exactly
         * what the backend stored.
         */
        await loadData();
      } else {
        toast.error(response?.data?.message || "Failed to save permissions.");
      }
    } catch (error) {
      console.error("Save Permissions Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to save permissions.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const countGlobalPermissions = () => {
    let count = 0;

    globalModules.forEach((module) => {
      if (module.enabled) {
        count++;
      }

      module.subModules?.forEach((subModule) => {
        if (subModule.enabled) {
          count++;
        }
      });
    });

    return count;
  };

  const countDepartmentPermissions = () => {
    let count = 0;

    departments.forEach((department) => {
      if (department.enabled) {
        count++;
      }

      department.modules?.forEach((module) => {
        if (module.enabled) {
          count++;
        }

        module.subModules?.forEach((subModule) => {
          if (subModule.enabled) {
            count++;
          }
        });
      });
    });

    return count;
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="subadmin-permissions-loading">
        <div className="subadmin-spinner" />

        <p>Loading permission configuration...</p>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="subadmin-permissions-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="subadmin-permissions-header">
        <div className="subadmin-header-left">
          <button
            type="button"
            className="subadmin-back-btn"
            onClick={() => navigate("/imsec-control-center/sub-admins")}
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="subadmin-page-title">
              <FaShieldAlt />
              Manage Permissions
            </div>

            <div className="subadmin-page-subtitle">
              {subAdmin?.name || "Sub Admin"}

              {subAdmin?.email ? ` • ${subAdmin.email}` : ""}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="subadmin-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="subadmin-permission-summary">
        <div className="permission-summary-card">
          <FaShieldAlt />

          <div>
            <span>Global Permissions</span>

            <strong>{countGlobalPermissions()}</strong>
          </div>
        </div>

        <div className="permission-summary-card">
          <FaBuilding />

          <div>
            <span>Department Permissions</span>

            <strong>{countDepartmentPermissions()}</strong>
          </div>
        </div>

        <div className="permission-summary-card">
          <FaCheckCircle />

          <div>
            <span>Account Status</span>

            <strong>{subAdmin?.isActive ? "Active" : "Inactive"}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          GLOBAL MODULES
      ===================================================== */}

      <section className="permission-section">
        <div className="permission-section-header">
          <div>
            <h2>Global Modules</h2>

            <p>Control access to college-wide Admin modules.</p>
          </div>

          <div className="permission-actions">
            <button type="button" onClick={selectAllGlobal}>
              Select All
            </button>

            <button type="button" onClick={clearAllGlobal}>
              Clear All
            </button>
          </div>
        </div>

        <div className="permission-grid">
          {globalModules.map((module, moduleIndex) => {
            const hasSubModules =
              Array.isArray(module.subModules) && module.subModules.length > 0;

            const expanded = expandedModules[module.key] === true;

            return (
              <div
                className={`permission-card ${
                  module.enabled ? "permission-card-active" : ""
                }`}
                key={module.key}
              >
                <div className="permission-card-main">
                  {hasSubModules && (
                    <button
                      type="button"
                      className="permission-expand-btn"
                      onClick={() =>
                        setExpandedModules((previous) => ({
                          ...previous,
                          [module.key]: !expanded,
                        }))
                      }
                    >
                      {expanded ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                  )}

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={module.enabled === true}
                      onChange={() => toggleGlobalModule(moduleIndex)}
                    />

                    <span className="custom-checkbox" />

                    <span className="permission-label">
                      {module.label || module.name || module.key}
                    </span>
                  </label>
                </div>

                {hasSubModules && expanded && (
                  <div className="submodule-list">
                    {module.subModules.map((subModule, subModuleIndex) => (
                      <label className="submodule-checkbox" key={subModule.key}>
                        <input
                          type="checkbox"
                          checked={subModule.enabled === true}
                          onChange={() =>
                            toggleGlobalSubModule(moduleIndex, subModuleIndex)
                          }
                        />

                        <span className="custom-checkbox" />

                        <span>
                          {subModule.label || subModule.name || subModule.key}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          DEPARTMENTS
      ===================================================== */}

      <section className="permission-section">
        <div className="permission-section-header">
          <div>
            <h2>Department Permissions</h2>

            <p>Select departments and control their individual modules.</p>
          </div>
        </div>

        {departments.length === 0 ? (
          <div className="permission-empty">
            <FaBuilding />

            <h3>No departments found</h3>

            <p>Create a department first to assign department permissions.</p>
          </div>
        ) : (
          <div className="department-permission-list">
            {departments.map((department, departmentIndex) => {
              const expanded =
                expandedDepartments[String(department._id)] === true;

              return (
                <div
                  className={`department-permission-card ${
                    department.enabled ? "department-card-active" : ""
                  }`}
                  key={department._id}
                >
                  {/* -----------------------------------------
                        DEPARTMENT HEADER
                    ----------------------------------------- */}

                  <div className="department-permission-header">
                    <div className="department-title-area">
                      <button
                        type="button"
                        className="permission-expand-btn"
                        onClick={() =>
                          setExpandedDepartments((previous) => ({
                            ...previous,
                            [String(department._id)]: !expanded,
                          }))
                        }
                      >
                        {expanded ? <FaChevronDown /> : <FaChevronRight />}
                      </button>

                      <label className="permission-checkbox">
                        <input
                          type="checkbox"
                          checked={department.enabled === true}
                          onChange={() => toggleDepartment(departmentIndex)}
                        />

                        <span className="custom-checkbox" />

                        <span className="permission-label">
                          {department.name}
                        </span>
                      </label>
                    </div>

                    <div className="department-actions">
                      <button
                        type="button"
                        onClick={() => selectAllDepartment(departmentIndex)}
                      >
                        Select All
                      </button>

                      <button
                        type="button"
                        onClick={() => clearAllDepartment(departmentIndex)}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* -----------------------------------------
                        DEPARTMENT MODULES
                    ----------------------------------------- */}

                  {expanded && (
                    <div className="department-module-container">
                      {department.modules?.map((module, moduleIndex) => {
                        const hasSubModules =
                          Array.isArray(module.subModules) &&
                          module.subModules.length > 0;

                        const moduleExpanded =
                          expandedModules[`${department._id}-${module.key}`] ===
                          true;

                        return (
                          <div
                            className={`department-module-card ${
                              module.enabled ? "module-active" : ""
                            }`}
                            key={module.key}
                          >
                            <div className="permission-card-main">
                              {hasSubModules && (
                                <button
                                  type="button"
                                  className="permission-expand-btn"
                                  onClick={() =>
                                    setExpandedModules((previous) => ({
                                      ...previous,
                                      [`${department._id}-${module.key}`]:
                                        !moduleExpanded,
                                    }))
                                  }
                                >
                                  {moduleExpanded ? (
                                    <FaChevronDown />
                                  ) : (
                                    <FaChevronRight />
                                  )}
                                </button>
                              )}

                              <label className="permission-checkbox">
                                <input
                                  type="checkbox"
                                  checked={module.enabled === true}
                                  onChange={() =>
                                    toggleDepartmentModule(
                                      departmentIndex,
                                      moduleIndex,
                                    )
                                  }
                                />

                                <span className="custom-checkbox" />

                                <span className="permission-label">
                                  {module.label || module.name || module.key}
                                </span>
                              </label>
                            </div>

                            {hasSubModules && moduleExpanded && (
                              <div className="submodule-list">
                                {module.subModules.map(
                                  (subModule, subModuleIndex) => (
                                    <label
                                      className="submodule-checkbox"
                                      key={subModule.key}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={subModule.enabled === true}
                                        onChange={() =>
                                          toggleDepartmentSubModule(
                                            departmentIndex,
                                            moduleIndex,
                                            subModuleIndex,
                                          )
                                        }
                                      />

                                      <span className="custom-checkbox" />

                                      <span>
                                        {subModule.label ||
                                          subModule.name ||
                                          subModule.key}
                                      </span>
                                    </label>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          BOTTOM SAVE
      ===================================================== */}

      <div className="permission-bottom-actions">
        <button
          type="button"
          className="permission-cancel-btn"
          onClick={() => navigate("/imsec-control-center/sub-admins")}
        >
          Cancel
        </button>

        <button
          type="button"
          className="subadmin-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
};

export default SubAdminPermissions;
