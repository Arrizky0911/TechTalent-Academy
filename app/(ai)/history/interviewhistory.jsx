import React, {useState} from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Modal, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'react-native-heroicons/outline';
import Animated, { FadeIn } from 'react-native-reanimated';
import useFetchData from '../../../lib/useFetchData';
import { deleteInterviewResult, loadAllInterviews } from '../../../lib/AstraDBConfig';
import Loading from '../../../components/Loading';
import { useGlobalContext } from '../../../context/GlobalProvider';

const getResultColor = (result) => {
  switch (result) {
    case 'Very good': return 'text-green-500';
    case 'Terrible': return 'text-red-500';
    case 'Need an improvement': return 'text-yellow-500';
    default: return 'text-gray-400';
  }
};

const OptionDropdown = ({ visible, onClose, onOptionSelect}) => (
  <Modal
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-[#2A2A2A] rounded-lg w-40 overflow-hidden">
        {["See", "Delete"].map((option, index) => (
          <TouchableOpacity
            key={option}
            onPress={() => onOptionSelect(option)}
            className={`p-3 ${index !== 2 ? "border-b border-gray-700" : ""}`}
          >
            <View className="flex-row items-center">
              {option === "See" && <PencilIcon size={18} color="white" />}
              {option === "Delete" && <TrashIcon size={18} color="white" />}
              <Text className="text-white ml-2 font-geistRegular">{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Pressable>
  </Modal>
);


const InterviewHistory = () => {
  const {user} = useGlobalContext();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItemJob, setSelectedItemJob] = useState(null);
  const {data: interviewHistorySessions, isLoading , refetch} = useFetchData(() => loadAllInterviews(user.$id))
  const [isLoad, setIsLoad] = useState(false);
  
  const InterviewHistoryItem = ({ title, result, id }) => (
    <Animated.View 
      entering={FadeIn.duration(300)}
      className="border border-[#3F454D] rounded-2xl p-4 mb-3"
    >
      <TouchableOpacity
      onPress={() => {
        let parameter = {
          questions: {},
          answers: {},
          isNew: "history",
          session: id
        }
        router.push({ pathname: `mockFeedback/${title}`, params: parameter });
      }}
      className="z-10">

      <View 
        className="flex-row justify-between items-center">
        <Text className="text-white font-geistMedium text-base">{title} Interview</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedItemIndex(id);
            setSelectedItemJob(title);
          }}
          className="z-12">
          <EllipsisVerticalIcon size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-gray-400 font-geistRegular text-xs mt-2">Your results: 
          <Text className={`${getResultColor(result)} text-xs mt-1`}> {result}</Text>        
      </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const handleOptionSelect = async (option) => {
    setIsLoad(true);
    try {
      if (option === "See") {
        let parameter = {
          questions: {},
          answers: {},
          isNew: "history",
          session: selectedItemIndex
        }
        router.push({ pathname: `mockFeedback/${selectedItemJob}`, params: parameter });
        refetch();

      } else if (option === "Delete") {
        await deleteInterviewResult(selectedItemIndex);
        refetch();
      }
    } catch (error) {
      console.error(error);
      throw new error;
      
    } finally {
      setSelectedItemIndex(null);
      setSelectedItemJob(null);
      setIsLoad(false);
    }
  };

  return (
    <View className="flex-1 bg-[#111315]">
      {(isLoading || isLoad) && (
            <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
        )}
      <View className="px-4 mt-16 pb-4 flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.push("main/mockLanding")} className="left-4 z-10">
          <ArrowLeftIcon size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-geistBold flex-1 text-center">Interview History</Text>
      </View>
      
      <SafeAreaView className="flex-1 mt-10">
        <View className="flex-row justify-between items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-geistMedium">Chat History</Text>
          <TouchableOpacity onPress={() => router.push("/history/archivedchats")}>
            <ArchiveBoxIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          {interviewHistorySessions.length > 0 ? (
            <ScrollView className="flex-1 w-full">
              {interviewHistorySessions.map(renderHistoryItem)}
            </ScrollView>
          ) : (
            <View className="items-center">
              <Image
                source={images.chatHistoryEmpty}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
              <Text className="text-gray-400 text-center mt-4 font-geistRegular">
                No chat history yet. Start a conversation to see your history here!
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

export default InterviewHistory;
