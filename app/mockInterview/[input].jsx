import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // pastikan Anda sudah menginstal expo-linear-gradient
import { FontAwesome } from "@expo/vector-icons"; // pastikan Anda sudah menginstal @expo/vector-icons
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState, useCallback } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import useFetchData from "../../lib/useFetchData";
import { getQuestions } from "../../lib/interviewAI";
import Loading from "../../components/Loading";
import WaveAnimation from "../../components/WaveAnimation";
import { Audio } from "expo-av";
import { images } from "../../constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Alert, Modal } from "react-native";
import { mix } from "react-native-redash";
import { getTranscript } from "../../lib/GoogleAIConfig";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const MockTest = () => {
  const { input } = useLocalSearchParams();
  const { data: questions, isLoading } = useFetchData(() =>
    getQuestions(input)
  );
  console.log(questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const startRecording = async () => {
    console.log("Run start recording");
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(undefined);
    setIsTranscripting(true);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    const transcriptedText = await getTranscript(uri);
    if (transcriptedText) {
      let updatedAnswer = [...answers, transcriptedText];
      console.log(updatedAnswer);
      setAnswers(updatedAnswer);
    } else {
      console.log("Voice error");
    }
    setIsTranscripting(false);
  };

  const handleSubmit = () => {
    const formattedQuestions = questions.map((string) => string + "#$%");
    const formattedAnswers = answers.map((string) => string + "#$%");
    formattedQuestions[index - 1] = formattedQuestions[index - 1]?.concat(",");
    formattedAnswers[index - 1] = formattedAnswers[index - 1]?.concat(",");
    let result = {
      questions: formattedQuestions,
      answers: formattedAnswers,
      feedbacks: {},
      isNew: false,
    };
    console.log("redirecting");
    router.push({ pathname: `mockFeedback/${input}`, params: result });
  };

  const refreshCurrentAnswer = () => {
    console.log(answers?.length);
    setAnswers((answers) => answers.slice(0, -1));
    console.log(answers?.length);
  };

  const handleBackPress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmModal(false);
    router.back();
  };

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(1.2);
    rotation.value = withSequence(
      withTiming(-5, { duration: 50 }),
      withRepeat(withTiming(5, { duration: 100 }), 6, true),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  return (
    <ImageBackground
      source={require("./bgmock.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {(isLoading || isTranscripting) && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black/90" />
      )}
      <SafeAreaView className="bg-[#111315] h-full flex-1 pt-16">
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={handleBackPress}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-geistBold">
              Mock Interview
            </Text>
            <View style={{ width: 24 }}></View>
          </View>
          <Text className="text-white text-center font-geistSemiBold text-base mb-8">
            {input} Job Interview
          </Text>
        </View>

        <View className="flex-1 px-6">
          {index == questions?.length ? (
            <View className="flex-1 justify-center items-center">
              <Image
                className="h-[200px] w-[200px] mb-6"
                resizeMode="contain"
                source={images.done}
              />
              <Text className="text-white text-center px-6 font-geistRegular">
                Your answer has been saved, click submit to see your grade.
              </Text>
            </View>
          ) : (
            <View className="flex-1 justify-center">
              <View className="flex-row items-start mb-6">
                <Image
                  source={images.logo}
                  className="w-10 h-10 rounded-full"
                />
                <View className="flex-1 ml-4 bg-[#242627] p-4 rounded-b-xl rounded-tr-xl">
                  <Text className="text-white font-geistRegular text-sm mb-4">
                    {questions?.[index]}
                  </Text>
                  <View className="border-t border-gray-500 my-2" />
                  <Text className="text-gray-400 font-geistMedium text-xs text-right">
                    {index + 1} of {questions?.length}
                  </Text>
                </View>
              </View>

              {answers?.[index] && (
                <View
                  className="ml-10 mr-4 bg-[#3F454D] p-4 rounded-t-2xl rounded-bl-2xl 
          flex flex-col justify-between shadow-lg max-w-[80%] self-end"
                >
                  <Text className="text-white font-geistRegular text-xs leading-3 mb-4">
                    {answers?.[index]}
                  </Text>
                  <View className="border-t border-gray-600 my-2"></View>
                  <Text className="text-gray-500 font-geistRegular text-xs text-right">
                    {index + 1} of {questions?.length}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View className="px-6 mb-10">
          {index == questions?.length ? (
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 py-4 rounded-md w-full"
            >
              <Text className="text-white text-center font-geistSemiBold">
                Submit Interview
              </Text>
            </TouchableOpacity>
          ) : answers?.[index] ? (
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={refreshCurrentAnswer}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full"
              >
                <FontAwesome name="times" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                disabled
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full"
              >
                <FontAwesome name="microphone" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIndex((i) => i + 1)}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full"
              >
                <FontAwesome name="play" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center">
              <AnimatedTouchableOpacity
                onPress={() => (recording ? stopRecording() : startRecording())}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[animatedStyle]}
                className="bg-[#1e1e1e] p-6 border border-white/20 rounded-full"
              >
                <FontAwesome
                  name="microphone"
                  size={32}
                  color={recording ? "red" : "white"}
                />
              </AnimatedTouchableOpacity>
              {recording && (
                <View className="absolute top-[-40]">
                  <WaveAnimation isRecording={recording} />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#242627] p-6 rounded-2xl w-4/5 max-w-[300px]">
            <Text className="text-white text-lg font-geistBold mb-4 text-center">
              Exit Interview?
            </Text>
            <Text className="text-gray-300 text-sm font-geistRegular mb-6 text-center">
              Your interview progress will be lost. Are you sure you want to
              leave?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="bg-gray-600 py-2 px-4 rounded-full"
              >
                <Text className="text-white font-geistMedium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmExit}
                className="bg-red-500 py-2 px-4 rounded-full"
              >
                <Text className="text-white font-geistMedium">Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default MockTest;
