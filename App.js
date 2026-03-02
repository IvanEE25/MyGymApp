import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, StatusBar, KeyboardAvoidingView, Platform,
  useWindowDimensions
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// --- 1. СЛОВАРЬ ПЕРЕВОДОВ ---
const TRANSLATIONS = {
  ru: {
    setup_title: "Настройка",
    how_many_days: "Сколько дней в неделю тренируетесь?",
    start: "Начать",
    app_title: "ДНЕВНИК КАЧКА",
    day_default: "ДЕНЬ",
    delete_title: "Удаление",
    delete_day_confirm: "Удалить этот день и упражнения?",
    cancel: "Отмена",
    delete: "Удалить",
    rename_placeholder: "Название",
    finish_title: "Финиш!",
    finish_body: "Цикл завершен. Обновите 1ПМ.",
    ok: "ОК",
    add_exercise: "+ Упражнение",
    add_day: "+ Добавить день",
    logic_title: "Справка",
    understood: "Понятно",
    edit: "Изменить",
    add: "Добавить",
    ex_name: "Упражнение",
    one_rm: "1ПМ (кг)",
    save: "Сохранить",
    delete_ex: "Удалить упражнение",
    stage: "Эт.",
    week: "Нед.",
    low: "Лёгкая 4x8",
    mid: "Средняя 3x12",
    high: "Тяжёлая 3x16",
    limit_title: "Лимит",
    limit_body: "В неделе всего 7 дней.",
    done: "Готово",
    lang_select: "Выберите язык / Select Language",

    intensity_title: "Интенсивность",
    intensity_desc:
      "• Лёгкая — меньше повторений, больше вес. Подходит для силы.\n" +
      "• Средняя — баланс веса и повторений.\n" +
      "• Тяжёлая — больше повторений, меньше вес. Подходит для техники и «объёма».",
    one_rm_title: "1ПМ",
    one_rm_desc:
      "1ПМ — максимальный вес на 1 повтор с правильной техникой. " +
      "Если не знаете свой 1ПМ, посчитайте его в калькуляторе по формуле Эпли.",

    calc_open: "Калькулятор 1ПМ",
    calc_title: "Калькулятор 1ПМ",
    calc_formula: "Формула Эпли: 1ПМ = (M × k) / 30 + M",
    calc_weight: "Вес (M), кг",
    calc_reps: "Повторения (k), 1–30",
    calc_calculate: "Посчитать",
    calc_use: "Использовать",
    calc_result: "Результат",
    calc_limit: "Максимум 30 повторений."
  },

  uk: {
    setup_title: "Налаштування",
    how_many_days: "Скільки днів на тиждень ви тренуєтесь?",
    start: "Почати",
    app_title: "ЩОДЕННИК КАЧКА",
    day_default: "ДЕНЬ",
    delete_title: "Видалення",
    delete_day_confirm: "Видалити цей день і вправи?",
    cancel: "Скасувати",
    delete: "Видалити",
    rename_placeholder: "Назва",
    finish_title: "Фініш!",
    finish_body: "Цикл завершено. Оновіть 1ПМ.",
    ok: "ОК",
    add_exercise: "+ Вправа",
    add_day: "+ Додати день",
    logic_title: "Довідка",
    understood: "Зрозуміло",
    edit: "Змінити",
    add: "Додати",
    ex_name: "Вправа",
    one_rm: "1ПМ (кг)",
    save: "Зберегти",
    delete_ex: "Видалити вправу",
    stage: "Ет.",
    week: "Тиж.",
    low: "Легка 4x8",
    mid: "Середня 3x12",
    high: "Важка 3x16",
    limit_title: "Ліміт",
    limit_body: "У тижні всього 7 днів.",
    done: "Готово",
    lang_select: "Оберіть мову",

    intensity_title: "Інтенсивність",
    intensity_desc:
      "• Легка — менше повторень, більша вага. Для розвитку сили.\n" +
      "• Середня — баланс ваги й повторень.\n" +
      "• Важка — більше повторень, менша вага. Для техніки та «об’єму».",
    one_rm_title: "1ПМ",
    one_rm_desc:
      "1ПМ — максимальна вага на 1 повтор з правильною технікою. " +
      "Якщо не знаєте свій 1ПМ, порахуйте його в калькуляторі за формулою Еплі.",

    calc_open: "Калькулятор 1ПМ",
    calc_title: "Калькулятор 1ПМ",
    calc_formula: "Формула Еплі: 1ПМ = (M × k) / 30 + M",
    calc_weight: "Вага (M), кг",
    calc_reps: "Повторення (k), 1–30",
    calc_calculate: "Порахувати",
    calc_use: "Використати",
    calc_result: "Результат",
    calc_limit: "Максимум 30 повторень."
  },

  en: {
    setup_title: "Setup",
    how_many_days: "How many days a week do you train?",
    start: "Start",
    app_title: "GYM DIARY",
    day_default: "DAY",
    delete_title: "Delete",
    delete_day_confirm: "Delete this day and exercises?",
    cancel: "Cancel",
    delete: "Delete",
    rename_placeholder: "Name",
    finish_title: "Finish!",
    finish_body: "Cycle complete. Update 1RM.",
    ok: "OK",
    add_exercise: "+ Exercise",
    add_day: "+ Add Day",
    logic_title: "Help",
    understood: "Understood",
    edit: "Edit",
    add: "Add",
    ex_name: "Exercise name",
    one_rm: "1RM (kg)",
    save: "Save",
    delete_ex: "Delete exercise",
    stage: "St.",
    week: "Wk.",
    low: "Low 4x8",
    mid: "Mid 3x12",
    high: "High 3x16",
    limit_title: "Limit",
    limit_body: "Only 7 days in a week.",
    done: "Done",
    lang_select: "Select Language",

    intensity_title: "Intensity",
    intensity_desc:
      "• Low — fewer reps, heavier weight. Great for strength.\n" +
      "• Mid — a balance of weight and reps.\n" +
      "• High — more reps, lighter weight. Great for technique and volume.",
    one_rm_title: "1RM",
    one_rm_desc:
      "1RM is the maximum weight you can lift for 1 clean rep. " +
      "If you don’t know your 1RM, calculate it with the in-app Epley calculator.",

    calc_open: "1RM Calculator",
    calc_title: "1RM Calculator",
    calc_formula: "Epley formula: 1RM = (M × k) / 30 + M",
    calc_weight: "Weight (M), kg",
    calc_reps: "Reps (k), 1–30",
    calc_calculate: "Calculate",
    calc_use: "Use",
    calc_result: "Result",
    calc_limit: "Max 30 reps."
  },

  et: {
    setup_title: "Seadistamine",
    how_many_days: "Mitu päeva nädalas sa treenid?",
    start: "Alusta",
    app_title: "JÕUSAALI PÄEVIK",
    day_default: "PÄEV",
    delete_title: "Kustutamine",
    delete_day_confirm: "Kustuta see päev ja harjutused?",
    cancel: "Loobu",
    delete: "Kustuta",
    rename_placeholder: "Nimetus",
    finish_title: "Valmis!",
    finish_body: "Tsükkel läbi. Uuenda 1RM.",
    ok: "OK",
    add_exercise: "+ Harjutus",
    add_day: "+ Lisa päev",
    logic_title: "Abi",
    understood: "Arusaadav",
    edit: "Muuda",
    add: "Lisa",
    ex_name: "Harjutus",
    one_rm: "1RM (kg)",
    save: "Salvesta",
    delete_ex: "Kustuta harjutus",
    stage: "Et.",
    week: "Näd.",
    low: "Madal 4x8",
    mid: "Keskm.3x12",
    high: "Kõrge 3x16",
    limit_title: "Limiit",
    limit_body: "Nädalas on ainult 7 päeva.",
    done: "Valmis",
    lang_select: "Vali keel",

    intensity_title: "Intensiivsus",
    intensity_desc:
      "• Madal — vähem kordusi, raskem kaal. Hea jõu arendamiseks.\n" +
      "• Keskmine — tasakaal raskuse ja korduste vahel.\n" +
      "• Kõrge — rohkem kordusi, kergem raskus. Hea tehnika ja mahu jaoks.",
    one_rm_title: "1RM",
    one_rm_desc:
      "1RM on maksimaalne raskus ühele korrektsele kordusele. " +
      "Kui sa ei tea oma 1RM-i, arvuta see rakenduse Epley kalkulaatoriga.",

    calc_open: "1RM kalkulaator",
    calc_title: "1RM kalkulaator",
    calc_formula: "Epley valem: 1RM = (M × k) / 30 + M",
    calc_weight: "Raskus (M), kg",
    calc_reps: "Kordused (k), 1–30",
    calc_calculate: "Arvuta",
    calc_use: "Kasuta",
    calc_result: "Tulemus",
    calc_limit: "Maksimaalselt 30 kordust."
  }
};

// ---------- Helpers ----------
const ALL_DAY_PREFIXES = [
  TRANSLATIONS.ru.day_default,
  TRANSLATIONS.uk.day_default,
  TRANSLATIONS.en.day_default,
  TRANSLATIONS.et.day_default
];

const normalizeIntensity = (value) => {
  if (value === 'Низкая') return 'low';
  if (value === 'Средняя') return 'mid';
  if (value === 'Высокая') return 'high';
  if (value === 'low' || value === 'mid' || value === 'high') return value;
  return 'mid';
};

const parseDefaultDayName = (name) => {
  if (!name) return null;
  const trimmed = String(name).trim();
  const match = trimmed.match(/^(.*)\s+(\d+)$/);
  if (!match) return null;
  const prefix = match[1].trim();
  const num = parseInt(match[2], 10);
  if (!Number.isFinite(num)) return null;
  if (ALL_DAY_PREFIXES.includes(prefix)) return { prefix, num };
  return null;
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const sanitizeDecimalInput = (raw, max = 1000) => {
  let s = String(raw ?? '').replace(',', '.');
  s = s.replace(/[^0-9.]/g, '');
  const parts = s.split('.');
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('');
  if (s.startsWith('.')) s = '0' + s;
  const [intPart, decPart] = s.split('.');
  let out = intPart;
  if (decPart !== undefined) out += '.' + decPart.slice(0, 2);
  const num = parseFloat(out);
  if (Number.isFinite(num) && num > max) return String(max);
  return out;
};

const sanitizeIntInput = (raw, max = 30) => {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return '';
  return String(clamp(n, 1, max));
};
const confirmDialog = (title, message, onConfirm, t) => {
  // WEB: нормальный confirm с кнопками
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) onConfirm();
    return;
  }

  // iOS/Android: обычный Alert.alert с кнопками
  Alert.alert(title, message, [
    { text: t('cancel'), style: 'cancel' },
    { text: t('delete'), style: 'destructive', onPress: onConfirm },
  ]);
};

const alertWithOk = (title, message, onOk, t) => {
  // WEB
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
    return;
  }

  // iOS/Android
  Alert.alert(title, message, [{ text: t('ok'), onPress: onOk }]);
};
export default function App() {
  const [lang, setLang] = useState('ru');
  const t = (key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ? TRANSLATIONS[lang][key] : key;

  const isCyrillic = lang === 'ru' || lang === 'uk';
  const unitKg = isCyrillic ? 'кг' : 'kg';
  const rmShort = isCyrillic ? '1ПМ' : '1RM';

  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 768;

  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [calcM, setCalcM] = useState('');
  const [calcK, setCalcK] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);

  const [newEx, setNewEx] = useState({ name: '', oneRM: '', intensity: 'mid', dayId: '' });

  useEffect(() => { loadData(); }, []);

  // Web: блокируем скролл страницы под модалкой
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;

    const anyModalOpen = modalVisible || infoModalVisible || langModalVisible || calcModalVisible;
    const prev = document.body.style.overflow;

    if (anyModalOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [modalVisible, infoModalVisible, langModalVisible, calcModalVisible]);

  const migrateDays = (loadedDays) => {
    if (!Array.isArray(loadedDays)) return [];
    return loadedDays.map((d, i) => {
      const parsed = parseDefaultDayName(d?.name);
      const isDefaultName = (typeof d?.isDefaultName === 'boolean')
        ? d.isDefaultName
        : !!parsed;

      const num = (Number.isFinite(d?.num) && d.num > 0)
        ? d.num
        : (parsed?.num ?? (i + 1));

      const name = isDefaultName
        ? `${TRANSLATIONS[lang].day_default} ${num}`
        : (d?.name ?? `${TRANSLATIONS[lang].day_default} ${num}`);

      return { ...d, num, isDefaultName, name };
    });
  };

  const migrateExercises = (loadedExercises) => {
    if (!Array.isArray(loadedExercises)) return [];
    return loadedExercises.map(ex => ({
      ...ex,
      intensity: normalizeIntensity(ex.intensity),
    }));
  };

  const loadData = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);

      const savedDaysStruct = await AsyncStorage.getItem('daysStructure');
      const savedEx = await AsyncStorage.getItem('exercises');

      if (savedDaysStruct) {
        const rawDays = JSON.parse(savedDaysStruct);
        const rawExercises = savedEx ? JSON.parse(savedEx) : [];

        const loadedDays = migrateDays(rawDays);
        const loadedExercises = migrateExercises(rawExercises);

        setDays(loadedDays);
        setExercises(loadedExercises);
        setIsSetupComplete(true);

        await AsyncStorage.setItem('daysStructure', JSON.stringify(loadedDays));
        await AsyncStorage.setItem('exercises', JSON.stringify(loadedExercises));
      }
    } catch (e) {
      console.error("Load Error:", e);
    }
  };

  const saveData = async (updatedExercises, updatedDays) => {
    try {
      await AsyncStorage.setItem('daysStructure', JSON.stringify(updatedDays));
      await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));
    } catch (e) { console.error("Save Error:", e); }
  };

  const updateDefaultDayNamesForLang = (updatedLang) => {
    const updatedDays = (days || []).map((d, i) => {
      const parsed = parseDefaultDayName(d?.name);
      const isDefaultName = (typeof d?.isDefaultName === 'boolean')
        ? d.isDefaultName
        : !!parsed;

      const num = (Number.isFinite(d?.num) && d.num > 0)
        ? d.num
        : (parsed?.num ?? (i + 1));

      if (!isDefaultName) return { ...d, num };
      return { ...d, num, isDefaultName: true, name: `${TRANSLATIONS[updatedLang].day_default} ${num}` };
    });

    setDays(updatedDays);
    if (isSetupComplete) saveData(exercises, updatedDays);
  };

  const changeLanguage = async (newLang) => {
    setLang(newLang);
    setLangModalVisible(false);
    await AsyncStorage.setItem('appLanguage', newLang);
    updateDefaultDayNamesForLang(newLang);
  };

  // --- ЛОГИКА (не меняем) ---
  const calculateWeight = (ex) => {
    let basePercent = 0.70;
    const intensity = normalizeIntensity(ex.intensity);

    if (intensity === 'mid') basePercent = 0.60;
    if (intensity === 'high') basePercent = 0.50;

    const weekNum = parseInt(ex.week, 10);
    const stageNum = parseInt(ex.stage, 10);
    const oneRmNum = parseFloat(ex.oneRM);

    if (!Number.isFinite(weekNum) || !Number.isFinite(stageNum) || !Number.isFinite(oneRmNum)) return "0.0";

    let currentPercent = basePercent + (weekNum - 1) * 0.05;
    let weight = oneRmNum * currentPercent;
    if (stageNum === 2) weight += 5;
    return weight.toFixed(1);
  };

  const calculateSets = (ex) => {
    const intensity = normalizeIntensity(ex.intensity);
    const isLow = intensity === 'low';
    let baseSets = isLow ? 4 : 3;
    return (parseInt(ex.week, 10) === 4) ? baseSets - 1 : baseSets;
  };

  const calculateReps = (ex) => {
    const intensity = normalizeIntensity(ex.intensity);
    const intensityBase = { low: 8, mid: 12, high: 16 };
    const base = intensityBase[intensity] ?? 12;
    const weekNum = parseInt(ex.week, 10);
    if (!Number.isFinite(weekNum)) return base;
    const calculated = base - (weekNum - 1) * 2;
    return calculated > 0 ? calculated : 1;
  };

  // --- DAY MANAGEMENT ---
  const getNextDayNumber = () => {
    const nums = (days || []).map(d => {
      if (Number.isFinite(d?.num) && d.num > 0) return d.num;
      const parsed = parseDefaultDayName(d?.name);
      return parsed?.num ?? 0;
    });
    const maxNum = nums.length ? Math.max(...nums) : 0;
    return maxNum + 1;
  };

  const addDay = () => {
    if (days.length >= 7) { Alert.alert(t('limit_title'), t('limit_body')); return; }
    const newDayId = Date.now().toString();
    const nextNum = getNextDayNumber();
    const updatedDays = [...days, { id: newDayId, num: nextNum, isDefaultName: true, name: `${t('day_default')} ${nextNum}` }];
    setDays(updatedDays);
    saveData(exercises, updatedDays);
  };

  const deleteDay = (dayId) => {
    confirmDialog(
     t('delete_title'),
     t('delete_day_confirm'),
      () => {
      const updatedDays = days.filter(d => d.id !== dayId);
      const updatedExercises = exercises.filter(ex => ex.dayId !== dayId);
      setDays(updatedDays);
      setExercises(updatedExercises);
      saveData(updatedExercises, updatedDays);
      },
      t
    );
  };

  const renameDay = (id, newName) => {
    const updatedDays = days.map(d => d.id === id ? { ...d, name: newName, isDefaultName: false } : d);
    setDays(updatedDays);
    saveData(exercises, updatedDays);
  };

  // --- EXERCISE PROGRESSION ---
  const handleComplete = (id) => {
    const updated = exercises.map(ex => {
      if (ex.id === id) {
        let nWeek = parseInt(ex.week, 10) + 1;
        let nStage = parseInt(ex.stage, 10);

        if (nWeek > 4) { nWeek = 1; nStage += 1; }

        if (nStage > 2) {
  alertWithOk(
    t('finish_title'),
    t('finish_body'),
    () => editExercise(ex),
    t
  );
  return { ...ex, week: 1, stage: 1 };
}
        return { ...ex, week: nWeek, stage: nStage };
      }
      return ex;
    });
    setExercises(updated); saveData(updated, days);
  };

  const handleStepBack = (id) => {
    const updated = exercises.map(ex => {
      if (ex.id === id) {
        let nWeek = parseInt(ex.week, 10) - 1;
        let nStage = parseInt(ex.stage, 10);

        if (nWeek < 1) {
          if (nStage === 2) { nWeek = 4; nStage = 1; } else { return ex; }
        }
        return { ...ex, week: nWeek, stage: nStage };
      }
      return ex;
    });
    setExercises(updated); saveData(updated, days);
  };

  // --- ADD / EDIT EXERCISE ---
  const addOrUpdateExercise = () => {
    const nameOk = (newEx.name || '').trim().length > 0;
    const one = parseFloat(String(newEx.oneRM).replace(',', '.'));
    if (!nameOk || !Number.isFinite(one) || one <= 0) return;

    let updated;
    if (editMode) {
      updated = exercises.map(ex =>
        ex.id === currentEditingId
          ? { ...ex, name: newEx.name.trim(), oneRM: String(newEx.oneRM), intensity: normalizeIntensity(newEx.intensity), week: 1, stage: 1 }
          : ex
      );
    } else {
      updated = [...exercises, { ...newEx, name: newEx.name.trim(), oneRM: String(newEx.oneRM), intensity: normalizeIntensity(newEx.intensity), id: Date.now().toString(), week: 1, stage: 1 }];
    }
    setExercises(updated); saveData(updated, days);
    closeModal();
  };

  const editExercise = (ex) => {
    setNewEx({
      ...ex,
      oneRM: String(ex.oneRM ?? ''),
      intensity: normalizeIntensity(ex.intensity),
    });
    setCurrentEditingId(ex.id);
    setEditMode(true);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(false);
    setCurrentEditingId(null);
    setNewEx({ name: '', oneRM: '', intensity: 'mid', dayId: '' });
  };

  // --- 1RM CALCULATOR ---
  const openCalc = () => {
    setCalcM('');
    setCalcK('');
    setCalcResult(null);
    setCalcModalVisible(true);
  };

  const calcOneRM = () => {
    const m = parseFloat(String(calcM).replace(',', '.'));
    const k = parseInt(calcK, 10);

    if (!Number.isFinite(m) || m <= 0 || !Number.isFinite(k) || k <= 0) return;

    const kk = clamp(k, 1, 30);
    const oneRM = Math.round((m * kk) / 30 + m);
    setCalcResult(oneRM);
  };

  const useCalcResult = () => {
    if (calcResult == null) return;
    setNewEx(prev => ({ ...prev, oneRM: String(calcResult) }));
    setCalcModalVisible(false);
  };

  const content = !isSetupComplete ? (
    <SafeAreaView style={[styles.safe, isDesktopWeb && styles.safeDesktop]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.shell, isDesktopWeb && styles.shellDesktop]}>
        <View style={styles.setupWrap}>
          <Text style={styles.setupTitle}>{t('setup_title')}</Text>

          <View style={styles.langRow}>
            {['uk', 'ru', 'en', 'et'].map(l => (
              <TouchableOpacity
                key={l}
                activeOpacity={0.85}
                onPress={() => changeLanguage(l)}
                style={[styles.langPill, lang === l && styles.langPillActive]}
              >
                <Text style={[styles.langPillText, lang === l && styles.langPillTextActive]}>{l.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.setupCard}>
            <Text style={styles.setupHint}>{t('how_many_days')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
              placeholder={t('how_many_days')}
              placeholderTextColor={stylesVars.muted2}
              onChangeText={v => {
                const num = parseInt(v, 10);
                if (num > 0 && num <= 7) {
                  const createdDays = Array.from({ length: num }, (_, i) => ({
                    id: String(i + 1),
                    num: i + 1,
                    isDefaultName: true,
                    name: `${t('day_default')} ${i + 1}`
                  }));
                  setDays(createdDays);
                }
              }}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryBtn}
              onPress={() => {
                if (days.length > 0) {
                  setIsSetupComplete(true);
                  saveData([], days);
                }
              }}
            >
              <Text style={styles.primaryBtnText}>{t('start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[styles.safe, isDesktopWeb && styles.safeDesktop]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.shell, isDesktopWeb && styles.shellDesktop]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerKicker}>{t('app_title')}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.85} style={styles.headerChip} onPress={() => setLangModalVisible(true)}>
              <Text style={styles.headerChipText}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.headerChip} onPress={() => setInfoModalVisible(true)}>
              <Text style={styles.headerChipText}>?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 110 }}
          keyboardShouldPersistTaps="handled"
        >
          {days.map((dayObj) => (
            <View key={dayObj.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.dayTitleWrap}>
                  <TextInput
                    style={styles.dayTitleInput}
                    value={dayObj.name}
                    onChangeText={(text) => renameDay(dayObj.id, text)}
                    placeholder={t('rename_placeholder')}
                    placeholderTextColor={stylesVars.muted2}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => deleteDay(dayObj.id)}
                  style={styles.iconDanger}
                >
                  <Text style={styles.iconDangerText}>✕</Text>
                </TouchableOpacity>
              </View>

              {exercises.filter(ex => ex.dayId === dayObj.id).map(ex => {
                const intensityKey = normalizeIntensity(ex.intensity);
                return (
                  <View key={ex.id} style={styles.exerciseCard}>
                    <TouchableOpacity activeOpacity={0.85} style={{ flex: 1 }} onPress={() => editExercise(ex)}>
                      <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
                      <Text style={styles.exMeta}>
                        {t('stage')}{ex.stage} • {t('week')}{ex.week} • {t(intensityKey)}
                      </Text>
                      <Text style={styles.exSub}>{ex.oneRM} {unitKg} • {rmShort}</Text>
                    </TouchableOpacity>

                    <View style={styles.rightBox}>
                      <Text style={styles.weightText}>{calculateWeight(ex)} {unitKg}</Text>
                      <Text style={styles.repsText}>{calculateSets(ex)} × {calculateReps(ex)}</Text>

                      <View style={styles.actionRow}>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => handleStepBack(ex.id)} style={styles.smallBtn}>
                          <Text style={styles.smallBtnText}>←</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => handleComplete(ex.id)} style={styles.smallBtnDone}>
                          <Text style={styles.smallBtnDoneText}>{t('done')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addInlineBtn}
                onPress={() => {
                  setEditMode(false);
                  setCurrentEditingId(null);
                  setNewEx({ name: '', oneRM: '', intensity: 'mid', dayId: dayObj.id });
                  setModalVisible(true);
                }}
              >
                <Text style={styles.addInlineText}>{t('add_exercise')}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {days.length < 7 && (
            <TouchableOpacity activeOpacity={0.85} style={styles.addDayBtn} onPress={addDay}>
              <Text style={styles.addDayBtnText}>{t('add_day')}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* INFO MODAL */}
        <Modal visible={infoModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
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

                <TouchableOpacity activeOpacity={0.85} style={[styles.primaryBtn, { marginTop: 14 }]} onPress={() => setInfoModalVisible(false)}>
                  <Text style={styles.primaryBtnText}>{t('understood')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* LANGUAGE MODAL */}
        <Modal visible={langModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView
                style={{ maxHeight: 560 }}
                contentContainerStyle={{ paddingBottom: 8 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>{t('lang_select')}</Text>

                <View style={{ gap: 10 }}>
                  <TouchableOpacity activeOpacity={0.85} style={styles.langFullBtn} onPress={() => changeLanguage('uk')}>
                    <Text style={styles.langFullText}>Українська 🇺🇦</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.85} style={styles.langFullBtn} onPress={() => changeLanguage('ru')}>
                    <Text style={styles.langFullText}>Парашный</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.85} style={styles.langFullBtn} onPress={() => changeLanguage('en')}>
                    <Text style={styles.langFullText}>English 🇺🇸</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.85} style={styles.langFullBtn} onPress={() => changeLanguage('et')}>
                    <Text style={styles.langFullText}>Eesti 🇪🇪</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.85} style={{ marginTop: 14 }} onPress={() => setLangModalVisible(false)}>
                  <Text style={styles.linkText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ADD / EDIT EXERCISE MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView
                style={{ maxHeight: 560 }}
                contentContainerStyle={{ paddingBottom: 8 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>{editMode ? t('edit') : t('add')}</Text>

                <Text style={styles.fieldLabel}>{t('ex_name')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('ex_name')}
                  placeholderTextColor={stylesVars.muted2}
                  value={newEx.name}
                  onChangeText={v => setNewEx({ ...newEx, name: v })}
                />

                <Text style={styles.fieldLabel}>{t('one_rm')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('one_rm')}
                  placeholderTextColor={stylesVars.muted2}
                  keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                  inputMode={Platform.OS === 'web' ? 'decimal' : undefined}
                  value={String(newEx.oneRM ?? '')}
                  onChangeText={(v) => {
                    const clean = sanitizeDecimalInput(v, 1000);
                    setNewEx({ ...newEx, oneRM: clean });
                  }}
                />

                <TouchableOpacity activeOpacity={0.85} style={styles.secondaryBtn} onPress={openCalc}>
                  <Text style={styles.secondaryBtnText}>{t('calc_open')}</Text>
                </TouchableOpacity>

                <View style={styles.segmentRow}>
                  {['low', 'mid', 'high'].map(l => {
                    const active = normalizeIntensity(newEx.intensity) === l;
                    return (
                      <TouchableOpacity
                        key={l}
                        activeOpacity={0.85}
                        style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                        onPress={() => setNewEx({ ...newEx, intensity: l })}
                      >
                        <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t(l)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity activeOpacity={0.85} style={styles.primaryBtn} onPress={addOrUpdateExercise}>
                  <Text style={styles.primaryBtnText}>{t('save')}</Text>
                </TouchableOpacity>

                {editMode && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={{ marginTop: 12 }}
                    onPress={() => {
                      const updated = exercises.filter(ex => ex.id !== currentEditingId);
                      setExercises(updated);
                      saveData(updated, days);
                      closeModal();
                    }}
                  >
                    <Text style={styles.dangerLink}>{t('delete_ex')}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity activeOpacity={0.85} onPress={closeModal} style={{ marginTop: 12 }}>
                  <Text style={styles.linkText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* 1RM CALCULATOR MODAL */}
        <Modal visible={calcModalVisible} animationType="fade" transparent={true}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
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
                  style={styles.input}
                  placeholder={t('calc_weight')}
                  placeholderTextColor={stylesVars.muted2}
                  keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                  inputMode={Platform.OS === 'web' ? 'decimal' : undefined}
                  value={calcM}
                  onChangeText={(v) => setCalcM(sanitizeDecimalInput(v, 1000))}
                />

                <Text style={styles.fieldLabel}>{t('calc_reps')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('calc_reps')}
                  placeholderTextColor={stylesVars.muted2}
                  keyboardType="number-pad"
                  inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
                  value={calcK}
                  onChangeText={(v) => setCalcK(sanitizeIntInput(v, 30))}
                />

                <TouchableOpacity activeOpacity={0.85} style={styles.primaryBtn} onPress={calcOneRM}>
                  <Text style={styles.primaryBtnText}>{t('calc_calculate')}</Text>
                </TouchableOpacity>

                {calcResult != null && (
                  <View style={{ marginTop: 14 }}>
                    <View style={styles.resultPill}>
                      <Text style={styles.resultText}>{t('calc_result')}: {calcResult} {unitKg}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.85} style={[styles.primaryBtn, { marginTop: 10 }]} onPress={useCalcResult}>
                      <Text style={styles.primaryBtnText}>{t('calc_use')}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity activeOpacity={0.85} onPress={() => setCalcModalVisible(false)} style={{ marginTop: 12 }}>
                  <Text style={styles.linkText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaProvider>
      {content}
    </SafeAreaProvider>
  );
}

// --- Design tokens ---
const stylesVars = {
  bg: '#0B0F14',
  surface: '#101826',
  surface2: '#0E1623',
  border: '#1F2A3A',
  text: '#EAF0FF',
  muted: '#A9B4C6',
  muted2: '#6E7B90',
  accent: '#3B82F6',
  success: '#22C55E',
  danger: '#EF4444',
};

// --- Styles ---
const ANDROID_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: stylesVars.bg,
    alignItems: 'center', // важно для ПК: центрируем shell
  },

  safeDesktop: {
    paddingVertical: 24,
  },

  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 520, // важно для ПК: не растягиваем на весь экран
  },

  shellDesktop: {
    borderWidth: 1,
    borderColor: stylesVars.border,
    borderRadius: 24,
    overflow: 'hidden',
  },

  // Setup
  setupWrap: { flex: 1, padding: 20, paddingTop: ANDROID_TOP + 20, justifyContent: 'center' },
  setupTitle: { color: stylesVars.text, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 14, letterSpacing: 0.5 },
  setupHint: { color: stylesVars.muted, fontSize: 13, marginBottom: 10, textAlign: 'center' },
  setupCard: {
    backgroundColor: stylesVars.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: stylesVars.border,
  },
  langRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 10 },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: stylesVars.border,
    backgroundColor: stylesVars.surface2,
  },
  langPillActive: { backgroundColor: stylesVars.accent, borderColor: stylesVars.accent },
  langPillText: { color: stylesVars.muted, fontWeight: '800', fontSize: 12 },
  langPillTextActive: { color: '#FFFFFF' },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: ANDROID_TOP + 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: stylesVars.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: stylesVars.bg,
  },
  headerKicker: { color: stylesVars.muted, fontSize: 12, fontWeight: '800', letterSpacing: 3 },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerChip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerChipText: { color: stylesVars.text, fontWeight: '900', fontSize: 12 },

  // Main list
  scroll: { padding: 16, width: '100%' },
  section: {
    backgroundColor: stylesVars.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: stylesVars.border,
    padding: 12,
    marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 10 },
  dayTitleWrap: {
    flex: 1,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dayTitleInput: {
    color: stylesVars.text,
    fontSize: 16,
    fontWeight: '900',
  },
  iconDanger: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDangerText: { color: stylesVars.danger, fontWeight: '900', fontSize: 14 },

  exerciseCard: {
    backgroundColor: stylesVars.surface2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: stylesVars.border,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  exName: { color: stylesVars.text, fontSize: 16, fontWeight: '900' },
  exMeta: { color: stylesVars.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  exSub: { color: stylesVars.muted2, fontSize: 12, marginTop: 2 },

  rightBox: { alignItems: 'flex-end', justifyContent: 'space-between' },
  weightText: { color: stylesVars.success, fontSize: 18, fontWeight: '900' },
  repsText: { color: stylesVars.muted, fontSize: 12, marginTop: 2, marginBottom: 8 },

  actionRow: { flexDirection: 'row', gap: 8 },
  smallBtn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: stylesVars.bg,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: { color: stylesVars.muted, fontWeight: '900' },
  smallBtnDone: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnDoneText: { color: stylesVars.success, fontWeight: '900', fontSize: 12 },

  addInlineBtn: {
    marginTop: 2,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stylesVars.border,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  addInlineText: { color: stylesVars.muted, fontSize: 13, fontWeight: '800' },

  addDayBtn: {
    marginTop: 2,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: stylesVars.accent,
    backgroundColor: 'rgba(59,130,246,0.12)',
    alignItems: 'center',
  },
  addDayBtnText: { color: stylesVars.accent, fontWeight: '900' },

  // Buttons
  primaryBtn: {
    backgroundColor: stylesVars.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  secondaryBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stylesVars.border,
    backgroundColor: stylesVars.surface2,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: { color: stylesVars.accent, fontWeight: '900' },

  // Inputs (важно: fontSize 16, чтобы iPhone Safari не делал zoom)
  fieldLabel: { color: stylesVars.muted, fontSize: 12, fontWeight: '800', marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: stylesVars.surface2,
    color: stylesVars.text,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: stylesVars.border,
    fontSize: 16,
  },

  // Segmented control
  segmentRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: 'rgba(59,130,246,0.18)', borderColor: 'rgba(59,130,246,0.6)' },
  segmentText: { color: stylesVars.muted, fontWeight: '900', fontSize: 12 },
  segmentTextActive: { color: stylesVars.text },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 18,
    alignItems: 'center',
    ...Platform.select({
      web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 },
      default: {},
    }),
  },
  modalCard: {
    backgroundColor: stylesVars.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: stylesVars.border,
    width: '100%',
    maxWidth: 520,
  },
  modalTitle: { color: stylesVars.text, fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 12 },

  infoTitle: { color: stylesVars.text, fontSize: 14, fontWeight: '900', marginTop: 10, marginBottom: 6 },
  infoText: { color: stylesVars.muted, fontSize: 13, lineHeight: 18 },

  hintText: { color: stylesVars.muted, fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 6 },
  hintTextSmall: { color: stylesVars.muted2, fontSize: 12, textAlign: 'center', marginBottom: 10 },

  resultPill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
  },
  resultText: { color: stylesVars.success, fontWeight: '900', fontSize: 14 },

  // Language list buttons
  langFullBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
  },
  langFullText: { color: stylesVars.text, fontSize: 16, fontWeight: '800' },

  // Links
  linkText: { color: stylesVars.muted, textAlign: 'center', fontWeight: '800' },
  dangerLink: { color: stylesVars.danger, textAlign: 'center', fontWeight: '900' },
});