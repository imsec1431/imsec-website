import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/university-rank-holders`;

// Get All
export const getUniversityRankHolders = () => {
  return axios.get(API_URL);
};

// Get Single
export const getUniversityRankHolder = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Create
export const createUniversityRankHolder = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update
export const updateUniversityRankHolder = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete
export const deleteUniversityRankHolder = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
