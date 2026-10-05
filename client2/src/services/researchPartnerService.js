import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/research/partners`;

export const getResearchPartners = () => {
  return axios.get(API);
};

export const getResearchPartner = (id) => {
  return axios.get(`${API}/${id}`);
};

export const addResearchPartner = (data) => {
  return axios.post(API, data);
};

export const updateResearchPartner = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

export const deleteResearchPartner = (id) => {
  return axios.delete(`${API}/${id}`);
};
