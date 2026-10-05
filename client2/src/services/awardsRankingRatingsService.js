import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   API URL
========================================================= */

const API_URL = `${API_BASE_URL}/api/awards-ranking-ratings`;

/* =========================================================
   GET PUBLISHED AWARDS, RANKINGS & RATINGS
========================================================= */

export const getAwardsRankingRatings = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Get Awards Ranking Ratings Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load awards, rankings and ratings.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const awardsRankingRatingsService = {
  getAwardsRankingRatings,
};

export default awardsRankingRatingsService;
