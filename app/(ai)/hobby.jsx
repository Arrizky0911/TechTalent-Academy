import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Hobby = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {};

  return (
    <SafeAreaView className="flex-1 bg-[#111315]  p-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-geistBold mb-4">
          Find course
        </Text>
        <Text className="text-gray-400 mb-8 text-xs text-center font-geistRegular">
          Find tutorial Lorem ipsum description dari find tutorial
        </Text>

        <TextInput
          className="bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border border-[#6e6e6e] rounded mb-4 w-full"
          placeholder="Input here"
          placeholderTextColor="gray"
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </View>
      <View className="bottom-[0.1%] left-0 right-0">
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
        >
          <Text className="text-white text-center font-geistSemiBold">
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-[#6e6e6e] py-3 px-6 rounded-md w-full"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-geistSemiBold">
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Hobby;
