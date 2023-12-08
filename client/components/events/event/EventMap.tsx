"use client";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useState, useEffect, memo, FC } from "react";

interface MapContainerProps {
  place: string;
}

const MapContainer: FC<MapContainerProps> = ({ place }) => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  useEffect(() => {
    async function getLatLonForPlace() {
      const geocodeUrl = `https://maps.google.com/maps/api/geocode/json?address=${place}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const geoCodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geoCodeResponse.json();
      console.log(geocodeData);
      const { lat, lng } = geocodeData.results[0].geometry.location;
      setLocation({ lat, lng });
    }
    getLatLonForPlace();
  }, [place]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  return isLoaded ? (
    <div className="max-w-5xl rounded-lg">
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={16}>
        <>
          <MarkerF position={location} />
        </>
      </GoogleMap>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default memo(MapContainer);
