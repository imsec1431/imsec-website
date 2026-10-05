import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// ============================================================
// PUBLIC PLACEMENT RECORDS
// ============================================================

const PLACEMENT_RECORDS_URL = `${API_BASE_URL}/api/placement-records`;

export const getPublicPlacementStudents = async () => {
  const response = await axios.get(`${PLACEMENT_RECORDS_URL}/public`);

  return response.data;
};

// ============================================================
// PUBLIC PLACEMENT STATISTICS
// ============================================================

const PLACEMENT_STATISTICS_URL = `${API_BASE_URL}/api/placement-stats`;

export const getPublicPlacementStatistics = async () => {
  const response = await axios.get(PLACEMENT_STATISTICS_URL);

  return response.data;
};

// Backward compatibility
export const getPlacementStats = async () => {
  return getPublicPlacementStatistics();
};

// ============================================================
// PUBLIC PLACEMENT HIGHLIGHTS
// ============================================================

const PLACEMENT_HIGHLIGHTS_URL = `${API_BASE_URL}/api/placement-highlights`;

export const getPublicPlacementHighlights = async () => {
  const response = await axios.get(`${PLACEMENT_HIGHLIGHTS_URL}/public`);

  return response.data;
};

// ============================================================
// GET ALL PUBLIC PLACEMENT DATA
// ============================================================

export const getAllPublicPlacementData = async () => {
  const [studentsResponse, statisticsResponse, highlightsResponse] =
    await Promise.all([
      getPublicPlacementStudents(),
      getPublicPlacementStatistics(),
      getPublicPlacementHighlights(),
    ]);

  return {
    students: studentsResponse?.data || [],

    statistics: statisticsResponse?.data || [],

    highlights: highlightsResponse?.data || [],
  };
};
