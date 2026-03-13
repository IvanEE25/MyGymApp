import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { styles, stylesVars } from '../theme';

const EditableDayTitle = memo(function EditableDayTitle({ id, value, placeholder, onCommit }) {
  const [draft, setDraft] = useState(value ?? '');
  const lastCommittedRef = useRef(value ?? '');
  const ignoreNextBlurRef = useRef(false);

  useEffect(() => {
    const nextValue = value ?? '';
    setDraft(nextValue);
    lastCommittedRef.current = nextValue;
    ignoreNextBlurRef.current = false;
  }, [id, value]);

  const commitDraft = useCallback(() => {
    const nextValue = draft ?? '';
    const prevValue = value ?? '';
    if (nextValue === prevValue) return;
    if (lastCommittedRef.current === nextValue) return;
    lastCommittedRef.current = nextValue;
    onCommit(id, nextValue);
  }, [draft, id, onCommit, value]);

  const handleSubmitEditing = useCallback(() => {
    ignoreNextBlurRef.current = true;
    commitDraft();
  }, [commitDraft]);

  const handleBlur = useCallback(() => {
    if (ignoreNextBlurRef.current) {
      ignoreNextBlurRef.current = false;
      return;
    }
    commitDraft();
  }, [commitDraft]);

  return (
    <TextInput
      style={styles.dayTitleInput}
      value={draft}
      onChangeText={setDraft}
      onBlur={handleBlur}
      onSubmitEditing={handleSubmitEditing}
      blurOnSubmit
      placeholder={placeholder}
      placeholderTextColor={stylesVars.muted2}
      maxLength={40}
    />
  );
});

export default EditableDayTitle;
