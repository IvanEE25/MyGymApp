import { memo, useCallback } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../theme';

const DialogModal = memo(function DialogModal({ visible, title, message, buttons, onClose }) {
  const handleOverlayPress = useCallback(() => {
    const cancelBtn = (buttons || []).find((b) => b?.key === 'cancel');
    if (cancelBtn?.onPress) {
      cancelBtn.onPress();
    }
    onClose?.();
  }, [buttons, onClose]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleOverlayPress}>
      <Pressable style={styles.modalOverlay} onPress={handleOverlayPress}>
        <Pressable style={[styles.modalCard, styles.dialogCard]} onPress={(e) => e.stopPropagation?.()}>
          {!!title && <Text style={styles.dialogTitle}>{title}</Text>}
          {!!message && <Text style={styles.dialogBody}>{message}</Text>}

          <View style={styles.dialogBtnRow}>
            {(buttons || []).map((b, idx) => {
              const variant = b?.variant || 'secondary';
              const btnStyle =
                variant === 'danger'
                  ? styles.dangerBtn
                  : variant === 'primary'
                  ? styles.primaryBtn
                  : styles.secondaryBtn;

              const textStyle =
                variant === 'danger'
                  ? styles.dangerBtnText
                  : variant === 'primary'
                  ? styles.primaryBtnText
                  : styles.secondaryBtnText;

              return (
                <TouchableOpacity
                  key={b?.key || String(idx)}
                  activeOpacity={0.85}
                  style={[btnStyle, styles.dialogBtn]}
                  onPress={() => {
                    try {
                      b?.onPress?.();
                    } finally {
                      onClose?.();
                    }
                  }}
                >
                  <Text style={textStyle}>{b?.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default DialogModal;
