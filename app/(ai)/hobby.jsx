import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

const Hobby = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    router.push(`hobby/${searchInput}`);
  };
  const hobbies = [
    "Drawing",
    "Reading",
    "Playing Game",
    "Playing Sports",
    "Playing Music",
    "Hiking",
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#111315]  p-4">
      <Animated.View
        entering={FadeIn.delay(100).duration(800)}
        className="mx-2 mt-3"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.arrowLeft}
            className="h-6 w-6 mt-10"
            resizeMethod="contain"
            tintColor="white"
          />
        </TouchableOpacity>
      </Animated.View>
      <View className="flex-1 items-center justify-center">
        <Animated.Text
          entering={FadeInDown.delay(200).duration(800).springify()}
          className="text-white text-2xl font-geistBold mb-4"
        >
          Hobby/Interest
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(300).duration(800).springify()}
          className="text-gray-400 mb-8 text-xs text-center font-geistRegular"
        >
          Input what you interested in, so we can know what position is suitable
          for you
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(400).duration(800).springify()}
          className="w-full"
        >
          <TextInput
            className="bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border-white/40 border-[1px] h-10 rounded-xl mb-4 w-full"
            placeholder="Input here"
            placeholderTextColor="gray"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(500).duration(800).springify()}
          className="w-full flex-row flex-wrap justify-between gap-y-2"
        >
          {hobbies.map((hobby, key) => (
            <Animated.View
              key={key}
              entering={FadeInUp.delay(600 + key * 50)
                .duration(800)
                .springify()}
              className="w-[48%]"
            >
              <TouchableOpacity
                onPress={() => setSearchInput(hobby)}
                className="border-[1px] border-[#6e6e6e] rounded-xl py-2 px-2"
              >
                <Text className="text-[#d9d9d9] text-xs font-geistRegular text-center">
                  {hobby}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </View>
      <Animated.View
        entering={FadeInUp.delay(700).duration(800).springify()}
        className="bottom-[0.1%] left-0 right-0"
      >
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
          disabled={searchInput ? false : true}
        >
          <Text className="text-white text-center font-geistSemiBold">
            Search
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Hobby;
