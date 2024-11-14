import { View, Text } from "react-native";
import React from "react";

type DestinationCallback = (
  latitude: number,
  longitude: number,
  address: string
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
}: GoogleTextInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerClassName} mb-5`}
    >
      <Text>GoogleTextInput</Text>
    </View>
  );
};

export default GoogleTextInput;
