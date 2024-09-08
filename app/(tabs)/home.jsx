import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loading from "../../components/Loading";
import icons from "../../constants/icons";
import {
  getAllCategories,
  getAllCourses,
  getCurrentUser,
  getUserLabels,
} from "../../lib/appwriteConfig";
import useFetchData from "../../lib/useFetchData";
import HomeCourse from "../../components/HomeCourse";

import { router } from "expo-router";

const Home = () => {
  const { user, setIsLoading, isLoading, setUser } = useGlobalContext();
  const { data: courses, refetch } = useFetchData(getAllCourses);
  const [currentDate, setCurrentDate] = useState('');
  const { data: categories, refetch: refetchCategories } =
    useFetchData(getAllCategories);

  const { data: labels, refetch: refetchLabels } = useFetchData(getUserLabels);
  const adminLabel = labels.filter((label) => label.toLowerCase() === "admin");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getCurrentUser();
      refetch();
      refetchCategories();
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  useEffect(() => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(today);
  }, []);
  
  return (
    <SafeAreaView className="bg-frame flex-1">
      <View className="h-[15%] w-full bg-black rounded-b-[10px] absolute  flex-row justify-between px-10 z-50 items-center">
        <View className="flex-row justify-between items-center  top-10">

        <View className="flex-row space-x-3 items-center">
          <View className="justify-center">
            <Text className="text-white/70 text-[12px]">Hello👋</Text>
            <Text className="text-white capitalize font-geistMedium text-md">
              {user.username}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-5">
            <Image
              source={{ uri: user?.avatar }}
              className="w-[35px] h-[35px] rounded-full"
              resizeMode="cover"
            />

          {adminLabel?.length > 1 && (
            <TouchableOpacity onPress={() => router.push("/createCourse")}>
              <Image
                source={icons.addCircle}
                className="w-[20px] h-[20px]"
                tintColor="#fff"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {adminLabel.length > 1 && (
            <TouchableOpacity
              className="border-[1px] border-white py-0.5 px-2 rounded-xl"
              onPress={() => router.push("/createCategory")}
            >
              <Text className="text-white">Add category</Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
        <View >
          <Text className="text-white text-start top-16 text-xs  font-geistMedium">{currentDate}</Text>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="pt-4">
          {categories.map((category, index) => {
            if (category.courses.length > 1) {
              return (
                <View className="mt-4" key={index}>
                  <HomeCourse
                    data={category.courses}
                    title={category.category_name}
                  />
                </View>
              );
            }
            return null;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
