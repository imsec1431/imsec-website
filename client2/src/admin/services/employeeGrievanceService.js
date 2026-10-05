import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/employee-grievance`;

// ==============================
// Get All
// ==============================

export const getEmployeeGrievances = () => {
  return axios.get(API);
};

// ==============================
// Get Single
// ==============================

export const getEmployeeGrievance = (id) => {
  return axios.get(`${API}/${id}`);
};

// ==============================
// Update
// ==============================

export const updateEmployeeGrievance = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ==============================
// Delete
// ==============================

export const deleteEmployeeGrievance = (id) => {
  return axios.delete(`${API}/${id}`);
};
