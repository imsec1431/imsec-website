import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Get published Mandatory Disclosure documents
 */
export const getMandatoryDisclosure = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/mandatory-disclosure`);

  return response.data;
};
