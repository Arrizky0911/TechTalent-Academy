import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { router, Tabs } from "expo-router";
import { HomeIcon, AcademicCapIcon, ClockIcon, UserIcon } from "react-native-heroicons/outline";
import { HomeIcon as HomeSolid, AcademicCapIcon as AcademicCapSolid, ClockIcon as ClockSolid, UserIcon as UserSolid, SparklesIcon } from "react-native-heroicons/solid";
import { images } from "../../constants/";

// animate tipis-tipis for tab icon
const AnimatedTabIcon = ({ Icon, SolidIcon, title, color, focused }) => {
  const IconComponent = focused ? SolidIcon : Icon;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="justify-center items-center gap-1">
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: spin }] }}>
        <IconComponent size={24} color={color} />
      </Animated.View>
      <Text className="text-xs font-geistSemiBold" style={{ color }}>
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
        tabBarInactiveTintColor: "#94A3B8",
        tabBarActiveTintColor: "#2A86FF",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 80,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={HomeIcon} SolidIcon={HomeSolid} color={color} title="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          headerShown: false,
          title: "Courses",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={AcademicCapIcon} SolidIcon={AcademicCapSolid} color={color} title="Courses" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="aiFeature"
        options={{
          headerShown: false,
          title: "AI",
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity
              onPress={() => router.push("/aiFeature")}
              className={`bg-gray-500 w-16 h-16 items-center justify-center rounded-full absolute -top-7 shadow-lg ${
                focused ? 'border-2 border-white/50' : ''
              }`}
            >
              <Image
                source={images.logo}
                className="w-[48px] h-[48px] ml-1 mb-1"
                resizeMode="contain"
                tintColor="#fff"
              />
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
            <AnimatedTabIcon Icon={ClockIcon} SolidIcon={ClockSolid} color={color} title="History" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={UserIcon} SolidIcon={UserSolid} color={color} title="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
