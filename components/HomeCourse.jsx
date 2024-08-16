import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const CourseCardHome = ({ item }) => (
  <TouchableOpacity
    className="ml-2 mr-5 bg-home-course w-[180px] h-[210px] my-2 rounded-2xl p-3 overflow-hidden relative shadow-[0_35px_60px_-15px_rgba(200,0,0,0.7)]"
    onPress={() => router.push(`courseDetail/${item.$id}`)}
  >
    <View className="w-full h-[120px] rounded-xl overflow-hidden relative">
      <Image
        className="w-full h-full rounded-md"
        source={{ uri: item.thumbnail_url }}
        resizeMode="cover"
      />
      <View className="bg-home-course/50 w-full h-full absolute top-0 bottom-0 right-0 left-0"></View>
    </View>
    <View className="my-3">
      <Text
        numberOfLines={2}
        className="text-white text-[13px] font-geistSemiBold"
      >
        {item.title}
      </Text>
    </View>
  </TouchableOpacity>
);

const HomeCourse = ({ data, title }) => {
  return (
    <View className="ml-4">
      <Text className="text-white capitalize font-geistSemiBold text-lg">
        {title}
      </Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.$id}
        renderItem={(item) => <CourseCardHome item={item.item} />}
        contentOffset={{ x: 10 }}
      />
    </View>
  );
};

export default HomeCourse;
