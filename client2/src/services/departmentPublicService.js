import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   PUBLIC DEPARTMENT OVERVIEW
========================================================= */

export const getPublicDepartmentOverview = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-overview/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT ACHIEVEMENTS
========================================================= */

export const getPublicDepartmentAchievements = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-achievements/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT PLACEMENT
========================================================= */

export const getPublicDepartmentPlacement = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-placement/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC ACADEMIC RESULTS
========================================================= */

export const getPublicAcademicResults = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-academic-results/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT EVENTS
========================================================= */

export const getPublicDepartmentEvents = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-events/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT INFRASTRUCTURE
========================================================= */

export const getPublicDepartmentInfrastructure = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-infrastructure/slug/${slug}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC STUDENT CORNER
========================================================= */

export const getPublicStudentCorner = async (slug) => {
  const response = await axios.get(`${API_URL}/api/student-corner/${slug}`);

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT FACULTY
========================================================= */

export const getPublicDepartmentFaculty = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/department-faculty/slug/${slug}`,
  );

  return response.data;
};
