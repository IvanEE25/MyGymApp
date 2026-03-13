import { memo } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../theme';

const LanguageModal = memo(function LanguageModal({ visible, onClose, t, onPick, lang }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation?.()}>
          <ScrollView
            style={{ maxHeight: 560 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>{t('lang_select')}</Text>

            <View style={{ gap: 10 }}>
              {[
                { key: 'ua', label: 'Українська 🇺🇦' },
                { key: 'ru', label: 'Русский' },
                { key: 'en', label: 'English 🇺🇸' },
                { key: 'ee', label: 'Eesti 🇪🇪' },
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.85}
                  style={[styles.langFullBtn, lang === key && styles.langFullBtnActive]}
                  onPress={() => onPick(key)}
                >
                  <Text style={[styles.langFullText, lang === key && styles.langFullTextActive]}>
                    {lang === key ? '✓  ' : ''}{label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity activeOpacity={0.85} style={{ marginTop: 14 }} onPress={onClose}>
              <Text style={styles.linkText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default LanguageModal;
