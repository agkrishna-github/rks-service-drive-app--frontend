import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import cloud from "../images/cloud1.png";
import Button from "@mui/material/Button";
import { useVehicleContext } from "./contextApi/vehiclesApi";

const PickUpCameraComp = () => {
  const { singleVehicleData, setVehicleImages } = useVehicleContext();

  console.log(singleVehicleData);
  console.log(setVehicleImages);

  const [images, setImages] = useState([]);
  console.log(images);
  const [files, setFiles] = useState([]);
  console.log(files);
  const [source, setSource] = useState([]);
  console.log(source);
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);

  const navigate = useNavigate();
  /* 
  const addImage = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      console.log(files);
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      console.log(formData);

      const response = await axios.post(
        "http://localhost:8090/api/v1/image/addImages",
        formData
      );

      console.log(response);

      console.log(response.data);
      console.log(response?.data);

    
      setImages(uploadedImages?.images);
      setVehicleImages(uploadedImages?.images);
      
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }; */

  const handleCapture = (e) => {
    console.log(e);

    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const file = e.target.files[0];
        const newUrl = URL.createObjectURL(file);

        setSource([...source, newUrl]);
      }
    }
  };

  console.log(source);

  const pickupCompleted = async () => {
    setVehicleImages(source);
    navigate("/workShopMapPage");
  };

  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      {isLoading && (
        <h3 className="p-3 bg-red-950 text-white rounded-lg">Loading...</h3>
      )}
      <h4 className="p-3 bg-blue-950 text-white w-full">Vehicle Photos</h4>
      <div className="min-h-[500px] w-[90%] mx-auto shadow shadow-black bg-blue-300 p-3 mt-3 flex flex-wrap gap-3">
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img
              src={source[0] || cloud}
              alt={"snap"}
              className="imgdiv"
              width={200}
              height={200}
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img src={source[1] || cloud} alt={"snap"} className="imgdiv"></img>
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img src={source[2] || cloud} alt={"snap"} className="imgdiv"></img>
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img src={source[3] || cloud} alt={"snap"} className="imgdiv"></img>
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img src={source[4] || cloud} alt={"snap"} className="imgdiv"></img>
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div className="maindiv ">
            <img src={source[5] || cloud} alt={"snap"} className="imgdiv"></img>
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

          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
      </div>
      {source.length === 6 && (
        <div className="flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] ">
          <h4
            className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
            onClick={pickupCompleted}
          >
            Upload
          </h4>
        </div>
      )}
      {/* 
      <div>
        {pickupDirectionData?.routes && (
          <div className="mt-10 p-5 shadow shadow-black">
            <h5 className="mt-5">To Pickup</h5>
            <p className="mt-5">
              Distance :{" "}
              {(pickupDirectionData?.routes[0]?.distance * 0.001).toFixed(2)}{" "}
              Kms
            </p>
            <p className="mt-5">
              Duration :{" "}
              {(pickupDirectionData?.routes[0]?.duration / 60).toFixed(2)} Min
            </p>
          </div>
        )}
        {directionData?.routes && (
          <div className="mt-10 p-5 shadow shadow-black">
            <h5 className="mt-5">Pickup - Workshop</h5>
            <p className="mt-5">
              Distance :{" "}
              {(directionData?.routes[0]?.distance * 0.001).toFixed(2)} Kms
            </p>
            <p className="mt-5">
              Duration : {(directionData?.routes[0]?.duration / 60).toFixed(2)}{" "}
              Min
            </p>
          </div>
        )}
      </div> */}
    </section>
  );
};

export default PickUpCameraComp;
