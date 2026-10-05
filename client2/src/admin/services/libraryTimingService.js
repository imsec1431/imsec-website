import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/library-timings`;

// ================================
// Get Timing
// ================================

export const getLibraryTiming = () => {
  return axios.get(API);
};

// ================================
// Save Timing
// ================================

export const saveLibraryTiming = (data) => {
  return axios.post(API, data);
};
