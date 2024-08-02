import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ButtonTemplate = ({
  containerStyles,
  textStyles,
  handlePress,
  text,
  disable,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-button-main items-center py-2 rounded ${containerStyles}`}
      disabled={disable}
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
