import apiClient from "./apiClient";

export const getDepartments = async () => {
  const response = await apiClient.get("/hierarchy/departments");
  return response.data.data || response.data;
};

export const getCategories = async (departmentId) => {
  const response = await apiClient.get(`/hierarchy/categories?departmentId=${departmentId}`);
  return response.data.data || response.data;
};

export const getDomains = async (categoryId) => {
  const response = await apiClient.get(`/hierarchy/domains?categoryId=${categoryId}`);
  return response.data.data || response.data;
};

export const getTracks = async (domainId) => {
  const response = await apiClient.get(`/hierarchy/tracks?domainId=${domainId}`);
  return response.data.data || response.data;
};

export const createDepartment = async (data) => {
  const response = await apiClient.post("/hierarchy/departments", data);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await apiClient.post("/hierarchy/categories", data);
  return response.data;
};

export const createDomain = async (data) => {
  const response = await apiClient.post("/hierarchy/domains", data);
  return response.data;
};
