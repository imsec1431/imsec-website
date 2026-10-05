import axios from "axios";

/* =========================================================
   API URL
========================================================= */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/sub-admins`;

/* =========================================================
   GET AUTH TOKEN
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null
  );
};

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token = getToken();

  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
};

/* =========================================================
   CREATE SUB ADMIN
=========================================================

   POST /api/sub-admins
========================================================= */

export const createSubAdmin = (data) => {
  return axios.post(API_URL, data, getAuthConfig());
};

/* =========================================================
   GET ALL SUB ADMINS
=========================================================

   GET /api/sub-admins
========================================================= */

export const getSubAdmins = () => {
  return axios.get(API_URL, getAuthConfig());
};

/* =========================================================
   GET SINGLE SUB ADMIN
=========================================================

   GET /api/sub-admins/:id
========================================================= */

export const getSubAdmin = (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthConfig());
};

/* =========================================================
   UPDATE SUB ADMIN
=========================================================

   PUT /api/sub-admins/:id
=========================================================

   Updates:
   - Name
   - Email
   - Active/Inactive status
========================================================= */

export const updateSubAdmin = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, getAuthConfig());
};

/* =========================================================
   UPDATE SUB ADMIN PERMISSIONS
=========================================================

   PUT /api/sub-admins/:id/permissions

   Handles:
   - Global modules
   - Global sub-modules
   - Departments
   - Department modules
   - Department sub-modules
========================================================= */

export const updateSubAdminPermissions = (id, data) => {
  return axios.put(`${API_URL}/${id}/permissions`, data, getAuthConfig());
};

/* =========================================================
   RESET SUB ADMIN PASSWORD
=========================================================

   PATCH /api/sub-admins/:id/reset-password

   Admin directly sets a new password.

   NO OTP
   NO EMAIL
========================================================= */

export const resetSubAdminPassword = (id, password) => {
  return axios.patch(
    `${API_URL}/${id}/reset-password`,
    {
      password,
    },
    getAuthConfig(),
  );
};

/* =========================================================
   TOGGLE SUB ADMIN STATUS
=========================================================

   PATCH /api/sub-admins/:id/status
========================================================= */

export const toggleSubAdminStatus = (id) => {
  return axios.patch(`${API_URL}/${id}/status`, {}, getAuthConfig());
};

/* =========================================================
   DELETE SUB ADMIN
=========================================================

   DELETE /api/sub-admins/:id
========================================================= */

export const deleteSubAdmin = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthConfig());
};

/* =========================================================
   GET PERMISSION CONFIG
=========================================================

   GET /api/sub-admins/permission-config

   Returns:
   - Global modules
   - Global sub-modules
   - All departments
   - Department modules
   - Department sub-modules
========================================================= */

export const getPermissionConfig = () => {
  return axios.get(`${API_URL}/permission-config`, getAuthConfig());
};
