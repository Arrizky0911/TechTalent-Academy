import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { images } from "../../constants";
import { chat } from "../../lib/chatAI";

const AiFeature = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState("");

  const quickChat = async (value) => {
    setUserInput(value);
    await ask();
  }

  const ask = async () => {
    if (userInput.trim() === '') return;

    setIsSubmitting(true);
    setUserInput('');

    try {
      let response = await chat(userInput);
      setUserInput(response);
      
    } catch (e) {
      setUserInput("Sorry, there was an error processing your request.");

    } finally {
      setIsSubmitting(false);

    }
  };

  return (
    <View className="flex-1 bg-[#111315] p-4">
      <View className="flex-row items-center">
        <Text className="flex-row text-white text-xs font-geistRegular top-0 justify-center">Hello, Farrel. How can I help you?</Text>
        
        <TouchableOpacity 
          className="flex-row"
          onPress={() => {quickChat('What this bot can do?')}}>
          <Text>What this bot can do?</Text>
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity 
          className="flex-1"
          onPress={() => {quickChat('How to use this bot?')}}>
            <Text>How to use this bot?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          className="flex-1"
          onPress={() => {quickChat('Make a roadmap to become a fullstack web developer')}}>
            <Text>Make a roadmap to become a fullstack web developer</Text>
          </TouchableOpacity>
        </View>

      </View>
      

      <View className="flex-row bottom-0">
        <TextInput
          className="justify-center"
          placeholder="Type your question here..."
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity 
        className="bottom-0 left-0"
        onPress={ask}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default AiFeature;
