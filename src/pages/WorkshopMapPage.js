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
  };

  //   getUserLocation();

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [userLocation?.lng, userLocation?.lat],
      duration: 2500,
    });
  }, [userLocation]);

  useEffect(() => {
    if (destinationCordinates) {
      getDirectionRoute();
    }
  }, [destinationCordinates]);

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
  };

  return (
    <div>
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
        <div className="mt-10 p-5 shadow shadow-black">
          <h5 className="mt-5">Pickup - Workshop</h5>
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

      <div className="mt-10 ms-10">
        <Button
          variant="contained"
          className="inline-block w-[150px] mx-auto p-3 me-5"
          onClick={getUserLocation}
        >
          Get Location
        </Button>
      </div>

      <div className="mt-10 ms-10">
        <Button
          variant="contained"
          className="inline-block mx-auto p-3 me-5"
          onClick={pickupCompleted}
        >
          Pick Up Completed
        </Button>
      </div>
    </div>
  );
};

export default WorkshopMapPage;
