import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Get public Alumni Profile page data
 */
export const getAlumniProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/alumni-profile`);

    return response.data;
  } catch (error) {
    console.error("Get Alumni Profile Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load alumni profile data.",
      }
    );
  }
};

const alumniProfileService = {
  getAlumniProfile,
};

export default alumniProfileService;
