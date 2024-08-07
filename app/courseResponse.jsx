import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const courseResponse = () => {
  const categories = ['Gaming', 'Gaming', 'Gaming', 'Gaming', 'Gaming']

  return (
    <SafeAreaView className="flex-1 bg-[#111315] p-4">
      <View className="flex-row items-center space-x-2 mb-4">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#6B7280"
          className="flex-1 bg-[#1e1e1e] py-3.5 px-12 h-[43px] rounded border border-[#6e6e6e] text-white font-geistRegular text-xs"
        />
      </View>
      {/* <ScrollView horizontal className="flex flex-row mb-4">
        {['Gaming', 'Gaming', 'Gaming', 'Gaming'].map((category, index) => (
          <TouchableOpacity
            key={index}
            className="py-2 px-2 h-[28px] mr-2 rounded-xl border border-[#6e6e6e] items-center justify-center"
          >
            <Text className="text-white">{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity className='py-[6.5px] px-7 mb-4 mr-2 rounded-xl border border-[#6e6e6e] items-center justify-center'>
              <Text className='text-white text-xs font-geistRegular'>{item} </Text>
            </TouchableOpacity>
            )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <ScrollView className="flex-1">
        {Array(4)
          .fill("")
          .map((_, index) => (
            <View key={index} className="bg-[#111315] p-4 mb-4 rounded-lg">
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                className="h-40 w-full rounded-lg mb-4"
              />
              <Text className="text-white text-xs font-geistSemiBold mb-1">
                C# Programming Specialization for Unity Game Development by
                Coursera
              </Text>
              
              <Text className="text-gray-500 text-xs font-geistMedium">University of Colorado</Text>
              <Text className="text-blue-400 text-xs font-geistMedium mt-1">12 Courses</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default courseResponse