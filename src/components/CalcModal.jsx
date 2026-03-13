import { memo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles, stylesVars } from '../theme';

const CalcModal = memo(function CalcModal({
  visible,
  t,
  unitKg,
  calcM,
  calcK,
  calcResult,
  errors,
  onChangeM,
  onBlurM,
  onChangeK,
  onBlurK,
  onCalc,
  onUse,
  onClose,
}) {
  const repsRef = useRef(null);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView behavior="padding" style={styles.modalKeyboardWrap}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation?.()}>
            <ScrollView
              style={{ maxHeight: 560 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>{t('calc_title')}</Text>
              <Text style={styles.hintText}>{t('calc_formula')}</Text>
              <Text style={styles.hintTextSmall}>{t('calc_limit')}</Text>

              <Text style={styles.fieldLabel}>{t('calc_weight')}</Text>
              <TextInput
                style={[styles.input, errors?.m && styles.inputError]}
                placeholder={t('calc_weight_placeholder')}
                placeholderTextColor={stylesVars.muted2}
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                value={calcM}
                onChangeText={onChangeM}
                onBlur={onBlurM}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => repsRef.current?.focus?.()}
              />
              {errors?.m && <Text style={styles.errorText}>{t('calc_weight_required')}</Text>}

              <Text style={styles.fieldLabel}>{t('calc_reps')}</Text>
              <TextInput
                ref={repsRef}
                style={[styles.input, errors?.k && styles.inputError]}
                placeholder={t('calc_reps_placeholder')}
                placeholderTextColor={stylesVars.muted2}
                keyboardType="number-pad"
                value={calcK}
                onChangeText={onChangeK}
                onBlur={onBlurK}
                returnKeyType="done"
                onSubmitEditing={onCalc}
              />
              {errors?.k && <Text style={styles.errorText}>{t('calc_reps_required')}</Text>}

              <TouchableOpacity activeOpacity={0.85} style={styles.primaryBtn} onPress={onCalc}>
                <Text style={styles.primaryBtnText}>{t('calc_calculate')}</Text>
              </TouchableOpacity>

              {calcResult != null && (
                <View style={{ marginTop: 14 }}>
                  <View style={styles.resultPill}>
                    <Text style={styles.resultText}>
                      {t('calc_result')}: {calcResult} {unitKg}
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.85} style={[styles.primaryBtn, { marginTop: 10 }]} onPress={onUse}>
                    <Text style={styles.primaryBtnText}>{t('calc_use')}</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity activeOpacity={0.85} onPress={onClose} style={{ marginTop: 12 }}>
                <Text style={styles.linkText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
});

export default CalcModal;
