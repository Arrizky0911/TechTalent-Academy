import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../../constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const Hobby = () => {
  const [searchInput, setSearchInput] = useState("");
  const animationProgress = useSharedValue(0);

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

  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 200 });
  }, []);

  const getAnimatedStyle = (index) => {
    return useAnimatedStyle(() => {
      const delay = index * 100;
      const opacity = withDelay(delay, withTiming(animationProgress.value));
      const translateY = withDelay(
        delay,
        withTiming(20 - 20 * animationProgress.value)
      );
      return {
        opacity,
        transform: [{ translateY }],
      };
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315] p-4">
      <Animated.View style={getAnimatedStyle(0)} className="mx-2 mt-3">
        <TouchableOpacity onPress={() => router.push("aiFeature")}>
          <Image
            source={icons.arrowLeft}
            className="h-6 w-6"
            resizeMethod="contain"
            tintColor="white"
          />
        </TouchableOpacity>
      </Animated.View>
      <View className="flex-1 items-center justify-center">
        <Animated.Text
          style={getAnimatedStyle(1)}
          className="text-white text-2xl font-geistBold mb-4"
        >
          Hobby/Interest
        </Animated.Text>
        <Animated.Text
          style={getAnimatedStyle(2)}
          className="text-gray-400 mb-8 text-xs text-center font-geistRegular"
        >
          Input what you interested in, so we can know what position is suitable
          for you
        </Animated.Text>

        <Animated.View style={getAnimatedStyle(3)} className="w-full">
          <TextInput
            className="bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border-white/40 border-[1px] h-10 rounded-xl mb-4 w-full"
            placeholder="Input here"
            placeholderTextColor="gray"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </Animated.View>
        <View className="w-full flex-row flex-wrap justify-between gap-y-2">
          {hobbies.map((hobby, key) => (
            <Animated.View
              key={key}
              style={getAnimatedStyle(4 + key)}
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
        </View>
      </View>
      <Animated.View
        style={getAnimatedStyle(10)}
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
