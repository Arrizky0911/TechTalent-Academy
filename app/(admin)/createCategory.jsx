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
  const [showInput, setShowInput] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: categories,
    isLoading,
    setIsLoading,
    refetch,
  } = useFetchData(getAllCategories);

  const handleCreateCategory = async () => {
    Keyboard.dismiss();
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert("Error", "Category name cannot be empty");
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert("Error", "Category name must be at least 3 characters long");
      return;
    }

    if (categories.some(cat => cat.category_name.toLowerCase() === trimmedName.toLowerCase())) {
      Alert.alert("Error", "A category with this name already exists");
      return;
    }

    setIsLoading(true);
    try {
      await createCategories(trimmedName);
      refetch();
      setName("");
    } catch (error) {
      Alert.alert("Error", "Failed to create new category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    const trimmedName = updatingName.trim();

    if (!trimmedName) {
      Alert.alert("Error", "Category name cannot be empty");
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert("Error", "Category name must be at least 3 characters long");
      return;
    }

    if (categories.some(cat => 
      cat.category_name.toLowerCase() === trimmedName.toLowerCase() && 
      cat.$id !== selectedCategory.$id
    )) {
      Alert.alert("Error", "A category with this name already exists");
      return;
    }

    setIsLoading(true);
    try {
      await updateCategory(selectedCategory.$id, trimmedName);
      refetch();
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update category");
    } finally {
      setIsLoading(false);
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
      className={`rounded-2xl m-1 p-4 flex-1 aspect-square justify-center items-center ${
        selectedId === item.$id ? 'bg-white' : 'bg-[#353535]'
      }`}
      onPress={() => {
        setModalVisible(true);
        setSelectedCategory(item);
        setUpdatingName(item?.category_name);
        setSelectedId(item.$id);
        setShowInput(false); 
      }}
    >
      <Text className={`capitalize text-center text-sm font-geistRegular ${
        selectedId === item.$id ? 'text-[#353535]' : 'text-white'
      }`}>
        {item?.category_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-black flex-1">
      {isLoading && (
        <Loading additionStyle="absolute h-full top-0 right-0 left-0 bg-black/70" />
      )}
      <View className="flex-row items-center justify-center font-geistMedium p-4 mt-8">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-4">
          <Image source={icons.arrowLeft} className="w-6 h-6" tintColor="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg text-center font-geistSemiBold">Course Category</Text>
      </View>

      <Text className="text-gray-400 text-xs text-center font-geistRegular px-4 mb-4">
        Manage course category for this app.
        Click one of the course category to edit or delete.
      </Text>

      <FlatList
        data={[...categories, { id: 'add', category_name: 'Add Category' }]}
        renderItem={({ item }) => 
          item.id === 'add' ? (
            <TouchableOpacity
              className={`rounded-2xl m-1 p-4 flex-1 aspect-square justify-center items-center ${
                showInput ? 'bg-white' : 'bg-[#353535]'
              }`}
              onPress={() => {
                setShowInput(true);
                setSelectedId(null);
              }}
            >
              <Text className={`text-start text-sm font-geistRegular ${
                showInput ? 'text-[#353535]' : 'text-white'
              }`}>
                 {item.category_name}
              </Text>
            </TouchableOpacity>
          ) : renderCategoryItem({ item })
        }
        keyExtractor={(item) => item.$id || item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      />

      {showInput && (
        <View className="absolute bottom-0 left-0 right-0 bg-black p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-sm font-geistMedium">Add New Category</Text>
            <TouchableOpacity onPress={() => setShowInput(false)}>
            </TouchableOpacity>
          </View>
          <TextInput
            className=" text-white p-2 px-4 border border-gray-600 rounded-lg mb-2 text-sm font-geistRegular"
            placeholder="Input category name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-[#353535] py-2 px-4 rounded-lg flex-1 mr-2"
              onPress={() => {
                setShowInput(false);
                setSelectedId(null);
              }}
            >
              <Text className="text-white text-center text-sm font-geistRegular">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-600 py-2 px-4 rounded-lg flex-1 ml-2"
              onPress={() => {
                handleCreateCategory();
                setShowInput(false);
                setSelectedId(null); 
              }}
            >
              <Text className="text-white text-center text-sm font-geistRegular">Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#111315] rounded-xl p-5 w-[80%] max-w-[300px]">
            <Text className="text-white text-lg font-geistSemiBold mb-4">Edit Category</Text>
            <TextInput
              className="border border-gray-600 text-white p-3 rounded-lg mb-4 text-sm font-geistRegular"
              placeholder="Update category name"
              placeholderTextColor="gray"
              value={updatingName}
              onChangeText={setUpdatingName}
            />
            <View className="flex-row justify-between mb-3">
              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-lg flex-1 mr-2"
                onPress={handleUpdateCategory}
              >
                <Text className="text-white text-center text-sm font-geistMedium">Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded-lg flex-1 ml-2"
                onPress={handleDeleteCategory}
              >
                <Text className="text-white text-center text-sm font-geistMedium">Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-gray-700 py-2 px-4 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center text-sm font-geistMedium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryList;
