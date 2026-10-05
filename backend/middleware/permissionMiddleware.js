import Admin from "../models/Admin.js";

import Department from "../models/Department.js";
import DepartmentFaculty from "../models/DepartmentFaculty.js";
import DepartmentHodMessage from "../models/DepartmentHodMessage.js";
import DepartmentAlumni from "../models/DepartmentAlumni.js";
import DepartmentAchievementItem from "../models/DepartmentAchievementItem.js";
import FacultyAchievementItem from "../models/FacultyAchievementItem.js";
import DepartmentEvent from "../models/DepartmentEvent.js";

/* =========================================================
   DEPARTMENT RESEARCH MODELS
========================================================= */

import DepartmentResearchAbout from "../models/DepartmentResearchAbout.js";
import DepartmentResearchPolicy from "../models/DepartmentResearchPolicy.js";
import DepartmentResearchJournal from "../models/DepartmentResearchJournal.js";
import DepartmentResearchConferencePaper from "../models/DepartmentResearchConferencePaper.js";
import DepartmentResearchBook from "../models/DepartmentResearchBook.js";
import DepartmentResearchPatent from "../models/DepartmentResearchPatent.js";
import DepartmentResearchFDP from "../models/DepartmentResearchFDP.js";

/* =========================================================
   GET ADMIN ID
========================================================= */

const getAdminId = (req) => {
  return (
    req.admin?._id || req.admin?.id || req.user?._id || req.user?.id || null
  );
};

/* =========================================================
   RESOLVE DEPARTMENT ID FROM RESOURCE ID
========================================================= */

/*
 * Some department routes use /:id where :id is the
 * resource ID and NOT the department ID.
 *
 * Examples:
 *
 * Faculty:
 *   /department-faculty/:id
 *
 * HOD Message:
 *   /department-hod-message/:id
 *
 * Alumni:
 *   /department-alumni/:id
 *
 * Achievement:
 *   /department-achievement-items/:id
 *
 * Events:
 *   /department-events/:id
 *
 * Research:
 *   /department-research/.../:id
 *
 * Therefore we resolve the actual department before
 * checking Sub Admin permissions.
 */

const resolveDepartmentIdFromResource = async (
  moduleKey,
  subModuleKey,
  resourceId,
) => {
  if (!resourceId) {
    return null;
  }

  try {
    /* =====================================================
       FACULTY
    ===================================================== */

    if (moduleKey === "faculty" && subModuleKey === "faculty-achievements") {
      const achievement = await FacultyAchievementItem.findById(resourceId)
        .select("departmentId")
        .lean();

      return achievement?.departmentId || null;
    }

    if (moduleKey === "faculty") {
      const faculty = await DepartmentFaculty.findById(resourceId)
        .select("departmentId")
        .lean();

      return faculty?.departmentId || null;
    }

    /* =====================================================
       HOD MESSAGE / OVERVIEW
    ===================================================== */

    if (moduleKey === "overview") {
      const hodMessage = await DepartmentHodMessage.findById(resourceId)
        .select("departmentId")
        .lean();

      return hodMessage?.departmentId || null;
    }

    /* =====================================================
       DEPARTMENT ALUMNI
    ===================================================== */

    if (moduleKey === "alumni") {
      const alumni = await DepartmentAlumni.findById(resourceId)
        .select("department")
        .lean();

      return alumni?.department || null;
    }

    /* =====================================================
       DEPARTMENT ACHIEVEMENT ITEM
    ===================================================== */

    if (moduleKey === "achievements") {
      const achievement = await DepartmentAchievementItem.findById(resourceId)
        .select("departmentId")
        .lean();

      return achievement?.departmentId || null;
    }

    /* =====================================================
       DEPARTMENT EVENTS
    ===================================================== */

    if (moduleKey === "events") {
      const event = await DepartmentEvent.findById(resourceId)
        .select("departmentId")
        .lean();

      return event?.departmentId || null;
    }

    /* =====================================================
       DEPARTMENT RESEARCH
    ===================================================== */

    if (moduleKey === "research") {
      let ResearchModel = null;

      switch (subModuleKey) {
        case "about":
          ResearchModel = DepartmentResearchAbout;
          break;

        case "research-policy":
          ResearchModel = DepartmentResearchPolicy;
          break;

        case "journals":
          ResearchModel = DepartmentResearchJournal;
          break;

        case "conference-papers":
          ResearchModel = DepartmentResearchConferencePaper;
          break;

        case "books-chapters":
          ResearchModel = DepartmentResearchBook;
          break;

        case "patents":
          ResearchModel = DepartmentResearchPatent;
          break;

        case "fdps":
          ResearchModel = DepartmentResearchFDP;
          break;

        default:
          ResearchModel = null;
      }

      if (ResearchModel) {
        const researchResource = await ResearchModel.findById(resourceId)
          .select("department")
          .lean();

        return researchResource?.department || null;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to resolve department from resource:", error);

    return null;
  }
};

/* =========================================================
   GLOBAL PERMISSION
========================================================= */

export const requireGlobalPermission = (moduleKey, subModuleKey = null) => {
  return async (req, res, next) => {
    try {
      const adminId = getAdminId(req);

      /* ===================================================
         AUTHENTICATION
      =================================================== */

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const admin = await Admin.findById(adminId).lean();

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin account not found.",
        });
      }

      /* ===================================================
         SUPER ADMIN / NORMAL ADMIN
         FULL ACCESS
      =================================================== */

      if (admin.role !== "Sub Admin") {
        return next();
      }

      /* ===================================================
         ACTIVE CHECK
      =================================================== */

      if (admin.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive.",
        });
      }

      /* ===================================================
         GET MODULES
      =================================================== */

      const modules = Array.isArray(admin?.permissions?.modules)
        ? admin.permissions.modules
        : [];

      const modulePermission = modules.find(
        (module) => module?.key === moduleKey,
      );

      if (!modulePermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this module.",
        });
      }

      /* ===================================================
         SPECIFIC SUB-MODULE
      =================================================== */

      if (subModuleKey) {
        const subModules = Array.isArray(modulePermission.subModules)
          ? modulePermission.subModules
          : [];

        const subModulePermission = subModules.find(
          (subModule) => subModule?.key === subModuleKey,
        );

        if (subModulePermission?.enabled === true) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this sub-module.",
        });
      }

      /* ===================================================
         COMPLETE MODULE
      =================================================== */

      if (modulePermission.enabled === true) {
        return next();
      }

      /* ===================================================
         MODULE DISABLED BUT SUB-MODULE ENABLED
      =================================================== */

      const hasEnabledSubModule =
        Array.isArray(modulePermission.subModules) &&
        modulePermission.subModules.some(
          (subModule) => subModule?.enabled === true,
        );

      if (hasEnabledSubModule) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this module.",
      });
    } catch (error) {
      console.error("Global permission middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Permission verification failed.",
      });
    }
  };
};

/* =========================================================
   DEPARTMENT PERMISSION
========================================================= */

export const requireDepartmentPermission = (
  moduleKey = null,
  subModuleKey = null,
) => {
  return async (req, res, next) => {
    try {
      /* ===================================================
         ADMIN
      =================================================== */

      const adminId = getAdminId(req);

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const admin = await Admin.findById(adminId).lean();

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin account not found.",
        });
      }

      /* ===================================================
         SUPER ADMIN / NORMAL ADMIN
         FULL ACCESS
      =================================================== */

      if (admin.role !== "Sub Admin") {
        return next();
      }

      /* ===================================================
         ACTIVE CHECK
      =================================================== */

      if (admin.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive.",
        });
      }

      /* ===================================================
         GET DEPARTMENT ID / SLUG
      =================================================== */

      let departmentId =
        req.params.departmentId ||
        req.body?.departmentId ||
        req.body?.department ||
        req.query?.departmentId ||
        req.query?.department ||
        null;

      const departmentSlug =
        req.params.slug ||
        req.params.departmentSlug ||
        req.body?.departmentSlug ||
        req.query?.departmentSlug ||
        null;

      /*
       * :id can mean different things.
       *
       * Example:
       *
       * /department-faculty/:id
       * :id = Faculty ID
       *
       * /department-hod-message/:id
       * :id = HOD Message ID
       *
       * /department-alumni/:id
       * :id = Alumni ID
       *
       * /department-achievement-items/:id
       * :id = Achievement Item ID
       *
       * /department-events/:id
       * :id = Event ID
       *
       * /department-research/.../:id
       * :id = Research Resource ID
       */

      const resourceId = req.params.id || null;

      /* ===================================================
         RESOLVE RESOURCE → DEPARTMENT
      =================================================== */

      if (!departmentId && resourceId && moduleKey) {
        const resolvedDepartmentId = await resolveDepartmentIdFromResource(
          moduleKey,
          subModuleKey,
          resourceId,
        );

        if (resolvedDepartmentId) {
          departmentId = String(resolvedDepartmentId);
        }
      }

      /* ===================================================
         SUB ADMIN DEPARTMENTS
      =================================================== */

      const departments = Array.isArray(admin?.permissions?.departments)
        ? admin.permissions.departments
        : [];

      if (departments.length === 0) {
        return res.status(403).json({
          success: false,
          message: "No department has been assigned to your account.",
        });
      }

      /* ===================================================
         FIND ASSIGNED DEPARTMENT
      =================================================== */

      let departmentPermission = null;

      /* ---------------------------------------------------
         FIRST: DEPARTMENT ID
      --------------------------------------------------- */

      if (departmentId) {
        departmentPermission =
          departments.find(
            (department) =>
              String(department?.departmentId || "") === String(departmentId) ||
              String(department?._id || "") === String(departmentId),
          ) || null;
      }

      /* ---------------------------------------------------
         SECOND: DEPARTMENT SLUG
      --------------------------------------------------- */

      if (!departmentPermission && departmentSlug) {
        departmentPermission =
          departments.find(
            (department) =>
              String(department?.slug || "")
                .trim()
                .toLowerCase() === String(departmentSlug).trim().toLowerCase(),
          ) || null;
      }

      /* ---------------------------------------------------
         THIRD: ID MAY ACTUALLY BE SLUG
      --------------------------------------------------- */

      if (!departmentPermission && departmentId) {
        departmentPermission =
          departments.find(
            (department) =>
              String(department?.slug || "")
                .trim()
                .toLowerCase() === String(departmentId).trim().toLowerCase(),
          ) || null;
      }

      /* ===================================================
         DEPARTMENT NOT ASSIGNED
      =================================================== */

      if (!departmentPermission) {
        console.log("Department Permission Denied:", {
          adminId,
          moduleKey,
          subModuleKey,
          resourceId,
          departmentId,
          departmentSlug,
        });

        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this department.",
        });
      }

      /* ===================================================
         DEPARTMENT ROOT
      =================================================== */

      if (!moduleKey) {
        if (departmentPermission.enabled === true) {
          return next();
        }

        const departmentModules = Array.isArray(departmentPermission.modules)
          ? departmentPermission.modules
          : [];

        const hasAnyAccess = departmentModules.some((module) => {
          if (module?.enabled === true) {
            return true;
          }

          return (
            Array.isArray(module?.subModules) &&
            module.subModules.some((subModule) => subModule?.enabled === true)
          );
        });

        if (hasAnyAccess) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: "No modules have been assigned for this department.",
        });
      }

      /* ===================================================
         FIND DEPARTMENT MODULE
      =================================================== */

      const departmentModules = Array.isArray(departmentPermission.modules)
        ? departmentPermission.modules
        : [];

      const modulePermission = departmentModules.find(
        (module) => module?.key === moduleKey,
      );

      if (!modulePermission) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this department module.",
        });
      }

      /* ===================================================
         SPECIFIC SUB-MODULE
      =================================================== */

      if (subModuleKey) {
        const subModules = Array.isArray(modulePermission.subModules)
          ? modulePermission.subModules
          : [];

        const subModulePermission = subModules.find(
          (subModule) => subModule?.key === subModuleKey,
        );

        if (subModulePermission?.enabled === true) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this department sub-module.",
        });
      }

      /* ===================================================
         COMPLETE MODULE
      =================================================== */

      if (modulePermission.enabled === true) {
        return next();
      }

      /* ===================================================
         MODULE DISABLED BUT SUB-MODULE ENABLED
      =================================================== */

      const hasEnabledSubModule =
        Array.isArray(modulePermission.subModules) &&
        modulePermission.subModules.some(
          (subModule) => subModule?.enabled === true,
        );

      if (hasEnabledSubModule) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this department module.",
      });
    } catch (error) {
      console.error("Department permission middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Department permission verification failed.",
      });
    }
  };
};

/* =========================================================
   EXPORT
========================================================= */

export default {
  requireGlobalPermission,
  requireDepartmentPermission,
};
