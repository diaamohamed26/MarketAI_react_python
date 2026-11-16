
import { apiRequest } from "./api";

export const generateContent = (prompt) =>
  apiRequest("/ai/generate/", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

export const chatWithAI = (message) =>
  apiRequest("/ai/chat/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

export const generateSocialPost = ({ prompt, platform, tone }) =>
  apiRequest("/social/generate/", {
    method: "POST",
    body: JSON.stringify({ prompt, platform, tone }),
  });

export const analyzeSEO = (prompt) =>
  apiRequest("/ai/seo/", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
