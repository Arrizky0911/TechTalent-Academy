import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, TextInput, Animated } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Reanimated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function App() {
  const [selectedJob, setSelectedJob] = useState(null); // state to track selected job
  const [anotherJob, setJob] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const jobs = [
    "Front End Developer",
    "Back End Developer",
    "Fullstack Developer",
    "UI UX Designer",
    "Network Engineer",
    "Game Developer",
    "AI Researcher",
    "Penetration Tester",
    "Another Job",
  ];

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-[#30353C] w-full h-full absolute pt-14">
        <Animated.View style={{ opacity: fadeAnim }} className="flex-row justify-between">
          <TouchableOpacity className="ml-6" onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 mr-10">
            <Text className="text-white text-center relative text-xl font-geistBold mb-10">
              Mock Interview
            </Text>
          </View>
        </Animated.View>
        <Reanimated.View entering={FadeInUp.delay(300).duration(1000)} className="flex-1 w-full h-full bg-[#111315] relative rounded-t-3xl">
          <Text className="text-white font-geistBold text-center text-lg mt-10">
            What kind of job are you interested in?
          </Text>
          <Text className="text-gray-400 font-geistRegular text-center text-xs m-2">
            Select your dream job role and let's kickstart a tailored interview simulation just for you!
          </Text>
          <Reanimated.View entering={FadeIn.delay(600).duration(1000)} className="flex-wrap flex-row mt-2 w-full px-5 justify-between">
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
                  } font-geistRegular text-center text-xs`}
                >
                  {job}
                </Text>
              </TouchableOpacity>
            ))}
            {selectedJob === "Another Job" ? (
              <TextInput
                className="mt-5 bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border-white/40 border-[1px] w-full h-10 rounded-xl mb-4 w-full"
                placeholder="Input here"
                placeholderTextColor="gray"
                value={anotherJob}
                onChangeText={() => setJob()}
              />

            ) : (
              <></>
            )}
          </Reanimated.View>
          <Reanimated.View entering={FadeInUp.delay(1200).duration(1000)} className="flex-1 justify-end items-center pb-5 mx-5">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
              disabled={selectedJob && (selectedJob !== "Another Job" || !(anotherJob == "")) ? false : true}
            >
              <Text className="text-white text-center font-geistSemiBold">Next</Text>
            </TouchableOpacity>
          </Reanimated.View>
        </Reanimated.View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <Reanimated.View entering={FadeIn.duration(300)} className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <Reanimated.View entering={FadeInUp.duration(500)} className="bg-[#111315] rounded-lg p-6 w-11/12 max-h-3/4">
              <Text className="text-lg text-white font-geistBold text-center mb-4">
                Must be read before!
              </Text>

              {/* Wrapping ScrollView to handle overflow */}
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                <View className="ml-5">
                  <Text className="text-gray-200 font-geistRegular text-sm mb-3">
                    <Text className="font-geistSemiBold">1.</Text> Prepare yourself properly before starting.
                  </Text>
                  <Text className="text-gray-200 font-geistRegular text-sm mb-3">
                    <Text className="font-geistSemiBold">2.</Text> Speak clearly and keep your voice loud.
                  </Text>
                  <Text className="text-gray-200 font-geistRegular text-sm mb-3">
                    <Text className="font-geistSemiBold">3.</Text> Button Functions:
                  </Text>
                  <View className="ml-5">
                    <Text className="text-gray-200 font-geistRegular text-sm mb-2">- To start speaking, click the mic button in the center. Click it again to stop the recording.</Text>
                    <Text className="text-gray-200 font-geistRegular text-sm mb-2">- Click the "Next" button on the right to move to the next question. At the last question, click the button to end the mock interview.</Text>
                    <Text className="text-gray-200 font-geistRegular text-sm mb-2">- Click the "X" button on the left to repeat the current question. For example, if you're on question 4 and click the "X" button, it will repeat question 4, not from the beginning.</Text>
                  </View>
                </View>
                <Text className="text-gray-200 font-geistSemiBold text-sm mb-3">
                  Good Luck!
                </Text>
              </ScrollView>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setJob("");
                  router.push(`mockInterview/${selectedJob == "Another Job" ? anotherJob : selectedJob}`);
                }}
                className="bg-blue-500 py-3 rounded-md mt-4"
              >
                <Text className="text-white text-center font-geistBold">Got it!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="border border-white py-3 rounded-md mt-4"
              >
                <Text className="text-white text-center font-geistBold">Close!</Text>
              </TouchableOpacity>
            </Reanimated.View>
          </Reanimated.View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
