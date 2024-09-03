import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import cloud from "../images/cloud1.png";
import Button from "@mui/material/Button";

import axios from "axios";

const CustomerCameraComp = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const { state } = useLocation();

  const { dropData, directionData, pickupDirectionData } = state;

  useEffect(() => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    if (files.length) addImage(formData);
  }, [files]);

  const addImage = async (imgData) => {
    const response = await axios.post(
      "http://localhost:8090/api/v1/image/addImages",
      imgData
    );

    const uploadedImages = await response.data;
    setImages(uploadedImages);
    console.log(uploadedImages);
  };

  const handleCapture = (e) => {
    console.log(e);

    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const file = e.target.files[0];
        setFiles([...files, file]);
        /* 
        console.log(file);
        const newUrl = URL.createObjectURL(file);
        setImages([...images, newUrl]); */
      }
    }
  };

  console.log(files);

  const dropCompleted = async () => {
    const postDropData = {
      images: images,
      dropData: dropData,
    };

    try {
      const response = await axios.post(
        "http://localhost:8090/api/v1/dropData/addDropData",
        postDropData
      );

      if (response?.data?.success) {
        navigate("/homepage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      <h4>Vehicle Handover To Customer</h4>
      <div className="min-h-[300px] w-[90%] mx-auto shadow shadow-black  p-3 mt-3 flex flex-wrap gap-3">
        <div className="bg-white h-full camera text-end relative">
          <div>
            <div className="w-[300px] h-[300px]">
              <img
                src={images[0]?.url || cloud}
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
      {images.length !== 0 && (
        <div className="mt-3 ">
          <Button
            variant="contained"
            className="block w-[200px] mx-auto p-3 bg-blue-400 text-white"
            onClick={dropCompleted}
          >
            Completed
          </Button>
        </div>
      )}
    </section>
  );
};

export default CustomerCameraComp;
