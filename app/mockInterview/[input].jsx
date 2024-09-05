import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // pastikan Anda sudah menginstal expo-linear-gradient
import { FontAwesome } from "@expo/vector-icons"; // pastikan Anda sudah menginstal @expo/vector-icons
import AntDesign from '@expo/vector-icons/AntDesign';
import React, {useState} from 'react';
import { router } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import useFetchData from '../../lib/useFetchData';
import { getQuestions, getTranscript } from '../../lib/AIConfig';
import Loading from "../../components/Loading";
import { Audio } from "expo-av";

const MockTest = () => {
  const {input} = useLocalSearchParams();
  const {data: questions, isLoading} = useFetchData(() => getQuestions(input));
  console.log(questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState();

  const startRecording = async () => {
    console.log("Run start recording")
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    setIsTranscripting(true);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    const transcriptedText = await getTranscript(uri);
    if (transcriptedText) {
      let updatedAnswer = [...answers, transcriptedText];
      console.log(updatedAnswer);
      setAnswers(updatedAnswer);
    } else {
      console.log("Voice error")
    }
    setIsTranscripting(false);
  }
  
  const handleSubmit = () => {
    const formattedQuestions = questions.map(string => string + "#$%");
    const formattedAnswers = answers.map(string => string + "#$%");
    let result = {
      questions: formattedQuestions,
      answers: formattedAnswers
    }
    console.log("redirecting")
    router.push({pathname: `mockFeedback/${input}`, params:result})
  }

  const refreshCurrentAnswer = () => {
    console.log(answers?.length)
    setAnswers( answers => answers.slice(0,-1))
    console.log(answers?.length)
  }

  
  return (
    <ImageBackground
      source={require('./bgmock.png')} // Ensure the path is correct to your bgmock.png
      style={{ flex: 1 }}
       resizeMode= 'cover'
    >
    {(isLoading || isTranscripting) && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
    <SafeAreaView className="bg-[#111315] h-full w-full flex pt-16">
      <View className='flex-row justify-between '>
        <TouchableOpacity className='ml-6' onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View className='flex-1 mr-8'>
          <Text className="text-white text-center text-xl font-geistBold mb-10">
            Mock Interview
          </Text>
        </View>
      </View>
      <Text className="text-white text-center font-geistSemiBold text-base mt-3">
        {input} Job Interview
      </Text>

      <View className="flex flex-row justify-center items-end mr-16 ml-3">
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} 
          className="  w-10 h-10 rounded-full border-2 ml-8 border-white"
        />
        {index == questions?.length ? (
          <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
            <Text className="text-white font-geistRegular text-xs">
              There are no more questions {answers?.length == questions?.length ? "Your answer has been saved" : ""}
            </Text>
            <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          </View>
          
        ) : (
          <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
            <Text className="text-white font-geistRegular text-xs">
              {questions?.[index]}
            </Text>
            <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
            <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">{index + 1} of {questions?.length}</Text>
          </View>

        )}
      </View>

      {answers?.[index] ? (
        <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
          <Text className="text-white font-geistRegular text-xs">
            {answers?.[index]}
          </Text>
          <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">{index + 1} of {questions?.length + 1}</Text>
        </View>
      ) : (
        <View className="mt-20 mb-10 items-center ">
          <LinearGradient
            colors={["#3b5998", "#192f6a"]}
            className="h-48 w-48 rounded-full border border-gray-200 items-center justify-center">
            <Text className="text-white font-geistRegular text-xl">02.00</Text>
          </LinearGradient>
        </View>
      )}

      {/* Control Buttons */}
      <View className="flex-1"></View>
        {index == questions?.length ? (
        <View className="flex-row justify-center w-full mb-10">
          <TouchableOpacity 
            onPress={() => handleSubmit()}
            className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
            <Text>Submit Interview</Text>
          </TouchableOpacity>
        </View>
        ) : 
          answers?.[index] ? (
            <View className="flex-row justify-center w-full mb-10">
              <TouchableOpacity 
                onPress={() => refreshCurrentAnswer()}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
                <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
              <TouchableOpacity 
                disabled
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
                <FontAwesome name="microphone" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIndex(i => i + 1)}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
                <FontAwesome name="play" size={24} color="white" />
              </TouchableOpacity>
            </View>

          ) : (
            <View className="flex-row justify-center w-full mb-10">
              <TouchableOpacity 
                onPress={() => recording ? stopRecording() : startRecording()}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
                <FontAwesome name="microphone" size={24} color="white" />
              </TouchableOpacity>
            </View>
        )}
    </SafeAreaView>
    </ImageBackground>
  );
}

export default MockTest