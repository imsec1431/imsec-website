import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/campus-highlights`;

// Get All Campus Highlights
export const getCampusHighlights = () => {
  return axios.get(API_URL);
};

// Get Single Campus Highlight
export const getCampusHighlight = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Create Campus Highlight
export const createCampusHighlight = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update Campus Highlight
export const updateCampusHighlight = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete Campus Highlight
export const deleteCampusHighlight = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
