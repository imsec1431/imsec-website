import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Admin from "../models/Admin.js";
import Department from "../models/Department.js";
import permissionConfig from "../config/permissionConfig.js";

/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

const isAdminUser = (req) => {
  const admin = req.admin || req.user;

  if (!admin) {
    return false;
  }

  /*
   * Any normal Admin role can manage Sub Admins.
   * Sub Admin itself cannot manage Sub Admins.
   */
  return admin.role !== "Sub Admin";
};

/* =========================================================
   GLOBAL PERMISSIONS
========================================================= */

const buildGlobalPermissions = (permissions = []) => {
  const requestedPermissions = Array.isArray(permissions) ? permissions : [];

  return permissionConfig.modules.map((module) => {
    const requestedModule = requestedPermissions.find(
      (item) => item.key === module.key,
    );

    const moduleEnabled = requestedModule?.enabled === true;

    const requestedSubModules = Array.isArray(requestedModule?.subModules)
      ? requestedModule.subModules
      : [];

    return {
      key: module.key,
      enabled: moduleEnabled,

      subModules: Array.isArray(module.subModules)
        ? module.subModules.map((subModule) => {
            const requestedSubModule = requestedSubModules.find(
              (item) => item.key === subModule.key,
            );

            return {
              key: subModule.key,
              enabled: requestedSubModule?.enabled === true,
            };
          })
        : [],
    };
  });
};

/* =========================================================
   DEPARTMENT PERMISSIONS
========================================================= */

const buildDepartmentPermissions = async (permissions = []) => {
  const requestedPermissions = Array.isArray(permissions) ? permissions : [];

  const departments = await Department.find({})
    .select("_id name slug")
    .sort({ name: 1 })
    .lean();

  return departments.map((department) => {
    const requestedDepartment = requestedPermissions.find(
      (item) => String(item.departmentId) === String(department._id),
    );

    const departmentEnabled = requestedDepartment?.enabled === true;

    const requestedModules = Array.isArray(requestedDepartment?.modules)
      ? requestedDepartment.modules
      : [];

    return {
      departmentId: department._id,

      /*
       * Slug is included for frontend route checking.
       */
      slug: department.slug,

      name: department.name,

      enabled: departmentEnabled,

      modules: permissionConfig.departments.map((module) => {
        const requestedModule = requestedModules.find(
          (item) => item.key === module.key,
        );

        const moduleEnabled = requestedModule?.enabled === true;

        const requestedSubModules = Array.isArray(requestedModule?.subModules)
          ? requestedModule.subModules
          : [];

        return {
          key: module.key,
          enabled: moduleEnabled,

          subModules: Array.isArray(module.subModules)
            ? module.subModules.map((subModule) => {
                const requestedSubModule = requestedSubModules.find(
                  (item) => item.key === subModule.key,
                );

                return {
                  key: subModule.key,
                  enabled: requestedSubModule?.enabled === true,
                };
              })
            : [],
        };
      }),
    };
  });
};

/* =========================================================
   CREATE SUB ADMIN
========================================================= */

export const createSubAdmin = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const { name, email, password, isActive = true } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      role: "Sub Admin",

      isActive: isActive !== false,

      permissions: {
        modules: buildGlobalPermissions([]),
        departments: await buildDepartmentPermissions([]),
      },

      createdBy: req.admin?._id || req.user?._id || null,

      lastPasswordChange: new Date(),
    });

    const safeAdmin = await Admin.findById(admin._id)
      .select("-password -otp -otpExpire -loginOtp -loginOtpExpire")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Sub Admin created successfully.",
      data: safeAdmin,
    });
  } catch (error) {
    console.error("Create Sub Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Sub Admin.",
    });
  }
};

/* =========================================================
   GET ALL SUB ADMINS
========================================================= */

export const getSubAdmins = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const subAdmins = await Admin.find({
      role: "Sub Admin",
    })
      .select("-password -otp -otpExpire -loginOtp -loginOtpExpire")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: subAdmins.length,
      data: subAdmins,
    });
  } catch (error) {
    console.error("Get Sub Admins Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Sub Admins.",
    });
  }
};

/* =========================================================
   GET SINGLE SUB ADMIN
========================================================= */

export const getSubAdmin = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    const subAdmin = await Admin.findOne({
      _id: id,
      role: "Sub Admin",
    })
      .select("-password -otp -otpExpire -loginOtp -loginOtpExpire")
      .lean();

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    return res.json({
      success: true,
      data: subAdmin,
    });
  } catch (error) {
    console.error("Get Sub Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Sub Admin.",
    });
  }
};

/* =========================================================
   UPDATE SUB ADMIN BASIC DETAILS
========================================================= */

export const updateSubAdmin = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    const subAdmin = await Admin.findOne({
      _id: id,
      role: "Sub Admin",
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    const { name, email, isActive } = req.body;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      subAdmin.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      const duplicate = await Admin.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another account already uses this email.",
        });
      }

      subAdmin.email = normalizedEmail;
    }

    if (isActive !== undefined) {
      subAdmin.isActive = isActive === true;
    }

    await subAdmin.save();

    const safeAdmin = await Admin.findById(id)
      .select("-password -otp -otpExpire -loginOtp -loginOtpExpire")
      .lean();

    return res.json({
      success: true,
      message: "Sub Admin updated successfully.",
      data: safeAdmin,
    });
  } catch (error) {
    console.error("Update Sub Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Sub Admin.",
    });
  }
};

/* =========================================================
   UPDATE SUB ADMIN PERMISSIONS
========================================================= */

export const updateSubAdminPermissions = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admin permissions.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    const subAdmin = await Admin.findOne({
      _id: id,
      role: "Sub Admin",
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    const { modules = [], departments = [] } = req.body;

    subAdmin.permissions = {
      modules: buildGlobalPermissions(modules),

      departments: await buildDepartmentPermissions(departments),
    };

    await subAdmin.save();

    const safeAdmin = await Admin.findById(id)
      .select("-password -otp -otpExpire -loginOtp -loginOtpExpire")
      .lean();

    return res.json({
      success: true,
      message: "Sub Admin permissions updated successfully.",
      data: safeAdmin,
    });
  } catch (error) {
    console.error("Update Sub Admin Permissions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update permissions.",
    });
  }
};

/* =========================================================
   RESET SUB ADMIN PASSWORD

   Admin can directly set a new password
   for a Sub Admin.

   NO OTP
   NO EMAIL
   NO FORGOT PASSWORD FLOW
========================================================= */

export const resetSubAdminPassword = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reset Sub Admin passwords.",
      });
    }

    const { id } = req.params;
    const { password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const subAdmin = await Admin.findOne({
      _id: id,
      role: "Sub Admin",
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    /*
     * Hash new password
     */
    subAdmin.password = await bcrypt.hash(password, 12);

    /*
     * Track password change
     */
    subAdmin.lastPasswordChange = new Date();

    /*
     * Sub Admin does not use OTP.
     * Clear any old OTP values.
     */
    subAdmin.otp = null;
    subAdmin.otpExpire = null;
    subAdmin.loginOtp = null;
    subAdmin.loginOtpExpire = null;

    /*
     * These fields are cleared only if
     * they exist in the current Admin model.
     */
    if ("loginOtpAttempts" in subAdmin) {
      subAdmin.loginOtpAttempts = 0;
    }

    if ("loginLockedUntil" in subAdmin) {
      subAdmin.loginLockedUntil = null;
    }

    await subAdmin.save();

    return res.json({
      success: true,
      message: "Sub Admin password reset successfully.",
    });
  } catch (error) {
    console.error("Reset Sub Admin Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reset Sub Admin password.",
    });
  }
};

/* =========================================================
   TOGGLE SUB ADMIN STATUS
========================================================= */

export const toggleSubAdminStatus = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    const subAdmin = await Admin.findOne({
      _id: id,
      role: "Sub Admin",
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    subAdmin.isActive = !subAdmin.isActive;

    await subAdmin.save();

    return res.json({
      success: true,
      message: subAdmin.isActive
        ? "Sub Admin activated successfully."
        : "Sub Admin deactivated successfully.",
      data: {
        _id: subAdmin._id,
        isActive: subAdmin.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle Sub Admin Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Sub Admin status.",
    });
  }
};

/* =========================================================
   DELETE SUB ADMIN
========================================================= */

export const deleteSubAdmin = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage Sub Admins.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Sub Admin ID.",
      });
    }

    const subAdmin = await Admin.findOneAndDelete({
      _id: id,
      role: "Sub Admin",
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub Admin not found.",
      });
    }

    return res.json({
      success: true,
      message: "Sub Admin deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Sub Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete Sub Admin.",
    });
  }
};

/* =========================================================
   GET PERMISSION CONFIGURATION
========================================================= */

export const getPermissionConfig = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view permission configuration.",
      });
    }

    const departments = await Department.find({})
      .select("_id name slug")
      .sort({ name: 1 })
      .lean();

    return res.json({
      success: true,

      data: {
        /*
         * Global modules
         */
        modules: permissionConfig.modules,

        /*
         * Actual departments from MongoDB.
         *
         * Every department receives
         * the same department-module
         * configuration.
         */
        departments: departments.map((department) => ({
          _id: department._id,
          name: department.name,
          slug: department.slug,

          modules: permissionConfig.departments,
        })),
      },
    });
  } catch (error) {
    console.error("Get Permission Config Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load permission configuration.",
    });
  }
};
