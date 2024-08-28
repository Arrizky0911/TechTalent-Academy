import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AILayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chatbot" options={{ headerShown: false }} />
      <Stack.Screen name="mockLanding" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AILayout;
