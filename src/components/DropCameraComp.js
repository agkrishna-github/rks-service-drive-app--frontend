import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import cloud from "../images/cloud1.png";
import Button from "@mui/material/Button";
import { useVehicleContext } from "./contextApi/vehiclesApi";

const DropCameraComp = () => {
  const { singleVehicleData, setVehicleImages } = useVehicleContext();

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [source, setSource] = useState([]);
  console.log(source);
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);
  console.log(images);

  const navigate = useNavigate();

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

  console.log(files);

  const goToDrop = () => {
    setVehicleImages(source);
    navigate("/customerMapPage");
  };

  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      <h4 className="p-3 bg-blue-950 text-white w-full">Vehicle Photos</h4>
      <div className="min-h-[500px] w-[90%] mx-auto shadow shadow-black bg-blue-300 p-3 mt-3 flex flex-wrap gap-3">
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
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
          </div>
          <div className="absolute top-0 right-0 z-10">
            <label htmlFor="icon-button-file">
              <FaCamera className="" />
            </label>
          </div>
        </div>
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
            <div className="maindiv ">
              <img
                src={source[1] || cloud}
                alt={"snap"}
                className="imgdiv"
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
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
            <div className="maindiv ">
              <img
                src={source[2] || cloud}
                alt={"snap"}
                className="imgdiv"
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
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
            <div className="maindiv ">
              <img
                src={source[3] || cloud}
                alt={"snap"}
                className="imgdiv"
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
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
            <div className="maindiv ">
              <img
                src={source[4] || cloud}
                alt={"snap"}
                className="imgdiv"
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
        <div className="bg-white w-[150px] h-[150px] camera text-end relative">
          <div>
            <div className="maindiv ">
              <img
                src={source[5] || cloud}
                alt={"snap"}
                className="imgdiv"
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
      {source.length === 6 && (
        <div className="flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] ">
          <h4
            className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
            onClick={goToDrop}
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

export default DropCameraComp;
