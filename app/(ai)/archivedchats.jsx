import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Modal, Pressable } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, ArchiveBoxIcon, TrashIcon } from "react-native-heroicons/outline";
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

const OptionDropdown = ({visible, onClose, onOptionSelect}) => (
    <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        animationType="fade"
    >
        <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50">
            <View className='bg-[#2A2A2A] rounded-lg w-40 overflow-hidden'>
                {["Edit", "Delete"].map((option, index) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onOptionSelect(option)}
                        className={`p-3 ${index !== 2 ? 'border-b border-gray-700' : ''}`}
                    >
                        <View className='flex-row items-center'>
                            {option === "Edit" && <PencilIcon size={18} color="white"/>}
                            {option === "Delete" && <TrashIcon size={18} color="white"/>}
                            <Text className='text-white ml-2 font-geistRegular'>{option}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Pressable>
    </Modal>
)

const ArchivedChats = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)

  const archivedItems = [
    { title: "Old project discussion", date: "2023" },
    { title: "Python vs JavaScript comparison", date: "2023" },
    { title: "How to optimize database queries", date: "2022" },
    { title: "Best practices for React Native", date: "2022" },
  ];

  const hadleOptionSelect = (option) => {
    console.log(`Selected option: ${option} for item ${selectedItemIndex}`)
    setSelectedItemIndex(null)
  }

  const renderArchivedItem = (item, index) => (
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
    <View className="flex-1 ">
      <BgImage />
      <SafeAreaView className="flex-1 mt-10">
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-geistMedium">Archived Chats</Text>
          <View style={{ width: 24 }} ></View> 
        </View>
        <ScrollView className="flex-1 px-4">
          <Text className="text-gray-400 text-xs font-geistRegular mb-4 text-center">
            Archive your most important conversations here.
          </Text>
          <DateHeader title="2023" />
          {archivedItems.slice(0, 2).map(renderArchivedItem)}
          <DateHeader title="2022" />
          {archivedItems.slice(2).map(renderArchivedItem)}
        </ScrollView>
      </SafeAreaView>
      <OptionDropdown
        visible={selectedItemIndex != null}
        onClose={() => setSelectedItemIndex(null)}
        onOptionSelect={hadleOptionSelect}
      />
    </View>
  );
};

export default ArchivedChats;
