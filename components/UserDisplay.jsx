import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const UserDisplay = ({ user }) => {
  return (
    <View className="absolute w-full top-[100px] px-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-white text-base font-geistMedium mb-1">
            {user?.username}
          </Text>
          {user?.profession ? (
            <Text className="text-white/80 text-xs font-geistRegular">
              {user?.profession}
            </Text>
          ) : (
            <View className="flex-row items-center">
              <Image
                source={icons.warning}
                resizeMode="contain"
                className="w-4 h-4 mr-2"
                tintColor="red"
              />
              <Text className="text-red-500 text-xs font-geistRegular">
                You haven't input your profession
              </Text>
            </View>
          )}
        </View>
        <Image
          source={{ uri: user?.avatar }}
          resizeMethod="cover"
          className="w-11 h-11 rounded-full"
        />
      </View>
    </View>
  );
};

export default UserDisplay;
