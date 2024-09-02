import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const center = { lat: 17.4241643, lng: 78.45733709999999 };

let google = window.google;

const PickUpMapComp = () => {
  const [map, setMap] = useState(null);
  const [deirectionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startLati, setStartLati] = useState("");
  const [startLong, setStartLong] = useState("");
  const [endLati, setEndLati] = useState("");
  const [endLong, setEndLong] = useState("");
  const [delAdd, setDelAdd] = useState(
    "Maruti Suzuki Arena - Saboo RKS Motor Pvt. Ltd, Raj Bhavan Road, Matha Nagar, Somajiguda, Hyderabad, Telangana, India"
  );

  const [gpsLati, setGpsLati] = useState("");
  const [gpsLong, setGpsLong] = useState("");

  const navigate = useNavigate();

  const originRef = useRef();
  const destinationRef = useRef();

  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAf4vRvjVvt-AuStWjrfbA-tJNYouHBpb4",
    libraries: ["places"],
  });

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    console.log(originRef.current.value);

    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);
    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const handleOnPlacesChangedStart = () => {
    let address = startInputRef.current.getPlaces();

    const num = address.map((e) => e);
    const newAdd = num.map((item) => item);
    setStartLati(newAdd[0].geometry.location.lat());
    setStartLong(newAdd[0].geometry.location.lng());
  };
  console.log(startLati);
  console.log(startLong);

  const handleOnPlacesChangedEnd = () => {
    let address = endInputRef.current.getPlaces();

    const num = address.map((e) => e);
    const newAdd = num.map((item) => item);
    setEndLati(newAdd[0].geometry.location.lat());
    setEndLong(newAdd[0].geometry.location.lng());
  };
  console.log(endLati);
  console.log(endLong);

  const showInMapClicked = () => {
    window.open(
      `https://maps.google.com/maps/dir/?api=1&origin=${startLati},${startLong}&destination=${endLati},${endLong}&key=AIzaSyAf4vRvjVvt-AuStWjrfbA-tJNYouHBpb4`
    );
  };

  return (
    <section className="w-5/6 mx-auto md:w-screen min-h-[500px] p-2 grid grid-cols-2 md:grid-cols-none gap-x-5 shadow-xl shadow-black rounded-md  ">
      <div className="p-3">
        <h2>Vehicle Delivery Details</h2>
        <div className="mt-10">
          {isLoaded && (
            <div>
              <div className="">
                <label htmlFor="">Dealer Location</label>
                <StandaloneSearchBox
                  onLoad={(ref) => (startInputRef.current = ref)}
                  onPlacesChanged={handleOnPlacesChangedStart}
                >
                  <input
                    ref={originRef}
                    value={delAdd}
                    type="text"
                    placeholder=""
                    className="p-2 w-[400px] mt-2 md:w-full"
                    readOnly
                  />
                </StandaloneSearchBox>
              </div>
              <div className="mt-10 md:mb-10">
                <label htmlFor="">Customer Location</label>
                <StandaloneSearchBox
                  onLoad={(ref) => (endInputRef.current = ref)}
                  onPlacesChanged={handleOnPlacesChangedEnd}
                >
                  <input
                    ref={destinationRef}
                    type="text"
                    placeholder=""
                    className="p-2 w-[400px] mt-2 md:w-full"
                  />
                </StandaloneSearchBox>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-9">
          <div className="mt-5 ">
            <button
              onClick={() => calculateRoute()}
              className="p-2 w-[200px] cursor-pointer  hover:bg-blue-900 hover:text-white"
            >
              Get Directions
            </button>
          </div>
          {distance && duration && (
            <div className="mt-3">
              <h4 className="mb-2">Distance : {distance}</h4>
              <h4 className="m">Duration : {duration}</h4>
            </div>
          )}
          <div className="">
            <button
              className="py-1 px-2 w-[200px] cursor-pointer hover:bg-blue-900 hover:text-white"
              onClick={showInMapClicked}
            >
              Go to maps
            </button>
          </div>
          {/*  <div className="">
            <button
              className="py-1 px-2 w-[200px] cursor-pointer bg-white"
              onClick={stopGPS}
            >
              Stop Maps
            </button>
          </div> */}
        </div>
      </div>
      <div className="shadow shadow-black mt-10 w-[500px] md:w-full h-[500px] md:h-[550px]">
        <div className="md:w-[100%] md:h-[550px] md:mb-10 h-[500px]">
          <GoogleMap
            center={center}
            zoom={20}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />
            <DirectionsRenderer directions={deirectionResponse} />
            {/* {deirectionResponse && ( 
            )}
            */}
          </GoogleMap>
        </div>
      </div>
    </section>
  );
};

export default PickUpMapComp;
