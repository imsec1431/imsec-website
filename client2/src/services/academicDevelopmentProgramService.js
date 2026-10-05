import axios from "axios";
import { getConfiguredApiBase } from "../admin/utils/adminHttp";

const API_BASE_URL = getConfiguredApiBase();

const API = `${API_BASE_URL}/api/academic-development-programs`;

// ======================================
// Get All Programs
// ======================================

export const getPrograms = () => {
  return axios.get(API);
};

// ======================================
// Get Single Program
// ======================================

export const getProgram = (id) => {
  return axios.get(`${API}/${id}`);
};

// ======================================
// Add Program
// ======================================

export const addProgram = (formData) => {
  return axios.post(API, formData);
};

// ======================================
// Update Program
// ======================================

export const updateProgram = (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

// ======================================
// Delete Program
// ======================================

export const deleteProgram = (id) => {
  return axios.delete(`${API}/${id}`);
};
