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

  const { singleVehicleData } = useVehicleContext();

  const navigate = useNavigate();

  console.log(directionData);

  console.log(singleVehicleData);

  /* 
  {
    console.log(singleVehicleData);
  area: "Sanath Nagar";
  city: "Hyderabad";
  color: "SIZZILING RED";
  custName: "K SUKUMAR";
  hno: "22-13";
  mandal: "Hyderabad";
  phoneNum: "9845685214";
  pincode: "500040";
  regNum: "TS10FF1010";
  state: "Telangana";
  street: "SRINIVAS NAGAR";
  vehicleModel: "MARUTI ALTO 800 VXI";
  _id: "66d13559e6c2d49382787451";
} */

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

    if (sourceCordinates) {
      getPicupDirectionRoute();
    }
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
    navigate("/pickUpCameraComp");
    setOpen(true);
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
  }, [sourceCordinates, destinationCordinates]);

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

  return (
    <div>
      <div>
        <h3 className="p-2 bg-blue-500 text-white">
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
        <div className="p-5 shadow shadow-black bg-yellow-200">
          <h4 className="mt-5 bg-blue-500 text-white p-2">
            To Pickup Location
          </h4>
          <p className="mt-5">
            Distance :{" "}
            <b>
              {(pickupDirectionData?.routes[0]?.distance * 0.001).toFixed(2)}{" "}
              Kms
            </b>
          </p>
          <p className="mt-5">
            Duration :{" "}
            <b>
              {(pickupDirectionData?.routes[0]?.duration / 60).toFixed(2)} Min
            </b>
          </p>
        </div>
      )}
      {directionData?.routes && (
        <div
          className={!open ? "hidden" : "p-5 shadow shadow-black bg-yellow-200"}
        >
          <h4 className="mt-5 bg-blue-500 text-white p-2">
            To Workshop Location
          </h4>
          <p className="mt-5">
            {" "}
            Distance :{" "}
            <b>{(directionData?.routes[0]?.distance * 0.001).toFixed(2)} Kms</b>
          </p>
          <p className="mt-5">
            {" "}
            Duration :
            <b>{(directionData?.routes[0]?.duration / 60).toFixed(2)} Min</b>
          </p>
        </div>
      )}

      <div className="mt-10 flex gap-5">
        <div
          className={
            !open
              ? "hidden"
              : "flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] mb-20"
          }
        >
          <h4
            className="w-[300px] p-3 border  bg-blue-600 text-white text-center"
            onClick={goToPickup}
          >
            Go To Pickup Location
          </h4>
        </div>
        <div
          className={
            open
              ? "hidden"
              : "flex justify-center items-center w-full  bg-blue-300 text-white h-[50px] "
          }
          onClick={endPickup}
        >
          <h4 className="w-[300px] p-3 border  bg-red-600 text-white text-center">
            Reached Pickup Location
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MapsPage;
