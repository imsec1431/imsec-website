import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/alumni`;

export const getAlumni = async () => {
  return axios.get(API_URL);
};

export const getAlumniById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createAlumni = async (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateAlumni = async (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAlumni = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
