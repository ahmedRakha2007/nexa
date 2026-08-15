import axios from "axios";

/**
 * Axios instance — point VITE_API_URL at your backend when it exists.
 * No backend calls are wired up yet; see the *.api.ts modules for placeholders.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("nexa.token");

  if (token) {
    config.headers = {
      ...(config.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    } as import("axios").AxiosRequestHeaders;
  }

  return config;
});
