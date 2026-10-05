import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   GET ALL DEPARTMENT ACHIEVEMENTS
   ADMIN
========================================================= */

export const getDepartmentAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/department-achievement-items/department/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   GET SINGLE DEPARTMENT ACHIEVEMENT
========================================================= */

export const getDepartmentAchievementItemById = async (id) => {
  const response = await axios.get(
    `${API_URL}/department-achievement-items/${id}`,
  );

  return response.data;
};

/* =========================================================
   CREATE DEPARTMENT ACHIEVEMENT
   PHOTO IS OPTIONAL
========================================================= */

export const createDepartmentAchievementItem = async (formData) => {
  const response = await axios.post(
    `${API_URL}/department-achievement-items`,
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
   UPDATE DEPARTMENT ACHIEVEMENT
   PHOTO IS OPTIONAL
========================================================= */

export const updateDepartmentAchievementItem = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/department-achievement-items/${id}`,
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
   DELETE DEPARTMENT ACHIEVEMENT
========================================================= */

export const deleteDepartmentAchievementItem = async (id) => {
  const response = await axios.delete(
    `${API_URL}/department-achievement-items/${id}`,
  );

  return response.data;
};

/* =========================================================
   PUBLIC DEPARTMENT ACHIEVEMENTS
========================================================= */

export const getPublicDepartmentAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/department-achievement-items/public/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   DEFAULT SERVICE
========================================================= */

const departmentAchievementItemService = {
  getDepartmentAchievementItems,
  getDepartmentAchievementItemById,
  createDepartmentAchievementItem,
  updateDepartmentAchievementItem,
  deleteDepartmentAchievementItem,
  getPublicDepartmentAchievementItems,
};

export default departmentAchievementItemService;
