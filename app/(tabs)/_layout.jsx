import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router, Tabs } from "expo-router";
import { icons } from "../../constants/";

const TabIcon = ({ title, color, source }) => {
  return (
    <View className="justify-center items-center gap-1 mx-2">
      <Image source={source} tintColor={color} />
      <Text className="text-white font-geistSemiBold" style={{ color: color }}>
        {title}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#2A86FF",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 70,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          padding: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon source={icons.home} color={color} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          headerShown: false,
          title: "Courses",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.course} color={color} title="Courses" />
          ),
        }}
      />
      <Tabs.Screen
        name="aiFeature"
        options={{
          headerShown: false,
          title: "AiFeature",
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => router.push("/aiFeature")}
              className="bg-gray w-[65px] h-[65px] items-center justify-center rounded-full absolute -top-8"
            >
              <Image source={icons.aiFeature} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.history} color={color} title="History" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.profile} color={color} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
