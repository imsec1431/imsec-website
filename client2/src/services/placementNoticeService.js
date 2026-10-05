const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/placement-notices`;

/* =========================================================
   GET PUBLIC PLACEMENT NOTICES
========================================================= */

export const fetchPlacementNotices = async () => {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load placement notices.");
  }

  return result;
};
