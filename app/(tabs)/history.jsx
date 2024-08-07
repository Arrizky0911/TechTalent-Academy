import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const History = () => {
  return (
    <SafeAreaView className="bg-frame h-full relative">
      <View className="absolute top-0 h-[90px] w-full bg-frame border-b-[0.5px] border-b-white/60 justify-end py-3 px-5 z-90">
        <Text className="text-white font-geistBold text-2xl">History</Text>
      </View>
    </SafeAreaView>
  );
};

export default History;
