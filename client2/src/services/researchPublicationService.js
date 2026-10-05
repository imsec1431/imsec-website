import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

export const getPublicResearchPublications = async () => {
  const response = await axios.get(`${API_URL}/research/journals`);

  return (response.data?.data || []).filter((item) => item.status === "Active");
};

export const getPublicResearchPublicationContent = async () => {
  const response = await axios.get(`${API_URL}/research/publication-content`);

  return response.data?.data || {};
};
