import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/hero-slider`;

// Get All Hero Slides
export const getSlides = async () => {
  return await axios.get(API_URL);
};

// Get Single Hero Slide
export const getSlide = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Add Hero Slide
export const addSlide = async (formData) => {
  return await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update Hero Slide
export const updateSlide = async (id, formData) => {
  return await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete Hero Slide
export const deleteSlide = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
