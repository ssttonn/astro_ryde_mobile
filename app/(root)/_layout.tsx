import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="find-ride" />
      <Stack.Screen name="confirm-ride" />
      <Stack.Screen name="book-ride" />
    </Stack>
  );
};

export default RootLayout;
