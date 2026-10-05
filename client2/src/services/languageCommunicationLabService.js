import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/language-communication-lab`;

export const getLanguageCommunicationLab = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export default {
  getLanguageCommunicationLab,
};
