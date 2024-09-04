import { useEffect, useRef, useState } from "react";
import { Map, Marker, Layer, Source } from "react-map-gl";
import pin from "../images/pin.png";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const WorkshopMapPage = () => {
  const [userLocation, setUserLocation] = useState();
  const [destinationCordinates, setDestinationCordinates] = useState({
    lng: 78.45736,
    lat: 17.42421,
  });
  const [directionData, setDirectionData] = useState();
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const mapRef = useRef();
  /* 
  useEffect(() => {
    getUserLocation();
  }, []); */

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log(pos);
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    console.log(userLocation);
    setOpen(false);
  };

  //   getUserLocation();

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [userLocation?.lng, userLocation?.lat],
      duration: 2500,
    });
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && destinationCordinates) {
      getDirectionRoute();
    }
  }, [userLocation && destinationCordinates]);

  const getDirectionRoute = async () => {
    const res = await fetch(
      MAPBOX_DRIVING_ENDPOINT +
        userLocation?.lng +
        "," +
        userLocation?.lat +
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
    setDirectionData(result);
  };

  const pickupCompleted = () => {
    navigate("/workShopCam");
    setOpen(true);
  };

  return (
    <div>
      <div>
        <h3 className="p-2 bg-blue-500 text-white">Going To Workshop</h3>
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

        {destinationCordinates && (
          <Marker
            longitude={destinationCordinates.lng}
            latitude={destinationCordinates.lat}
            anchor="bottom"
          >
            <img src={pin} alt="location pic" width={50} height={50} />
          </Marker>
        )}

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
          <h4 className="mt-5">Pickup To Workshop</h4>
          <p className="mt-5">
            Distance :
            <b>{(directionData?.routes[0]?.distance * 0.001).toFixed(2)} Kms</b>
          </p>
          <p className="mt-5">
            Duration :
            <b>{(directionData?.routes[0]?.duration / 60).toFixed(2)} Min</b>
          </p>
        </div>
      )}

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
          Start To Workshop
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
          onClick={pickupCompleted}
        >
          Reached Work Shop
        </h4>
      </div>
    </div>
  );
};

export default WorkshopMapPage;
