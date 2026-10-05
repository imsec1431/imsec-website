import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/research/fdp`;

const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// Content (About, Timeline, Categories, Stats)
export const getFDPContentAdmin = async () => {
  const response = await axios.get(`${API_URL}/content`, getAuthHeaders());
  return response.data;
};

export const updateFDPContentAdmin = async (data) => {
  const response = await axios.put(
    `${API_URL}/content`,
    data,
    getAuthHeaders(),
  );
  return response.data;
};

// FDP Item CRUD
export const getAllFDPsAdmin = async (params = {}) => {
  const response = await axios.get(API_URL, { params, ...getAuthHeaders() });
  return response.data;
};

export const getFDPByIdAdmin = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createFDPAdmin = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

export const updateFDPAdmin = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteFDPAdmin = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
