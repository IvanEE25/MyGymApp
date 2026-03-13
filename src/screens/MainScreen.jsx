import { memo, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

import { styles, stylesVars } from '../theme';
import { PROGRESSION, LIMIT_DAYS, INPUT_LIMITS } from '../constants';
import { clamp } from '../utils/filters';
import { normalizeIntensity } from '../utils/exercises';
import HeaderBar from '../components/HeaderBar';
import AddDayButton from '../components/AddDayButton';
import EditableDayTitle from '../components/EditableDayTitle';

const MainScreen = memo(function MainScreen({
  t,
  lang,
  unitKg,
  rmShort,
  days,
  exercises,
  exercisesByDay,
  doneFlashMap,
  onOpenLang,
  onOpenInfo,
  onAddDay,
  onRenameDay,
  onDeleteDay,
  onAddExercise,
  onEditExercise,
  onStepBack,
  onComplete,
  onShowAlert,
}) {
  const calculateWeight = useCallback((ex) => {
    const intensity = normalizeIntensity(ex.intensity);
    const basePercent = PROGRESSION.intensityBasePercent[intensity] ?? PROGRESSION.intensityBasePercent.mid;

    const weekNum = parseInt(ex.week, 10);
    const stageNum = parseInt(ex.stage, 10);
    const oneRmNum = parseFloat(String(ex.oneRM).replace(',', '.'));

    if (!Number.isFinite(weekNum) || !Number.isFinite(stageNum) || !Number.isFinite(oneRmNum)) return '0.0';

    const percent = basePercent + (weekNum - 1) * PROGRESSION.weekPercentStep;
    let w = oneRmNum * percent;
    if (stageNum === 2) w += PROGRESSION.stage2BonusKg;

    w = clamp(w, 0, INPUT_LIMITS.oneRmMaxKg);
    return w.toFixed(1);
  }, []);

  const calculateSets = useCallback((ex) => {
    const intensity = normalizeIntensity(ex.intensity);
    const baseSets = PROGRESSION.setsBase[intensity] ?? 3;
    const week = parseInt(ex.week, 10);
    if (week === PROGRESSION.totalWeeks) return Math.max(1, baseSets - PROGRESSION.week4SetsMinus);
    return baseSets;
  }, []);

  const calculateReps = useCallback((ex) => {
    const intensity = normalizeIntensity(ex.intensity);
    const base = PROGRESSION.repsBase[intensity] ?? PROGRESSION.repsBase.mid;
    const weekNum = parseInt(ex.week, 10);
    if (!Number.isFinite(weekNum)) return base;

    const reps = base - (weekNum - 1) * PROGRESSION.repsWeekDecrement;
    return reps > 0 ? reps : 1;
  }, []);

  const renderItem = useCallback(({ item: dayObj }) => {
    const list = exercisesByDay[dayObj.id] || [];

    return (
      <Animated.View
        entering={FadeInDown.duration(180)}
        exiting={FadeOutUp.duration(120)}
        layout={LinearTransition.springify().damping(18).stiffness(160)}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.dayTitleWrap}>
              <EditableDayTitle
                id={dayObj.id}
                value={dayObj.name}
                onCommit={onRenameDay}
                placeholder={t('rename_placeholder')}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => onDeleteDay(dayObj.id)} style={styles.iconDanger}>
              <Text style={styles.iconDangerText}>✕</Text>
            </TouchableOpacity>
          </View>

          {list.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{t('empty_title')}</Text>
              <Text style={styles.emptyBody}>{t('empty_body')}</Text>
            </View>
          )}

          {list.map((ex) => {
            const intensityKey = normalizeIntensity(ex.intensity);
            const weekNum = parseInt(ex.week, 10) || 1;
            const stageNum = parseInt(ex.stage, 10) || 1;
            const weekPct = clamp(weekNum / PROGRESSION.totalWeeks, 0, 1);
            const totalSteps = PROGRESSION.totalStages * PROGRESSION.totalWeeks;
            const currentStep = (stageNum - 1) * PROGRESSION.totalWeeks + weekNum;
            const stagePct = clamp(currentStep / totalSteps, 0, 1);

            return (
              <View key={ex.id} style={[styles.exerciseCard, !!doneFlashMap?.[ex.id] && styles.exerciseCardFlash]}>
                <TouchableOpacity activeOpacity={0.85} style={{ flex: 1 }} onPress={() => onEditExercise(ex)}>
                  <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
                  <Text style={styles.exMeta}>{t(`${intensityKey}_label`)}</Text>
                  <Text style={styles.exSub}>{rmShort} {ex.oneRM} {unitKg}</Text>
                </TouchableOpacity>

                <View style={styles.rightBox}>
                  <Text style={styles.weightText}>{calculateWeight(ex)} {unitKg}</Text>
                  <Text style={styles.repsText}>{calculateSets(ex)} × {calculateReps(ex)}</Text>

                  <View style={styles.progressWrap}>
                    <View style={styles.progressLine}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${weekPct * 100}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{t('week_full')} {weekNum}/{PROGRESSION.totalWeeks}</Text>
                    </View>

                    <View style={styles.progressLine}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill2, { width: `${stagePct * 100}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{t('stage_full')} {stageNum}/{PROGRESSION.totalStages}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onStepBack(ex.id)}
                      onLongPress={() => onShowAlert?.(t('hint_title'), t('step_back_hint'))}
                      accessibilityLabel={t('step_back_label')}
                      accessibilityHint={t('step_back_hint')}
                      style={styles.smallBtn}
                    >
                      <Text style={styles.smallBtnText}>↩</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onComplete(ex.id)}
                      onLongPress={() => onShowAlert?.(t('hint_title'), t('done_hint'))}
                      accessibilityLabel={t('done_label')}
                      accessibilityHint={t('done_hint')}
                      style={styles.smallBtnDone}
                    >
                      <Text style={styles.smallBtnDoneText}>{t('done')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          <TouchableOpacity activeOpacity={0.85} style={styles.addInlineBtn} onPress={() => onAddExercise(dayObj.id)}>
            <Text style={styles.addInlineText}>{t('add_exercise')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }, [
    exercisesByDay,
    t,
    unitKg,
    rmShort,
    doneFlashMap,
    onRenameDay,
    onDeleteDay,
    onEditExercise,
    onStepBack,
    onComplete,
    onShowAlert,
    onAddExercise,
    calculateWeight,
    calculateSets,
    calculateReps,
  ]);

  const footer = useMemo(() => (
    <View>
      {days.length < LIMIT_DAYS && (
        <View style={{ marginTop: 2 }}>
          <AddDayButton onPress={onAddDay} label={t('add_day')} />
        </View>
      )}
    </View>
  ), [days.length, onAddDay, t]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={stylesVars.bg} />
      <View style={styles.shell}>
        <HeaderBar
          title={t('app_title')}
          lang={lang}
          onOpenLang={onOpenLang}
          onOpenInfo={onOpenInfo}
        />

        <FlatList
          data={days}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.mainListContent}
          style={styles.mainList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          bounces={false}
          scrollEnabled
          removeClippedSubviews={false}
          ListFooterComponent={footer}
        />
      </View>
    </SafeAreaView>
  );
});

export default MainScreen;
