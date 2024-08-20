import { View, ActivityIndicator, Text } from "react-native";
import React from "react";

const Loading = ({ additionStyle }) => {
  return (
    <View
      className={`h-full w-full top-0 z-50 items-center justify-center bg-black ${additionStyle}`}
    >
      <ActivityIndicator color="#fff" size="90px" />
      <Text className="text-white text-sm font-geistMedium mt-5">
        Please Wait
      </Text>
    </View>
  );
};

export default Loading;
