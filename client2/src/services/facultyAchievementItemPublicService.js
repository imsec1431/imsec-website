import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Get public Faculty Achievement items
 * for a specific department.
 */
export const getPublicFacultyAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/api/faculty-achievement-items/public/${departmentId}`,
  );

  return response.data;
};

const facultyAchievementItemPublicService = {
  getPublicFacultyAchievementItems,
};

export default facultyAchievementItemPublicService;
