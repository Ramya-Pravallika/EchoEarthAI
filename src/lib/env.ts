export const env = {
  NODE_ENV: (import.meta as any).env?.MODE || "development",
  GEMINI_API_KEY: (import.meta as any).env?.VITE_GEMINI_API_KEY || "",
  API_URL: (import.meta as any).env?.VITE_API_URL || "/api",
};

export default env;
