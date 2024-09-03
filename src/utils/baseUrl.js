import axios from "axios";

export const axiosApi = axios.create({
  // baseURL: "http://localhost:8090",
  baseURL: "https://rks-service-drive-app-backend.onrender.com",
});
