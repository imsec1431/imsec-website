import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/employee-grievance`;

// ==============================
// Add Employee Grievance
// PUBLIC WEBSITE
// ==============================

export const addEmployeeGrievance = (data) => {
  return axios.post(API, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
