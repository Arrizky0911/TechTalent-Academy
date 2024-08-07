import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const TextFields = ({
  placeholder,
  type,
  otherClass,
  handleChange,
  value,
  textInputClass,
  containerClass,
  editable,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`w-full relative flex-row items-center ${otherClass}`}>
      <View
        className={`border-white/50 border-[1px] w-full h-10 rounded-xl flex-row flex-1 items-center px-4 ${containerClass}`}
      >
        <TextInput
          value={value}
          onChangeText={handleChange}
          className={"flex-1 text-white font-geistRegular" + ` ${textInputClass}`}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={type === "password" && !showPassword}
          editable={editable}
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
