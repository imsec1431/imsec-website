import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/auditorium`;

/*
|--------------------------------------------------------------------------
| Get Auditorium Data
|--------------------------------------------------------------------------
| Public API
|
| No authentication is required.
|--------------------------------------------------------------------------
*/

export const getAuditorium = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Auditorium API Error:", error);

    throw error;
  }
};

export default {
  getAuditorium,
};
