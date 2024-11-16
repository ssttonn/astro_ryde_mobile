import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { memo, useRef } from "react";
import {
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { icons } from "@/constants";

import Map from "./Map";

type RidesLayoutProps = {
  children: React.ReactNode;
  title?: string;
  snapPoints?: string[];
};

const RidesLayout = ({ children, title, snapPoints }: RidesLayoutProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white">
          <View className="flex flex-col h-screen bg-blue-500">
            <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.backArrow}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>
              <Text className="text-xl font-JakartaSemiBold ml-5">
                {title || "Go Back"}
              </Text>
            </View>
            <Map />
          </View>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints || ["50%", "85%"]}
            index={0}
            keyboardBehavior="fillParent"
          >
            <BottomSheetView
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              {children}
            </BottomSheetView>
          </BottomSheet>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default memo(RidesLayout);
