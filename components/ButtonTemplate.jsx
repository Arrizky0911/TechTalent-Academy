import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ButtonTemplate = ({ containerStyles, textStyles, handlePress, text }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-secondary items-center py-2 rounded ${containerStyles}`}
    >
      <Text
        className={`font-geistSemiBold text-white text-[16px] ${textStyles}`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonTemplate;
