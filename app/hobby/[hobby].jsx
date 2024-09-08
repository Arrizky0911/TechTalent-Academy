import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { searchHobby } from "../../lib/AIConfig";
import useFetchData from "../../lib/useFetchData";
import Loading from "../../components/Loading";
import { icons } from "../../constants";
import { images } from "../../constants";

const RoadmapResponse = () => {
  const { hobby } = useLocalSearchParams();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const animationOpacity = useSharedValue(1);
  const animationScale = useSharedValue(1);
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const jobsData = await searchHobby(hobby);
      setJobs(jobsData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    fetchJobs();
  }, []);

  const toggleAccordion = (accordion, path) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (activeAccordion === accordion) {
      setActiveAccordion(null);
      closeAnimation();
    } else {
      setActiveAccordion(accordion);
      openAnimation();
      setSelectedRoadmap(path); 
      setModalVisible(true); 
    }
  };

  const openAnimation = () => {
    animationOpacity.value = withTiming(1, { duration: 400 });
    animationScale.value = withSpring(1, { damping: 12 });
  };

  const closeAnimation = () => {
    animationOpacity.value = withTiming(0, { duration: 300 });
    animationScale.value = withTiming(0.95, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animationOpacity.value,
      transform: [
        {
          scale: animationScale.value,
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-[#111315] relative">
      {isLoading && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
      <View className="p-6 mt-4">
        <Text className="text-white text-xl font-geistSemiBold">
          | Study Planning
        </Text>
        <Text className="text-gray-400 text-xs mt-2 font-geistRegular">
          A study planning that helps you reach your career
        </Text>
      </View>

      <ScrollView className="flex-1 p-6 bg-[#30353c] rounded-t-2xl w-full h-full">
        <View>
          <Text className="text-[#d9d9d9] text-xs font-geistRegular">
            Your hobby:
          </Text>
          <Text className="text-white text-xl font-geistBold mt-1 mb-4">
            {hobby}
          </Text>
        </View>

        {!jobs || jobs.length < 1 ? (
          <View className="items-center justify-center h-[65vh]">
            <Image
              source={images.noFoundHobby}
              tintColor="#a8aaac"
              className="w-full h-auto mr-2 mb-4"
              resizeMode="contain"
            />
            <Text className="font-geistRegular  text-[#a8aaac] text-center">
              We're sorry, but we couldn't find any IT jobs related to your hobby.
            </Text>
          </View>
        ) : (
          jobs?.map(({ name, path }, index) => {
            return (
              <View key={index} style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  className="bg-[#111315]/50 rounded-lg border border-[#6B7280] p-4"
                  onPress={() => toggleAccordion(name, path)}
                >
                  <Text className="text-white font-geistSemiBold text-sm">
                    {name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal for Roadmap Content */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className="bg-[#111315] rounded-xl w-[90%] p-6">
            <Text className="text-white font-geistSemiBold text-lg mb-4">
              Roadmap Details
            </Text>
            <ScrollView>
              {selectedRoadmap &&
                selectedRoadmap.map(({ subject, description }, idx) => (
                  <View key={idx} className="mb-4">
                    <Text className="text-white font-geistSemiBold text-sm">
                      {subject}
                    </Text>
                    <Text className="text-gray-400 font-geistRegular text-xs mt-2">
                      {description}
                    </Text>
                  </View>
                ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-500 py-2 px-4 rounded-md mt-4"
            >
              <Text className="text-white text-center font-geistSemiBold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Done Button */}
      <TouchableOpacity
        onPress={() => router.push(`aiFeature`)}
        className="bg-blue-500 py-3 px-6 mb-4 mx-6 absolute bottom-0 left-0 right-0 rounded-md"
        style={{ opacity: modalVisible ? 0.5 : 1 }}
      >
        <Text className="text-white text-center font-geistSemiBold">Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoadmapResponse;
