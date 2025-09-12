import axios, { type InternalAxiosRequestConfig } from "axios";
import { LogoutRequest } from "./LogoutLogic";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      LogoutRequest()
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
