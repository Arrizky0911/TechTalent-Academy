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

          <View className="flex-wrap flex-row mt-10 w-full px-5 justify-between">
            {jobs.map((job, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedJob(job)}
                className={`${
                  selectedJob === job ? "bg-[#eeeeeb]" : "bg-[#353535] text-white"
                } py-7 px-4 rounded-xl m-1 mt-2.5 w-[30%] items-center justify-center`}
              >
                <Text
                  className={`${
                    selectedJob === job ? "text-[#353535]" : "text-white"
                  } font-geistRegular text-center text-sm`}
                >
                  {job}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-1 justify-end items-center pb-5 mx-5">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
            >
              <Text className="text-white text-center font-geistSemiBold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg p-6 w-11/12 max-h-3/4">
              <Text className="text-lg font-geistBold text-center mb-4">
                Must be read before!
              </Text>

              {/* Wrapping ScrollView to handle overflow */}
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                <View className="ml-5">
                  <Text className="text-gray-800 font-geistRegular text-base mb-3">
                    <Text className="font-geistSemiBold">1.</Text> Prepare yourself properly before starting.
                  </Text>
                  <Text className="text-gray-800 font-geistRegular text-base mb-3">
                    <Text className="font-geistSemiBold">2.</Text> Speak clearly and keep your voice loud.
                  </Text>
                  <Text className="text-gray-800 font-geistRegular text-base mb-3">
                    <Text className="font-geistSemiBold">3.</Text> Button Functions:
                  </Text>
                  <View className="ml-5">
                    <Text className="text-gray-800 font-geistRegular text-base mb-2">- To start speaking, click the mic button in the center. Click it again to stop the recording.</Text>
                    <Text className="text-gray-800 font-geistRegular text-base mb-2">- Click the "Next" button on the right to move to the next question. At the last question, click the button to end the mock interview.</Text>
                    <Text className="text-gray-800 font-geistRegular text-base mb-2">- Click the "X" button on the left to repeat the current question. For example, if you're on question 4 and click the "X" button, it will repeat question 4, not from the beginning.</Text>
                  </View>
                </View>
                <Text className="text-gray-800 font-geistSemiBold text-base mb-3">
                  Good Luck!
                </Text>
              </ScrollView>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  router.push("mockInterview");
                }}
                className="bg-blue-500 py-3 rounded-md mt-4"
              >
                <Text className="text-white text-center font-geistBold">Got it!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="border border-black py-3 rounded-md mt-4"
              >
                <Text className="text-black text-center font-geistBold">Close!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
