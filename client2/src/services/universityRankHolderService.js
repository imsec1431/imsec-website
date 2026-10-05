import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/university-rank-holders`;

export const getUniversityRankHolders = async () => {
  return axios.get(API_URL);
};
