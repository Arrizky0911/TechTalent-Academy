import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { router, usePathname } from "expo-router";
import BgImage from "../../components/BgImage";
import UserDisplay from "../../components/UserDisplay";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import BotTextFields from "../../components/BotTextFields";

const Chatbot = () => {
  const { user } = useGlobalContext();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const scrollViewRef = useRef();

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    if (!isChatStarted) setIsChatStarted(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputValue },
    ]);

    setInputValue('')
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView className="h-full relative">
        <BgImage />
        <View className="mx-5 mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.arrowLeft} className="w-7 h-7 mt-10" resizeMethod="contain" tintColor="white" />
          </TouchableOpacity>
        </View>

        {!isChatStarted ? (
          <>
            <UserDisplay user={user} />
            <View className="absolute -bottom-1 w-full h-[695px] bg-[#111315] rounded-t-3xl items-center border-[1px] border-white/10 px-5">
              <View className="rounded-full w-10 h-1.5 bg-white/70 absolute top-3"></View>
              <View>
                <View className="mt-[60px]">
                  <Text className="text-white text-center text-xl font-geistMedium">
                    Good Morning, {user.username} 👋
                  </Text>
                  <Text className="text-white text-center text-xl font-geistMedium">
                    What can I do for you?
                  </Text>
                </View>

                <View className="mx-5 mt-[60px] w-full items-center">
                  <View className="flex-row w-full justify-center gap-x-4">
                    <TouchableOpacity onPress={() => handleInputChange('What this bot can do?')} className="w-[170px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between">
                      <Image source={icons.questionCircle} className="w-6 h-6" resizeMethod="contain" tintColor="white" />
                      <Text className="text-white text-sm">What this bot can do?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleInputChange('How to use this bot?')} className="w-[170px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between">
                      <Image source={icons.cursor} className="w-6 h-6" resizeMethod="contain" tintColor="white" />
                      <Text className="text-white text-sm">How to use this bot?</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleInputChange('Make a roadmap to become a fullstack web developer')} className="w-[350px] h-[147px] rounded-xl bg-[#353535] px-5 py-8 justify-between mt-4">
                    <View className="relative">
                      <Image source={icons.starThin} tintColor="white" className="w-6 h-6" resizeMethod="contain" />
                      <Image source={icons.starThick} tintColor="white" className="w-3 h-3 absolute left-3.5 top-3.5" resizeMethod="contain" />
                    </View>
                    <Text className="text-white text-sm">Make a roadmap to become a fullstack web developer</Text>
                  </TouchableOpacity>
                  <Text className="text-xs text-white text-center font-geistRegular mt-10">This bot can make a mistake</Text>
                </View>
              </View>

              {/* Input field and send button */}
              <BotTextFields
                outerClass="absolute bottom-[50px] px-3"
                containerClass="h-14"
                placeholder="Ask me anything..."
                value={inputValue}
                handleChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            </View>
          </>
        ) : (
          // Chatbot display
          <View className="absolute -bottom-1 w-full h-full bg-[#111315] rounded-t-3xl border-[1px] border-white/10 px-5">
            <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.arrowLeft} className="w-7 h-7 mt-10" resizeMethod="contain" tintColor="white" />
          </TouchableOpacity>
            <ScrollView 
              className="mx-5 mt-5 flex-1"
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: message.role === "user" ? "#2a86ff" : "#E5E5EA",
                    padding: 10,
                    marginVertical: 5,
                    borderRadius: 10,
                  }}
                >
                  <Text className='font-geistRegular' style={{ color: message.role === "user" ? "#fff" : "#000" }}>
                    {message.content}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Input field and send button */}
            <View className="justify-center items-center ">
              <View className="bottom-10">
              <BotTextFields
                outerClass=""
                containerClass="h-14"
                placeholder="Ask me anything..."
                value={inputValue}
                handleChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;