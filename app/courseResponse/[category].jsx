import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { Link, router, useLocalSearchParams } from "expo-router";
import useFetchData from "../../lib/useFetchData";
import { getAllCategories, searchCategories } from "../../lib/appwriteConfig";
import { images } from "../../constants";

const CourseResponse = () => {
  const { category } = useLocalSearchParams();
  const { data: categories } = useFetchData(getAllCategories);
  const { data, refetch } = useFetchData(() => searchCategories(category));
  const datass = data.map((item) => item.courses)[0];

  console.log(category);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await refetch();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315] p-4">
      <View className="flex-row items-center space-x-2 mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.arrowLeft}
            className="h-4 w-4 rounded-full"
            resizeMethod="contain"
            tintColor="white"
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          value={category}
          placeholderTextColor="#6B7280"
          className="flex-1 bg-[#1e1e1e] py-3.5 px-12 h-[43px] rounded border border-[#6e6e6e] text-white font-geistRegular text-xs"
        />
      </View>
      {/* <ScrollView horizontal className="flex flex-row mb-4">  
        {['Gaming', 'Gaming', 'Gaming', 'Gaming'].map((category, index) => (
          <TouchableOpacity
            key={index}
            className="py-2 px-2 h-[28px] mr-2 rounded-xl border border-[#6e6e6e] items-center justify-center"
          >
            <Text className="text-white">{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity className="py-[6.5px] px-7 mb-4 mr-2 rounded-xl border border-[#6e6e6e] items-center justify-center">
              <Text className="text-white text-xs font-geistRegular capitalize">
                {item.category_name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.$id}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4 font-geistMedium">Mencari kursus...</Text>
        </View>
      ) : !datass || datass.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={images.noFound}
            className="w-64 h-64 mb-4"
            resizeMode="contain"
          />
          <Text className="text-white text-lg font-geistSemiBold mb-2">Oops! Course not found</Text>
          <Text className="text-gray-400 text-center font-geistRegular">
            We're so sorry, but we couldn't find any courses that match your search.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {datass.map((item) => {
            return (
              <TouchableOpacity
                key={item.$id}
                className="bg-[#111315] p-4 mb-4 rounded-lg"
                onPress={() => router.push(`courseDetail/${item.$id}`)}
              >
                <Image
                  source={{ uri: item.thumbnail_url }}
                  className="h-40 w-full rounded-lg mb-4"
                />
                <Text className="text-white text-xs font-geistSemiBold mb-1">
                  {item.title}
                </Text>
                <View className="mt-4 flex-row justify-between">
                  <Text className="text-gray-500 text-xs font-geistMedium">
                    University of Colorado
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CourseResponse;
