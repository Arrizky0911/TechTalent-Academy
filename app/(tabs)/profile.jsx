import React from "react";
import { allFormat, icons, images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import TextFields from "../../components/TextFields";
import ButtonTemplate from "../../components/ButtonTemplate";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { signOut } from "../../lib/appwriteConfig";
import { Redirect, router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { formatDate } = allFormat;

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.push("/sign-in");
  };

  if (!user) return <Redirect href="/sign-in" />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full">
        <ImageBackground
          source={images.authBg}
          className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
        />
        <View className="bg-frame absolute bottom-0 w-full h-[680px] rounded-t-3xl border-[1px] border-gray items-center">
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
                <Text className="text-[#6E6E6E] font-geistMedium">
                  {user.profession}
                </Text>
              ) : (
                <View className="flex-row items-center gap-x-1">
                  <Image
                    source={icons.warning}
                    resizeMode="contain"
                    className="w-[18px] h-[18px]"
                    tintColor="red"
                  />
                  <Text className="text-white/80 font-geistRegular">
                    You haven't input your profession
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* FORMS */}

          <View className="mt-[60px] px-6 w-full">
            <Text className="text-center text-white font-geistMedium mb-10">
              Created on {formatDate(user.$createdAt)}
            </Text>
            <View className="w-full mb-5">
              <Text className="text-[#f0efef] mb-2 font-geistRegular">
                Username
              </Text>
              <TextFields
                placeholder="Username"
                value={user.username}
                textInputClass="text-[#f0efef]"
                containerClass="h-12 border-[#f0efef]"
                editable={true}
              />
            </View>
            <View className="w-full mb-5">
              <Text className="text-[#f0efef] mb-2 font-geistRegular">
                Profession
              </Text>
              <TextFields
                placeholder="Profession"
                value={user.profession}
                textInputClass="text-[#f0efef]"
                containerClass="h-12 border-[#f0efef]"
                editable={true}
              />
            </View>
            <View className="w-full mb-5">
              <Text className="text-[#f0efef] mb-2 font-geistRegular">
                Email
              </Text>
              <TextFields
                placeholder="Username"
                value={user.email}
                textInputClass="text-gray-400"
                containerClass="h-12 border-[#f0efef]"
                editable={false}
              />
            </View>
            <Text className="text-center text-white font-geistMedium mt-5">
              Last modified on {formatDate(user.$updatedAt)}
            </Text>
            <ButtonTemplate text="Update" containerStyles="mt-4 py-3.5" />
            <ButtonTemplate
              text="Sign Out"
              containerStyles="mt-3 py-3.5 bg-gray"
              handlePress={logout}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
