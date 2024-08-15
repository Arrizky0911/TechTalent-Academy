import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useFetchData from "../../lib/useFetchData";
import { getCourseById } from "../../lib/appwriteConfig";

const CourseDetail = () => {
  const { id } = useLocalSearchParams();
  const { data: course } = useFetchData(() => getCourseById(id));

  const [activeTab, setActiveTab] = useState("overview");
  const [overviewWidth, setOverviewWidth] = useState(0);
  const [chatbotWidth, setChatbotWidth] = useState(0);
  const [overviewX, setOverviewX] = useState(0);
  const [chatbotX, setChatbotX] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetTeanslateX = activeTab === "overview" ? overviewX : chatbotX;
    Animated.spring(translateX, {
      toValue: targetTeanslateX,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, overviewX, chatbotX]);

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute mt-14 left-4 z-10 p-2 rounded-full"
      >
        <AntDesign name="arrowleft" size={24} color="#fff" />
      </TouchableOpacity>

      <View className="h-[245px] w-full relative">
        <Image
          source={{ uri: course?.thumbnail_url }}
          className="h-full w-full"
          resizeMethod="contain"
        />
        <View className="bg-black/50 h-full w-full absolute top-0 bottom-0"></View>
      </View>
      <View
        style={{ marginTop: -28 }}
        className="px-8 py-6 bg-[#111315] flex-1 border-[1px] border-black/50 rounded-tr-xl rounded-tl-xl"
      >
        <Text className="text-white text-xl font-geistBold">
          {course.title}
        </Text>
        <Text className="text-[#737373] text-xs font-geistMedium mt-4">
          {course.description}
        </Text>
        <View className="mt-16 mb-4">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setActiveTab("overview")}
              onLayout={(event) => {
                const { width, x } = event.nativeEvent.layout;
                setOverviewWidth(width);
                setOverviewX(x);
              }}
              className={`px-4 py-2`}
            >
              <Text
                className={`font-geistSemiBold ${
                  activeTab === "overview" ? "text-white" : "text-white/60"
                }`}
              >
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("chatbot")}
              onLayout={(event) => {
                const { width, x } = event.nativeEvent.layout;
                setChatbotWidth(width);
                setChatbotX(x);
              }}
              className={`px-4 py-2`}
            >
              <Text
                className={`font-geistSemiBold ${
                  activeTab === "chatbot" ? "text-white" : "text-white/60"
                }`}
              >
                ChatBot
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 4 }}>
            <Animated.View
              style={{
                height: 2,
                backgroundColor: "white",
                width: activeTab === "overview" ? overviewWidth : chatbotWidth,
                transform: [{ translateX }],
              }}
            />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {activeTab === "overview" ? (
            <View className="items-start h-full">
              <Text className="font-geistRegular text-white text-sm leading-4">
                {course.summary}
              </Text>
            </View>
          ) : (
            <View className="flex-row gap-10 justify-center items-center ">
              <View className="w-20 h-20 p-2 bg-white rounded-[100px] justify-center items-center">
                <Image
                  source={{ uri: "https://via.placeholder.com/42x42" }}
                  className=" self-center w-[42px] h-[42px]"
                />
              </View>
              <View>
                <Text className="text-white  text-sm font-geistSemiBold">
                  Any question u wanna ask?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("../../(ai)/chatbot")}
                  className="bg-[#2a86ff] rounded-lg px-10 py-2 mt-4"
                >
                  <Text className="text-white font-geistSemiBold text-xs">
                    Go to Chatbot now!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CourseDetail;