import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/research/patent`;

const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// Page Content (About, Stats, Timeline)
export const getPatentContentAdmin = async () => {
  const response = await axios.get(`${API_URL}/content`, getAuthHeaders());
  return response.data;
};

export const updatePatentContentAdmin = async (data) => {
  const response = await axios.put(
    `${API_URL}/content`,
    data,
    getAuthHeaders(),
  );
  return response.data;
};

// Patent CRUD
export const getAllPatentsAdmin = async (params = {}) => {
  const response = await axios.get(API_URL, { params, ...getAuthHeaders() });
  return response.data;
};

export const getPatentByIdAdmin = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createPatentAdmin = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

export const updatePatentAdmin = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deletePatentAdmin = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
