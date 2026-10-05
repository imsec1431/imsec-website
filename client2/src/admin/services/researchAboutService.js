import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/research/about`;

export const getResearchAbout = () => {
  return axios.get(API);
};

export const addResearchAbout = (data) => {
  return axios.post(API, data);
};

export const updateResearchAbout = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

export const deleteResearchAbout = (id) => {
  return axios.delete(`${API}/${id}`);
};
