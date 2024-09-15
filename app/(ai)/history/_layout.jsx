import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const historyLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="archivedchats" options={{ headerShown: false }} />
      <Stack.Screen name="chatbothistory" options={{ headerShown: false }} />
      <Stack.Screen name="interviewhistory" options={{ headerShown: false }} />
    </Stack>
  );
};

export default historyLayout;
