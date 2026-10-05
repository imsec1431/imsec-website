import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/rules`;

// ==============================
// Get All
// ==============================

export const getRules = () => {
  return axios.get(API);
};

// ==============================
// Get Single
// ==============================

export const getRule = (id) => {
  return axios.get(`${API}/${id}`);
};

// ==============================
// Add
// ==============================

export const addRule = (data) => {
  return axios.post(API, data);
};

// ==============================
// Update
// ==============================

export const updateRule = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ==============================
// Delete
// ==============================

export const deleteRule = (id) => {
  return axios.delete(`${API}/${id}`);
};
