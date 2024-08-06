import React from "react";
import { allFormat, icons, images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import TextFields from "../../components/TextFields";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

const Profile = () => {
  const { user, setUser } = useGlobalContext();
  const { formatDate } = allFormat;

  console.log(user);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full">
        <ImageBackground
          source={images.authBg}
          className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
        />
        <View className="bg-frame absolute bottom-0 w-full h-[660px] rounded-t-3xl border-[1px] border-gray items-center">
          <View className="bg-[#2c2c2c] w-[365px] h-[85px] rounded-3xl absolute -top-10 px-5 flex-row items-center space-x-4">
            <View className="w-[50px] h-[50px] rounded-full overflow-hidden ml-1">
              <Image
                className="w-full h-full rounded-full"
                resizeMode="cover"
                source={{ uri: user.avatar }}
              />
            </View>
            <View className="items-start gap-y-2">
              <Text className="text-white text-md font-geistMedium">
                {user.username}
              </Text>
              {user.profession ? (
                <Text className="text-[#6E6E6E]">{user.profession}</Text>
              ) : (
                <View className="flex-row items-center gap-x-1">
                  <Image
                    source={icons.warning}
                    resizeMode="contain"
                    className="w-[18px] h-[18px]"
                    tintColor="red"
                  />
                  <Text className="text-white/80">
                    You haven't input your profession
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* FORMS */}

          <View className="mt-[60px] px-6 w-full space-y-5">
            <Text className="text-center text-white">
              Created on {formatDate(user.$createdAt)}
            </Text>
            <View className="w-full">
              <Text className="text-[#f0efef] mb-2">Username</Text>
              <TextFields
                placeholder="Username"
                value={user.username}
                textInputClass="text-[#f0efef]"
                containerClass="h-12 border-[#f0efef]"
                editable={true}
              />
            </View>
            <View className="w-full">
              <Text className="text-[#f0efef] mb-2">Profession</Text>
              <TextFields
                placeholder="Profession"
                value={user.profession}
                textInputClass="text-[#f0efef]"
                containerClass="h-12 border-[#f0efef]"
                editable={true}
              />
            </View>
            <View className="w-full">
              <Text className="text-[#f0efef] mb-2">Email</Text>
              <TextFields
                placeholder="Username"
                value={user.email}
                textInputClass="text-gray-400"
                containerClass="h-12 border-[#f0efef]"
                editable={false}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
