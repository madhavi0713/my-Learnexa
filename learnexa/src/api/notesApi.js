import apiClient from "./apiClient";

export const createNote = async (courseId, videoId, text) => {
  const response = await apiClient.post("/notes", { courseId, videoId, text });
  return response.data;
};

export const getNotes = async (courseId) => {
  const response = await apiClient.get(`/notes/course/${courseId}`);
  return response.data;
};
