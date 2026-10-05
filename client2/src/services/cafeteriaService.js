import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/cafeteria`;

export const getCafeteria = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Cafeteria API Error:", error);

    throw error;
  }
};

export default {
  getCafeteria,
};
