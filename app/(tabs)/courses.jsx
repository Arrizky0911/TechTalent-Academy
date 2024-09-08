import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchData from "../../lib/useFetchData";
import { getAllCategories } from "../../lib/appwriteConfig";
import Loading from "../../components/Loading";

const Courses = () => {
  const { data: categories } = useFetchData(getAllCategories);

  if (!categories) return <Loading />;

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/courseResponse/${searchInput}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]  p-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-geistBold mb-4">
          Find course
        </Text>
        <Text className="text-gray-400 mb-8 text-xs text-center font-geistRegular">
          Unlock the digital realm! Dive into cutting-edge IT courses and level up your tech skills today.
        </Text>

        <TextInput
          className="bg-[#1e1e1e] text-white font-geistRegular p-2 pl-4 border border-[#6e6e6e] rounded mb-4 w-full"
          placeholder="Input here"
          placeholderTextColor="gray"
          value={searchInput}
          onChangeText={setSearchInput}
        />

        <View className="w-full mx-2 flex-wrap flex-row gap-2 max-h-[200px] justify-between">
          {categories.map((category, index) => {
            if (index < 6) {
              return (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/courseResponse/${category.category_name}`)
                  }
                  key={category.$id}
                  className="w-[180px] border-[1px] border-[#6e6e6e] rounded-xl py-2"
                >
                  <Text className="text-[#d9d9d9] text-xs font-geistRegular text-center">
                    {category.category_name}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>

        {/* <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px]  rounded-xl mr-2">
            <Text className="font-geistRegular text-xs text-[#d9d9d9] text-center">
              {categories[0].category_name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full ">
            <Text className="font-geistRegular text-[#d9d9d9] text-xs text-center ">
              {categories[1].category_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full mr-2">
            <Text className="font-geistRegular text-[#d9d9d9] text-xs text-center ">
              {categories[2].category_name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] rounded-xl">
            <Text className="font-geistRegular text-xs text-[#d9d9d9] text-center">
              {categories[3].category_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row mx-2 w-full">
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px]  rounded-xl mr-2">
            <Text className="font-geistRegular text-xs text-[#d9d9d9] text-center">
              {categories[4].category_name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border border-[#6e6e6e] h-8 py-[6.5px] px-14 rounded-xl w-full ">
            <Text className="font-geistRegular text-[#d9d9d9] text-xs text-center ">
              {categories[5].category_name}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View className=" bottom-20 left-0 right-0">
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
        >
          <Text className="text-white text-center font-geistSemiBold">
            Search
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity className="border border-[#6e6e6e] py-3 px-6 rounded-md w-full">
          <Text className="text-white text-center font-geistSemiBold">Back</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Courses;
