import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, Image } from "react-native";

import Payment from "@/components/Payment";
import RidesLayout from "@/components/RidesLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore } from "@/store/useDriverStore";
import { useLocationStore } from "@/store/useLocationStore";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = useMemo(
    () => drivers?.filter((driver) => +driver.id === selectedDriver)[0],
    [drivers, selectedDriver],
  );

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="com.astrotify.AstroRyde" // required for Apple Pay
      urlScheme="astroRyde" // required for 3D
    >
      <RidesLayout title="Book Ride">
        <>
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Ride Information
          </Text>
          <View className="flex w-full justify-center items-center mt-10">
            <Image
              source={{ uri: driverDetails?.profile_image_url }}
              className="w-28 h-28 rounded-full"
            />
            <View className="flex flex-row justify-center items-center mt-5 gap-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {driverDetails?.title}
              </Text>
              <View className="flex flex-row justify-center items-center gap-x-0.5">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-Jakarta">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex items-stretch py-3 px-5 rounded-3xl bg-general-600 mt-5">
            <View className="flex flex-row items-center justify-between border-b border-white py-3">
              <Text className="text-lg font-Jakarta">Ride Price</Text>
              <Text className="text-lg font-Jakarta text-[#0CC25F]">
                ${driverDetails?.price}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between border-b border-white py-3">
              <Text className="text-lg font-Jakarta">Pickup Time</Text>
              <Text className="text-lg font-Jakarta">
                {driverDetails?.time &&
                  formatTime(parseInt(`${driverDetails?.time}`))}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between py-3">
              <Text className="text-lg font-Jakarta">Car Seats</Text>
              <Text className="text-lg font-Jakarta">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>
          <View className="flex items-stretch justify-center mt-5">
            <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 py-3">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="text-lg font-Jakarta ml-2">{userAddress}</Text>
            </View>
            <View className="flex flex-row items-center justify-start border-b  border-general-700 py-3">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="text-lg font-Jakarta ml-2">
                {destinationAddress}
              </Text>
            </View>
          </View>
          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.id!}
            rideTime={driverDetails?.time!}
          />
        </>
      </RidesLayout>
    </StripeProvider>
  );
};

export default BookRide;
