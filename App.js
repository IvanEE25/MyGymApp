import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Vibration } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TRANSLATIONS } from './src/locales';
import { PROGRESSION, INPUT_LIMITS, LIMIT_DAYS } from './src/constants';
import { clamp, fillTemplate, filterDecimalTyping, normalizeDecimalOnBlur, filterIntTyping, normalizeIntOnBlur } from './src/utils/filters';
import { normalizeIntensity, normalizeExerciseDraftForCompare, exerciseDraftsEqual, migrateExercises } from './src/utils/exercises';
import { parseDefaultDayName, renumberDays, migrateDays } from './src/utils/days';

import Splash from './src/components/Splash';
import DialogModal from './src/components/DialogModal';
import ExerciseModal from './src/components/ExerciseModal';
import CalcModal from './src/components/CalcModal';
import InfoModal from './src/components/InfoModal';
import LanguageModal from './src/components/LanguageModal';
import Snackbar from './src/components/Snackbar';
import SetupScreen from './src/screens/SetupScreen';
import MainScreen from './src/screens/MainScreen';

export default function App() {
  const [lang, setLang] = useState('ru');

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ru;
    return dict[key] ?? key;
  }, [lang]);

  const isCyrillic = lang === 'ru' || lang === 'ua';
  const unitKg = isCyrillic ? 'кг' : 'kg';
  const rmShort = isCyrillic ? '1ПМ' : '1RM';

  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [calcM, setCalcM] = useState('');
  const [calcK, setCalcK] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [calcErrors, setCalcErrors] = useState({ m: false, k: false });

  const [editMode, setEditMode] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const [newEx, setNewEx] = useState({ name: '', oneRM: '', intensity: 'mid', dayId: '' });
  const initialExerciseDraftRef = useRef(normalizeExerciseDraftForCompare({ name: '', oneRM: '', intensity: 'mid', dayId: '' }));
  const [exErrors, setExErrors] = useState({ name: false, oneRM: false });

  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', buttons: [] });

  const [doneFlashMap, setDoneFlashMap] = useState({});
  const doneFlashTimersRef = useRef({});

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const snackbarTimerRef = useRef(null);

  const [finishResetId, setFinishResetId] = useState(null);

  // ---- Save queue ----
  const saveQueueRef = useRef(Promise.resolve());
  const saveDebounceTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const daysRef = useRef(days);
  const exercisesRef = useRef(exercises);
  useEffect(() => { daysRef.current = days; }, [days]);
  useEffect(() => { exercisesRef.current = exercises; }, [exercises]);

  const commitSavePayload = useCallback((payload) => {
    const exStr = JSON.stringify(payload?.updatedExercises ?? []);
    const daysStr = JSON.stringify(payload?.updatedDays ?? []);

    saveQueueRef.current = saveQueueRef.current
      .then(() => AsyncStorage.multiSet([
        ['daysStructure', daysStr],
        ['exercises', exStr],
      ]))
      .catch((e) => console.error('Save Error:', e));
  }, []);

  const flushPendingSave = useCallback(() => {
    if (saveDebounceTimerRef.current) {
      clearTimeout(saveDebounceTimerRef.current);
      saveDebounceTimerRef.current = null;
    }
    const payload = pendingSaveRef.current;
    pendingSaveRef.current = null;
    if (payload) commitSavePayload(payload);
  }, [commitSavePayload]);

  useEffect(() => {
    return () => {
      Object.values(doneFlashTimersRef.current || {}).forEach((id) => { if (id) clearTimeout(id); });
      if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
      flushPendingSave();
    };
  }, [flushPendingSave]);

  const enqueueSave = useCallback((updatedExercises, updatedDays, options = {}) => {
    pendingSaveRef.current = { updatedExercises, updatedDays };

    if (options?.immediate) { flushPendingSave(); return; }

    const delay = options?.debounceMs ?? 700;
    if (saveDebounceTimerRef.current) clearTimeout(saveDebounceTimerRef.current);
    saveDebounceTimerRef.current = setTimeout(() => {
      saveDebounceTimerRef.current = null;
      const payload = pendingSaveRef.current;
      pendingSaveRef.current = null;
      if (payload) commitSavePayload(payload);
    }, delay);
  }, [commitSavePayload, flushPendingSave]);

  // ---- Load ----
  const loadData = useCallback(async () => {
    try {
      const pairs = await AsyncStorage.multiGet(['appLanguage', 'daysStructure', 'exercises']);
      const map = Object.fromEntries(pairs);

      const savedLang = map.appLanguage;
      const effectiveLang = savedLang && TRANSLATIONS[savedLang] ? savedLang : 'ru';
      setLang(effectiveLang);

      const savedDaysStruct = map.daysStructure;
      const savedEx = map.exercises;

      if (savedDaysStruct) {
        try {
          const rawDays = JSON.parse(savedDaysStruct);
          const rawExercises = savedEx ? JSON.parse(savedEx) : [];

          const loadedDays = migrateDays(rawDays, effectiveLang);
          const loadedExercises = migrateExercises(rawExercises);

          setDays(loadedDays);
          setExercises(loadedExercises);
          setIsSetupComplete(true);
          enqueueSave(loadedExercises, loadedDays, { immediate: true });
        } catch (parseErr) {
          console.error('Parse Error:', parseErr);
          await AsyncStorage.multiRemove(['daysStructure', 'exercises']);
        }
      }
    } catch (e) {
      console.error('Load Error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSave]);

  useEffect(() => { loadData(); }, [loadData]);

  // ---- Derived state ----
  const exercisesByDay = useMemo(() => {
    const map = {};
    for (const ex of exercises) {
      if (!map[ex.dayId]) map[ex.dayId] = [];
      map[ex.dayId].push(ex);
    }
    return map;
  }, [exercises]);

  // ---- Flash / Snackbar / Dialog ----
  const flashDoneCard = useCallback((id) => {
    if (!id) return;
    setDoneFlashMap((prev) => ({ ...prev, [id]: true }));
    const prevTimer = doneFlashTimersRef.current[id];
    if (prevTimer) clearTimeout(prevTimer);
    doneFlashTimersRef.current[id] = setTimeout(() => {
      setDoneFlashMap((prev) => { const next = { ...prev }; delete next[id]; return next; });
      delete doneFlashTimersRef.current[id];
    }, 500);
  }, []);

  const showSnackbar = useCallback((text, duration = 1800) => {
    if (!text) return;
    setSnackbarText(text);
    setSnackbarVisible(true);
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    snackbarTimerRef.current = setTimeout(() => setSnackbarVisible(false), duration);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((p) => ({ ...p, visible: false }));
  }, []);

  const showAlert = useCallback((title, message, onOk) => {
    setDialog({ visible: true, title, message, buttons: [{ key: 'ok', text: t('ok'), variant: 'primary', onPress: onOk }] });
  }, [t]);

  const showConfirm = useCallback((title, message, { onConfirm, onCancel, confirmText, cancelText, confirmVariant } = {}) => {
    setDialog({
      visible: true, title, message,
      buttons: [
        { key: 'cancel', text: cancelText || t('cancel'), variant: 'secondary', onPress: onCancel },
        { key: 'confirm', text: confirmText || t('ok'), variant: confirmVariant || 'primary', onPress: onConfirm },
      ],
    });
  }, [t]);

  // ---- Reset ----
  const resetAllData = useCallback(() => {
    showConfirm(t('reset_title'), t('reset_body'), {
      confirmText: t('reset_confirm'),
      confirmVariant: 'danger',
      onConfirm: async () => {
        try { await AsyncStorage.clear(); } catch (e) { console.error('Reset Error:', e); }
        setInfoModalVisible(false);
        setLangModalVisible(false);
        setCalcModalVisible(false);
        setModalVisible(false);
        setDialog({ visible: false, title: '', message: '', buttons: [] });
        setDays([]);
        setExercises([]);
        setIsSetupComplete(false);
        setLang('ru');
        setEditMode(false);
        setCurrentEditingId(null);
        setFinishResetId(null);
        setNewEx({ name: '', oneRM: '', intensity: 'mid', dayId: '' });
        setExErrors({ name: false, oneRM: false });
        setCalcM('');
        setCalcK('');
        setCalcResult(null);
        setCalcErrors({ m: false, k: false });
        setDoneFlashMap({});
        setSnackbarVisible(false);
        setSnackbarText('');
      },
    });
  }, [showConfirm, t]);

  // ---- Language ----
  const updateDefaultDayNamesForLang = useCallback((updatedLang) => {
    const updatedDays = (daysRef.current || []).map((d) => {
      const parsed = parseDefaultDayName(d?.name);
      const isDefaultName = typeof d?.isDefaultName === 'boolean' ? d.isDefaultName : !!parsed;
      const num = Number.isFinite(d?.num) && d.num > 0 ? d.num : 1;
      if (!isDefaultName) return { ...d, num };
      return { ...d, num, isDefaultName: true, name: `${TRANSLATIONS[updatedLang].day_default} ${num}` };
    });
    setDays(updatedDays);
    if (isSetupComplete) enqueueSave(exercisesRef.current, updatedDays);
  }, [enqueueSave, isSetupComplete]);

  const changeLanguage = useCallback(async (newLang) => {
    setLang(newLang);
    setLangModalVisible(false);
    await AsyncStorage.setItem('appLanguage', newLang);
    updateDefaultDayNamesForLang(newLang);
  }, [updateDefaultDayNamesForLang]);

  // ---- Day management ----
  const addDay = useCallback(() => {
    if (daysRef.current.length >= LIMIT_DAYS) { showAlert(t('limit_title'), t('limit_body')); return; }
    const newDayId = Date.now().toString();
    const nextNum = daysRef.current.length + 1;
    const updatedRaw = [...daysRef.current, { id: newDayId, num: nextNum, isDefaultName: true, name: `${t('day_default')} ${nextNum}` }];
    const updatedDays = renumberDays(updatedRaw, lang);
    setDays(updatedDays);
    enqueueSave(exercisesRef.current, updatedDays);
  }, [enqueueSave, lang, showAlert, t]);

  const deleteDay = useCallback((dayId) => {
    showConfirm(t('delete_title'), t('delete_day_confirm'), {
      confirmText: t('delete'), confirmVariant: 'danger',
      onConfirm: () => {
        const updatedRawDays = (daysRef.current || []).filter((d) => d.id !== dayId);
        const updatedExercises = (exercisesRef.current || []).filter((ex) => ex.dayId !== dayId);
        const updatedDays = renumberDays(updatedRawDays, lang);
        setDays(updatedDays);
        setExercises(updatedExercises);
        enqueueSave(updatedExercises, updatedDays);
      },
    });
  }, [enqueueSave, lang, showConfirm, t]);

  const renameDay = useCallback((id, newName) => {
    const updatedDays = (daysRef.current || []).map((d) => {
      if (d.id !== id) return d;
      if (String(newName ?? '').trim() === '') return { ...d, name: `${t('day_default')} ${d.num}`, isDefaultName: true };
      return { ...d, name: newName, isDefaultName: false };
    });
    setDays(updatedDays);
    enqueueSave(exercisesRef.current, updatedDays);
  }, [enqueueSave, t]);

  // ---- Exercise progression ----
  const handleComplete = useCallback((id) => {
    const list = exercisesRef.current || [];
    const ex = list.find((x) => x.id === id);
    if (!ex) return;

    const currentWeek = parseInt(ex.week, 10) || 1;
    const currentStage = parseInt(ex.stage, 10) || 1;
    let nWeek = currentWeek + 1;
    let nStage = currentStage;

    if (nWeek > PROGRESSION.totalWeeks) { nWeek = 1; nStage += 1; }

    if (nStage > PROGRESSION.totalStages) {
      showConfirm(t('finish_title'), t('finish_body'), {
        confirmText: t('finish_update'), cancelText: t('cancel'), confirmVariant: 'primary',
        onConfirm: () => {
          const nextDraft = { ...ex, oneRM: String(ex.oneRM ?? ''), intensity: normalizeIntensity(ex.intensity) };
          initialExerciseDraftRef.current = normalizeExerciseDraftForCompare(nextDraft);
          setFinishResetId(ex.id);
          setNewEx(nextDraft);
          setCurrentEditingId(ex.id);
          setEditMode(true);
          setModalVisible(true);
        },
      });
      return;
    }

    const updated = list.map((x) => (x.id === id ? { ...x, week: nWeek, stage: nStage } : x));
    setExercises(updated);
    enqueueSave(updated, daysRef.current, { debounceMs: 350 });
    flashDoneCard(id);

    if (nStage !== currentStage) {
      showSnackbar(fillTemplate(t('stage_change_toast'), { stage: nStage, week: nWeek }), 3000);
    } else if (nWeek > currentWeek) {
      showSnackbar(fillTemplate(t('week_change_toast'), { week: nWeek }));
    }

    Vibration.vibrate(40);
  }, [enqueueSave, flashDoneCard, showConfirm, showSnackbar, t]);

  const handleStepBack = useCallback((id) => {
    const list = exercisesRef.current || [];
    const ex = list.find((item) => item.id === id);
    if (!ex) return;

    const currentWeek = parseInt(ex.week, 10) || 1;
    const currentStage = parseInt(ex.stage, 10) || 1;
    let nWeek = currentWeek - 1;
    let nStage = currentStage;

    if (nWeek < 1) {
      if (nStage > 1) { nStage -= 1; nWeek = PROGRESSION.totalWeeks; }
      else { showSnackbar(t('cycle_start_toast')); return; }
    }

    const updated = list.map((item) => item.id === id ? { ...item, week: nWeek, stage: nStage } : item);
    setExercises(updated);
    enqueueSave(updated, daysRef.current, { debounceMs: 350 });
    showSnackbar(fillTemplate(t('step_back_toast'), { stage: nStage, week: nWeek }));
  }, [enqueueSave, showSnackbar, t]);

  // ---- Add / edit exercise ----
  const openAddExercise = useCallback((dayId) => {
    const nextDraft = { name: '', oneRM: '', intensity: 'mid', dayId };
    setEditMode(false);
    setCurrentEditingId(null);
    setFinishResetId(null);
    initialExerciseDraftRef.current = normalizeExerciseDraftForCompare(nextDraft);
    setNewEx(nextDraft);
    setExErrors({ name: false, oneRM: false });
    setModalVisible(true);
  }, []);

  const editExercise = useCallback((ex) => {
    const nextDraft = { ...ex, oneRM: String(ex.oneRM ?? ''), intensity: normalizeIntensity(ex.intensity) };
    setExErrors({ name: false, oneRM: false });
    setFinishResetId(null);
    initialExerciseDraftRef.current = normalizeExerciseDraftForCompare(nextDraft);
    setNewEx(nextDraft);
    setCurrentEditingId(ex.id);
    setEditMode(true);
    setModalVisible(true);
  }, []);

  const forceCloseExerciseModal = useCallback(() => {
    setModalVisible(false);
    setEditMode(false);
    setCurrentEditingId(null);
    setFinishResetId(null);
    initialExerciseDraftRef.current = normalizeExerciseDraftForCompare({ name: '', oneRM: '', intensity: 'mid', dayId: '' });
    setNewEx({ name: '', oneRM: '', intensity: 'mid', dayId: '' });
    setExErrors({ name: false, oneRM: false });
  }, []);

  const requestCloseExerciseModal = useCallback(() => {
    const hasUnsavedChanges = !exerciseDraftsEqual(normalizeExerciseDraftForCompare(newEx), initialExerciseDraftRef.current);
    if (!hasUnsavedChanges) { forceCloseExerciseModal(); return; }
    showConfirm(t('discard_changes_title'), t('discard_changes_body'), {
      confirmText: t('discard_changes_confirm'), cancelText: t('cancel'), confirmVariant: 'danger',
      onConfirm: forceCloseExerciseModal,
    });
  }, [forceCloseExerciseModal, newEx, showConfirm, t]);

  const addOrUpdateExercise = useCallback(() => {
    const trimmedName = (newEx.name || '').trim();
    const nameOk = trimmedName.length > 0;
    const one = parseFloat(String(newEx.oneRM).replace(',', '.'));
    const oneClamped = Number.isFinite(one) ? clamp(one, 0, INPUT_LIMITS.oneRmMaxKg) : NaN;
    const oneOk = Number.isFinite(oneClamped) && oneClamped > 0;

    if (!nameOk || !oneOk) { setExErrors({ name: !nameOk, oneRM: !oneOk }); return; }

    const saveExercise = (resetProgressOnEdit = false) => {
      let updated;
      if (editMode) {
        updated = (exercisesRef.current || []).map((ex) => {
          if (ex.id !== currentEditingId) return ex;
          return {
            ...ex,
            name: trimmedName,
            oneRM: String(oneClamped),
            intensity: normalizeIntensity(newEx.intensity),
            week: resetProgressOnEdit ? 1 : ex.week,
            stage: resetProgressOnEdit ? 1 : ex.stage,
          };
        });
      } else {
        updated = [
          ...(exercisesRef.current || []),
          {
            ...newEx,
            name: trimmedName,
            oneRM: String(oneClamped),
            intensity: normalizeIntensity(newEx.intensity),
            id: Date.now().toString(),
            week: 1,
            stage: 1,
          },
        ];
      }
      setExercises(updated);
      enqueueSave(updated, daysRef.current);
      setFinishResetId(null);
      forceCloseExerciseModal();
    };

    if (!editMode) { saveExercise(false); return; }

    const currentExercise = (exercisesRef.current || []).find((ex) => ex.id === currentEditingId);
    if (!currentExercise) { saveExercise(false); return; }

    const prevOne = parseFloat(String(currentExercise.oneRM).replace(',', '.'));
    const oneRmChanged = !Number.isFinite(prevOne) || Math.abs(prevOne - oneClamped) > 1e-6;
    const shouldForceReset = finishResetId === currentExercise.id;

    if (shouldForceReset) { saveExercise(true); return; }

    if (oneRmChanged) {
      showConfirm(t('one_rm_changed_title'), t('one_rm_changed_body'), {
        confirmText: t('reset_confirm'), cancelText: t('keep_progress'), confirmVariant: 'danger',
        onConfirm: () => saveExercise(true),
        onCancel: () => saveExercise(false),
      });
      return;
    }

    saveExercise(false);
  }, [currentEditingId, editMode, enqueueSave, finishResetId, forceCloseExerciseModal, newEx, showConfirm, t]);

  const deleteExercise = useCallback(() => {
    showConfirm(t('delete_title'), t('delete_ex_confirm'), {
      confirmText: t('delete'), confirmVariant: 'danger',
      onConfirm: () => {
        const updated = (exercisesRef.current || []).filter((ex) => ex.id !== currentEditingId);
        setExercises(updated);
        enqueueSave(updated, daysRef.current);
        forceCloseExerciseModal();
      },
    });
  }, [currentEditingId, enqueueSave, forceCloseExerciseModal, showConfirm, t]);

  // ---- 1RM calculator ----
  const openCalc = useCallback(() => {
    setCalcM(''); setCalcK(''); setCalcResult(null); setCalcErrors({ m: false, k: false });
    setCalcModalVisible(true);
  }, []);

  const calcOneRM = useCallback(() => {
    Keyboard.dismiss();
    const mRaw = parseFloat(String(calcM).replace(',', '.'));
    const kRaw = parseInt(calcK, 10);
    const mOk = Number.isFinite(mRaw) && mRaw > 0;
    const kOk = Number.isFinite(kRaw) && kRaw > 0;

    if (!mOk || !kOk) { setCalcErrors({ m: !mOk, k: !kOk }); setCalcResult(null); return; }
    setCalcErrors({ m: false, k: false });

    const m = clamp(mRaw, 0, INPUT_LIMITS.oneRmMaxKg);
    const k = clamp(kRaw, 1, INPUT_LIMITS.repsMax);
    setCalcResult(clamp(Math.round((m * k) / 30 + m), 0, INPUT_LIMITS.oneRmMaxKg));
  }, [calcK, calcM]);

  const useCalcResult = useCallback(() => {
    if (calcResult == null) return;
    setNewEx((prev) => ({ ...prev, oneRM: String(calcResult) }));
    setCalcModalVisible(false);
  }, [calcResult]);

  // ---- Setup ----
  const onStartSetup = useCallback((num) => {
    if (!Number.isFinite(num) || num < 1) return;
    const now = Date.now();
    const createdDays = Array.from({ length: num }, (_, i) => ({
      id: String(now + i), num: i + 1, isDefaultName: true,
      name: `${t('day_default')} ${i + 1}`,
    }));
    const normalized = renumberDays(createdDays, lang);
    setDays(normalized);
    setExercises([]);
    setIsSetupComplete(true);
    enqueueSave([], normalized);
  }, [enqueueSave, lang, t]);

  // ---- Render ----
  const content = useMemo(() => {
    if (isLoading) return <Splash />;

    if (!isSetupComplete) {
      return (
        <SetupScreen
          t={t} lang={lang}
          onChangeLanguage={changeLanguage}
          onStart={onStartSetup}
        />
      );
    }

    return (
      <MainScreen
        t={t} lang={lang} unitKg={unitKg} rmShort={rmShort}
        days={days} exercises={exercises} exercisesByDay={exercisesByDay}
        doneFlashMap={doneFlashMap}
        onOpenLang={() => setLangModalVisible(true)}
        onOpenInfo={() => setInfoModalVisible(true)}
        onAddDay={addDay} onRenameDay={renameDay} onDeleteDay={deleteDay}
        onAddExercise={openAddExercise} onEditExercise={editExercise}
        onStepBack={handleStepBack} onComplete={handleComplete}
        onShowAlert={showAlert}
      />
    );
  }, [
    addDay, changeLanguage, days, deleteDay, editExercise, exercises,
    exercisesByDay, handleComplete, handleStepBack, isLoading, isSetupComplete,
    lang, onStartSetup, openAddExercise, renameDay, rmShort, doneFlashMap,
    showAlert, t, unitKg,
  ]);

  return (
    <SafeAreaProvider>
      {content}

      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        onResetData={resetAllData}
        t={t}
      />

      <LanguageModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        t={t} onPick={changeLanguage} lang={lang}
      />

      <ExerciseModal
        visible={modalVisible} t={t} editMode={editMode} newEx={newEx} errors={exErrors}
        onChangeName={(v) => { setExErrors((p) => ({ ...p, name: false })); setNewEx((p) => ({ ...p, name: v })); }}
        onChangeOneRm={(v) => { setExErrors((p) => ({ ...p, oneRM: false })); setNewEx((p) => ({ ...p, oneRM: filterDecimalTyping(v) })); }}
        onOneRmBlur={() => setNewEx((p) => ({ ...p, oneRM: normalizeDecimalOnBlur(p.oneRM) }))}
        onOpenCalc={openCalc}
        onPickIntensity={(k) => setNewEx((p) => ({ ...p, intensity: k }))}
        onIntensityInfo={() => showAlert(t('intensity_title'), t('intensity_desc'))}
        onSave={addOrUpdateExercise}
        onClose={requestCloseExerciseModal}
        onDelete={deleteExercise}
      />

      <CalcModal
        visible={calcModalVisible} t={t} unitKg={unitKg}
        calcM={calcM} calcK={calcK} calcResult={calcResult} errors={calcErrors}
        onChangeM={(v) => { setCalcErrors((p) => ({ ...p, m: false })); setCalcResult(null); setCalcM(filterDecimalTyping(v)); }}
        onBlurM={() => setCalcM(normalizeDecimalOnBlur(calcM))}
        onChangeK={(v) => { setCalcErrors((p) => ({ ...p, k: false })); setCalcResult(null); setCalcK(filterIntTyping(v)); }}
        onBlurK={() => setCalcK(normalizeIntOnBlur(calcK, 1, INPUT_LIMITS.repsMax))}
        onCalc={calcOneRM} onUse={useCalcResult}
        onClose={() => { setCalcModalVisible(false); setCalcErrors({ m: false, k: false }); }}
      />

      <DialogModal
        visible={dialog.visible} title={dialog.title}
        message={dialog.message} buttons={dialog.buttons}
        onClose={closeDialog}
      />

      <Snackbar visible={snackbarVisible} text={snackbarText} />
    </SafeAreaProvider>
  );
}
