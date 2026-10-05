import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/departments/public`;

export const getPublicDepartments = async () => {
  return await axios.get(API);
};
