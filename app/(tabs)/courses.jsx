import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Courses = () => {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    console.log("Navigating to courseResponse with:", searchInput); // Debugging statement
    if (searchInput.trim()) {
      navigation.navigate("pages", { courseName: searchInput });
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-[#111315]  p-4'>
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

        <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px]  rounded-xl mr-2"
          >
            <Text className='font-geistRegular text-xs text-[#d9d9d9] text-center'>Gaming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full "
          >
            <Text className='font-geistRegular text-[#d9d9d9] text-xs text-center '>Game Developer</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full mr-2"
          >
            <Text className='font-geistRegular text-[#d9d9d9] text-xs text-center '>Game Developer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] rounded-xl"
          >
            <Text className='font-geistRegular text-xs text-[#d9d9d9] text-center'>Gaming</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px]  rounded-xl mr-2"
          >
            <Text className='font-geistRegular text-xs text-[#d9d9d9] text-center'>Gaming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full "
          >
            <Text className='font-geistRegular text-[#d9d9d9] text-xs text-center '>Game Developer</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className=" bottom-20 left-0 right-0">
        <TouchableOpacity 
          onPress={handleSearch}
          className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full">
          <Text className="text-white text-center font-geistSemiBold">Search</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity className="border border-[#6e6e6e] py-3 px-6 rounded-md w-full">
          <Text className="text-white text-center font-geistSemiBold">Back</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Courses;
