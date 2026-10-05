import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/student-grievance`;

// Get All Complaints
export const getStudentGrievances = () => {
  return axios.get(API);
};

// Get Single Complaint
export const getStudentGrievance = (id) => {
  return axios.get(`${API}/${id}`);
};

// Update Complaint
export const updateStudentGrievance = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// Delete Complaint
export const deleteStudentGrievance = (id) => {
  return axios.delete(`${API}/${id}`);
};
