import { router } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { FlatList, View } from "react-native";

import DriverCardItem from "@/components/DriverCardItem";
import MainButton from "@/components/MainButton";
import RidesLayout from "@/components/RidesLayout";
import { useDriverStore } from "@/store/useDriverStore";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  const footerComponent = useMemo(
    () => (
      <View className="mx-5 mt-10">
        <MainButton
          title="Select Ride"
          className="w-full"
          onPress={() => {
            router.push("/(root)/book-ride");
          }}
        />
      </View>
    ),
    [],
  );

  const snapPoints = useMemo(() => ["65%", "85%"], []);

  return (
    <RidesLayout title="Choose a Driver" snapPoints={snapPoints}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(info) => (
          <DriverCardItem
            driver={info.item}
            selected={selectedDriver!}
            setSelected={() => {
              setSelectedDriver(info.item.id);
            }}
          />
        )}
        ListFooterComponent={() => {
          return footerComponent;
        }}
      />
    </RidesLayout>
  );
};

export default ConfirmRide;
