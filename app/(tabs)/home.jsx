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
  const [currentDate, setCurrentDate] = useState("");
  const { data: categories, refetch: refetchCategories } =
    useFetchData(getAllCategories);

  const { data: labels, refetch: refetchLabels } = useFetchData(getUserLabels);
  const adminLabel = labels.filter((label) => label.toLowerCase() === "admin");

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const today = new Date().toLocaleDateString("en-US", options);
    setCurrentDate(today);
  }, []);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="bg-frame flex-1">
      <View className="h-[170px] w-full bg-black rounded-b-[20px] px-10 pt-6">
        <View className="flex-row justify-between items-center top-10">
          {adminLabel?.length >= 1 ? (
            <>
              <View className="flex-row space-x-3 items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[35px] h-[35px] rounded-full"
                  resizeMode="cover"
                />
                <View className="justify-center">
                  <Text className="text-white/70 text-[12px]">Hello👋</Text>
                  <Text className="text-white capitalize font-geistMedium text-md">
                    {user.username}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center space-x-3">
                <TouchableOpacity onPress={() => router.push("/createCourse")}>
                  <Image
                    source={icons.addCircle}
                    className="w-[20px] h-[20px]"
                    tintColor="#fff"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="border-[1px] border-white py-0.5 px-2 rounded-xl"
                  onPress={() => router.push("/createCategory")}
                >
                  <Text className="text-white">Add category</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View className="justify-center">
                <Text className="text-white/70 text-[12px]">Hello👋</Text>
                <Text className="text-white capitalize font-geistMedium text-md">
                  {user.username}
                </Text>
              </View>
              <Image
                source={{ uri: user?.avatar }}
                className="w-[35px] h-[35px] rounded-full"
                resizeMode="cover"
              />
            </>
          )}
        </View>
        <View>
          <Text className="text-white text-start top-16 text-xs font-geistMedium">
            {currentDate}
          </Text>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="pt-4">
          {categories?.map((category, index) => {
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
    </View>
  );
};

export default Home;
