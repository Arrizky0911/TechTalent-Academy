import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { images } from "../constants";

const BgImage = () => {
  return (
    <ImageBackground
      source={images.authBg}
      className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
    />
  );
};

export default BgImage;
