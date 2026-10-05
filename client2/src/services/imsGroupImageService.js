const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/ims-group-image`;

export const fetchIMSGroupImage = async () => {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load IMS Group information");
  }

  return result;
};
