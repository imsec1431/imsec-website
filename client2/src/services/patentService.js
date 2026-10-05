import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/research/patent`;

export const getPublicPatents = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getPublicPatentContent = async () => {
  const response = await axios.get(`${API_URL}/content`);
  return response.data;
};
