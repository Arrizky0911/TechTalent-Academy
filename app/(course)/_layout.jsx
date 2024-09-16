import React from "react";
import { Stack } from "expo-router";

const CourseLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
          name="courseResponse/[category]"
          options={{ headerShown: false }}
        />
    <Stack.Screen
          name="courseDetail/[id]"
          options={{ headerShown: false }}
        />
    </Stack>
  );
};

export default CourseLayout;
