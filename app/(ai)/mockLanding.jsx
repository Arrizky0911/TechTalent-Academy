import { router } from "expo-router";
import React, { useState } from "react";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function App() {
  const [selectedJob, setSelectedJob] = useState(null); // state to track selected job
  const [modalVisible, setModalVisible] = useState(false);

  const jobs = [
    "Front End Developer",
    "Network Engineer",
    "Fullstack Developer",
    "UI UX Designer",
    "Game Developer",
    "Cyber Security",
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-[#30353C] w-full h-full absolute pt-14">
        <View className="flex-row justify-between">
          <TouchableOpacity className="ml-6" onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 mr-10">
            <Text className="text-white text-center relative text-xl font-geistBold mb-10">
              Mock Interview
            </Text>
          </View>
        </View>
        <View className="flex-1 w-full h-full bg-[#111315] relative rounded-t-3xl">
          <Text className="text-white font-geistBold text-center text-lg mt-10">
            What kind of job are you interested in?
          </Text>
          <Text className="text-gray-400 font-geistRegular text-center text-xs mt-2">
            Input what you are interested in, so we can know what position is
            suitable for you.
          </Text>

        {/* Job Buttons Grid */}
        <View className="flex-wrap flex-row mt-10 w-full px-5 justify-between">
          {[
            "Front End Developer",
            "Network Engineer",
            "Fullstack Developer",
            "UI UX Designer",
            "Game Developer",
            "Cyber Security",
            "Another job",
          ].map((job, index) => (
            <TouchableOpacity
              key={index}
              className={`${
                job === "Another job"
                  ? "bg-[#eeeeeb]"
                  : "bg-[#353535] text-white"
              } py-7 px-4 rounded-xl m-1 mt-2.5 w-[30%] items-center justify-center`}
            >
              <Text
                className={`${
                  job === "Another job" ? "text-[#353535]" : "text-white"
                } font-geistRegular text-center text-sm`}
              >
                {job}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-1 justify-end items-center pb-5 mx-5">
          {/* Next Button */}
          <TouchableOpacity 
            onPress={() => router.push('mockInterview')}
            className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full">
            <Text className="text-white text-center font-geistSemiBold">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
