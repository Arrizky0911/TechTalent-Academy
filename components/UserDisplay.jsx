import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const UserDisplay = ({ user}) => {
  return (
    <View className={"absolute flex-row w-full top-[8%] justify-between"}>
      <View className="flex-row items-center ml-5">
        <Image
          source={{ uri: user?.avatar }}
          resizeMethod="cover"
          className="w-11 h-11 rounded-full"
        />
        <View className="ml-3">
          <Text className="text-white text-[16px] font-geistMedium mb-1">
            {user.username}
          </Text>
          <View>
            {user?.profession ? (
              <Text className="text-white/80 text-[13px] font-geistRegular">
                {user?.profession}
              </Text>
            ) : (
              <View className="flex-row gap-x-2 items-center">
                <Image
                  source={icons.warning}
                  resizeMode="contain"
                  className="w-[16px] h-[16px]"
                  tintColor="red"
                />
                <Text className="text-white/80 text-[13px] font-geistRegular">
                  You haven't input your profession
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserDisplay;
