const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/cdc-structure`;

/* =========================================
   GET CDC STRUCTURE - PUBLIC
========================================= */

export const fetchCDCStructure = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load CDC Structure");
  }

  return result;
};
