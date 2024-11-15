import React from "react";
import { Image, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { icons } from "@/constants";

export type DestinationCallback = (
  latitude: number,
  longitude: number,
  address: string,
) => void;

interface GoogleTextInputProps {
  icon: string;
  initialLocation?: string;
  containerClassName?: string;
  textInputBackgroundColor?: string;
  onPress?: DestinationCallback;
}

const GoogleTextInput = ({
  icon,
  containerClassName,
  onPress,
  textInputBackgroundColor,
  initialLocation,
}: GoogleTextInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerClassName} mb-5`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Where you want to go?"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor || "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor || "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          if (
            !details?.location.latitude ||
            !details?.location.longitude ||
            !details?.addressComponents[0].longText
          ) {
            return;
          }

          onPress?.caller(
            details?.location.latitude,
            details?.location.longitude,
            details?.addressComponents[0].longText,
          );
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        renderLeftButton={() => {
          return (
            <View className="justify-center items-center w-6 h-6">
              <Image
                source={icon || icons.search}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
          );
        }}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation || "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
