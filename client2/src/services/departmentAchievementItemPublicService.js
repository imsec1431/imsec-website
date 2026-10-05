import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Get public Department Achievement items
 * for a specific department.
 */
export const getPublicDepartmentAchievementItems = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/api/department-achievement-items/public/${departmentId}`,
  );

  return response.data;
};

const departmentAchievementItemPublicService = {
  getPublicDepartmentAchievementItems,
};

export default departmentAchievementItemPublicService;
