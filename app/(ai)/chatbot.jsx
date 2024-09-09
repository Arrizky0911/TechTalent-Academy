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
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import BgImage from "../../components/BgImage";
import UserDisplay from "../../components/UserDisplay";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import BotTextFields from "../../components/BotTextFields";
import { getResponse } from "../../lib/AIConfig";
import Markdown from "react-native-markdown-display";

const Chatbot = () => {
  const { user } = useGlobalContext();
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

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


  const sendMessage = async () => {
    if (!userInput.trim()) return;
    Keyboard.dismiss();
    console.log("Ini chat awal", chat);
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    setChat(updatedChat);

    console.log("Ini updatedChat", updatedChat);

    setIsLoading(true);

    try {
      const response = await getResponse(updatedChat);

      // let markdownResponse = markdownParser(response);
      // console.log(JSON.stringify(markdownResponse));

      let updatedChatWithBot = [
        ...updatedChat,
        {
          role: "model",
          parts: [{ text: response }],
        },
      ];

      console.log("Ini updated chat with bot", updatedChatWithBot);

      setUserInput("");
      setChat(updatedChatWithBot);

      console.log("Ini chat akhir", chat);
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
      <View className="h-full relative">
        <BgImage />
        <SafeAreaView className="mx-5 mt-5 ">
          <View className='flex-row items-center justify-between '>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowLeft}
              className="h-6 w-6 mt-10"
              resizeMethod="contain"
              tintColor="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-center text-xl font-geistMedium mt-10">Guidance</Text>
          <View className="w-7 h-7"></View> 
          </View>
        </SafeAreaView>

        {chat.length < 1 ? (
          <>
            <View className="absolute -bottom-1 w-full h-[80%] bg-[#111315] rounded-t-3xl items-center border-[1px] border-white/10 px-5">
              <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
              <View>
                <View className="mt-[15%]">
                  <Text className="text-white text-center text-xl font-geistMedium">

                    {greeting}, {user.username} 👋
                  </Text>
                  <Text className="text-white text-center text-xl font-geistMedium">
                    What can I do for you?
                  </Text>
                </View>


                <View className="w-full mt-8 px-4">
                  <View className="flex-row justify-between mb-4">
                    <TouchableOpacity
                      className="w-[48%] aspect-[4/3] rounded-xl bg-[#353535] p-4 justify-between"
                      onPress={() => handlePromptClick("What this bot can do?")}
                    >
                      <Image
                        source={icons.questionCircle}
                        className="w-6 h-6 my-[15%] ml-[15%]"
                        resizeMethod="contain"
                        tintColor="white"
                      />
                      <Text className="text-white text-sm">
                        What this bot can do?
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-[48%] aspect-[4/3] rounded-xl bg-[#353535] p-4 justify-between"
                      onPress={() => handlePromptClick("How to use this bot?")}
                    >
                      <Image
                        source={icons.cursor}
                        className="w-6 h-6 my-[15%] ml-[15%]"
                        resizeMethod="contain"
                        tintColor="white"
                      />
                      <Text className="text-white text-sm mx-[15%] mb-[20%]">
                        How to make my first website?
                      </Text>
                    </TouchableOpacity>
                  </View>
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
              </View>
            </View>
          </>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingBottom: 100,
            }}
          >
            {chat?.map((message, index) => (
              <View
                key={index}
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
                  className="font-geistRegular"
                  >
                    <Markdown
                    style={{maxWidth: "75%"}}
                    >
                      {message.parts[0].text}
                    </Markdown>
                  </Text>
              </View>
            ))}

            {isLoading && (
              <View
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
              </View>
            )}
          </ScrollView>
        )}
        <BotTextFields
          outerClass="absolute bottom-5 px-3"
          containerClass="h-14 bg-black flex-1"
          placeholder="Ask me anything..."
          handleChange={(e) => setUserInput(e)}
          value={userInput}
          handleSubmit={sendMessage}
          buttonDisable={isLoading || (userInput ? false : true)}
          editable={!isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
