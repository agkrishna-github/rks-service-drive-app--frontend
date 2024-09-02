import React, { useEffect, useState } from "react";
import { useAuth } from "../components/contextApi/auth";
import { getVehicleDetails } from "../api/vehicleApi";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addPickUpService } from "../api/serviceApi";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
const Homepage = () => {
  const [regNum, setRegNum] = useState("");
  const [service, setService] = useState("");

  const [auth] = useAuth();

  const { state } = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const vehicleData = useQuery({
    queryKey: ["vehicles", regNum],
    queryFn: () => getVehicleDetails(regNum),
    enabled: false,
  });

  const getSingleVehicleDetails = () => {
    vehicleData.refetch();
  };

  const goToPickup = () => {
    const pickupData = {
      empId: auth?.user?.id,
      vehDetails: vehicleData?.data?.foundVehicle,
      service: service,
    };
    navigate("/mapPage", {
      state: { pickUpData: pickupData },
    });
  };

  const goToDrop = () => {
    /* const dropData = {
       empId: auth?.user?.id,
       vehDetails: vehicleData?.data?.foundVehicle,
       service: service,
     };
     navigate("/pickUpCameraComp", {
       state: { pickUpData: pickupData },
     }); */
  };

  return (
    <section className="min-h-screen bg-blue-300 flex justify-center items-center">
      <div className="p-5 md:w-11/12 md:mx-auto md:h-[75%] md:my-auto shadow shadow-black bg-white rounded-md flex flex-col  gap-y-10">
        <h3 className="p-3 bg-gray-400">{auth?.user?.driver} Logged in</h3>

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
        <div className={vehicleData?.data?.foundVehicle ? "hidden" : "block "}>
          <Button
            variant="contained"
            type="button"
            onClick={() => getSingleVehicleDetails()}
            className="block p-3 w-[200px] mx-auto"
          >
            Get Details
          </Button>
        </div>
        {vehicleData?.data?.foundVehicle && (
          <div className="w-[90%] mx-auto shadow shadow-black min-h-[200px] flex flex-col justify-center items-center gap-y-3">
            <div className="mt-3">Customer Name</div>
            <h4>{vehicleData?.data?.foundVehicle.custName}</h4>
            <div className="mt-10">Vehicle</div>
            <h4>{vehicleData?.data?.foundVehicle.vehicleModel}</h4>
            <div className="mt-10">Vehicle Color</div>
            <h4>{vehicleData?.data?.foundVehicle.color}</h4>
            <div className="mt-10">Customer Mobile Number</div>
            <h4 className="mb-3">{vehicleData?.data?.foundVehicle.phoneNum}</h4>
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
              value={service}
              className="block p-3 w-[300px] mx-auto font-bold"
              onChange={(e) => setService(e.target.value)}
            >
              <MenuItem value="pickUp" className="hover:bg-blue-500">
                Pick Up
              </MenuItem>
              <MenuItem value="drop" className="hover:bg-blue-500">
                Drop
              </MenuItem>
            </Select>
          </div>

          {service && service === "pickUp" ? (
            <div className="mt-5 p-3">
              <Button
                type="button"
                variant="contained"
                className="block p-3 w-[200px] mx-auto"
                onClick={goToPickup}
              >
                Go To Pickup
              </Button>
            </div>
          ) : (
            <div className="mt-5">
              <Button
                type="button"
                variant="contained"
                className="block p-3 w-[200px] mx-auto"
                onClick={goToDrop}
              >
                Go To Drop
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
