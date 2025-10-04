import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { LogoutRequest } from "./LogoutLogic";

const api = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("nexgad_token");
    if (token) {
      config.headers.set("Authorization", ` Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      (error.message && error.message.includes("Network Error"))
    ) {
      window.dispatchEvent(new CustomEvent("network-error"));
    }

    const status = error.response?.status;
    if (status === 401) {
      const originalRequest = (error.config as any) || {};
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          LogoutRequest();
        } catch (e) {
          console.error("LogoutRequest error", e);
        }
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
