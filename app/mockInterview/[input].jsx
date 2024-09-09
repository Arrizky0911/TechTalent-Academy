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
import React, { useState } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import useFetchData from "../../lib/useFetchData";
import { getQuestions, getTranscript } from "../../lib/AIConfig";
import Loading from "../../components/Loading";
import { Audio } from "expo-av";
import { images } from "../../constants";

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
    let result = {
      questions: formattedQuestions,
      answers: formattedAnswers,
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

  return (
    <ImageBackground
      source={require("./bgmock.png")} // Ensure the path is correct to your bgmock.png
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {(isLoading || isTranscripting) && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
      <SafeAreaView className="bg-[#111315] h-full w-full flex pt-16">
        <View className="flex-row justify-between ">
          <TouchableOpacity className="ml-6" onPress={handleBackPress}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 mr-8">
            <Text className="text-white text-center text-xl font-geistBold mb-10">
              Mock Interview
            </Text>
          </View>
        </View>
        <Text className="text-white text-center font-geistSemiBold text-base mt-3">
          {input} Job Interview
        </Text>
        <View className="flex flex-row h-1/2 justify-center items-center mr-16 ml-3">
          {index == questions?.length ? (
            <>
              <View className="flex-1 justify-center w-full h-auto self-center items-center mt-10">
                <Image
                  className=" h-[200px] rounded-lg"
                  resizeMode="contain"
                  source={images.done}
                />
                <Text className=" text-white text-center mt-6 px-6 font-geistRegular">
                  Your answer has been saved, click submit to see your grade.
                </Text>
              </View>
            </>
          ) : (
            <>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
                className="  w-10 h-10 rounded-full border-2 ml-8 border-white"
              />
              <View className="w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
                <Text className="text-white font-geistRegular text-xs">
                  {questions?.[index]}
                </Text>
                <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
                <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">
                  {index + 1} of {questions?.length}
                </Text>
              </View>
            </>
          )}
        </View>

        {answers?.[index] ? (
          <View className="-top-20 ml-10 mr-4 bg-[#3F454D] p-4 rounded-t-2xl rounded-bl-2xl flex flex-col justify-between shadow-lg max-w-[80%] self-end">
            <Text className="text-white font-geistRegular text-sm leading-5">
              {answers?.[index]}
            </Text>
            <View className="mt-4 border-t rounded-full w-full border-gray-600"></View>
            <Text className="text-gray-500 font-geistMedium text-[10px] mt-2 text-right">
              {index + 1} of {questions?.length}
            </Text>
          </View>
        ) : (
          <></>
        )}

        {/* Control Buttons */}
        <View className="flex-1"></View>
        {index == questions?.length ? (
          <View className="justify-center items-center w-full mb-10">
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-[85%] mx-auto"
            >
              <Text className="text-white text-center font-geistSemiBold">
                Submit Interview
              </Text>
            </TouchableOpacity>
          </View>
        ) : answers?.[index] ? (
          <View className="flex-row justify-center w-full mb-10">
            <TouchableOpacity
              onPress={() => refreshCurrentAnswer()}
              className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full "
            >
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16"
            >
              <FontAwesome name="microphone" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIndex((i) => i + 1)}
              className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full "
            >
              <FontAwesome name="play" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-center w-full mb-10">
            <TouchableOpacity
              onPress={() => (recording ? stopRecording() : startRecording())}
              className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16"
            >
              <FontAwesome name="microphone" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MockTest;
