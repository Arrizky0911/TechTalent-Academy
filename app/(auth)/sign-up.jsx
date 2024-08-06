import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFields from "../../components/TextFields";
import ButtonTemplate from "../../components/ButtonTemplate";
import { createUser } from "../../lib/appwriteConfig";
import { router } from "expo-router";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Fill all the input!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createUser(form.username, form.email, form.password);
      Alert.alert("Success", res.username);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="h-full relative flex-col">
        <ImageBackground
          source={images.authBg}
          className="min-h-[98vh] w-full absolute top-0 bottom-0 bg-black"
        />
        <View className="absolute bottom-0 left-0 right-0 px-7 py-10 border-[1px] rounded-tl-xl rounded-tr-xl drop-shadow-xl flex-col items-center bg-frame">
          <View className="flex-row w-full items-center mb-10 justify-center">
            <ButtonTemplate
              text="Sign Up"
              textStyles=""
              containerStyles="bg-gray px-10 mr-10"
              disable={true}
            />
            <ButtonTemplate
              handlePress={() => router.push("/sign-in")}
              text="Sign In"
              textStyles=""
              containerStyles="bg-button-main px-10"
            />
          </View>
          <TextFields
            value={form.username}
            handleChange={(e) => setForm({ ...form, username: e })}
            placeholder="Username"
            type="username"
            otherClass="mb-5"
            editable={true}
          />
          <TextFields
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            placeholder="Email"
            type="email"
            otherClass="mb-5"
            editable={true}
          />
          <TextFields
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            placeholder="Password"
            type="password"
            otherClass="mb-5"
            editable={true}
          />

          <ButtonTemplate
            handlePress={submit}
            text="Sign Up"
            containerStyles="w-full rounded-lg mt-10 mb-5 py-3"
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
