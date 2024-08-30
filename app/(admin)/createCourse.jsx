import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { icons } from "../../constants";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import useFetchData from "../../lib/useFetchData";
import { createCourses, getAllCategories } from "../../lib/appwriteConfig";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import Loading from "../../components/Loading";
import font from '../../assets/fonts/Geist-Regular.ttf'

const CreateCourse = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { data: categories, refetch } = useFetchData(getAllCategories);

  const formatedCategory = categories?.map((category) => {
    const { $id, category_name } = category;
    return { key: $id, value: category_name };
  });

  const [form, setForm] = useState({
    name: "",
    thumbnail: null,
    video: null,
    prompt: "",
    description: "",
    summary: "",
  });

  const openPicker = async (selectType) => {
    setIsPublishing(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          selectType === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (selectType === "image") {
          setForm({ ...form, thumbnail: result.assets[0] });
        }

        if (selectType === "video") {
          setForm({ ...form, video: result.assets[0] });
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleChangeText = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const publish = async () => {
    setIsPublishing(true);
    try {
      await createCourses({ ...form, categories: selectedCategories });
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setIsPublishing(false);
      router.replace("/");
    }
  };

  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="bg-[#111315] h-full relative py-16">
        {isPublishing && (
          <Loading additionStyle="absolute h-full w-full z-[1000] bg-black/50" />
        )}
        <View className="flex-row w-full ml-5 items-center space-x-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowLeft}
              className="w-6 h-6"
              tintColor="#fff"
            />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-geistSemiBold">
            Upload Course
          </Text>
        </View>
        <ScrollView className="px-4 my-6">
          <View className="flex flex-row w-auto gap-2">

          <View className="flex-1">
            <Text className="text-white font-geistRegular mb-2">Video Title</Text>
            <TextInput
              className="border border-[#6B7280] font-geistRegular h-12 text-white p-3 w-auto rounded-lg"
              placeholder="Give your video a title"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => handleChangeText("name", value)}
              value={form.name}
            />
          </View>
          <View className="flex-1 font-geistRegular">
          <Text className="text-white font-geistRegular mb-2">Video Category</Text>
            <MultipleSelectList
              data={formatedCategory}
              save="key"
              setSelected={(val) => setSelectedCategories(val)}
              onSelect={() => console.log(selectedCategories)}
              label="Categories"
              labelStyles={{ color: "white" }}
              boxStyles={{
                borderColor: "#6B7280",
                borderWidth: 1,
                height: 48
              }}
              placeholder="Select Categories"
              inputStyles={{ color: "white" }}
              dropdownStyles={{ backgroundColor: "black" }}
              dropdownItemStyles={{
                
              }}
              dropdownTextStyles={{ color: "white", fontFamily: '' }}
              badgeStyles={{ backgroundColor: "#3B82F6" }}
              badgeTextStyles={{ color: "white" }}
              checkBoxStyles={{
                backgroundColor: "white",
                borderColor: "white",
              }}
            />
          </View>
          </View>
          <View className="mt-6">
            <Text className="text-white font-geistRegular mb-2">Description</Text>
            <TextInput
              className="border border-[#6B7280] font-geistRegular h-12 text-white p-3 w-auto rounded-lg"
              placeholder="Describe your video"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => handleChangeText("description", value)}
              value={form.description}
            />
          </View>

          <View className="mt-6">
            <Text className="text-white font-geistRegular mb-2">Summary</Text>
            <TextInput
              className="border border-[#6B7280] font-geistRegular h-12 text-white p-3 w-auto rounded-lg"
              placeholder="Summarize your video"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => handleChangeText("summary", value)}
              value={form.summary}
              multiline
            />
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-base font-geistRegular text-white font-medium">
              Upload Video
            </Text>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  resizeMode={ResizeMode.COVER}
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl "
                  useNativeControls
                  isLooping
                />
              ) : (
                <View className="w-full h-40 px-4 rounded-2xl border border-[#6B7280] border-dashed justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-gray-600 justify-center items-center"></View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-7 space-y-2">
            <Text className="text-base font-geistRegular text-white font-medium">
              Thumbnail Image
            </Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl "
                />
              ) : (
                <View className="w-full h-16 px-4 rounded-2xl justify-center items-center border border-[#6B7280] flex-row space-x-2">
                  <Text className="text-sm text-gray-300 font-geistRegular">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="text-white font-geistRegular mb-2">AI Prompt</Text>
            <TextInput
              className="border border-[#6B7280] font-geistRegular text-[#6B7280] p-3 rounded-lg"
              placeholder="The prompt you used to create this video"
              placeholderTextColor="gray"
              onChangeText={(value) => handleChangeText("prompt", value)}
              value={form.prompt}
            />
          </View>

          

          <TouchableOpacity
            className="mt-7 bg-blue-600 p-4 rounded-lg"
            onPress={publish}
          >
            <Text className="text-white font-geistSemiBold text-center font-semibold">
              Submit & Publish
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateCourse;
