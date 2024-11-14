import React from "react";
import { View, Text, Image } from "react-native";

import { icons } from "@/constants";

import MainButton from "./MainButton";

const OAuthMethod = () => {
  const onLoginWithGoogle = () => {};

  return (
    <View className="gap-3">
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text>Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <MainButton
        className="w-full bg-white border border-gray-200"
        onPress={onLoginWithGoogle}
      >
        <View className="flex flex-row justify-center items-center gap-2">
          <Image
            source={icons.google}
            className="w-5 h-5 mx-2"
            resizeMode="contain"
          />
          <Text className="text-black font-JakartaBold text-xl">
            Login with google
          </Text>
        </View>
      </MainButton>
    </View>
  );
};

export default OAuthMethod;
