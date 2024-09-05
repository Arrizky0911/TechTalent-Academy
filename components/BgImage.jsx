import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import { Image } from "react-native";

const BgImage = () => {
  return (
    <Image
      source={images.authBg}
      className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
    />
  );
};

export default BgImage;
