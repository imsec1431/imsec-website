import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/departments`;

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken");

  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
};

/* =========================================================
   GET ALL DEPARTMENTS
========================================================= */

export const getDepartments = async () => {
  return await axios.get(API_URL, getAuthConfig());
};

/* =========================================================
   GET SINGLE DEPARTMENT
========================================================= */

export const getDepartment = async (id) => {
  return await axios.get(`${API_URL}/${id}`, getAuthConfig());
};

/* =========================================================
   CREATE DEPARTMENT
========================================================= */

export const createDepartment = async (data) => {
  return await axios.post(API_URL, data, getAuthConfig());
};

/* =========================================================
   UPDATE DEPARTMENT
========================================================= */

export const updateDepartment = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
};

/* =========================================================
   DELETE DEPARTMENT
========================================================= */

export const deleteDepartment = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, getAuthConfig());
};

/* =========================================================
   PUBLIC DEPARTMENTS
========================================================= */

export const getPublicDepartments = async () => {
  return await axios.get(`${API_URL}/public`);
};
