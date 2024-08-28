import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextFields from "../../components/TextFields";
import ButtonTemplate from "../../components/ButtonTemplate";
import { getCurrentUser, signIn, signOut } from "../../lib/appwriteConfig";
import { router } from "expo-router";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loading from "../../components/Loading";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
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
    Keyboard.dismiss();
    try {
      await signIn(form.email, form.password);

      const response = await getCurrentUser();

      setUser(response);
      setIsLoggedIn(true);

      router.replace("/home");
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
      <View className="h-full relative flex-col bg-black">
        {isSubmitting && (
          <Loading additionStyle="absolute bottom-0 top-0 w-full z-[1000] bg-black/70" />
        )}
        <ImageBackground
          className="min-h-[98vh] w-full absolute top-0 bottom-0"
          source={images.authBg}
        />

        <View className="absolute bottom-0 left-0 right-0 px-7 py-10 border-[1px] rounded-tl-xl rounded-tr-xl drop-shadow-xl flex-col items-center bg-frame">
          <View className="flex-row w-full items-center mb-10 justify-center">
            <ButtonTemplate
              handlePress={() => router.push("/sign-up")}
              text="Sign Up"
              textStyles="text-secondary"
              containerStyles="bg-primary px-10 mr-10"
            />
            <ButtonTemplate
              text="Sign In"
              textStyles=""
              containerStyles="bg-gray px-10"
              disable={true}
            />
          </View>
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
            text="Sign In"
            containerStyles="w-full rounded-lg mt-10 mb-5 py-3"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
