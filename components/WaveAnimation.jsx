import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WaveAnimation = ({ isRecording }) => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      progress1.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, true);
      progress2.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1, true);
      progress3.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, true);
    } else {
      progress1.value = withTiming(0);
      progress2.value = withTiming(0);
      progress3.value = withTiming(0);
    }
  }, [isRecording]);

  const animatedProps1 = useAnimatedProps(() => {
    const y = 10 - progress1.value * 10;
    return {
      d: `M0,10 Q5,${y} 10,10 T20,10 T30,10 T40,10 T50,10`
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const y = 10 - progress2.value * 15;
    return {
      d: `M0,10 Q5,${y} 10,10 T20,10 T30,10 T40,10 T50,10`
    };
  });

  const animatedProps3 = useAnimatedProps(() => {
    const y = 10 - progress3.value * 20;
    return {
      d: `M0,10 Q5,${y} 10,10 T20,10 T30,10 T40,10 T50,10`
    };
  });

  return (
    <View style={{ width: 50, height: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Svg height="20" width="50">
        <AnimatedPath animatedProps={animatedProps1} stroke="#FF0000" strokeWidth="2" fill="none" />
        <AnimatedPath animatedProps={animatedProps2} stroke="#FF6666" strokeWidth="2" fill="none" />
        <AnimatedPath animatedProps={animatedProps3} stroke="#FFCCCC" strokeWidth="2" fill="none" />
      </Svg>
    </View>
  );
};

export default WaveAnimation;