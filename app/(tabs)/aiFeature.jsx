import { View, Text, SafeAreaView, ImageBackground } from "react-native";
import React from "react";
import { images } from "../../constants";

const AiFeature = () => {
  return (
    <SafeAreaView className="h-full relative">
      <ImageBackground
        source={images.authBg}
        className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
      />
    </SafeAreaView>
  );
};

export default AiFeature;
