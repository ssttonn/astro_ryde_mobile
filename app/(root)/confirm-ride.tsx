import { router } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { FlatList, View } from "react-native";

import DriverCardItem from "@/components/DriverCardItem";
import MainButton from "@/components/MainButton";
import RidesLayout from "@/components/RidesLayout";
import { generateMarkersFromData } from "@/lib/map";
import { useDriverStore } from "@/store/useDriverStore";
import { useLocationStore } from "@/store/useLocationStore";

const mockDrivers = [
  {
    id: 1,
    first_name: "James",
    last_name: "Wilson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: 4.8,
  },
  {
    id: 2,
    first_name: "David",
    last_name: "Brown",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    car_seats: 5,
    rating: 4.6,
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: 4.7,
  },
  {
    id: 4,
    first_name: "Robert",
    last_name: "Green",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: 4.9,
  },
];
const ConfirmRide = () => {
  const { userLatitude, userLongitude } = useLocationStore();
  const { drivers, selectedDriver, setSelectedDriver, setDrivers } =
    useDriverStore();

  useEffect(() => {
    if (!userLatitude || !userLongitude) {
      return;
    }

    const newMarkers = generateMarkersFromData({
      data: mockDrivers,
      userLatitude,
      userLongitude,
    });

    setDrivers(newMarkers);
  }, [setDrivers, userLatitude, userLongitude]);

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
