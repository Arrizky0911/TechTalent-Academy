import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PagesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="courseResponse" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PagesLayout;
