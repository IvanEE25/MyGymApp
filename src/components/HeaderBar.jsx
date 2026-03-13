import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../theme';

const HeaderBar = memo(function HeaderBar({ title, lang, onOpenLang, onOpenInfo }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerKicker}>{title}</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity activeOpacity={0.85} style={styles.headerChip} onPress={onOpenLang}>
          <Text style={styles.headerChipText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.headerChip} onPress={onOpenInfo}>
          <Text style={styles.headerChipText}>?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default HeaderBar;
