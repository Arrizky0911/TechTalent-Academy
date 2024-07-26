import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const TextFields = ({ placeholder, type, otherClass, handleChange, value }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`w-full relative flex-row items-center ${otherClass}`}>
      <View className="border-gray border-[1px] w-full h-10 rounded-xl flex-row flex-1 items-center px-4">
        <TextInput
          value={value}
          onChangeText={handleChange}
          className="flex-1"
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={type === "password" && !showPassword}
        />

        {type === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextFields;
