import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

const CameraComp = (props) => {
  console.log("page reload");
  console.log(props);
  /*  const handleCapture = (e, id) => {
    e.preventDefault();

    console.log(id);
    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const file = e.target.files[0];
        console.log(file);
        const newUrl = URL.createObjectURL(file);

        const imagesArray = images.filter((imgObj) => imgObj.id !== id);

        console.log(imagesArray);

        const newOject = { id: id, url: newUrl };

        const newImagesArray = [...imagesArray, newOject];
        console.log(newImagesArray);

        setImages([...newImagesArray]);
      }
    }
  }; */

  return (
    <>
      {/*  <div className="bg-white w-[150px] h-[150px] camera text-end relative">
        <div>
          <div className="maindiv ">
            <img src={images.url} alt={"snap"} className="imgdiv"></img>
          </div>

          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            capture="environment"
            onChange={(e) => {
              handleCapture(e, images.id);
            }}
            style={{ display: "none" }}
          />
        </div>
        <div className="absolute top-0 right-0 z-10">
          <label htmlFor="icon-button-file">
            <FaCamera className="" />
          </label>
        </div>
      </div> */}
    </>
  );
};

export default CameraComp;
