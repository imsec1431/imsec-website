import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/achievements`;

// Get All
export const getAchievements = () => axios.get(API_URL);

// Get One
export const getAchievementById = (id) => axios.get(`${API_URL}/${id}`);

// Create
export const createAchievement = (formData) =>
  axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update
export const updateAchievement = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete
export const deleteAchievement = (id) => axios.delete(`${API_URL}/${id}`);
