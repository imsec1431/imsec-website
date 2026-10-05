import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// ============================================================
// 1. PUBLIC PLACEMENT STATISTICS
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
// 2. PUBLIC PLACEMENT HIGHLIGHTS
// ============================================================

const PLACEMENT_HIGHLIGHTS_URL = `${API_BASE_URL}/api/placement-highlights`;

export const getPublicPlacementHighlights = async () => {
  const response = await axios.get(`${PLACEMENT_HIGHLIGHTS_URL}/public`);

  return response.data;
};

// ============================================================
// 3. PUBLIC STUDENT PLACEMENT RECORDS
// ============================================================

const PLACEMENT_RECORDS_URL = `${API_BASE_URL}/api/placement-records`;

export const getPublicPlacementStudents = async () => {
  const response = await axios.get(`${PLACEMENT_RECORDS_URL}/public`);

  return response.data;
};

// ============================================================
// GET ALL PUBLIC PLACEMENT DATA
// ============================================================
// Order:
// 1. Statistics
// 2. Highlights
// 3. Student Records
// ============================================================

export const getAllPublicPlacementData = async () => {
  const [statisticsResponse, highlightsResponse, studentsResponse] =
    await Promise.all([
      getPublicPlacementStatistics(),
      getPublicPlacementHighlights(),
      getPublicPlacementStudents(),
    ]);

  return {
    statistics: statisticsResponse?.data || [],

    highlights: highlightsResponse?.data || [],

    students: studentsResponse?.data || [],
  };
};

// ============================================================
// OLD PLACEMENT API
// ============================================================
// These are kept so existing public pages using the old
// /api/placements module continue to work.
// ============================================================

const PLACEMENT_URL = `${API_BASE_URL}/api/placements`;

export const getPlacements = async () => {
  const response = await axios.get(PLACEMENT_URL);

  return response.data;
};

export const getPlacementById = async (id) => {
  const response = await axios.get(`${PLACEMENT_URL}/${id}`);

  return response.data;
};

export const createPlacement = async (data) => {
  const response = await axios.post(PLACEMENT_URL, data);

  return response.data;
};

export const updatePlacement = async (id, data) => {
  const response = await axios.put(`${PLACEMENT_URL}/${id}`, data);

  return response.data;
};

export const deletePlacement = async (id) => {
  const response = await axios.delete(`${PLACEMENT_URL}/${id}`);

  return response.data;
};
