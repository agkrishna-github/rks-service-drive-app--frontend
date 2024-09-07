import React, { useEffect, useState } from "react";
import { useAuth } from "../components/contextApi/auth";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useVehicleContext } from "../components/contextApi/vehiclesApi";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { baseURL } from "../utils/baseUrl";
import toast from "react-hot-toast";

const Homepage = () => {
  const { setAuth } = useAuth();

  const [regNum, setRegNum] = useState("");

  const [vehicleData, setVehicleData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useAuth();
  const {
    serviceData,
    setServiceData,
    storeSingleVehicleData,
    userLocation,
    setUserLocation,
  } = useVehicleContext();
  const [service, setService] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (vehicleData) {
      return storeSingleVehicleData(vehicleData);
    }
  }, [vehicleData]);

  const getSingleVehcleData = async (rNum) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/vehicle/get-vehicle-details/${rNum}`
      );

      const vehicleData = response?.data;

      console.log(vehicleData);
      if (vehicleData?.success) {
        console.log(vehicleData);
        setVehicleData(vehicleData?.foundVehicle);
        setIsLoading(false);
        return;
      } else {
        toast.error("Error in fetching vehicle data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log(pos);
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const goToPickup = () => {
    navigate("/mapPage");
  };

  const goToWorkshop = () => {
    /*  const dropData = {
      empId: auth?.user?.id,
      vehDetails: vehicleData?.data?.foundVehicle,
      service: service,
    };
    navigate("/dropMapPage", {
      state: { dropData: dropData },
    }); */
  };

  const logout = () => {
    setAuth({
      user: null,
      token: "",
    });
    navigate("/homepage");
  };

  return (
    <section className="min-h-screen bg-blue-300 flex justify-center items-center">
      <div className="p-5 md:w-11/12 md:mx-auto md:min-h-[75%] md:my-auto shadow shadow-black bg-white rounded-md flex flex-col  gap-y-10">
        <div
          className="bg-black self-end text-white p-3 text-center rounded-md"
          onClick={logout}
        >
          Logout
        </div>
        <h3 className="p-3 bg-blue-950 text-white rounded-md">
          {auth?.user?.driver && (auth?.user?.driver).toUpperCase()} Logged in
        </h3>

        <div className="mt-10">
          <TextField
            autoComplete="off"
            label="Enter Vehicle Registration Number"
            variant="outlined"
            type="text"
            value={regNum}
            onChange={(e) => setRegNum(e.target.value)}
            placeholder="Enter Veh Reg Number"
            className="block p-3 w-[90%] mx-auto"
          />
        </div>

        <div className={vehicleData ? "hidden" : "block "}>
          {isLoading ? (
            <div className="p-2 w-[75%] bg-red-950 text-white rounded-lg">
              Loading...
            </div>
          ) : (
            <Button
              variant="contained"
              type="button"
              disabled={!regNum ? true : false}
              onClick={() => getSingleVehcleData(regNum)}
              className="block p-3 w-[200px] mx-auto"
            >
              Get Details
            </Button>
          )}
        </div>
        {vehicleData && (
          <div className="w-[90%] mx-auto shadow shadow-black min-h-[200px] flex flex-col justify-center items-center gap-y-3">
            <div className="mt-3">Customer Name</div>
            <h4>{vehicleData.custName}</h4>
            <div className="mt-10">Vehicle</div>
            <h4>{vehicleData.vehicleModel}</h4>
            <div className="mt-10">Vehicle Color</div>
            <h4>{vehicleData.color}</h4>
            <div className="mt-10">Customer Mobile Number</div>
            <h4 className="mb-3">{vehicleData.phoneNum}</h4>
          </div>
        )}

        <div className="mt-3">
          <div>
            <InputLabel id="demo-simple-select-label">
              Select Service
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={service || ""}
              className="block p-3 w-[300px] mx-auto font-bold"
              onChange={(e) => setService(e.target.value)}
            >
              <MenuItem value="pickUp" className="hover:bg-blue-500">
                PickUp
              </MenuItem>
              <MenuItem value="drop" className="hover:bg-blue-500">
                Drop
              </MenuItem>
            </Select>
          </div>

          {service && service === "pickUp" && (
            <div className="flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mb-20 mt-10">
              <h4
                className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
                onClick={goToPickup}
              >
                Go To Pickup
              </h4>
            </div>
          )}

          {service && service === "drop" && (
            <div className="flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mb-20 mt-10">
              <h4
                className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
                onClick={goToWorkshop}
              >
                Go To Workshop
              </h4>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
