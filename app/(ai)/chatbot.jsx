import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { router, usePathname } from "expo-router";
import BgImage from "../../components/BgImage";
import UserDisplay from "../../components/UserDisplay";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import BotTextFields from "../../components/BotTextFields";

const Chatbot = () => {
  const { user } = useGlobalContext();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full relative">
        <BgImage />
        <View className="mx-5 mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowLeft}
              className="w-7 h-7"
              resizeMethod="contain"
              tintColor="white"
            />
          </TouchableOpacity>
        </View>
        <UserDisplay user={user} />
        <View className="absolute -bottom-1 w-full h-[695px] bg-[#151719] rounded-t-3xl items-center border-[1px] border-white/10 px-5">
          <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
          <View>
            <View className="mt-[60px]">
              <Text className="text-white text-center text-xl font-geistMedium">
                Good Morning, {user.username} 👋
              </Text>
              <Text className="text-white text-center text-xl font-geistMedium">
                What can i do for u?
              </Text>
            </View>

            <View className="mx-5 mt-[60px] w-full items-center">
              <View className="flex-row w-full justify-center gap-x-4">
                <TouchableOpacity className="w-[170px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between">
                  <Image
                    source={icons.questionCircle}
                    className="w-6 h-6"
                    resizeMethod="contain"
                    tintColor="white"
                  />
                  <Text className="text-white text-sm">
                    What this bot can do?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-[170px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between">
                  <Image
                    source={icons.cursor}
                    className="w-6 h-6"
                    resizeMethod="contain"
                    tintColor="white"
                  />
                  <Text className="text-white text-sm">
                    How to use this bot?
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="w-[350px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between mt-4">
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
                <Text className="text-white text-sm">
                  Make a roadmap to become a fullstack web developer
                </Text>
              </TouchableOpacity>
              <Text className="text-xs text-white text-center font-geistRegular mt-10">
                This bot can make a mistake
              </Text>
            </View>
          </View>

          <BotTextFields
            outerClass="absolute bottom-[50px] px-3"
            containerClass="h-14"
            placeholder="Ask me anything..."
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
