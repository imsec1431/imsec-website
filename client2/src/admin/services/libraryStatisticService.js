import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/library-statistics`;

// ======================================
// Get All
// ======================================

export const getStatistics = () => {
  return axios.get(API);
};

// ======================================
// Get Single
// ======================================

export const getStatistic = (id) => {
  return axios.get(`${API}/${id}`);
};

// ======================================
// Add
// ======================================

export const addStatistic = (data) => {
  return axios.post(API, data);
};

// ======================================
// Update
// ======================================

export const updateStatistic = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ======================================
// Delete
// ======================================

export const deleteStatistic = (id) => {
  return axios.delete(`${API}/${id}`);
};
