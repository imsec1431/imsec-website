import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/internal-grievance-committee`;

// Get all committee members
export const getCommitteeMembers = () => {
  return axios.get(API);
};
