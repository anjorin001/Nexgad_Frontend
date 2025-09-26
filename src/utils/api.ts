import axios, { type InternalAxiosRequestConfig } from "axios";
import { LogoutRequest } from "./LogoutLogic";

const api = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("nexgad_token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    console.log("err",error)
    if (error.response?.status === 401) {
      LogoutRequest();
      window.location.href = "/login";
    }
    if (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      error.message.includes("Network Error")
    ) {
      window.dispatchEvent(new CustomEvent("network-error"));
    }
    return Promise.reject(error);
  }
);

export default api;
