import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   GET ALL FACULTY ACHIEVEMENTS
   ADMIN
========================================================= */

export const getFacultyAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/faculty-achievement-items/department/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   GET SINGLE FACULTY ACHIEVEMENT
========================================================= */

export const getFacultyAchievementItemById = async (id) => {
  const response = await axios.get(
    `${API_URL}/faculty-achievement-items/${id}`,
  );

  return response.data;
};

/* =========================================================
   CREATE FACULTY ACHIEVEMENT
   multipart/form-data
========================================================= */

export const createFacultyAchievementItem = async (formData) => {
  const response = await axios.post(
    `${API_URL}/faculty-achievement-items`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/* =========================================================
   UPDATE FACULTY ACHIEVEMENT
   multipart/form-data
========================================================= */

export const updateFacultyAchievementItem = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/faculty-achievement-items/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/* =========================================================
   DELETE FACULTY ACHIEVEMENT
========================================================= */

export const deleteFacultyAchievementItem = async (id) => {
  const response = await axios.delete(
    `${API_URL}/faculty-achievement-items/${id}`,
  );

  return response.data;
};

/* =========================================================
   GET PUBLIC FACULTY ACHIEVEMENTS
========================================================= */

export const getPublicFacultyAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/faculty-achievement-items/public/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   DEFAULT SERVICE
========================================================= */

const facultyAchievementItemService = {
  getFacultyAchievementItems,
  getFacultyAchievementItemById,
  createFacultyAchievementItem,
  updateFacultyAchievementItem,
  deleteFacultyAchievementItem,
  getPublicFacultyAchievementItems,
};

export default facultyAchievementItemService;
