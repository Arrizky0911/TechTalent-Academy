import React from "react";
import { Stack } from "expo-router";
import { InterviewHistoryProvider } from './interviewhistory';

const AILayout = () => {
  return (
    <InterviewHistoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="chatbot" options={{ headerShown: false }} />
        <Stack.Screen name="mockLanding" options={{ headerShown: false }} />
        <Stack.Screen name="interviewhistory" options={{ headerShown: false }} />
      </Stack>
    </InterviewHistoryProvider>
  );
};

export default AILayout;
