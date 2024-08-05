import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";
import Loading from "../components/Loading";

export default function Index() {
  const { isLoggedIn, isLoading } = useGlobalContext();
  if (isLoading) {
    return <Loading />;
  }
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }
  return <Redirect href="/sign-up" />;
}
