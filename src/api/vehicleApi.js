import axios from "axios";

const vehicleApi = axios.create({
  baseURL: "http://localhost:8090/api/v1/vehicle",
});

export const getVehicleDetails = async (regNum) => {
  const response = await vehicleApi.get(`/get-vehicle-details/${regNum}`);
  return await response.data;
};

export default vehicleApi;
