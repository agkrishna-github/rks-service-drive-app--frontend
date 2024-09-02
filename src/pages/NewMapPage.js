import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactMapGl, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapsPage = () => {
  const { state: vehState } = useLocation();

  const { hno, street, area, city, state } = vehState?.pickUpData?.vehDetails;

  // state.pickUpData =

  const [coords, setCoords] = useState([]);
  const [start, setStart] = useState([78.5469086, 17.425577]);
  const [end, setEnd] = useState([78.5469086, 17.425577]);
  const [startLat, setStartLat] = useState([]);
  const [endLong, setEndLong] = useState([]);
  const [viewPort, setViewPort] = useState({
    longitude: 78.5469086,
    latitude: 17.425577,
    zoom: 15,
  });
  const [marker, setMarker] = useState({
    latitude: 78.5469086,
    longitude: 17.425577,
  });

  const GeolocateControlRef = useRef();

  useEffect(() => {
    console.log("first useEffect");
    const geo = navigator.geolocation;
    geo.getCurrentPosition(userCoords);
    function userCoords(position) {
      console.log("first useEffect - usercords function start");
      let userLatitude = position.coords.latitude;
      let userLongitude = position.coords.longitude;
      setStart([userLongitude, userLatitude]);
      setStartLat([userLongitude, userLatitude]);
      console.log("first useEffect - usercords function last after results");
      console.log([userLongitude, userLatitude]);
    }
  }, []);

  /* 
  useEffect(()=>{
    getUserLocation()
  },[])

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function(pos){
      console.log(pos)
      setUserLocation({lat:pos.coords.latitude, lng: pos.coords.longitude})
    })
  }

 */

  useEffect(() => {
    console.log("second useEffect");
    getCoordinates(`${hno}, ${street}, ${area}, ${city}, ${state} `);
    console.log("second useEffect last");
  }, []);

  useEffect(() => {
    console.log("third use effect");
    getRoute();
    GeolocateControlRef.current?.trigger();
    console.log("third use effect last");
    console.log(GeolocateControlRef.current);
  }, []);

  const getCoordinates = async (address) => {
    console.log("second useEffe async func");
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        GOOGLE_MAPS_API_KEY
    );

    const data = await response.json();
    console.log("second useEffe async func second");
    console.log(data);
    const latitude = data.results[0].geometry.location.lat;
    const longitude = data.results[0].geometry.location.lng;
    setEnd([longitude, latitude]);
    setEndLong([longitude, latitude]);
    console.log("second useEffe async func third");
  };

  const getRoute = async () => {
    console.log("third use effect async func");
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await response.json();
    console.log("third use effect async func second");
    console.log(data);
    const coords = data?.routes[0]?.geometry?.coordinates;
    console.log(coords);
    console.log("third use effect asunc func last");
    setCoords(coords);
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const lineStyle = {
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  const endPoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "Point",
          coordinates: [...end],
        },
      },
    ],
  };

  const layerEndpoint = {
    id: "end",
    type: "circle",
    source: {
      type: "geojson",
      data: "end",
    },
    paint: {
      "circle-radius": 10,
      "circle-color": "#f30",
    },
  };

  const showInMapClicked = () => {
    console.log("showinmapclicked function");
    window.open(
      `https://maps.google.com/maps/dir/?api=1&origin=${startLat[0]},${startLat[1]}&destination=${endLong[0]},${endLong[1]}&key=AIzaSyAf4vRvjVvt-AuStWjrfbA-tJNYouHBpb4`
    );
    console.log("showinmapclicked function last");
  };

  // navigate("/uploadImage", { state: { did: did, vid: state.vid } });
  console.log("lassssssssssst");
  return (
    <section className="min-h-screen flex flex-col gap-y-3 justify-center items-center">
      <h4> Pickup Location</h4>
      <div className="min-h-[500px] w-[90%] mx-auto shadow shadow-black bg-blue-300 p-3 mt-3 flex flex-wrap gap-3">
        <ReactMapGl
          {...viewPort}
          // onMove={(evt) => setViewPort(evt.viewPort)}
          // mapStyle="mapbox://styles/mapbox/streets-v9"
          mapStyle="mapbox://styles/agk-gopikrishna-4005/cm05b3dsz00fm01pda5t5e6ww"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          onViewportChange={(viewPort) => setViewPort(viewPort)}
          style={{ width: "400px", height: "400px" }}
        >
          <GeolocateControl
            ref={GeolocateControlRef}
            showAccuracyCircle={false}
            onGeolocate={(e) => {
              setStart([e.coords.longitude, e.coords.latitude]);
            }}
          />
          <FullscreenControl />
          <NavigationControl />
          {/* <Marker
            latitude={marker?.latitude}
            longitude={marker?.longitude}
            draggable={true}
            onDragEnd={handleMarkerDrag}
          /> */}
          <Source id="routeSource" type="geojson" data={geojson}>
            <Layer {...lineStyle} />
          </Source>
          <Source id="endSource" type="geojson" data={endPoint}>
            <Layer {...layerEndpoint} />
          </Source>
        </ReactMapGl>
      </div>
      <div onClick={showInMapClicked}>
        <button className="block w-[200px] mx-auto p-3">GO TO MAP</button>
      </div>
    </section>
  );
};

export default MapsPage;
