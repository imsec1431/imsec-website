import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getVisionMission = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/vision-mission`);

  return response.data;
};

export default {
  getVisionMission,
};
