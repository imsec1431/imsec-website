// import axios from "axios";
// import { getToken } from "../../admin/utils/token.js";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const PLACEMENT_RECORDS_URL = `${API_BASE_URL}/api/placement-records`;

// const PLACEMENT_STATISTICS_URL = `${API_BASE_URL}/api/placement-stats`;

// const PLACEMENT_HIGHLIGHTS_URL = `${API_BASE_URL}/api/placement-highlights`;

// /*
// |--------------------------------------------------------------------------
// | AUTH CONFIG
// |--------------------------------------------------------------------------
// */

// const getAuthConfig = () => {
//   const token = getToken();

//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//       Accept: "application/json",
//     },
//   };
// };

// /*
// |--------------------------------------------------------------------------
// | MODULE 1
// | PLACEMENT RECORDS
// |--------------------------------------------------------------------------
// */

// /**
//  * Get all placement records
//  * GET /api/placement-records
//  */
// export const getPlacementStudents = async () => {
//   return await axios.get(PLACEMENT_RECORDS_URL, getAuthConfig());
// };

// /**
//  * Create placement record
//  * POST /api/placement-records
//  */
// export const createPlacementStudent = async (studentData) => {
//   return await axios.post(PLACEMENT_RECORDS_URL, studentData, getAuthConfig());
// };

// /**
//  * Update placement record
//  * PUT /api/placement-records/:id
//  */
// export const updatePlacementStudent = async (id, studentData) => {
//   return await axios.put(
//     `${PLACEMENT_RECORDS_URL}/${id}`,
//     studentData,
//     getAuthConfig(),
//   );
// };

// /**
//  * Delete placement record
//  * DELETE /api/placement-records/:id
//  */
// export const deletePlacementStudent = async (id) => {
//   return await axios.delete(`${PLACEMENT_RECORDS_URL}/${id}`, getAuthConfig());
// };

// /**
//  * Import placement records from Excel
//  * POST /api/placement-records/import-excel
//  *
//  * IMPORTANT:
//  * Do not manually set Content-Type.
//  * Axios/browser automatically adds the multipart boundary.
//  */
// export const importPlacementStudentsFromExcel = async (formData) => {
//   const token = getToken();

//   return await axios.post(`${PLACEMENT_RECORDS_URL}/import-excel`, formData, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//       Accept: "application/json",
//     },
//   });
// };

// /*
// |--------------------------------------------------------------------------
// | PUBLIC PLACEMENT RECORDS
// |--------------------------------------------------------------------------
// */

// /**
//  * Get published placement records
//  * GET /api/placement-records/public
//  */
// export const getPublicPlacementStudents = async () => {
//   return await axios.get(`${PLACEMENT_RECORDS_URL}/public`);
// };

// /*
// |--------------------------------------------------------------------------
// | MODULE 2
// | PLACEMENT STATISTICS
// |--------------------------------------------------------------------------
// |
// | Backend route:
// | /api/placement-stats
// |
// | Current backend structure uses:
// |
// | type
// | figure
// | order
// | isActive
// |
// |--------------------------------------------------------------------------
// */

// /**
//  * Get placement statistics
//  * GET /api/placement-stats
//  */
// export const getPlacementStatistics = async () => {
//   return await axios.get(PLACEMENT_STATISTICS_URL, getAuthConfig());
// };

// /**
//  * Create placement statistic
//  * POST /api/placement-stats
//  */
// export const createPlacementStatistics = async (statisticsData) => {
//   return await axios.post(
//     PLACEMENT_STATISTICS_URL,
//     statisticsData,
//     getAuthConfig(),
//   );
// };

// /**
//  * Update placement statistic
//  * PUT /api/placement-stats/:id
//  */
// export const updatePlacementStatistics = async (id, statisticsData) => {
//   return await axios.put(
//     `${PLACEMENT_STATISTICS_URL}/${id}`,
//     statisticsData,
//     getAuthConfig(),
//   );
// };

// /**
//  * Delete placement statistic
//  * DELETE /api/placement-stats/:id
//  */
// export const deletePlacementStatistics = async (id) => {
//   return await axios.delete(
//     `${PLACEMENT_STATISTICS_URL}/${id}`,
//     getAuthConfig(),
//   );
// };

// /**
//  * Public placement statistics
//  * GET /api/placement-stats
//  *
//  * Existing public placement components already use
//  * this endpoint.
//  */
// export const getPublicPlacementStatistics = async () => {
//   return await axios.get(PLACEMENT_STATISTICS_URL);
// };

// /*
// |--------------------------------------------------------------------------
// | BACKWARD COMPATIBILITY
// |--------------------------------------------------------------------------
// |
// | Existing Home page uses getPlacementStats().
// |
// |--------------------------------------------------------------------------
// */

// export const getPlacementStats = async () => {
//   return await axios.get(PLACEMENT_STATISTICS_URL);
// };

// /*
// |--------------------------------------------------------------------------
// | MODULE 3
// | PLACEMENT HIGHLIGHTS
// |--------------------------------------------------------------------------
// |
// | The frontend service is prepared for:
// |
// | /api/placement-highlights
// |
// | These functions will work once the backend
// | Placement Highlights module is mounted.
// |
// |--------------------------------------------------------------------------
// */

// /**
//  * Get placement highlights
//  * GET /api/placement-highlights
//  */
// export const getPlacementHighlights = async () => {
//   return await axios.get(PLACEMENT_HIGHLIGHTS_URL, getAuthConfig());
// };

// /**
//  * Create placement highlight
//  * POST /api/placement-highlights
//  */
// export const createPlacementHighlight = async (highlightData) => {
//   return await axios.post(
//     PLACEMENT_HIGHLIGHTS_URL,
//     highlightData,
//     getAuthConfig(),
//   );
// };

// /**
//  * Update placement highlight
//  * PUT /api/placement-highlights/:id
//  */
// export const updatePlacementHighlight = async (id, highlightData) => {
//   return await axios.put(
//     `${PLACEMENT_HIGHLIGHTS_URL}/${id}`,
//     highlightData,
//     getAuthConfig(),
//   );
// };

// /**
//  * Delete placement highlight
//  * DELETE /api/placement-highlights/:id
//  */
// export const deletePlacementHighlight = async (id) => {
//   return await axios.delete(
//     `${PLACEMENT_HIGHLIGHTS_URL}/${id}`,
//     getAuthConfig(),
//   );
// };

// /**
//  * Get public placement highlights
//  * GET /api/placement-highlights/public
//  */
// export const getPublicPlacementHighlights = async () => {
//   return await axios.get(`${PLACEMENT_HIGHLIGHTS_URL}/public`);
// };

import axios from "axios";
import { getToken } from "../../admin/utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PLACEMENT_RECORDS_URL = `${API_BASE_URL}/api/placement-records`;

const PLACEMENT_STATISTICS_URL = `${API_BASE_URL}/api/placement-stats`;

const PLACEMENT_HIGHLIGHTS_URL = `${API_BASE_URL}/api/placement-highlights`;

/*
|--------------------------------------------------------------------------
| AUTH CONFIG
|--------------------------------------------------------------------------
*/

const getAuthConfig = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  };
};

/*
|--------------------------------------------------------------------------
| MODULE 1
| PLACEMENT RECORDS
|--------------------------------------------------------------------------
*/

/**
 * Get all placement records
 * GET /api/placement-records
 */
export const getPlacementStudents = async () => {
  return await axios.get(PLACEMENT_RECORDS_URL, getAuthConfig());
};

/**
 * Create placement record
 * POST /api/placement-records
 */
export const createPlacementStudent = async (studentData) => {
  return await axios.post(PLACEMENT_RECORDS_URL, studentData, getAuthConfig());
};

/**
 * Update placement record
 * PUT /api/placement-records/:id
 */
export const updatePlacementStudent = async (id, studentData) => {
  return await axios.put(
    `${PLACEMENT_RECORDS_URL}/${id}`,
    studentData,
    getAuthConfig(),
  );
};

/**
 * Delete placement record
 * DELETE /api/placement-records/:id
 */
export const deletePlacementStudent = async (id) => {
  return await axios.delete(`${PLACEMENT_RECORDS_URL}/${id}`, getAuthConfig());
};

/**
 * Import placement records from Excel
 * POST /api/placement-records/import-excel
 *
 * IMPORTANT:
 * Do not manually set Content-Type.
 * Axios/browser automatically adds
 * the multipart boundary.
 */
export const importPlacementStudentsFromExcel = async (formData) => {
  const token = getToken();

  return await axios.post(`${PLACEMENT_RECORDS_URL}/import-excel`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  });
};

/*
|--------------------------------------------------------------------------
| PUBLIC PLACEMENT RECORDS
|--------------------------------------------------------------------------
*/

/**
 * Get published placement records
 * GET /api/placement-records/public
 */
export const getPublicPlacementStudents = async () => {
  return await axios.get(`${PLACEMENT_RECORDS_URL}/public`);
};

/*
|--------------------------------------------------------------------------
| MODULE 2
| PLACEMENT STATISTICS
|--------------------------------------------------------------------------
|
| Backend route:
| /api/placement-stats
|
| Current backend structure uses:
|
| type
| figure
| order
| isActive
|
|--------------------------------------------------------------------------
*/

/**
 * Get placement statistics
 * GET /api/placement-stats
 */
export const getPlacementStatistics = async () => {
  return await axios.get(PLACEMENT_STATISTICS_URL, getAuthConfig());
};

/**
 * Create placement statistic
 * POST /api/placement-stats
 */
export const createPlacementStatistics = async (statisticsData) => {
  return await axios.post(
    PLACEMENT_STATISTICS_URL,
    statisticsData,
    getAuthConfig(),
  );
};

/**
 * Update placement statistic
 * PUT /api/placement-stats/:id
 */
export const updatePlacementStatistics = async (id, statisticsData) => {
  return await axios.put(
    `${PLACEMENT_STATISTICS_URL}/${id}`,
    statisticsData,
    getAuthConfig(),
  );
};

/**
 * Delete placement statistic
 * DELETE /api/placement-stats/:id
 */
export const deletePlacementStatistics = async (id) => {
  return await axios.delete(
    `${PLACEMENT_STATISTICS_URL}/${id}`,
    getAuthConfig(),
  );
};

/**
 * Public placement statistics
 * GET /api/placement-stats
 *
 * Existing public placement components
 * already use this endpoint.
 */
export const getPublicPlacementStatistics = async () => {
  return await axios.get(PLACEMENT_STATISTICS_URL);
};

/*
|--------------------------------------------------------------------------
| BACKWARD COMPATIBILITY
|--------------------------------------------------------------------------
|
| Existing Home page uses getPlacementStats().
|
|--------------------------------------------------------------------------
*/

export const getPlacementStats = async () => {
  return await axios.get(PLACEMENT_STATISTICS_URL);
};

/*
|--------------------------------------------------------------------------
| MODULE 3
| PLACEMENT HIGHLIGHTS
|--------------------------------------------------------------------------
|
| Backend route:
| /api/placement-highlights
|
| Admin:
| GET    /api/placement-highlights
| POST   /api/placement-highlights
| PUT    /api/placement-highlights/:id
| DELETE /api/placement-highlights/:id
|
| Public:
| GET /api/placement-highlights/public
|
|--------------------------------------------------------------------------
*/

/**
 * Get all placement highlights
 *
 * GET /api/placement-highlights
 */
export const getPlacementHighlights = async () => {
  return await axios.get(PLACEMENT_HIGHLIGHTS_URL, getAuthConfig());
};

/**
 * Create placement highlight
 *
 * POST /api/placement-highlights
 */
export const createPlacementHighlight = async (highlightData) => {
  return await axios.post(
    PLACEMENT_HIGHLIGHTS_URL,
    highlightData,
    getAuthConfig(),
  );
};

/**
 * Update placement highlight
 *
 * PUT /api/placement-highlights/:id
 */
export const updatePlacementHighlight = async (id, highlightData) => {
  return await axios.put(
    `${PLACEMENT_HIGHLIGHTS_URL}/${id}`,
    highlightData,
    getAuthConfig(),
  );
};

/**
 * Delete placement highlight
 *
 * DELETE /api/placement-highlights/:id
 */
export const deletePlacementHighlight = async (id) => {
  return await axios.delete(
    `${PLACEMENT_HIGHLIGHTS_URL}/${id}`,
    getAuthConfig(),
  );
};

/**
 * Get published placement highlights
 *
 * GET /api/placement-highlights/public
 */
export const getPublicPlacementHighlights = async () => {
  return await axios.get(`${PLACEMENT_HIGHLIGHTS_URL}/public`);
};
