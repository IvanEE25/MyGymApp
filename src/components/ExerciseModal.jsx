import { memo, useCallback, useRef } from 'react';
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
import { normalizeIntensity } from '../utils/exercises';

const ExerciseModal = memo(function ExerciseModal({
  visible,
  t,
  editMode,
  newEx,
  errors,
  onChangeName,
  onChangeOneRm,
  onOneRmBlur,
  onOpenCalc,
  onPickIntensity,
  onIntensityInfo,
  onSave,
  onClose,
  onDelete,
}) {
  const nameRef = useRef(null);
  const oneRmRef = useRef(null);

  const handleShow = useCallback(() => {
    if (!editMode) {
      nameRef.current?.focus?.();
    }
  }, [editMode]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose} onShow={handleShow}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView behavior="padding" style={styles.modalKeyboardWrap}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation?.()}>
            <ScrollView
              style={{ maxHeight: 560 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>{editMode ? t('edit') : t('add')}</Text>

              <Text style={styles.fieldLabel}>{t('ex_name')}</Text>
              <TextInput
                ref={nameRef}
                style={[styles.input, errors?.name && styles.inputError]}
                placeholder={t('ex_name_placeholder')}
                placeholderTextColor={stylesVars.muted2}
                value={newEx.name}
                onChangeText={onChangeName}
                maxLength={60}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => oneRmRef.current?.focus?.()}
              />
              {errors?.name && <Text style={styles.errorText}>{t('ex_name_required')}</Text>}

              <Text style={styles.fieldLabel}>{t('one_rm')}</Text>
              <TextInput
                ref={oneRmRef}
                style={[styles.input, errors?.oneRM && styles.inputError]}
                placeholder={t('one_rm_placeholder')}
                placeholderTextColor={stylesVars.muted2}
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                value={String(newEx.oneRM ?? '')}
                onChangeText={onChangeOneRm}
                onBlur={onOneRmBlur}
                returnKeyType="done"
                onSubmitEditing={onSave}
              />
              {errors?.oneRM && <Text style={styles.errorText}>{t('one_rm_required')}</Text>}

              <TouchableOpacity activeOpacity={0.85} style={styles.secondaryBtn} onPress={onOpenCalc}>
                <Text style={styles.secondaryBtnText}>{t('calc_open')}</Text>
              </TouchableOpacity>

              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { marginBottom: 0, marginLeft: 0 }]}>{t('intensity_title')}</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onIntensityInfo}
                  accessibilityLabel={t('intensity_info')}
                >
                  <Text style={styles.infoIcon}>ℹ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.segmentRow}>
                {['low', 'mid', 'high'].map((k) => {
                  const active = normalizeIntensity(newEx.intensity) === k;
                  return (
                    <TouchableOpacity
                      key={k}
                      activeOpacity={0.85}
                      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                      onPress={() => onPickIntensity(k)}
                    >
                      <Text style={[styles.segmentText, active && styles.segmentTextActive, { opacity: active ? 1 : 0, fontSize: 10 }]}>✓</Text>
                      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t(`${k}_label`)}</Text>
                      <Text style={[styles.segmentScheme, active && styles.segmentTextActive]}>{t(`${k}_scheme`)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity activeOpacity={0.85} style={styles.primaryBtn} onPress={onSave}>
                <Text style={styles.primaryBtnText}>{t('save')}</Text>
              </TouchableOpacity>

              {editMode && (
                <TouchableOpacity activeOpacity={0.85} style={{ marginTop: 12 }} onPress={onDelete}>
                  <Text style={styles.dangerLink}>{t('delete_ex')}</Text>
                </TouchableOpacity>
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

export default ExerciseModal;
