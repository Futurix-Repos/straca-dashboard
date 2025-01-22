import React, { useCallback, useEffect, useState } from "react";

import {
  GoogleMap,
  Marker,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";

export default function MapWrapper({
  coordinates,
  setCoordinates,
}: {
  coordinates: { lng?: number; lat?: number } | undefined;
  setCoordinates: (value: { lng?: number; lat?: number }) => void;
}) {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isMarkerShow, setIsMarkerShow] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script-straca",
    googleMapsApiKey: "AIzaSyAmU6cWN8LG5ve3_8-ceRPBixEioKDnN4s",
  });

  const success = useCallback(
    (position: any) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log(coordinates);

      if (coordinates?.lng && coordinates.lat) {
        setCurrentPosition({
          lat: Number(coordinates.lat),
          lng: Number(coordinates.lng),
        });
      } else {
        setCoordinates({
          lat: latitude,
          lng: longitude,
        });
        setCurrentPosition({
          lat: latitude,
          lng: longitude,
        });
      }
    },
    [coordinates, setCoordinates],
  );

  useEffect(() => {
    if (currentPosition == null) {
      //console.log("useEffect");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, () => {
          console.log("error");
        });
      } else {
        console.log("Geolocation not supported");
      }
    } else if (
      currentPosition?.lat !== coordinates?.lat ||
      currentPosition?.lng !== coordinates?.lng
    ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, () => {
          console.log("error");
        });
      } else {
        console.log("Geolocation not supported");
      }
    }
  }, [coordinates?.lat, coordinates?.lng, currentPosition, success]);

  const onMarkerEvent = useCallback(
    (e: google.maps.MapMouseEvent, type: string) => {
      setMarkerPosition({
        lat: e.latLng?.lat() ?? 0,
        lng: e.latLng?.lng() ?? 0,
      });
      setCoordinates({
        lat: e.latLng?.lat() ?? 0,
        lng: e.latLng?.lng() ?? 0,
      });
    },
    [setCoordinates],
  );

  if (!isLoaded) return <h1>Loading...</h1>;

  return (
    <div>
      <GoogleMap
        mapContainerClassName="h-80"
        onLoad={(map) => {}}
        center={{
          lat: markerPosition?.lat ?? currentPosition?.lat ?? 0,
          lng: markerPosition?.lng ?? currentPosition?.lng ?? 0,
        }}
        options={{ streetViewControl: false }}
        zoom={15}
        onClick={(e) => onMarkerEvent(e, "click")}
      >
        {
          <MarkerF
            position={{
              lat: markerPosition?.lat ?? currentPosition?.lat ?? 0,
              lng: markerPosition?.lng ?? currentPosition?.lng ?? 0,
            }}
            icon={{
              url: "/icons/pin_truck.png",
              scaledSize: new google.maps.Size(100, 100),
              anchor: new google.maps.Point(70, 100),
            }}
            animation={google.maps.Animation.BOUNCE}
            //draggable={true}
            //onDragEnd={(e) => onMarkerEvent(e, "dragEnd")}
          />
        }
      </GoogleMap>
    </div>
  );
}
