import axios from "axios";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

/* =========================================================
   GET PUBLISHED COURSES
========================================================= */

export const getPublishedCourses = async () => {
  return API.get("/courses/public");
};

/* =========================================================
   GET COURSES BY CATEGORY
   UG / PG
========================================================= */

export const getCoursesByCategory = async (category) => {
  return API.get(`/courses/category/${encodeURIComponent(category)}`);
};

/* =========================================================
   GET COURSES BY COURSE
========================================================= */

export const getCoursesByCourse = async (category, courseName) => {
  return API.get(
    `/courses/category/${encodeURIComponent(
      category,
    )}/${encodeURIComponent(courseName)}`,
  );
};

export default API;
