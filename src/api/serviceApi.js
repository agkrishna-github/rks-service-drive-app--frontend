import axios from "axios";

const serviceApi = axios.create({
  baseURL: "http://localhost:8090/api/v1/service-pickup",
});

export const addPickUpService = async (data) => {
  const response = await serviceApi.post("/add-pickup-service", data);
  return await response.data;
};

export default serviceApi;
