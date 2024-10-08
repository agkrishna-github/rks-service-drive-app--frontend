import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import cloud from "../images/cloud1.png";
import Button from "@mui/material/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useVehicleContext } from "../components/contextApi/vehiclesApi";
import { baseURL } from "../utils/baseUrl";

const WorkShopCam = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [source, setSource] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompLoading, setIsCompLoading] = useState(false);

  const navigate = useNavigate();

  const { vehImages, singleVehicleData } = useVehicleContext();
  /* 
  const addImage = async (imgData) => {
    setIsLoading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const response = await axios.post(
      "http://localhost:8090/api/v1/image/addImages",
      formData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const jsonData = await response.json();

    console.log(jsonData);

    const uploadedImages = jsonData?.data;

    console.log(uploadedImages);

    setImages(uploadedImages?.images);
    setIsLoading(false);
    return;

    console.log(uploadedImages);
  };
 */

  const handleCapture = (e) => {
    console.log(e);

    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const file = e.target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  };

  const pickupCompleted = async () => {
    setIsCompLoading(true);

    try {
      const postPickupData = {
        workShopImage: source,
        vehImages,
        pickUpData: singleVehicleData,
      };

      const response = await axios.post(
        `${baseURL}/api/v1/pickUpData/addPickUpData`,
        postPickupData
      );

      console.log(response?.data);

      setIsCompLoading(false);
      toast.success("Completed");
      navigate("/homepage");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      <h4 className="p-3 bg-blue-950 text-white w-full">
        Vehicle Handover To Workshop
      </h4>
      {isLoading && (
        <h3 className="p-3 bg-red-950 rounded-lg text-white">Loading...</h3>
      )}
      {isCompLoading && (
        <h3 className="p-3 bg-red-950 text-white">Loading...</h3>
      )}
      <div className="min-h-[300px] w-[90%] mx-auto shadow shadow-black  p-3 mt-3 flex flex-wrap gap-3">
        <div className="bg-white h-full camera text-end relative">
          <div>
            <div className="w-[300px] h-[300px]">
              <img
                src={source || cloud}
                alt={"snap"}
                className="w-full h-full"
                width={400}
                height={400}
              ></img>
            </div>

            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              capture="environment"
              onChange={(e) => {
                handleCapture(e);
              }}
              style={{ display: "none" }}
            />
          </div>
          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
      </div>
      {source && (
        <div className="flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mb-20 mt-10">
          <h4
            className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
            onClick={pickupCompleted}
          >
            Upload and Complete
          </h4>
        </div>
      )}
    </section>
  );
};

export default WorkShopCam;
