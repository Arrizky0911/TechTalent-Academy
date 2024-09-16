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
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import BgImage from "../../../components/BgImage";
import UserDisplay from "../../../components/UserDisplay";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { icons } from "../../../constants";
import BotTextFields from "../../../components/BotTextFields";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { chatAI } from "../../../lib/chatAI";
import {
  addChatHistory,
  loadChatHistory,
  updateChatHistory,
} from "../../../lib/AstraDBConfig";
import Loading from "../../../components/Loading";
import { randomUUID } from "expo-crypto";
import AiFeature from "../../(tabs)/aiFeature";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClockIcon } from "react-native-heroicons/outline";

const Chatbot = () => {
  const { user } = useGlobalContext();
  const { chatSession } = useLocalSearchParams();
  const [chat, setChat] = useState([]);
  const [sessionID, setSessionID] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoadChat, setIsLoadChat] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isLoadResponse, setIsLoadResponse] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [greeting, setGreeting] = useState("");
  const scrollViewRef = useRef(null);

  const fetchChatHistory = async (session) => {
    setIsLoadChat(true);
    try {
      const chatHistory = await loadChatHistory(session);
      console.log(chatHistory?.[0]?.chat);
      setChat(chatHistory?.[0]?.chat);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadChat(false);
    }
  };

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

    console.log(chatSession);
    setSessionID(chatSession);

    if (chatSession != "noSession") {
      fetchChatHistory(chatSession);
      setIsNewChat(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setIsChatting(true);
    Keyboard.dismiss();
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    setChat(updatedChat);
    setIsLoadResponse(true);

    try {
      const response = await chatAI(updatedChat, userInput);

      let updatedChatWithBot = [
        ...updatedChat,
        {
          role: "model",
          parts: [{ text: response }],
        },
      ];

      if (isNewChat) {
        let session = randomUUID();
        setSessionID(session);
        await addChatHistory(session, user.$id, updatedChatWithBot, userInput);
        setIsNewChat(false);
      } else {
        await updateChatHistory(sessionID, updatedChatWithBot);
      }
      setUserInput("");

      setChat(updatedChatWithBot);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadResponse(false);
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
      {isLoadChat && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
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
              <Animated.View
                entering={FadeIn.delay(200).duration(300)}
                className="items-start"
              >
                <TouchableOpacity onPress={() => {
                  if (chatSession === "noSession") {
                    setChat([]);
                    setIsChatting(false);
                    setIsNewChat(true);
                    if  (chat?.length < 1) {
                      router.push("aiFeature");
                    }
                  } else {
                    router.back();
                  }
                  }}>
                  <Image
                    source={icons.arrowLeft}
                    className="h-6 w-6 mt-10 mb-6"
                    resizeMethod="contain"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </Animated.View>
              <Animated.Text
                entering={FadeIn.delay(300).duration(300)}
                className="text-white text-center text-xl font-geistMedium mt-10 mb-6 mx-10"
              >
                Guidance
              </Animated.Text>

              <Animated.View entering={FadeIn.delay(200).duration(300)}>
                {(isNewChat && !isChatting) || chatSession !== "noSession" ? (
                  <TouchableOpacity
                    className="items-end mt-4 opacity-0"
                    disabled={true}
                  >
                    <ClockIcon size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      router.push("history/chatbothistory");
                    }}
                    className="items-end mt-4"
                  >
                    <ClockIcon size={24} color="white" />
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        {isNewChat && !isChatting ? (
          <>
            <Animated.View
              entering={FadeIn.delay(400).duration(300)}
              className="-top-16"
            >
              <UserDisplay user={user} />
            </Animated.View>
            <Animated.View
              entering={SlideInDown.delay(500).duration(500)}
              className="absolute bottom-0 w-full h-[72%] bg-[#111315] rounded-t-3xl items-center border-[1px] border-white/10 px-5"
            >
              <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingBottom: 100,
                }}
              >
                <Animated.View
                  entering={FadeIn.delay(700).duration(300)}
                  className="w-full mt-3"
                >
                  <View className="mt-[10%]">
                    <Text className="text-white text-center text-xl font-geistMedium">
                      {greeting}, {user?.username} 👋
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
                        className="w-[48%] rounded-2xl bg-[#353535] p-4 justify-between"
                        onPress={() =>
                          handlePromptClick(
                            "Who are you, and what's your ability and function?"
                          )
                        }
                      >
                        <Image
                          source={icons.questionCircle}
                          className="w-6 h-6 m-2"
                          resizeMethod="contain"
                          tintColor="white"
                        />
                        <Text className="text-white text-sm font-geistRegular m-2">
                          Who are you, and what's your ability and function?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-[48%] rounded-2xl bg-[#353535] p-4 justify-between"
                        onPress={() =>
                          handlePromptClick(
                            "How to use the interview simulation feature"
                          )
                        }
                      >
                        <Image
                          source={icons.cursor}
                          className="w-6 h-6 m-2"
                          resizeMethod="contain"
                          tintColor="white"
                        />
                        <Text className="text-white text-sm font-geistRegular m-2">
                          How to use the interview simulation feature
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity
                      className="w-full aspect-rectangle rounded-2xl bg-[#353535] p-4 flex justify-between"
                      onPress={() =>
                        handlePromptClick(
                          "Make a roadmap to become a fullstack web developer"
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
                      <Text className="text-white font-geistRegular text-sm flex-1 m-2">
                        Make a roadmap to become a fullstack web developer
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push("history/chatbothistory")}
                      className="w-full mt-4 py-3 rounded-2xl  hover:bg-[#4A4A4A] flex-row items-center justify-between px-4"
                    >
                      <Text className="text-white font-geistRegular">
                        See History here
                      </Text>
                      <ChevronRightIcon size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </ScrollView>
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
                  {message.role === "user" || Platform.OS !== "ios" ? (
                    message.parts[0].text
                  ) : (
                    <Markdown
                      style={{ maxWidth: "75%", flex: 1, flexWrap: "wrap" }}
                      markdownit={MarkdownIt({
                        typographer: true,
                        breaks: true,
                      }).disable(["blockquote", "list", "code"])}
                    >
                      {message.parts[0].text}
                    </Markdown>
                  )}
                </Text>
              </Animated.View>
            ))}

            {isLoadResponse && (
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
            buttonDisable={isLoadResponse || (userInput ? false : true)}
            editable={!isLoadResponse}
          />
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
