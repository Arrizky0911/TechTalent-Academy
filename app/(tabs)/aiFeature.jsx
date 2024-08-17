import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { icons, images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import UserDisplay from "../../components/UserDisplay";
import BgImage from "../../components/BgImage";

const AiFeature = () => {
  const { user } = useGlobalContext();
  return (
    <SafeAreaView className="h-full relative">
      <BgImage />
      <UserDisplay user={user} />
      <View className="absolute bottom-0 w-full h-[690px] bg-[#151719] rounded-t-3xl items-center border-[1px] border-white/10">
        <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
        <Text className="text-center text-white font-geistMedium mt-[60px]">
          Ai Powered Tools that Will Help you in Your Career Development
        </Text>
        <View className="flex-row justify-center mt-[60px] gap-x-5">
          <TouchableOpacity
            className="h-[290px] w-[155px] bg-[#353535] rounded-xl px-3 py-6 justify-between"
            onPress={() => router.push("/chatbot")}
          >
            {/* AI LOGO and title */}
            <View className="space-y-3">
              {/* logo */}
              <View className="relative">
                <Image
                  source={icons.starThin}
                  tintColor="white"
                  className="w-6 h-6"
                  resizeMethod="contain"
                />
                <Image
                  source={icons.starThick}
                  tintColor="white"
                  className="w-3 h-3 absolute left-3.5 top-3.5"
                  resizeMethod="contain"
                />
              </View>

              <Text className="font-geistSemiBold text-lg text-white">
                Savior
              </Text>
            </View>
            <Text className="text-white text-[13px] font-geistRegular">
              AI chatbot that will help you in your career development
            </Text>
          </TouchableOpacity>
          <View className="h-[290px] w-[180px] justify-between">
            <TouchableOpacity 
              className="w-full h-[130px] bg-[#353535] rounded-2xl p-4 justify-between"
              onPress={() => router.push('hobby')}
              >
              <View className="flex-row items-center justify-between">
                <Image
                  source={icons.questionCircle}
                  tintColor="white"
                  className="w-5 h-5"
                  resizeMethod="contain"
                />
                <Text className="text-white font-geistSemiBold">Apostle</Text>
                <Image
                  source={icons.arrowUpRight}
                  tintColor="white"
                  className="w-5 h-5"
                  resizeMethod="contain"
                />
              </View>
              <View>
                <Text className="text-white font-geistRegular">
                  AI powered tools to find the roadmap of careers from your
                  hobby/interest
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="w-full h-[130px] bg-[#353535] rounded-2xl p-4 justify-between">
              <View className="flex-row items-center">
                <Image
                  source={icons.cursor}
                  tintColor="white"
                  className="w-5 h-5 mr-5"
                  resizeMethod="contain"
                />
                <Text className="text-white font-geistSemiBold">Judgement</Text>
              </View>
              <View>
                <Text className="text-white font-geistRegular">
                  AI tools for mock interviews with job-specific questions and
                  feedback.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AiFeature;
