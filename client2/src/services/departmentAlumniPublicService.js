import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   GET DEPARTMENT BY SLUG
========================================================= */

export const getDepartmentBySlug = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/departments/slug/${encodeURIComponent(slug)}`,
  );

  return response.data;
};

/* =========================================================
   GET DEPARTMENT ALUMNI
========================================================= */

export const getPublicDepartmentAlumni = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/api/department-alumni/department/${departmentId}`,
  );

  return response.data;
};

const departmentAlumniPublicService = {
  getDepartmentBySlug,
  getPublicDepartmentAlumni,
};

export default departmentAlumniPublicService;
