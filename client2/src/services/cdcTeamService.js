const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/cdc-team`;

/* =========================================
   GET CDC TEAM - PUBLIC
========================================= */

export const fetchCDCTeam = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load CDC Team");
  }

  return result;
};
