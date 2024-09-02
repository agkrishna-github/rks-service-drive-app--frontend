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

const MapsPage = () => {
  const [userLocation, setUserLocation] = useState();
  const [destinationCordinates, setDestinationCordinates] = useState({
    lng: 78.45736,
    lat: 17.42421,
  });
  const [directionData, setDirectionData] = useState();
  const [pickupDirectionData, setPickupDirectionData] = useState();
  const [sourceCordinates, setSourceCordinates] = useState();
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  console.log(directionData);
  const { state: vehState } = useLocation();

  const { hno, street, area, city, state } = vehState?.pickUpData?.vehDetails;

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

    if (sourceCordinates) {
      getPicupDirectionRoute();
    }
    /* if (userLocation && sourceCordinates) {
      getPicupDirectionRoute();
    } */
  }, [sourceCordinates]);

  const goToPickup = () => {
    mapRef.current?.flyTo({
      center: [userLocation?.lng, userLocation?.lat],
      duration: 2500,
      zoom: 15,
    });
    setOpen(false);
  };

  const endPickup = () => {
    navigate("/pickUpCameraComp", {
      state: {
        pickUpData: vehState?.pickUpData,
        directionData,
        pickupDirectionData,
      },
    });
  };

  useEffect(() => {
    if (destinationCordinates) {
      mapRef.current?.flyTo({
        center: [destinationCordinates?.lng, destinationCordinates?.lat],
        duration: 2500,
      });
    }

    if (sourceCordinates && destinationCordinates) {
      getDirectionRoute();
    }
  }, [destinationCordinates]);

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

  const getPicupDirectionRoute = async () => {
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
    setPickupDirectionData(result);
  };

  const getDirectionRoute = async () => {
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
    setDirectionData(result);
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

    setSourceCordinates({
      lat: data.results[0]?.geometry.location.lat,
      lng: data.results[0]?.geometry.location.lng,
    });
    console.log(sourceCordinates);
  };

  const reachedWorkShop = () => {
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

        {sourceCordinates && (
          <Marker
            longitude={sourceCordinates?.lng}
            latitude={sourceCordinates?.lat}
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

        {pickupDirectionData?.routes && (
          <Source
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates:
                  pickupDirectionData?.routes[0]?.geometry?.coordinates,
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

      {pickupDirectionData?.routes && (
        <div className="mt-10 p-5 shadow shadow-black">
          <h5 className="mt-5">To Pickup</h5>
          <p className="mt-5">
            Distance :{" "}
            {(pickupDirectionData?.routes[0]?.distance * 0.001).toFixed(2)} Kms
          </p>
          <p className="mt-5">
            Duration :{" "}
            {(pickupDirectionData?.routes[0]?.duration / 60).toFixed(2)} Min
          </p>
          <div className="mt-10 flex gap-5">
            <div>
              <Button
                variant="contained"
                className="p-3 ms-3"
                onClick={goToPickup}
              >
                Go To Pickup
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                className=" p-3 ms-3"
                onClick={endPickup}
              >
                End Pickup
              </Button>
            </div>
          </div>
        </div>
      )}
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

      {/*  <div className="mt-10 ms-5 mb-20">
        <Button
          variant="contained"
          className="inline-block w-[250px] mx-auto p-3 me-5"
          onClick={reachedWorkShop}
        >
          Reached Workshop
        </Button>
      </div> */}
    </div>
  );
};

export default MapsPage;
