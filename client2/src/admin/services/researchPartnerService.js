import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/research/partners`;

// GET ALL
export const getResearchPartners = async () => {
  return axios.get(API);
};

// GET SINGLE
export const getResearchPartner = async (id) => {
  return axios.get(`${API}/${id}`);
};

// ADD
export const addResearchPartner = async (data) => {
  return axios.post(API, data);
};

// UPDATE
export const updateResearchPartner = async (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

// DELETE
export const deleteResearchPartner = async (id) => {
  return axios.delete(`${API}/${id}`);
};
