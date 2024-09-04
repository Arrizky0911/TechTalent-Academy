import React, {useState, useEffect} from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { getQuestions } from "../../lib/AIConfig";
import { Audio, RecordingOptionsPresets} from "expo-av";
import useFetchData from "../../lib/useFetchData";

const MockInterviewScreen = () => {
  const router = useRouter()
  const {input} = useLocalSearchParams();
  const [questions, setquestions] = useFetchData(() => getQuestions(input));
  const [question, setQuestion] = useState(questions?.[0]);
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);

  // useEffect(() => {
  //   const getPermission = async () => {
  //     await Audio.requestPermissionsAsync()
  //       .then((permission) => {
  //         console.log("Permission Granted: " + permission.granted);
  //         setAudioPermission(permission.granted);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }

  //   getPermission();
  //   return () => {
  //     if (recording) {
  //       stopRecording();
  //     }
  //   };
  // }, []);

  const handleRecordStart = async () => {
    setRecordedAudio(null);
    setRecording(null);
    if (recording) {
      const audioUri = await stopRecording(recording);
      if (audioUri) {
        console.log("Saved audio file to", savedUri);
      }
    } else {
      await startRecording();
    }
  }

  const startRecording = async () => {
    setIsRecording(true);
    setRecording(null);
    setRecordedAudio(null);

    // Check if a recording is already in progress
    if (isRecording) {
      console.warn("A recording is already in progress");
      return;
    }

    // Check for permissions before starting the recording
    if (!audioPermission) {
      console.warn("Audio permission is not granted");
      return;
    }
    try {
      // needed for IOS, If you develop mainly on IOS device or emulator, 
      // there will be error if you don't include this.
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      console.log("Starting Recording");
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus("recording");
      
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    try {
      if (recordingStatus === "recording") {
        console.log("Stopping Recording");
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        setRecordedAudio({
          uri,
          name: `recording-${Date.now()}.m4a`, // Change the file extension to .m4a
          type: "audio/m4a", // Update the type to M4A
        });

        // resert our states to record again
        setRecording(null);
        setRecordingStatus("stopped");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }


  const handleInterview = async (audio) => {
    setIsLoading(true);
    // let asnwer = await getTranscript();
    // setAnswers(...answers, answer);
    setQuestion()
    if (answers?.length == questions?.length) {
      let interviewResult = {
        question: questions,
        answer: answers,
      }
      setIsLoading(false);
      router.push(`/mockFeedback/${interviewResult}`);
    } 
  
  }

  return (
    <ImageBackground
      source={require('./bgmock.png')} // Ensure the path is correct to your bgmock.png
      style={{ flex: 1 }}
       resizeMode= 'cover'
    >
    <SafeAreaView className="bg-[#111315] h-full w-full flex pt-16">
      {/* Header */}
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
        {input} Job Mock Interview
      </Text>

      <View className="flex flex-row justify-center items-end mr-16 ml-3">
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} 
          className="  w-10 h-10 rounded-full border-2 ml-8 border-white"
        />
        <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
          <Text className="text-white font-geistRegular text-xs">
            {question}
          </Text>
          <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">1 of 10</Text>
        </View>
      </View>

      {/* Timer Circle */}
      <View className="mt-20 mb-10 items-center ">
        <LinearGradient
          colors={["#3b5998", "#192f6a"]}
          className="h-48 w-48 rounded-full border border-gray-200 items-center justify-center"
        >
          <Text className="text-white font-geistRegular text-xl">02.00</Text>
        </LinearGradient>
      </View>

      {/* Control Buttons */}
      <View className="flex-1"></View>
      <View className="flex-row justify-center w-full mb-10">
        <TouchableOpacity className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
          <FontAwesome name="microphone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          // onPress={}
          className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
          <FontAwesome name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default MockInterviewScreen;
