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
import { signIn, signOut } from "../../lib/appwriteConfig";
import { router } from "expo-router";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Fill all the input!");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      Alert.alert("Success");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full bg-primary relative flex-col">
        <ButtonTemplate
          text="Testt"
          handlePress={async () => {
            await signOut();
          }}
        />
        <View className="absolute bottom-0 left-0 right-0 px-7 py-10 border-gray border-[1px] rounded-tl-xl rounded-tr-xl drop-shadow-xl flex-col items-center bg-primary">
          <View className="flex-row w-full items-center mb-10 justify-center">
            <ButtonTemplate
              handlePress={() => router.push("/sign-up")}
              text="Sign Up"
              textStyles="text-secondary"
              containerStyles="bg-primary border-[1px] border-gray px-10 mr-10"
            />
            <ButtonTemplate
              text="Sign In"
              textStyles=""
              containerStyles="bg-secondary border-[1px] border-gray px-10"
            />
          </View>
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
            text="Sign In"
            containerStyles="w-full rounded-lg mt-10 mb-5 py-3"
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
