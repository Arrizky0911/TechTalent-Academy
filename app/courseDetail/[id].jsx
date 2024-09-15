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
import {
  getCourseById,
  getCurrentUser,
  updateHistory,
} from "../../lib/appwriteConfig";
import icons from "../../constants/icons";
import { Video as VideoAV, ResizeMode } from "expo-av";

import { useGlobalContext } from "../../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";

const CourseDetail = () => {
  const videoElement = useRef(null);

  const { id } = useLocalSearchParams();
  const {
    data: course,
    isLoading,
    setIsLoading,
  } = useFetchData(() => getCourseById(id));
  const { user, setUser } = useGlobalContext();

  const [isPlay, setIsPlay] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [overviewWidth, setOverviewWidth] = useState(0);
  const [chatbotWidth, setChatbotWidth] = useState(0);
  const [overviewX, setOverviewX] = useState(0);
  const [chatbotX, setChatbotX] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const titleSlideAnim = useRef(new Animated.Value(50)).current;
  const descSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(descSlideAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const targetTeanslateX = activeTab === "overview" ? overviewX : chatbotX;
    Animated.spring(translateX, {
      toValue: targetTeanslateX,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, overviewX, chatbotX]);

  const handleUpdate = async () => {
    setIsPlay(true);
    const histories = user.courses_history.filter((cour) => id !== cour.$id);
    histories.push(course);

    const updatedHistory = {
      courses_history: histories,
    };
    try {
      updateHistory(user.$id, updatedHistory, user.$permissions);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#111315] relative">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-[5%] left-4 z-10 p-2 rounded-full"
      >
        <AntDesign name="arrowleft" size={24} color="#fff" />
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="h-[220px] w-full relative items-center justify-center"
      >
        {isPlay ? (
          <View className="w-full h-full bg-black relative items-center justify-center">
            <VideoAV
              ref={videoElement}
              source={{
                uri: course.video_url,
              }}
              className="w-full h-full bg-black"
              resizeMode={ResizeMode.CONTAIN}
              onError={(err) => console.error(err)}
              shouldPlay
              useNativeControls={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setIsPlay(false);
                }
              }}
            />
            <TouchableOpacity
              className={`absolute z-[100] bottom-3 right-3 ${
                isLoading ? "opacity-50" : ""
              }`}
              onPress={async () => {
                setIsLoading(true);
                try {
                  await videoElement.current.presentFullscreenPlayer();
                } catch (error) {
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              <Image
                source={icons.fullScreen}
                tintColor="#fff"
                className="w-5 h-5"
                resizeMethod="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: course?.thumbnail_url }}
              className="h-full w-full"
              resizeMethod="contain"
            />
            <View className="bg-black/60 h-full w-full absolute top-0 bottom-0"></View>
            {!isLoading && (
              <TouchableOpacity
                className="bg-white/50 w-[60px] h-[60px] rounded-full absolute justify-center items-center"
                onPress={handleUpdate}
              >
                <Image
                  source={icons.play}
                  tintColor="white"
                  className="ml-1 w-9 h-9"
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="py-6 bg-[#111315] flex-1 border-t-[1px] border-t-black/30"
      >
        <Animated.Text
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: titleSlideAnim }],
          }}
          className="text-white text-xl font-geistBold mx-8"
        >
          {course.title}
        </Animated.Text>
        <Animated.Text
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: descSlideAnim }],
          }}
          className="text-[#737373] text-xs font-geistMedium mt-4 mx-8"
        >
          {course.description}
        </Animated.Text>
        <View className="mt-16 mb-4">
          <View className="flex-row w-full">
            <TouchableOpacity
              onPress={() => setActiveTab("overview")}
              onLayout={(event) => {
                const { width, x } = event.nativeEvent.layout;
                setOverviewWidth(width);
                setOverviewX(x);
              }}
              className={`py-2 w-1/2`}
            >
              <Text
                className={`font-geistSemiBold text-center ${
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
              className={`py-2 w-1/2`}
            >
              <Text
                className={`font-geistSemiBold text-center ${
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
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: descSlideAnim }],
              }}
              className="items-start h-full px-6"
            >
              <Text className="font-geistRegular text-white text-sm leading-4">
                {course.summary}
              </Text>
            </Animated.View>
          ) : (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: descSlideAnim }],
              }}
              className="flex-row gap-10 justify-center items-center"
            >
              <View className="w-20 h-20 p-2 rounded-[100px] justify-center items-center">
                <Image
                  source={images.logo}
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
            </Animated.View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default CourseDetail;
