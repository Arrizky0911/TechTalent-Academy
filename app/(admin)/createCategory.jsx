import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  Keyboard,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetchData from "../../lib/useFetchData";
import {
  createCategories,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../lib/appwriteConfig";
import Loading from "../../components/Loading";
import ButtonTemplate from "../../components/ButtonTemplate";
import { router } from "expo-router";
import { icons } from "../../constants/";

const CategoryList = () => {
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const {
    data: categories,
    isLoading,
    setIsLoading,
    refetch,
  } = useFetchData(getAllCategories);

  const handleCreateCategory = async () => {
    Keyboard.dismiss();

    if (name.trim() === "") {
      setName("");
      return Alert.alert("Don't leave it empty Nigga");
    }
    setIsLoading(true);
    try {
      const newCategory = await createCategories(name);
      refetch();
    } catch (error) {
      Alert.alert("Error");
    } finally {
      setName("");
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    setIsLoading(true);
    try {
      await updateCategory(selectedCategory.$id, updatingName);
      refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const handleDeleteCategory = async () => {
    setIsLoading(true);
    try {
      await deleteCategory(selectedCategory?.$id);
      refetch();
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      className="bg-gray-800 border border-gray-600 py-2 px-4 rounded-lg m-2"
      onPress={() => {
        setModalVisible(true);
        setSelectedCategory(item);
        setUpdatingName(item?.category_name);
      }}
    >
      <Text className="text-white capitalize text-center">
        {item?.category_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-black flex-1 relative">
      {isLoading && (
        <Loading additionStyle="absolute h-full top-0 right-0 left-0 bg-black/70" />
      )}
      <TouchableOpacity
        className="mb-4 mt-5 mx-2"
        onPress={() => router.back()}
      >
        <Image source={icons.arrowLeft} className="w-8 h-8" tintColor="#fff" />
      </TouchableOpacity>

      <View className="mb-4 px-2">
        <TextInput
          className="bg-gray-800 text-white p-2 rounded-lg mb-2"
          placeholder="Category name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          className="bg-gray-700 py-2 px-4 rounded-lg"
          onPress={handleCreateCategory}
        >
          <Text className="text-white text-center">Create Category</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.$id}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-gray-800 p-4 rounded-lg w-4/5">
            <TextInput
              className="bg-gray-700 text-white p-2 rounded-lg mb-2"
              placeholder="Update category name"
              placeholderTextColor="gray"
              value={updatingName}
              onChangeText={setUpdatingName}
            />
            <TouchableOpacity
              className={`bg-gray-600 py-2 px-4 rounded-lg mb-2 ${
                isLoading ? "opacity-50" : ""
              }`}
              disabled={isLoading}
              onPress={handleUpdateCategory}
            >
              <Text className="text-white text-center">Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`bg-gray-600 py-2 px-4 rounded-lg mb-2 ${
                isLoading ? "opacity-50" : ""
              }`}
              disabled={isLoading}
              onPress={handleDeleteCategory}
            >
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`bg-gray-600 py-2 px-4 rounded-lg${
                isLoading ? "opacity-50" : ""
              }`}
              disabled={isLoading}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryList;
