import axios from "axios";

const driverApi = axios.create({
  baseURL: "http://localhost:8090/api/v1/driver",
});
/* 
export const getDrivers = async () => {
  const response = await driverApi.get("/driver/get-all-drivers");
  return response.data;
}; */

export const loginDriver = async (data) => {
  const response = await driverApi.post("/login-driver", data);
  return await response.data;
};

export const getAuthDetails = async () => {
  const response = await driverApi.get("/auth/get-drivers-auth");
  return await response.data;
};

export default driverApi;
