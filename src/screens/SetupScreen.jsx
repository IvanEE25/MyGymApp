import { memo, useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { styles, stylesVars } from '../theme';
import { LIMIT_DAYS } from '../constants';
import { filterDaysTyping, normalizeDaysOnBlur } from '../utils/filters';

const SetupScreen = memo(function SetupScreen({ t, lang, onChangeLanguage, onStart }) {
  const [daysValue, setDaysValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const onDaysChange = useCallback((v) => {
    setHasError(false);
    setDaysValue(filterDaysTyping(v));
  }, []);

  const onDaysBlur = useCallback(() => {
    setDaysValue((prev) => normalizeDaysOnBlur(prev));
  }, []);

  const onPressStart = useCallback(() => {
    const n = parseInt(daysValue, 10);
    if (!Number.isFinite(n) || n < 1) {
      setHasError(true);
      return;
    }
    setHasError(false);
    onStart(Math.min(n, LIMIT_DAYS));
  }, [daysValue, onStart]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={stylesVars.bg} />
      <View style={styles.shell}>
        <View style={styles.setupWrap}>
          <Text style={styles.setupTitle}>{t('setup_title')}</Text>

          <View style={styles.langRow}>
            {['ua', 'ru', 'en', 'ee'].map((l) => (
              <TouchableOpacity
                key={l}
                activeOpacity={0.85}
                onPress={() => onChangeLanguage(l)}
                style={[styles.langPill, lang === l && styles.langPillActive]}
              >
                <Text style={[styles.langPillText, lang === l && styles.langPillTextActive]}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.setupCard}>
            <Text style={styles.setupHint}>{t('setup_tip')}</Text>

            <TextInput
              style={[styles.input, hasError && styles.inputError]}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder={t('days_placeholder')}
              placeholderTextColor={stylesVars.muted2}
              value={daysValue}
              onChangeText={onDaysChange}
              onBlur={onDaysBlur}
              onSubmitEditing={onPressStart}
            />
            {hasError && <Text style={styles.errorText}>{t('days_required')}</Text>}

            <TouchableOpacity activeOpacity={0.85} style={styles.primaryBtn} onPress={onPressStart}>
              <Text style={styles.primaryBtnText}>{t('start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default SetupScreen;
