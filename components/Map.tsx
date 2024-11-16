import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore } from "@/store/useDriverStore";
import { useLocationStore } from "@/store/useLocationStore";
import { Driver, MarkerData } from "@/types/type";

const Map = () => {
  const {
    data: drivers,
    loading,
    error,
  } = useFetch<Driver[]>("/(api)/driver/fetchAll");

  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const region = useMemo(
    () =>
      calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }),
    [userLatitude, userLongitude, destinationLatitude, destinationLongitude],
  );

  const { selectedDriver, drivers: markers, setDrivers } = useDriverStore();

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      if (
        newMarkers.length > 0 &&
        destinationLatitude &&
        destinationLongitude
      ) {
        calculateDriverTimes({
          markers: newMarkers,
          userLatitude,
          userLongitude,
          destinationLatitude,
          destinationLongitude,
        })
          .then((drivers) => {
            if (!drivers) return;

            setDrivers(drivers as MarkerData[]);
          })
          .catch((err) => {
            setDrivers(newMarkers);
          });
      }
    }
  }, [
    destinationLatitude,
    destinationLongitude,
    drivers,
    setDrivers,
    userLatitude,
    userLongitude,
  ]);

  if (loading || !userLatitude || !userLatitude)
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="rounded-2xl items-center"
      tintColor="black"
      mapType="mutedStandard"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 20,
      }}
      region={region}
      showsUserLocation
      userInterfaceStyle="light"
      showsPointsOfInterest={false}
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
          />
        );
      })}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key={"destination"}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
