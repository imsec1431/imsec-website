import axios from "axios";
import { getAuthHeaders } from "../admin/utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/chairman`;

// Get Chairman details
export const getChairman = async () => {
  return await axios.get(API_URL);
};

// Save / Update Chairman details
export const saveChairman = async (formData) => {
  return await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};
