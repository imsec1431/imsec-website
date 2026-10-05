import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/library-guidelines`;

// ======================================
// Get All
// ======================================

export const getGuidelines = () => {
  return axios.get(API);
};

// ======================================
// Get Single
// ======================================

export const getGuideline = (id) => {
  return axios.get(`${API}/${id}`);
};

// ======================================
// Add
// ======================================

export const addGuideline = (data) => {
  return axios.post(API, data);
};

// ======================================
// Update
// ======================================

export const updateGuideline = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ======================================
// Delete
// ======================================

export const deleteGuideline = (id) => {
  return axios.delete(`${API}/${id}`);
};
