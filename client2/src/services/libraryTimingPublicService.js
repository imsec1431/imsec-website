import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/library-timings`;

export const getLibraryTiming = () => {
  return axios.get(API);
};
