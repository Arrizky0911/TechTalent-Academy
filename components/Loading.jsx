import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { images } from '../constants';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';

const Loading = ({ additionStyle }) => {
  const logoOpacity = useSharedValue(1); // Initial opacity

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  useEffect(() => {
    // Animate opacity to fade in and out infinitely
    logoOpacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.ease }),
      -1,  // Infinite repetition
      true // Reverse the animation (fade out, then fade in)
    );
  }, []);

  return (
    <View
      className={`h-full w-full top-0 z-50 items-center justify-center bg-black ${additionStyle}`}
    >
      <Animated.Image
        className="w-[62px] h-[62px]"
        resizeMode="contain"
        source={images.logo}
        style={animatedLogoStyle}
      />
      <Text className="text-white text-sm font-geistMedium mt-5">
        Please Wait
      </Text>
    </View>
  );
};

export default Loading;
