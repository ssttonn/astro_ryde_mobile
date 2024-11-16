import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardItemProps } from "@/types/type";

const DriverCardItem = ({
  driver,
  selected,
  setSelected,
}: DriverCardItemProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${selected === driver.id ? "bg-general-600" : "bg-white"} flex flex-row items-center justify-between py-5 px-3 rounded-xl`}
    >
      <Image
        source={{ uri: driver.profile_image_url }}
        className="w-14 h-14 rounded-full"
      />
      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-lg font-Jakarta">{driver.title}</Text>
          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-Jakarta">{driver.rating}</Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            <Image source={icons.dollar} className="w-4 h-4" />
            <Text className="text-sm font-Jakarta ml-1">${driver.price}</Text>
          </View>
          <Text className="text-sm font-Jakarta text-general-800 ml-1">|</Text>
          <Text className="text-sm font-Jakarta text-general-800">
            {driver.time && formatTime(parseInt(`${driver.time!}`))}
          </Text>
          <Text className="text-sm font-Jakarta text-general-800 mx-1">|</Text>
          <Text className="text-sm font-Jakarta text-general-800">
            {driver.car_seats} seats
          </Text>
        </View>
      </View>
      <Image
        source={{ uri: driver.car_image_url }}
        className="w-14 h-14"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default DriverCardItem;
