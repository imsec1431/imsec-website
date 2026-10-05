import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/placement-stats`;

// Get All
export const getPlacementStats = () => {
  return axios.get(API);
};

// Get Single
export const getPlacementStatById = (id) => {
  return axios.get(`${API}/${id}`);
};

// Create
export const createPlacementStat = (data) => {
  return axios.post(API, data);
};

// Update
export const updatePlacementStat = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// Delete
export const deletePlacementStat = (id) => {
  return axios.delete(`${API}/${id}`);
};
