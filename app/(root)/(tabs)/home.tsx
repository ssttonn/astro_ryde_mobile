import MainButton from "@/components/MainButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import React from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className="bg-general-500">
      {/* <FlatList

      /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
