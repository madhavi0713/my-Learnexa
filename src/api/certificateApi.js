import apiClient from "./apiClient";

export const generateCertificate = async (courseId, studentName, collegeName, year) => {
  const response = await apiClient.post("/certificates/generate", {
    courseId,
    studentName,
    collegeName,
    year
  });
  return response.data;
};

export const getMyCertificates = async () => {
  const response = await apiClient.get("/certificates/me");
  return response.data.data || response.data || [];
};
