import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import BgImage from "../../../components/BgImage";
import { useGlobalContext } from "../../../context/GlobalProvider";
import {
  loadUserSessions,
  setArchiveChatHistory,
} from "../../../lib/AstraDBConfig";
import useFetchData from "../../../lib/useFetchData";
import Loading from "../../../components/Loading";
import { images } from "../../../constants";

let header, display;

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
    <Pressable
      onPress={onClose}
      className="flex-1 justify-center items-center bg-black/50"
    >
      <View className="bg-[#2A2A2A] rounded-lg w-40 overflow-hidden">
        {["Edit", "Unarchive", "Delete"].map((option, index) => (
          <TouchableOpacity
            key={option}
            onPress={() => onOptionSelect(option)}
            className={`p-3 ${index !== 2 ? "border-b border-gray-700" : ""}`}
          >
            <View className="flex-row items-center">
              {option === "Edit" && <PencilIcon size={18} color="white" />}
              {option === "Unarchive" && (
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

const ArchivedChats = () => {
  const { user } = useGlobalContext();
  const {
    data: archivedHistorySessions,
    isLoading,
    refetch,
  } = useFetchData(() => loadUserSessions(user.$id, true));
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [date, setDate] = useState();
  const [isLoad, setIsLoad] = useState(false);

  const hadleOptionSelect = async (option) => {
    try {
      if (option === "Unarchive") {
        await setArchiveChatHistory(selectedItemIndex, "unarchived");
        Alert.alert("Message history has been unarchived");
        refetch();
      } else if (option === "Edit") {
        router.push(`/chatbot/${selectedItemIndex}`);
        refetch();
      } else if (option === "Delete") {
        await deleteMessage(selectedItemIndex);
        refetch();
      }
      setSelectedItemIndex(null);
    } catch (error) {
      console.error(error);
      throw new error();
    }
  };

  const renderArchivedItem = (item, index) => {
    let date = new Date(item.lastUpdate);
    let d;
    if (header) {
      d = dateDiffInDays(date, header);
    } else {
      d = 1;
    }
    if (d !== 0) {
      let now = new Date();
      let diff = dateDiffInDays(date ,now);
      if (diff == 0) {
        display = "Today";
      } else if (diff <= 1) {
        display = "Yesterday";
      } else if (diff <= 7) {
        display = "This Week";
      } else if (date.getFullYear == now.getFullYear && date.getMonth == now.getMonth) {
        display = "This Month";
      } else if (date.getFullYear == now.getFullYear) {
        display = "This Year";
      }
      header = date;
      index = 0;
    }
    return (
      <View key={item._id}>
        {index === 0 && <DateHeader title={display} />}
        <TouchableOpacity
          onPress={() => router.push(`/chatbot/${item._id}`)}
          className="mb-4"
        >
          <View className="flex-row justify-between items-center border border-[#3F454D] rounded-2xl p-4">
            <Text className="text-white font-geistRegular flex-1 mr-2">
              {item.header}
            </Text>
            <TouchableOpacity onPress={() => setSelectedItemIndex(item._id)}>
              <EllipsisVerticalIcon size={24} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 ">
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
            Archived Chats
          </Text>
          <View style={{ width: 24 }}></View>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          {archivedHistorySessions.length > 0 ? (
            <ScrollView className="flex-1 w-full">
              {archivedHistorySessions.map(renderArchivedItem)}
            </ScrollView>
          ) : (
            <View className="items-center">
              <Image
                source={images.archivedEmpty}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
              <Text className="text-gray-400 text-center mt-4 font-geistRegular">
                No chat archived yet. Start a conversation to archive your chat
                history here!
              </Text>
            </View>
          )}
        </View>
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
