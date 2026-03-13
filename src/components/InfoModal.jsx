import { memo } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../theme';

const InfoModal = memo(function InfoModal({ visible, onClose, onResetData, t }) {
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
            <Text style={styles.modalTitle}>{t('logic_title')}</Text>

            <Text style={styles.infoTitle}>{t('intensity_title')}</Text>
            <Text style={styles.infoText}>{t('intensity_desc')}</Text>

            <Text style={styles.infoTitle}>{t('one_rm_title')}</Text>
            <Text style={styles.infoText}>{t('one_rm_desc')}</Text>

            <View style={styles.dangerZoneWrap}>
              <TouchableOpacity activeOpacity={0.85} style={styles.dangerBtn} onPress={onResetData}>
                <Text style={styles.dangerBtnText}>{t('reset_data')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={[styles.primaryBtn, { marginTop: 10 }]} onPress={onClose}>
              <Text style={styles.primaryBtnText}>{t('understood')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default InfoModal;
