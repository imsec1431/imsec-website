import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET PUBLIC ABOUT IMSEC
========================================================= */

export const getAboutImsec = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/about-imsec`);

  return response.data;
};

export default {
  getAboutImsec,
};
