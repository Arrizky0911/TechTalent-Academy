import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import useFetchData from "../../lib/useFetchData";
import { getCurrentUser } from "../../lib/appwriteConfig";
import { set } from "date-fns";

const HistoryCard = ({ course }) => (
  <TouchableOpacity
    className="w-full h-[120px] p-3 justify-center"
    onPress={() => router.push(`courseDetail/${course.$id}`)}
  >
    <View className="flex-row gap-x-6">
      <View className="w-28 h-20 overflow-hidden rounded-xl relative">
        <Image
          source={{ uri: course.thumbnail_url }}
          className="w-full h-full"
          resizeMethod="cover"
        />
        <View className="absolute w-full h-full top-0 bottom-0 bg-black/30"></View>
      </View>
      <View className="flex-1 py-2">
        <Text
          className="text-white font-geistSemiBold w-full"
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <Text
          className="text-[#6d6d6d] text-xs font-geistSemiBold w-full mt-0.5"
          numberOfLines={2}
        >
          {course.description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const History = () => {
  const { user, setUser } = useGlobalContext();

  const { courses_history: history } = user;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView className="bg-frame h-full relative">
      <View className="top-0 h-[50px] w-full bg-frame border-b-[0.5px] border-b-white/60 justify-end py-3 px-5 z-90">
        <Text className="text-white font-geistBold text-2xl">History</Text>
      </View>
      {history && (
        <FlatList
          data={history}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => {
            return <HistoryCard course={item} />;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default History;
