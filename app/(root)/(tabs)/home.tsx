import MainButton from "@/components/MainButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { user } = useUser();
  return (
    <SafeAreaView>
      <SignedIn>
        <Text>Welcome back!</Text>
        <MainButton title="Sign out" />
      </SignedIn>
    </SafeAreaView>
  );
};

export default HomeScreen;
