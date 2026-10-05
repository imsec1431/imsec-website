import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/library-gallery`;

// ======================================
// Get All
// ======================================

export const getGalleryImages = () => {
  return axios.get(API);
};

// ======================================
// Get Single
// ======================================

export const getGalleryImage = (id) => {
  return axios.get(`${API}/${id}`);
};

// ======================================
// Add
// ======================================

export const addGalleryImage = (formData) => {
  return axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ======================================
// Update
// ======================================

export const updateGalleryImage = (id, formData) => {
  return axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ======================================
// Delete
// ======================================

export const deleteGalleryImage = (id) => {
  return axios.delete(`${API}/${id}`);
};
