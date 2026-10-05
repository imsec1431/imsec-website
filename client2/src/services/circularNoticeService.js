import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/circular-notice`;

// ===============================
// Get All Circulars
// ===============================

export const getCircularNotices = () => {
  return axios.get(API);
};

// ===============================
// Get Single Circular
// ===============================

export const getCircularNotice = (id) => {
  return axios.get(`${API}/${id}`);
};

// ===============================
// Add Circular
// ===============================

export const addCircularNotice = (data) => {
  return axios.post(API, data);
};

// ===============================
// Update Circular
// ===============================

export const updateCircularNotice = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ===============================
// Delete Circular
// ===============================

export const deleteCircularNotice = (id) => {
  return axios.delete(`${API}/${id}`);
};
