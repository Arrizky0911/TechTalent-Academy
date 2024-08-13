import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const BotTextFields = ({
  outerClass,
  containerClass,
  textStyles,
  value,
  handleChange,
  handleSubmit,
  placeholder,
  editable,
}) => {
  return (
    <View className={`w-full items-center flex-row ${outerClass}`}>
      <View
        className={`border-white/10 border-[1px] w-full h-10 rounded-xl flex-row flex-1 items-center px-4 ${containerClass}`}
      >
        <TextInput
          value={value}
          onChangeText={handleChange}
          className={
            "flex-1 w-full text-white font-geistRegular" + ` ${textStyles}`
          }
          placeholder={placeholder}
          placeholderTextColor="#3F454D"
          editable={editable}
        />

        <TouchableOpacity onPress={handleSubmit}>
          <Image
            source={icons.paperPlane}
            className="w-6 h-6"
            resizeMethod="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BotTextFields;