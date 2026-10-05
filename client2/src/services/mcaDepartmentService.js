import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api`;

const MCA_SLUG = "master-of-computer-application";

/* =========================================================
   MCA DEPARTMENT OVERVIEW
========================================================= */

export const getMcaOverview = async () => {
  const response = await axios.get(
    `${API}/department-overview/slug/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA DEPARTMENT ACHIEVEMENTS
========================================================= */

export const getMcaAchievements = async () => {
  const response = await axios.get(
    `${API}/department-achievements/slug/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA DEPARTMENT PLACEMENT
========================================================= */

export const getMcaPlacement = async () => {
  const response = await axios.get(
    `${API}/department-placement/slug/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA ACADEMIC RESULTS
========================================================= */

export const getMcaAcademicResults = async () => {
  const response = await axios.get(
    `${API}/department-academic-results/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA DEPARTMENT EVENTS
========================================================= */

export const getMcaEvents = async () => {
  const response = await axios.get(
    `${API}/department-events/department/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA INFRASTRUCTURE
========================================================= */

export const getMcaInfrastructure = async () => {
  const response = await axios.get(
    `${API}/department-infrastructure/${MCA_SLUG}`,
  );

  return response.data;
};

/* =========================================================
   MCA STUDENT CORNER
========================================================= */

export const getMcaStudentCorner = async () => {
  const response = await axios.get(`${API}/student-corner/${MCA_SLUG}`);

  return response.data;
};

/* =========================================================
   MCA FACULTY
========================================================= */

export const getMcaFaculty = async () => {
  const response = await axios.get(
    `${API}/department-faculty/department/${MCA_SLUG}`,
  );

  return response.data;
};
