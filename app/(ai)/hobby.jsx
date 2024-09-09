import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";

const Hobby = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    router.push(`hobby/${searchInput}`)
  };
  const hobbies = [
    "Drawing",
    "Reading",
    "Playing Game",
    "Playing Sports",
    "Playing Music",
    "Hiking"
  ]


  return (
    <SafeAreaView className="flex-1 bg-[#111315]  p-4">
      <View className="mx-2 mt-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowLeft}
              className="h-6 w-6 mt-10"
              resizeMethod="contain"
              tintColor="white"
            />
          </TouchableOpacity>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-geistBold mb-4">
          Hobby/Interest
        </Text>
        <Text className="text-gray-400 mb-8 text-xs text-center font-geistRegular">
          Input what you interested in, so we can know what position is suitable
          for you
        </Text>

        <TextInput
          className="bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border-white/40 border-[1px] h-10 rounded-xl mb-4 w-full"
          placeholder="Input here"
          placeholderTextColor="gray"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <View className="w-full mx-2 flex-wrap flex-row gap-2 max-h-[200px] justify-between">
          {hobbies.map((hobbie, key) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  setSearchInput(hobbie)
                }
                key={key}
                className="w-[45%] border-[1px] border-[#6e6e6e] rounded-xl py-2"
              >
                <Text className="text-[#d9d9d9] text-xs font-geistRegular text-center">
                  {hobbie}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View className="bottom-[0.1%] left-0 right-0">
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
          disabled={searchInput ? false : true}
        >
          <Text 
            className="text-white text-center font-geistSemiBold"
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Hobby;
