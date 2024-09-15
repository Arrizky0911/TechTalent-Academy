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
import React, { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { searchHobby } from "../../../lib/hobbyAI";
import useFetchData from "../../../lib/useFetchData";
import Loading from "../../../components/Loading";
import { icons } from "../../../constants";
import { images } from "../../../constants";

const RoadmapResponse = () => {
  const { hobby } = useLocalSearchParams();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const animationOpacity = useSharedValue(1);
  const animationScale = useSharedValue(1);
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    headerTranslateY.value = withSpring(0);
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

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

  const renderRoadmapStep = (subject, description, index, total) => (
    <View key={index} className="flex-row mb-3">
      <View className="mr-3 items-center">
        <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white font-geistBold text-xs">{index + 1}</Text>
        </View>
        {index < total - 1 && (
          <View className="w-0.5 h-full bg-blue-500 absolute top-6 left-1/2 -translate-x-1/2" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-white font-geistSemiBold text-sm mb-1">
          {subject}
        </Text>
        <Text className="text-gray-400 font-geistRegular text-xs">
          {description}
        </Text>
      </View>
    </View>
  );

  const getModalHeight = () => {
    if (!selectedRoadmap) return '50%';
    const stepCount = selectedRoadmap.length;
    if (stepCount <= 2) return '40%';
    if (stepCount <= 4) return '60%';
    return '85%';
  };

  return (
    <View className="flex-1 bg-[#111315] relative">
      {isLoading && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
      <Animated.View style={headerAnimatedStyle} className="p-6 mt-4">
        <Text className="text-white text-xl font-geistSemiBold">
          | Study Planning
        </Text>
        <Text className="text-gray-400 text-xs mt-2 font-geistRegular">
          A study planning that helps you reach your career
        </Text>
      </Animated.View>

      <ScrollView className="flex-1 p-6 bg-[#30353c] rounded-t-2xl w-full h-full">
        <Animated.View entering={FadeIn.delay(300).duration(1000)}>
          <Text className="text-[#d9d9d9] text-xs font-geistRegular">
            Your hobby:
          </Text>
          <Text className="text-white text-xl font-geistBold mt-1 mb-4">
            {hobby}
          </Text>
        </Animated.View>

        {!jobs || jobs.length < 1 ? (
          <Animated.View 
            entering={FadeInDown.delay(500).duration(1000)}
            className="items-center justify-center h-[65vh]"
          >
            <Image
              source={images.noFoundHobby}
              tintColor="#a8aaac"
              className="w-full h-auto mr-2 mb-4"
              resizeMode="contain"
            />
            <Text className="font-geistRegular  text-[#a8aaac] text-center">
              We're sorry, but we couldn't find any IT jobs related to your hobby.
            </Text>
          </Animated.View>
        ) : (
          jobs?.map(({ name, path }, index) => {
            return (
              <Animated.View 
                key={index} 
                entering={FadeInDown.delay(300 + index * 100).duration(500)}
                style={{ marginBottom: 16 }}
              >
                <TouchableOpacity
                  className="bg-[#111315]/50 rounded-lg border border-[#6B7280] p-4"
                  onPress={() => toggleAccordion(name, path)}
                >
                  <Text className="text-white font-geistSemiBold text-sm">
                    {name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
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
        <Animated.View 
          entering={FadeIn.duration(300)}
          className="flex-1 justify-center items-center bg-black/70"
        >
          <Animated.View 
            entering={FadeInUp.springify()}
            className={`bg-[#111315] rounded-xl w-[95%] p-4`}
            style={{ height: getModalHeight() }}
          >
            <Text className="text-white font-geistSemiBold text-lg mb-3">
              Roadmap for {activeAccordion}
            </Text>
            <ScrollView className="flex-1">
              {selectedRoadmap &&
                selectedRoadmap.map((step, idx) =>
                  renderRoadmapStep(
                    step.subject,
                    step.description,
                    idx,
                    selectedRoadmap.length
                  )
                )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-500 py-2 px-4 rounded-md mt-3"
            >
              <Text className="text-white text-center font-geistSemiBold text-sm">
                Close
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
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
