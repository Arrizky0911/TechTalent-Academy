import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AILayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chatbot/[chatSession]" options={{ headerShown: false }} />
      <Stack.Screen name="main/mockLanding" options={{ headerShown: false }} />
      <Stack.Screen name="main/hobby" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen
          name="hobby/[hobby]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mockInterview/[input]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mockFeedback/[interviewResult]"
          options={{ headerShown: false }}
        />
    </Stack>
  );
};

export default AILayout;
