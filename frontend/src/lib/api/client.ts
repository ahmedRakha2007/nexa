import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`,
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

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nexa.token");
      localStorage.removeItem("nexa.user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
