import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import BgImage from "../../components/BgImage";
import UserDisplay from "../../components/UserDisplay";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import BotTextFields from "../../components/BotTextFields";
import { chatAI } from "../../lib/chatAI";
import { FadeIn, SlideInDown } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import Markdown from "react-native-markdown-display";
import { addChatHistory, loadChatHistory, updateChatHistory } from "../../lib/AstraDBConfig";

const Chatbot = () => {
  const { user } = useGlobalContext();
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const loadHistory = async () => {
    try {
      let history = await loadChatHistory(sessionID);
      setChat(history);

    } catch (error) {
      console.error(error);

    }

  }

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    Keyboard.dismiss();
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    setChat(updatedChat);
    setIsLoading(true);

    try {
      const response = await chatAI(updatedChat, userInput);

      // let markdownResponse = markdownParser(response);
      // console.log(JSON.stringify(markdownResponse));

      let updatedChatWithBot = [
        ...updatedChat,
        {
          role: "model",
          parts: [{ text: response }],
        },
      ];

      setUserInput("");
      if(isNewChat) {
        // let id =
        // add sessionIDuserID relation table
        // setSessionID(id)
        await addChatHistory( sessionID , updatedChatWithBot);
        setIsNewChat(false);

      } else {
        await updateChatHistory("thethe", updateChatHistory);

      }

      setChat(updatedChatWithBot);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setUserInput(prompt);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Animated.View
        entering={FadeIn.duration(300)}
        className="h-full relative"
      >
        <BgImage />
        <Animated.View
          entering={FadeIn.delay(100).duration(300)}
          className="mx-5 mt-5"
        >
          <View>
            <View className="flex-row items-center justify-between">
              <Animated.View entering={FadeIn.delay(200).duration(300)}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Image
                    source={icons.arrowLeft}
                    className="h-6 w-6 mt-10"
                    resizeMethod="contain"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </Animated.View>
              <Animated.Text
                entering={FadeIn.delay(300).duration(300)}
                className="text-white text-center text-xl font-geistMedium mt-10"
              >
                Guidance
              </Animated.Text>
              <View className="w-7 h-7"></View>
            </View>
          </View>
        </Animated.View>

        {chat.length < 1 ? (
          <>
            <Animated.View
              entering={FadeIn.delay(400).duration(300)}
              className="-mt-[12%] "
            >
              <UserDisplay user={user}/>
            </Animated.View>
            <Animated.View
              entering={SlideInDown.delay(500).duration(500)}
              className="absolute bottom-0 w-full h-[72%] bg-[#111315] rounded-t-3xl items-center border-[1px] border-white/10 px-5"
            >
              <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
              <Animated.View
                entering={FadeIn.delay(700).duration(300)}
                className="w-full mt-10"
              >
                <View className="mt-[6%]">
                  <Text className="text-white text-center text-xl font-geistMedium">
                    {greeting}, {user.username} 👋
                  </Text>
                  <Text className="text-white text-center text-xl font-geistMedium">
                    What can I do for you?
                  </Text>
                </View>

                <View className="w-full mt-8">
                  <Animated.View
                    entering={FadeIn.delay(900).duration(300)}
                    className="flex-row justify-between mb-4"
                  >
                    <TouchableOpacity
                      className="w-[48%] aspect-[9/8] rounded-xl bg-[#353535] p-4 justify-between"
                      onPress={() => handlePromptClick("Who are you?")}
                    >
                      <Image
                        source={icons.questionCircle}
                        className="w-6 h-6"
                        resizeMethod="contain"
                        tintColor="white"
                      />
                      <Text className="text-white text-sm">Who are you?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-[48%] aspect-[9/8] rounded-xl bg-[#353535] p-4 justify-between"
                      onPress={() =>
                        handlePromptClick("How to make my first website?")
                      }
                    >
                      <Image
                        source={icons.cursor}
                        className="w-6 h-6"
                        resizeMethod="contain"
                        tintColor="white"
                      />
                      <Text className="text-white text-sm">
                        How to make my first website?
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <TouchableOpacity
                    className="w-full  aspect-[16/7] rounded-xl bg-[#353535] p-4 flex justify-between"
                    onPress={() =>
                      handlePromptClick(
                        "Maka roadmap to become a fullstack web developer"
                      )
                    }
                  >
                    <View className="h-14 relative">
                      <Image
                        source={icons.starThin}
                        tintColor="white"
                        className="w-6 h-6 absolute"
                        resizeMethod="contain"
                      />
                      <Image
                        source={icons.starThick}
                        tintColor="white"
                        className="w-3 h-3 absolute left-3.5 top-3.5"
                        resizeMethod="contain"
                      />
                    </View>
                    <Text className="text-white font-geistRegular text-sm flex-1 mt-2">
                      Make a roadmap to become a fullstack web developer
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>
          </>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingBottom: 100,
            }}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {chat?.map((message, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.delay(index * 100).duration(300)}
                style={{
                  alignSelf:
                    message.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.role === "user" ? "#2a86ff" : "#f0f0f0",
                  padding: 12,
                  marginVertical: 8,
                  borderRadius: 16,
                  maxWidth: "75%",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                className="w-auto"
              >
                <Text
                  style={{
                    color: message.role === "user" ? "#fff" : "#333",
                    fontSize: 16,
                  }}
                  className="font-geistRegular text-wrap break-words mx-2"
                >
                  {message.role === "user" ? (
                    message.parts[0].text
                  ) : (
                    <Markdown mergeStyle={true}>
                      {message.parts[0].text}
                    </Markdown>
                  )}
                </Text>
              </Animated.View>
            ))}

            {isLoading && (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f0f0f0",
                  padding: 12,
                  marginVertical: 8,
                  borderRadius: 16,
                  maxWidth: "75%",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color="#333" />
                <Text
                  className="font-geistRegular"
                  style={{ marginLeft: 10, color: "#333", fontSize: 16 }}
                >
                  Waiting for response
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        )}
        <Animated.View
          entering={FadeIn.delay(1300).duration(300)}
          className="absolute bottom-5 left-0 right-0 px-3"
        >
          <BotTextFields
            outerClass=""
            containerClass="h-14 bg-black flex-1"
            placeholder="Ask me anything..."
            handleChange={(e) => setUserInput(e)}
            value={userInput}
            handleSubmit={sendMessage}
            buttonDisable={isLoading || (userInput ? false : true)}
            editable={!isLoading}
          />
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
