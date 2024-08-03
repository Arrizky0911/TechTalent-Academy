import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";

const Home = () => {
  return (
    <SafeAreaView className="bg-frame h-full relative">
      <View className="h-[200px] w-full bg-black rounded-b-[20px] absolute top-0"></View>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
};

export default Home;
