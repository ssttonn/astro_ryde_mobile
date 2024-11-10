import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import {SignedIn, SignedOut, useUser} from "@clerk/clerk-expo";

const HomeScreen = () => {
  const {user} = useUser();
  return (
    <View>
      <SignedIn>
        <SafeAreaView>
          <Text>Welcome back!</Text>
        </SafeAreaView>
      </SignedIn>
      <SignedOut>
        <SafeAreaView>
          <Text>Sign in or register</Text>
        </SafeAreaView>
      </SignedOut>
    </View>
  );
};

export default HomeScreen;
