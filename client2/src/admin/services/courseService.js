import axios from "axios";

import { getToken } from "../utils/token";
import { getConfiguredApiBase } from "../utils/adminHttp";

/* =========================================================
   API
========================================================= */

const API = axios.create({
  baseURL: `${getConfiguredApiBase()}/api`,
});

/* =========================================================
   GET AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================================================
   ADMIN
   GET ALL COURSES
========================================================= */

export const getCourses = async () => {
  return API.get("/courses", getAuthConfig());
};

/* =========================================================
   PUBLIC
   GET PUBLISHED COURSES
========================================================= */

export const getPublishedCourses = async () => {
  return API.get("/courses/public");
};

/* =========================================================
   PUBLIC
   GET BY CATEGORY
========================================================= */

export const getCoursesByCategory = async (category) => {
  return API.get(`/courses/category/${encodeURIComponent(category)}`);
};

/* =========================================================
   PUBLIC
   GET BY CATEGORY + COURSE
========================================================= */

export const getCoursesByCourse = async (category, courseName) => {
  return API.get(
    `/courses/category/${encodeURIComponent(category)}/${encodeURIComponent(
      courseName,
    )}`,
  );
};

/* =========================================================
   ADMIN
   CREATE
========================================================= */

export const createCourse = async (courseData) => {
  return API.post("/courses", courseData, getAuthConfig());
};

/* =========================================================
   ADMIN
   UPDATE
========================================================= */

export const updateCourse = async (id, courseData) => {
  return API.put(`/courses/${id}`, courseData, getAuthConfig());
};

/* =========================================================
   ADMIN
   DELETE
========================================================= */

export const deleteCourse = async (id) => {
  return API.delete(`/courses/${id}`, getAuthConfig());
};

export default API;
