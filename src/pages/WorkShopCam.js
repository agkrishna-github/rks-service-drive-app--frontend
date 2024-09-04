import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import cloud from "../images/cloud1.png";
import Button from "@mui/material/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useVehicleContext } from "../components/contextApi/vehiclesApi";

const WorkShopCam = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [source, setSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompLoading, setIsCompLoading] = useState(false);

  const navigate = useNavigate();

  const { vehImages, singleVehicleData } = useVehicleContext();

  useEffect(() => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    if (files.length) addImage(formData);
  }, [files]);

  const addImage = async (imgData) => {
    setIsLoading(true);
    const response = await axios.post(
      "http://localhost:8090/api/v1/image/addImages",
      imgData
    );

    const uploadedImages = response?.data;

    if (uploadedImages?.success) {
      setImages(uploadedImages?.images);
      setIsLoading(false);
    }
    console.log(uploadedImages);
  };

  const handleCapture = (e) => {
    console.log(e);

    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const file = e.target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource([...source, newUrl]);
        setFiles([...files, file]);
      }
    }
  };

  console.log(files);

  const pickupCompleted = async () => {
    setIsCompLoading(true);

    try {
      const postPickupData = {
        workShopImages: images,
        vehImages,
        pickUpData: singleVehicleData,
      };

      const response = await axios.post(
        `http://localhost:8090/api/v1/pickUpData/addPickUpData`,
        postPickupData
      );

      console.log(response?.data);
      if (response?.data?.success) {
        setIsCompLoading(false);
        toast.success("Completed");
        navigate("/homepage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(images);

  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      <h4 className="p-3 bg-blue-500 text-white w-full">
        Vehicle Handover To Workshop
      </h4>
      {isLoading && <h3 className="p-3 bg-red-500 text-white">Loading...</h3>}
      {isCompLoading && (
        <h3 className="p-3 bg-red-500 text-white">Loading...</h3>
      )}
      <div className="min-h-[300px] w-[90%] mx-auto shadow shadow-black  p-3 mt-3 flex flex-wrap gap-3">
        <div className="bg-white h-full camera text-end relative">
          <div>
            <div className="w-[300px] h-[300px]">
              <img
                src={source[0] || cloud}
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
      {source.length !== 0 && (
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
