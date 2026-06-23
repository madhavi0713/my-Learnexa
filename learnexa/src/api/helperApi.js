import apiClient from "./apiClient";

export const chatWithAI = async (message) => {
  const response = await apiClient.post("/helper/chat", { message });
  return response.data; // Expected { success: true, reply: "...", source: "static | gemini" }
};
