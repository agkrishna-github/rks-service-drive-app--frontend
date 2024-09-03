import React, { useState } from "react";
// import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoutes from "./components/routes/PrivateRoutes";
import Homepage from "./pages/Homepage";
import MapsPage from "./pages/MapsPage";
import PickUpCameraComp from "./components/PickUpCameraComp";
import CameraComp from "./components/CameraComp";
import PickUpMapComp from "./pages/PickUpMapComp";
import "mapbox-gl/dist/mapbox-gl.css";
import WorkShopCam from "./pages/WorkShopCam";
import WorkshopMapPage from "./pages/WorkshopMapPage";
import DropMapPage from "./pages/DropMapPage";
import DropCameraComp from "./components/DropCameraComp";
import CustomerCameraComp from "./pages/CustomerCameraComp";
import CustomerMapPage from "./pages/CustomerMapPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route element={<PrivateRoutes />}> */}
        <Route path="homepage" element={<Homepage />} />
        <Route path="mapPage" element={<MapsPage />} />
        <Route path="dropMapPage" element={<DropMapPage />} />
        {/* <Route path="/pickUpMapComp" element={<PickUpMapComp />} /> */}
        <Route path="/pickUpCameraComp" element={<PickUpCameraComp />} />
        <Route path="/dropCameraComp" element={<DropCameraComp />} />
        <Route path="/workShopCam" element={<WorkShopCam />} />
        <Route path="/workShopMapPage" element={<WorkshopMapPage />} />
        <Route path="/customerMapPage" element={<CustomerMapPage />} />
        <Route path="/custCameraComp" element={<CustomerCameraComp />} />
        {/* <Route path="/cameraComp" element={<CameraComp />} /> */}
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
