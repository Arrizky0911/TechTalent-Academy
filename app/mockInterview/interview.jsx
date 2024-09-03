import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // pastikan Anda sudah menginstal expo-linear-gradient
import { FontAwesome } from "@expo/vector-icons"; // pastikan Anda sudah menginstal @expo/vector-icons
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

const Interview = () => {
  const router = useRouter()

  return (
    <ImageBackground
      source={require('./bgmock.png')} // Ensure the path is correct to your bgmock.png
      style={{ flex: 1 }}
       resizeMode= 'cover'
    >
    <SafeAreaView className="bg-[#111315] h-full w-full flex pt-16">
      {/* Header */}
<View className='flex-row justify-between '>
  <TouchableOpacity className='ml-6' onPress={() => router.back()}>
    <AntDesign name="arrowleft" size={24} color="white" />
  </TouchableOpacity>
  <View className='flex-1 mr-8'>
    <Text className="text-white text-center text-xl font-geistBold mb-10">
      Mock Interview
    </Text>
  </View>
</View>
      <Text className="text-white text-center font-geistSemiBold text-base mt-3">
        Front-End Developer Job Mock Interview
      </Text>

      <View className="flex flex-row justify-center items-end mr-16 ml-3">
        {/* Profile Photo */}
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} 
          className="  w-10 h-10 rounded-full border-2 ml-8 border-white"
        />
        {/* Question Card */}
        <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
          <Text className="text-white font-geistRegular text-xs">
            What type of front-end development do you specialize in?
          </Text>
          <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">1 of 10</Text>
        </View>
      </View>

      {/* Timer Circle */}
      <View className="mt-20 mb-10 items-center ">
        <LinearGradient
          colors={["#3b5998", "#192f6a"]}
          className="h-48 w-48 rounded-full border border-gray-200 items-center justify-center"
        >
          <Text className="text-white font-geistRegular text-xl">02.00</Text>
        </LinearGradient>
      </View>

      {/* Control Buttons */}
      <View className="flex-1"></View>
      <View className="flex-row justify-center w-full mb-10">
        <TouchableOpacity className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
          <FontAwesome name="microphone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push('mockInterview/mockFeedback')}
          className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
          <FontAwesome name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default Interview;
