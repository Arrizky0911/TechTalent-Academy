import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const HobbyLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="roadmapResponse" options={{ headerShown: false }} />
    </Stack>
  );
}

export default HobbyLayout