import React, { useCallback, useState } from "react";
import { allFormat, icons, images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import TextFields from "../../components/TextFields";
import ButtonTemplate from "../../components/ButtonTemplate";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { getCurrentUser, signOut, updateUser } from "../../lib/appwriteConfig";
import { Redirect, router, useFocusEffect } from "expo-router";
import BgImage from "../../components/BgImage";
import Loading from "../../components/Loading";
import * as ImagePicker from "expo-image-picker";
import { ID } from "react-native-appwrite";

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading, setIsLoading } =
    useGlobalContext();

  const { formatDate } = allFormat;

  const [form, setForm] = useState({
    avatar: null,
    username: user?.username,
    profession: user?.profession,
  });

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      console.log(user?.avatar);
      setUser(currentUser);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const avatarAssets = result.assets[0];

      const assetId = avatarAssets.assetId || ID.unique();
      const fileName = avatarAssets.uri.split("/").pop();
      const mimeType = fileName.split(".").pop();

      setForm({
        ...form,
        avatar: { ...avatarAssets, assetId, fileName, mimeType },
      });
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    if (!form.username || !form.profession)
      return Alert.alert("Please fill in all the fields");

    try {
      const asset = form.avatar
        ? form
        : { username: form.username, profession: form.profession };

      const response = await updateUser(user.$id, asset, user.$permissions);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      if (error.message === "AppwriteException: Network request failed") {
        Alert.alert("");
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Redirect href="/sign-in" />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full relative">
        {isLoading && (
          <Loading additionStyle="absolute h-full w-full z-[1000] bg-black/70" />
        )}
        <BgImage />
        <View className="bg-frame absolute bottom-0 w-full h-[680px] rounded-t-3xl border-[1px] border-gray items-center">
          <View className="bg-[#2c2c2c] w-[365px] h-[85px] rounded-3xl absolute -top-10 px-5 flex-row items-center space-x-4">
            <TouchableOpacity
              className="w-[50px] h-[50px] rounded-full ml-1"
              onPress={openPicker}
            >
              <Image
                className="w-full h-full rounded-full"
                resizeMode="cover"
                source={{
                  uri: !form.avatar ? user?.avatar : form.avatar.uri,
                }}
              />
            </TouchableOpacity>
            <View className="items-start gap-y-2">
              <Text className="text-white text-md font-geistMedium">
                {user?.username}
              </Text>
              {user?.profession ? (
                <Text className="text-white/70 font-geistMedium">
                  {user?.profession}
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
              Created on {formatDate(user?.$createdAt)}
            </Text>
            <View className="w-full mb-5">
              <Text className="text-[#f0efef] mb-2 font-geistRegular">
                Username
              </Text>
              <TextFields
                placeholder="Username"
                value={form.username}
                handleChange={(e) => setForm({ ...form, username: e })}
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
                value={form.profession}
                handleChange={(e) => setForm({ ...form, profession: e })}
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
                value={user?.email}
                textInputClass="text-gray-400"
                containerClass="h-12 border-[#f0efef]"
                editable={false}
              />
            </View>
            <Text className="text-center text-white font-geistMedium mt-5">
              Last modified on {formatDate(user?.$updatedAt)}
            </Text>
            <ButtonTemplate
              text="Update"
              containerStyles="mt-4 py-3.5"
              handlePress={handleUpdate}
            />
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
