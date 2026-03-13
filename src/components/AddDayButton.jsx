import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { styles } from '../theme';

const AddDayButton = memo(function AddDayButton({ onPress, label }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.98, { damping: 18, stiffness: 260 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 220 });
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.addDayBtn}
      >
        <Text style={styles.addDayBtnText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
});

export default AddDayButton;
