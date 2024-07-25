import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFields from "../../components/TextFields";
import ButtonTemplate from "../../components/ButtonTemplate";
import { createUser } from "../../lib/appwriteConfig";
import { router } from "expo-router";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Fill all the input!");
    }

    setIsSubmitting(true);

    try {
      const res = await createUser(form.username, form.email, form.password);
      Alert.alert("Success", res.username);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full bg-primary relative flex-col">
        <View className="absolute bottom-0 left-0 right-0 px-7 py-10 border-gray border-[1px] rounded-tl-xl rounded-tr-xl drop-shadow-xl flex-col items-center bg-primary">
          <TextFields
            value={form.username}
            handleChange={(e) => setForm({ ...form, username: e })}
            placeholder="Username"
            type="username"
            otherClass="mb-5"
          />
          <TextFields
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            placeholder="Email"
            type="email"
            otherClass="mb-5"
          />
          <TextFields
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            placeholder="Password"
            type="password"
            otherClass="mb-5"
          />

          <ButtonTemplate
            handlePress={submit}
            text="Sign Up"
            containerStyles="w-full rounded-lg mt-5 mb-10 py-3"
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
