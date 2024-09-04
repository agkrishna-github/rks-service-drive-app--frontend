import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const VehiclesContext = createContext();

const VehiclesProvider = ({ children }) => {
  const [serviceData, setServiceData] = useState("");
  const [singleVehicleData, setSingleVehicleData] = useState();
  const [vehImages, setVehicleImages] = useState();

  const storeSingleVehicleData = (data) => {
    setSingleVehicleData(data);
  };

  return (
    <VehiclesContext.Provider
      value={{
        serviceData,
        setServiceData,
        singleVehicleData,
        storeSingleVehicleData,
        setVehicleImages,
        vehImages,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};

const useVehicleContext = () => useContext(VehiclesContext);

export { useVehicleContext, VehiclesProvider };
