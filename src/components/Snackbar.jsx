import { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { styles } from '../theme';

const Snackbar = memo(function Snackbar({ visible, text }) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(false);
  const [renderedText, setRenderedText] = useState(text);
  const unmountTimerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
      if (text) setRenderedText(text);
      setMounted(true);
    } else {
      unmountTimerRef.current = setTimeout(() => setMounted(false), 260);
    }
    return () => {
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, [visible, text]);

  if (!mounted) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.snackbarWrap, { bottom: Math.max(insets.bottom, 22) + 8 }]}
    >
      <Animated.View
        entering={FadeInDown.duration(180)}
        exiting={FadeOutUp.duration(220)}
        style={styles.snackbar}
      >
        <Text style={styles.snackbarText}>{renderedText}</Text>
      </Animated.View>
    </View>
  );
});

export default Snackbar;
