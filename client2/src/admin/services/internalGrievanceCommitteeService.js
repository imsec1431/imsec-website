import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/internal-grievance-committee`;

// ==========================================
// Get All Committee Members
// Priority Wise
// ==========================================

export const getCommitteeMembers = () => {
  return axios.get(API);
};

// ==========================================
// Get Single Committee Member
// ==========================================

export const getCommitteeMember = (id) => {
  return axios.get(`${API}/${id}`);
};

// ==========================================
// Add Committee Member
// ==========================================

export const addCommitteeMember = (data) => {
  return axios.post(API, data);
};

// ==========================================
// Update Committee Member
// ==========================================

export const updateCommitteeMember = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// ==========================================
// Delete Committee Member
// ==========================================

export const deleteCommitteeMember = (id) => {
  return axios.delete(`${API}/${id}`);
};
