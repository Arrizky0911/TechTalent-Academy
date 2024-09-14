import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeftIcon, EllipsisVerticalIcon } from 'react-native-heroicons/outline';
import Animated, { FadeIn } from 'react-native-reanimated';

const interviewData = [
  { id: '1', title: 'AI Researcher Interview', result: 'Terrible' },
  { id: '2', title: 'UI UX Developer Interview', result: 'Good' },
  { id: '3', title: 'Backend Developer Interview', result: 'Need Improvement' },
];

const getResultColor = (result) => {
  switch (result) {
    case 'Good': return 'text-green-500';
    case 'Terrible': return 'text-red-500';
    case 'Need Improvement': return 'text-yellow-500';
    default: return 'text-gray-400';
  }
};

const InterviewHistoryItem = ({ title, result }) => (
  <Animated.View 
    entering={FadeIn.duration(300)}
    className="border border-[#3F454D] rounded-2xl p-4 mb-3"
  >
    <View className="flex-row justify-between items-center">
      <Text className="text-white font-geistMedium text-base">{title}</Text>
      <TouchableOpacity>
        <EllipsisVerticalIcon size={20} color="white" />
      </TouchableOpacity>
    </View>
    <Text className="text-gray-400 font-geistRegular text-xs mt-2">Your results: 
        <Text className={`${getResultColor(result)} text-xs mt-1`}> {result}</Text>        
    </Text>
  </Animated.View>
);

const InterviewHistory = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-4 mt-16 pb-4 flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="left-4">
          <ArrowLeftIcon size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-geistBold flex-1 text-center">Interview History</Text>
      </View>
      
      <FlatList
        data={interviewData}
        renderItem={({ item }) => <InterviewHistoryItem title={item.title} result={item.result} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

export default InterviewHistory;
