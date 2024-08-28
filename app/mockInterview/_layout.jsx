import React from 'react'
import { Stack } from 'expo-router'

const InterviewLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="interview" options={{ headerShown: false }} />
    </Stack>
  );
}

export default InterviewLayout