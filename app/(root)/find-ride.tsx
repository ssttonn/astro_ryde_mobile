import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import GoogleTextInput from "@/components/GoogleTextInput";
import MainButton from "@/components/MainButton";
import RidesLayout from "@/components/RidesLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store/useLocationStore";

const FindRidesScreen = () => {
  const {
    userAddress,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  return (
    <RidesLayout snapPoints={["85%"]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress}
          containerClassName="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          onPress={(lat, lon, address) => {
            setUserLocation({
              latitude: lat,
              longitude: lon,
              address,
            });
          }}
        />
      </View>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress}
          containerClassName="bg-neutral-100"
          textInputBackgroundColor="transparent"
          onPress={(lat, lon, address) => {
            setDestinationLocation({
              latitude: lat,
              longitude: lon,
              address,
            });
          }}
        />
      </View>
      <MainButton
        title="Find now"
        className="w-full"
        onPress={() => {
          router.push("/(root)/confirm-ride");
        }}
      />
    </RidesLayout>
  );
};

export default FindRidesScreen;
