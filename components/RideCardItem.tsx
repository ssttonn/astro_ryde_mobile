import React from "react";
import { View, Text, Image } from "react-native";

import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";

type RideCardItemProps = {
  ride: Ride;
};

const RideCardItem = ({ ride }: RideCardItemProps) => {
  return (
    <View className="flex flex-col items-stretch justify-start bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3 p-3">
      <View className="flex flex-row items-center justify-start">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${ride.destination_longitude + "," + ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
          }}
          className="w-[80px] h-[90px] rounded-lg"
        />
        <View className="flex flex-col justify-center gap-3">
          <View className="flex flex-row mx-5 gap-y-5 gap-x-2">
            <Image source={icons.to} className="w-5 h-5" />
            <Text className="text-md font-JakartaMedium" numberOfLines={1}>
              {ride.origin_address}
            </Text>
          </View>
          <View className="flex flex-row mx-5 gap-y-5 items gap-x-2">
            <Image source={icons.point} className="w-5 h-5" />
            <Text className="text-md font-JakartaMedium" numberOfLines={1}>
              {ride.destination_address}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center gap-y-5">
        <View className="flex flex-row items-center w-full justify-between">
          <Text className="text-md font-JakartaMedium text-gray-500">
            Date & Time
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-500">
            {`${formatDate(ride.created_at)}, ${formatTime(parseInt(`${ride.ride_time}`))}`}
          </Text>
        </View>
        <View className="flex flex-row items-center w-full justify-between">
          <Text className="text-md font-JakartaMedium text-gray-500">
            Driver
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-500">
            {ride.driver.first_name} {ride.driver.last_name}
          </Text>
        </View>
        <View className="flex flex-row items-center w-full justify-between">
          <Text className="text-md font-JakartaMedium text-gray-500">
            Car Seats
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-500">
            {ride.driver.car_seats}
          </Text>
        </View>
        <View className="flex flex-row items-center w-full justify-between">
          <Text className="text-md font-JakartaMedium text-gray-500">
            Payment Status
          </Text>
          <Text
            className={`text-md capitalize font-JakartaMedium text-gray-500 ${ride.payment_status === "paid" ? "text-green-500" : "text-red-500"}`}
          >
            {ride.payment_status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideCardItem;
