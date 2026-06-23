import apiClient from "./apiClient";

export const generateCourse = async (courseData) => {
  // Expected courseData: { courseName, domain }
  const response = await apiClient.post("/ai/generate-course", courseData);
  return response.data;
};
