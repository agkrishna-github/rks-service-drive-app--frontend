import { useEffect, useRef, useState } from "react";
import { Map, Marker, Layer, Source } from "react-map-gl";
import pin from "../images/pin.png";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useVehicleContext } from "../components/contextApi/vehiclesApi";
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const CustomerMapPage = () => {
  /* const [userLocation, setUserLocation] = useState();
  const [destinationCordinates, setDestinationCordinates] = useState({
    lng: 78.45736,
    lat: 17.42421,
  });
  const [directionData, setDirectionData] = useState();
  const [pickupDirectionData, setPickupDirectionData] = useState();
  const [sourceCordinates, setSourceCordinates] = useState();
  const [open, setOpen] = useState(true); */

  const [userLocation, setUserLocation] = useState();
  const [sourceCordinates, setSourceCordinates] = useState({
    lng: 78.45736,
    lat: 17.42421,
  });
  const [destinationCordinates, setDestinationCordinates] = useState();
  const [directionData, setDirectionData] = useState();
  const [dropDirectionData, setDropDirectionData] = useState();
  const [open, setOpen] = useState();

  const navigate = useNavigate();
  const { singleVehicleData } = useVehicleContext();

  const { hno, street, area, city, state } = singleVehicleData;

  console.log(hno, street, area, city, state);

  const mapRef = useRef();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    getCoordinates(`${hno} ${street} ${area} ${city} ${state} `);
  }, []);

  useEffect(() => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation?.lng, userLocation?.lat],
        duration: 2500,
      });
    }

    if (destinationCordinates) {
      getUserDirectionRoute();
    }
  }, [destinationCordinates]);

  useEffect(() => {
    if (destinationCordinates) {
      mapRef.current?.flyTo({
        center: [destinationCordinates?.lng, destinationCordinates?.lat],
        duration: 2500,
      });
    }

    if (sourceCordinates && destinationCordinates) {
      getDropDirectionRoute();
    }
  }, [sourceCordinates || destinationCordinates]);

  useEffect(() => {
    if (sourceCordinates) {
      mapRef.current?.flyTo({
        center: [sourceCordinates?.lng, sourceCordinates?.lat],
        duration: 2500,
      });
    }
  }, [sourceCordinates]);
  /* 
  useEffect(() => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation?.lng, userLocation?.lat],
        duration: 2500,
      });
    }
  }, [userLocation]); */

  const getUserDirectionRoute = async () => {
    const res = await fetch(
      MAPBOX_DRIVING_ENDPOINT +
        userLocation?.lng +
        "," +
        userLocation?.lat +
        ";" +
        sourceCordinates?.lng +
        "," +
        sourceCordinates?.lat +
        "?overview=full&geometries=geojson" +
        "&access_token=" +
        MAPBOX_ACCESS_TOKEN,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();
    console.log(result);
    setDirectionData(result);
  };

  const getDropDirectionRoute = async () => {
    console.log("source co ordinates", sourceCordinates);
    console.log("source co ordinates", destinationCordinates);
    const res = await fetch(
      MAPBOX_DRIVING_ENDPOINT +
        sourceCordinates?.lng +
        "," +
        sourceCordinates?.lat +
        ";" +
        destinationCordinates?.lng +
        "," +
        destinationCordinates?.lat +
        "?overview=full&geometries=geojson" +
        "&access_token=" +
        MAPBOX_ACCESS_TOKEN,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();
    console.log(result);
    setDropDirectionData(result);
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log(pos);
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    console.log(userLocation);
  };

  useEffect(() => {}, []);

  const getCoordinates = async (address) => {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        GOOGLE_MAPS_API_KEY
    );

    const data = await response.json();

    console.log(data);

    setDestinationCordinates({
      lat: data.results[0]?.geometry.location.lat,
      lng: data.results[0]?.geometry.location.lng,
    });
  };

  const dropCompleted = () => {
    navigate("/custCameraComp");
    setOpen(true);
  };

  return (
    <div>
      <div>
        <h3 className="p-3 bg-blue-950 text-white">
          Going To Customer Location
        </h3>
      </div>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: userLocation?.lng,
          latitude: userLocation?.lat,
          zoom: 14,
        }}
        style={{ width: "100%", height: 450 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {userLocation && (
          <Marker
            longitude={userLocation?.lng}
            latitude={userLocation?.lat}
            anchor="bottom"
          >
            <img src={pin} alt="location pic" width={50} height={50} />
          </Marker>
        )}

        {/*   {sourceCordinates && (
          <Marker
            longitude={sourceCordinates?.lng}
            latitude={sourceCordinates?.lat}
            anchor="bottom"
          >
            <img src={pin} alt="location pic" width={50} height={50} />
          </Marker>
        )} */}
        {destinationCordinates && (
          <Marker
            longitude={destinationCordinates.lng}
            latitude={destinationCordinates.lat}
            anchor="bottom"
          >
            <img src={pin} alt="location pic" width={50} height={50} />
          </Marker>
        )}

        {/*  {dropDirectionData?.routes && (
          <Source
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates:
                  dropDirectionData?.routes[0]?.geometry?.coordinates,
              },
            }}
          >
            <Layer
              type="line"
              layout={{ "line-join": "round", "line-cap": "square" }}
              paint={{ "line-color": "#0462d4", "line-width": 4 }}
            ></Layer>
          </Source>
        )} */}

        {directionData?.routes && (
          <Source
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: directionData?.routes[0]?.geometry?.coordinates,
              },
            }}
          >
            <Layer
              type="line"
              layout={{ "line-join": "round", "line-cap": "square" }}
              paint={{ "line-color": "#0462d4", "line-width": 4 }}
            ></Layer>
          </Source>
        )}
      </Map>

      {directionData?.routes && (
        <div className="p-5 shadow shadow-black bg-yellow-200">
          <h5 className="mt-5">To Customer Location</h5>
          <p className="mt-5">
            Distance : {(directionData?.routes[0]?.distance * 0.001).toFixed(2)}{" "}
            Kms
          </p>
          <p className="mt-5">
            Duration : {(directionData?.routes[0]?.duration / 60).toFixed(2)}{" "}
            Min
          </p>
        </div>
      )}
      {/*   {dropDirectionData?.routes && (
        <div className="mt-10 p-5 shadow shadow-black">
          <h5 className="mt-5">To Drop</h5>
          <p className="mt-5">
            Distance :{" "}
            {(dropDirectionData?.routes[0]?.distance * 0.001).toFixed(2)} Kms
          </p>
          <p className="mt-5">
            Duration :{" "}
            {(dropDirectionData?.routes[0]?.duration / 60).toFixed(2)} Min
          </p>
          <div className="mt-10 flex gap-5">
            <div>
              <Button
                variant="contained"
                className="p-3 ms-3"
                onClick={startDrop}
              >
                Start Drop
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                className=" p-3 ms-3"
                onClick={arrived}
              >
                Arrived
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/*  <div className="mt-10 ms-5 mb-20">
        <Button
          variant="contained"
          className="inline-block w-[250px] mx-auto p-3 me-5"
          onClick={reachedWorkShop}
        >
          Reached Workshop
        </Button>
      </div> */}
      <div
        className={
          open
            ? "flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mt-10"
            : "hidden"
        }
      >
        <h4
          className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
          onClick={getUserLocation}
        >
          Start To Customer Location
        </h4>
      </div>

      <div
        className={
          !open
            ? "flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mt-10"
            : "hidden"
        }
      >
        <h4
          className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
          onClick={dropCompleted}
        >
          Reached Customer Location
        </h4>
      </div>
    </div>
  );
};

export default CustomerMapPage;
