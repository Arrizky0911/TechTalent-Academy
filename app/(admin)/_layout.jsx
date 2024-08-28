import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AdminLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="createCourse" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AdminLayout;
