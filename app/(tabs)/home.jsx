import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loading from "../../components/Loading";
import icons from "../../constants/icons";
import { getAllCourses } from "../../lib/appwriteConfig";
import useFetchData from "../../lib/useFetchData";
import HomeCourse from "../../components/HomeCourse";

const Home = () => {
  const { user, setIsLoading, isLoading } = useGlobalContext();
  const { data: courses, refetch } = useFetchData(getAllCourses);

  const test = [1, 2, 3, 4, 5];
  const test1 = [...test, 6, 7, 9];
  console.log(test1);

  if (!user) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="bg-frame h-full relative">
      <View className="h-[170px] w-full bg-black rounded-b-[20px] absolute top-0 flex-row justify-between px-10 z-50">
        <View className="flex-row space-x-3 items-center">
          <View>
            <Image
              source={{ uri: user?.avatar }}
              className="w-[35px] h-[35px] rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center">
            <Text className="text-white/70 text-[12px]">Hello👋</Text>
            <Text className="text-white capitalize font-geistMedium text-md">
              {user.username}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-5">
          <Image
            source={icons.search}
            className="w-[20px] h-[20px]"
            tintColor="#fff"
            resizeMode="contain"
          />
          <Image
            source={icons.notification}
            className="w-[30px] h-[30px]"
            tintColor="#fff"
            resizeMode="contain"
          />
        </View>
      </View>
      <ScrollView className="relative top-[140px] py-8">
        <HomeCourse data={courses} title={"all courses"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
