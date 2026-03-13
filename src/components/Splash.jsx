import { memo, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { styles, stylesVars } from '../theme';

const Splash = memo(function Splash() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <SafeAreaView style={[styles.safe]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.shell, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.Text style={[{ color: stylesVars.muted, fontWeight: '900', letterSpacing: 6 }, animStyle]}>
          •••
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
});

export default Splash;
