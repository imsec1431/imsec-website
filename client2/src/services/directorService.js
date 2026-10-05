import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/director`;

// Get Director
export const getDirector = () => {
  return axios.get(API);
};

// Save / Update Director
export const saveDirector = (formData) => {
  return axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
