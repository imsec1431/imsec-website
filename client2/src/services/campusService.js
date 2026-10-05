import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET PUBLIC CAMPUS DATA
   ========================================================= */

export const getCampus = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/campus`);

  return response.data;
};

export default {
  getCampus,
};
