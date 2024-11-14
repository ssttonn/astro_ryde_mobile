import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store/useLocationStore";
import React from "react";
import { Text } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

//   const region = calculateRegion({
//     userLatitude,
//     userLongitude,
//     destinationLatitude,
//     destinationLongitude,
//   });

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
      showsUserLocation
      userInterfaceStyle="light"
    //   region={region}
      showsPointsOfInterest={false}
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;
