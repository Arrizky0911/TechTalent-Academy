import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
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

const RoadmapResponse = () => {
  const { hobby } = useLocalSearchParams();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const animationOpacity = useSharedValue(1); // manage opacity
  const animationScale = useSharedValue(1); // manage scale
  // const { data: jobs } = useFetchData(() => searchHobby(hobby));
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

  const toggleAccordion = (accordion) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth expansion and collapse

    if (activeAccordion === accordion) {
      setActiveAccordion(null);
      closeAnimation();
    } else {
      setActiveAccordion(accordion);
      openAnimation();
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
              source={icons.sadEmo}
              tintColor="#a8aaac"
              className="w-[150px] h-[150px] mr-2 mb-4"
              resizeMode="contain"
            />
            <Text className="font-geistRegular text-xl text-[#a8aaac]">
              No IT Jobs found!
            </Text>
          </View>
        ) : (
          jobs?.map(({ name, path }, index) => {
            const isActive = activeAccordion === name;

            return (
              <View key={index} style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  className="bg-[#111315]/50 rounded-lg border border-[#6B7280] p-4"
                  onPress={() => toggleAccordion(name)}
                >
                  <Text className="text-white font-geistSemiBold text-sm">
                    {name}
                  </Text>
                </TouchableOpacity>
                {isActive && (
                  <Animated.View
                    style={[
                      animatedStyle,
                      {
                        marginTop: 16,
                        marginBottom: 16,
                      },
                    ]}
                    className="bg-[#111315]/50 rounded-lg border border-[#6B7280] p-4 overflow-hidden"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-[11px] font-geistRegular">
                        Roadmap
                      </Text>
                      <Text className="text-white font-geistRegular underline text-[10px]">
                        See related tutorial
                      </Text>
                    </View>
                    {path.map(({ subject, description }, idx) => (
                      <View
                        key={idx}
                        className="bg-[#111315] p-4 mt-4 rounded-lg"
                      >
                        <Text className="text-white font-geistSemiBold text-sm">
                          {subject}
                        </Text>
                        <Text className="text-gray-400 font-geistRegular text-xs mt-2">
                          {description}
                        </Text>
                      </View>
                    ))}
                  </Animated.View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => router.push(`aiFeature`)}
        className="bg-blue-500 py-3 px-6 mb-4 mx-6 absolute bottom-0 left-0 right-0 rounded-md"
      >
        <Text className="text-white text-center font-geistSemiBold">Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoadmapResponse;
