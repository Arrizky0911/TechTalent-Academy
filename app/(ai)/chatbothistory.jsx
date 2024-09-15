import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, Modal, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon, EllipsisVerticalIcon, ArchiveBoxIcon, PencilIcon, TrashIcon } from "react-native-heroicons/outline";
import {icons} from "../../constants";
import BgImage from "../../components/BgImage";

const DateHeader = ({ title }) => (
  <View className="flex-row items-center my-4">
    <View className="flex-1 h-[1px] bg-gray-600" />
    <View className=" px-5 py-2 border border-gray-600 rounded-full">
      <Text className="text-white font-geistRegular">{title}</Text>
    </View>
    <View className="flex-1 h-[1px] bg-gray-600" />
  </View>
);

const OptionDropdown = ({ visible, onClose, onOptionSelect }) => (
  <Modal
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-[#2A2A2A] rounded-lg w-40 overflow-hidden">
        {["Edit", "Archive", "Delete"].map((option, index) => (
          <TouchableOpacity
            key={option}
            onPress={() => onOptionSelect(option)}
            className={`p-3 ${index !== 2 ? "border-b border-gray-700" : ""}`}
          >
            <View className="flex-row items-center">
              {option === "Edit" && <PencilIcon size={18} color="white" />}
              {option === "Archive" && <ArchiveBoxIcon size={18} color="white" />}
              {option === "Delete" && <TrashIcon size={18} color="white" />}
              <Text className="text-white ml-2 font-geistRegular">{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Pressable>
  </Modal>
);

const EditModal = ({ visible, onClose, onSave, initialTitle }) => {
  const [newTitle, setNewTitle] = useState(initialTitle);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#2A2A2A] rounded-2xl w-5/6 p-6">
          <Text className="text-white text-xl font-geistMedium mb-4">Edit Chat History</Text>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            className="border border-[#3F454D] text-white p-3 rounded-lg mb-4 font-geistRegular"
            placeholderTextColor="#9CA3AF"
            placeholder="Enter new title"
          />
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="mr-4">
              <Text className="text-gray-400 font-geistMedium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSave(newTitle)}>
              <Text className="text-blue-500 font-geistMedium">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const ChatHistory = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [historyItems, setHistoryItems] = useState([
    { title: "Make a roadmap to become a fullstack web developer", date: "Today" },
    { title: "How to make my first website?", date: "Today" },
    { title: "How to use this bot?", date: "Today" },
    { title: "Gimme a simple C++ code", date: "Today" },
    { title: "Make a roadmap to become a fullstack web developer", date: "7 Days" },
    { title: "How to make my first website?", date: "7 Days" },
    { title: "Give me a list of the best programming language in 2024", date: "7 Days" },
    { title: "Gimme a simple C++ code", date: "7 Days" },
  ]);

  const handleOptionSelect = (option) => {
    if (option === "Edit") {
      setEditModalVisible(true);
    } else {
      console.log(`Selected option: ${option} for item ${selectedItemIndex}`);
    }
  };

  const handleSaveEdit = (newTitle) => {
    if (selectedItemIndex !== null) {
      setHistoryItems(prevItems => 
        prevItems.map((item, index) => 
          index === selectedItemIndex ? { ...item, title: newTitle } : item
        )
      );
    }
    setEditModalVisible(false);
    setSelectedItemIndex(null);
  };

  const renderHistoryItem = (item, index) => (
    <View key={index} className="mb-4">
      <View className="flex-row justify-between items-center border border-[#3F454D] rounded-2xl p-4">
        <Text className="text-white font-geistRegular flex-1 mr-2">{item.title}</Text>
        <TouchableOpacity onPress={() => setSelectedItemIndex(index)}>
          <EllipsisVerticalIcon size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <BgImage />
      <SafeAreaView className="flex-1 mt-10">
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-geistMedium">Chat History</Text>
          <TouchableOpacity onPress={() => router.push("/archivedchats")}>
            <ArchiveBoxIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="px-4 py-2">
          <Text className="text-gray-400 text-xs text-center font-geistRegular">
            View your chat history. Tap a chat to continue or use the options menu to edit, archive, or delete.
          </Text>
        </View>
        <ScrollView className="flex-1 px-4">
          <DateHeader title="Today" />
          {historyItems.filter(item => item.date === "Today").map((item, index) => renderHistoryItem(item, index))}
          <DateHeader title="7 Days" />
          {historyItems.filter(item => item.date === "7 Days").map((item, index) => renderHistoryItem(item, index + historyItems.filter(i => i.date === "Today").length))}
        </ScrollView>
      </SafeAreaView>
      <OptionDropdown
        visible={selectedItemIndex !== null}
        onClose={() => setSelectedItemIndex(null)}
        onOptionSelect={handleOptionSelect}
      />
      <EditModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
        }}
        onSave={handleSaveEdit}
        initialTitle={selectedItemIndex !== null ? historyItems[selectedItemIndex].title : ""}
      />
    </View>
  );
};

export default ChatHistory;