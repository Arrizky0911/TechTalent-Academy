import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  PencilIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { icons, images } from "../../../constants";
import BgImage from "../../../components/BgImage";
import { useGlobalContext } from "../../../context/GlobalProvider";
import useFetchData from "../../../lib/useFetchData";
import {
  deleteMessage,
  loadUserSessions,
  setArchiveChatHistory,
} from "../../../lib/AstraDBConfig";
import Loading from "../../../components/Loading";

let header = undefined;

const DateHeader = ({ title }) => (
  <View className="flex-row items-center my-4">
    <View className="flex-1 h-[1px] bg-gray-600" />
    <View className=" px-5 py-2 border border-gray-600 rounded-full">
      <Text className="text-white font-geistRegular">{title}</Text>
    </View>
    <View className="flex-1 h-[1px] bg-gray-600" />
  </View>
);

const OptionDropdown = ({ visible, onClose, onOptionSelect, isArchived }) => (
  <Modal
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable
      onPress={onClose}
      className="flex-1 justify-center items-center bg-black/50"
    >
      <View className="bg-[#2A2A2A] rounded-lg w-40 overflow-hidden">
        {["Edit", isArchived, "Delete"].map((option, index) => (
          <TouchableOpacity
            key={option}
            onPress={() => onOptionSelect(option)}
            className={`p-3 ${index !== 2 ? "border-b border-gray-700" : ""}`}
          >
            <View className="flex-row items-center">
              {option === "Edit" && <PencilIcon size={18} color="white" />}
              {option === isArchived && (
                <ArchiveBoxIcon size={18} color="white" />
              )}
              {option === "Delete" && <TrashIcon size={18} color="white" />}
              <Text className="text-white ml-2 font-geistRegular">
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Pressable>
  </Modal>
);

const ChatHistory = () => {
  const { user } = useGlobalContext();
  const {
    data: userHistorySessions,
    isLoading,
    refetch,
  } = useFetchData(() => loadUserSessions(user.$id));
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isSessionArchived, setIsSessionArchived] = useState("");
  const [isLoad, setIsLoad] = useState(false);

  const handleOptionSelect = async (option) => {
    setIsLoad(true);
    try {
      if (option === "Archive") {
        await setArchiveChatHistory(selectedItemIndex, "archived");
        Alert.alert("Message has been archived");
      } else if (option === "Unarchive") {
        await setArchiveChatHistory(selectedItemIndex, "unarchived");
        Alert.alert("Message has been unarchived");
      } else if (option === "Edit") {
        router.push(`/chatbot/${selectedItemIndex}`);
        refetch();
      } else if (option === "Delete") {
        await deleteMessage(selectedItemIndex);
        refetch();
      }
    } catch (error) {
      console.error(error);
      throw new error();
    } finally {
      setSelectedItemIndex(null);
      setIsLoad(false);
    }
  };

  const renderHistoryItem = (item, index) => {
    if (item.lastUpdate !== header) {
      header = item.lastUpdate;
      index = 0;
    }
    return (
      <View key={item._id}>
        {index === 0 && <DateHeader title={item.lastUpdate} />}

        <TouchableOpacity
          onPress={() => router.push(`/chatbot/${item._id}`)}
          className="mb-4"
        >
          <View className="flex-row justify-between items-center border border-[#3F454D] rounded-2xl p-4">
            <Text className="text-white font-geistRegular flex-1 mr-2">
              {item.header}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedItemIndex(item._id);
                setIsSessionArchived(
                  item.status === "archived" ? "Unarchive" : "Archive"
                );
              }}
            >
              <EllipsisVerticalIcon size={24} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {(isLoading || isLoad) && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
      <BgImage />
      <SafeAreaView className="flex-1 mt-10">
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-geistMedium">
            Chat History
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/history/archivedchats")}
          >
            <ArchiveBoxIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          {userHistorySessions.length > 0 ? (
            <ScrollView className="flex-1 w-full">
              {userHistorySessions.map(renderHistoryItem)}
            </ScrollView>
          ) : (
            <View className="items-center">
              <Image
                source={images.chatHistoryEmpty}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
              <Text className="text-gray-400 text-center mt-4 font-geistRegular">
                No chat history yet. Start a conversation to see your history
                here!
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
      <OptionDropdown
        visible={selectedItemIndex !== null}
        onClose={() => setSelectedItemIndex(null)}
        onOptionSelect={handleOptionSelect}
        isArchived={isSessionArchived}
      />
    </View>
  );
};

export default ChatHistory;
