import apiClient from "./apiClient";

export const getCourses = async (trackId) => {
  const response = await apiClient.get(`/content/courses?trackId=${trackId}`);
  return response.data.data || response.data;
};

export const getCourseDetails = async (courseId) => {
  try {
    // Try fetching the course directly if the API supports it
    const response = await apiClient.get(`/content/courses/${courseId}`);
    if (response.data && (response.data.data || response.data)) {
      return response.data.data || response.data;
    }
  } catch (err) {
    console.warn("Direct course fetch failed, falling back to listing courses", err);
  }

  // Fallback: fetch all courses and search by ID
  const response = await apiClient.get("/content/courses");
  const list = response.data.data || response.data || [];
  return list.find((c) => c._id === courseId);
};

export const getModules = async (courseId) => {
  const response = await apiClient.get(`/content/modules?courseId=${courseId}`);
  return response.data.data || response.data || [];
};

export const getSubModules = async (moduleId) => {
  const response = await apiClient.get(`/content/sub-modules?moduleId=${moduleId}`);
  return response.data.data || response.data || [];
};

export const getVideos = async (subModuleId) => {
  const response = await apiClient.get(`/content/videos?subModuleId=${subModuleId}`);
  return response.data.data || response.data || [];
};

export const getAssignments = async (moduleId) => {
  const response = await apiClient.get(`/content/assignments?moduleId=${moduleId}`);
  return response.data.data || response.data || [];
};

export const getFinalAssignments = async (courseId) => {
  const response = await apiClient.get(`/content/final-assignments?courseId=${courseId}`);
  return response.data.data || response.data || [];
};

export const createModule = async (moduleData) => {
  const response = await apiClient.post("/content/modules", moduleData);
  return response.data;
};
