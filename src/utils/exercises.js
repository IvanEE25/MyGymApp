export const normalizeIntensity = (value) => {
  if (value === 'Низкая' || value === 'Лёгкая' || value === 'Лёгкая 4x8') return 'low';
  if (value === 'Средняя' || value === 'Средняя 3x12') return 'mid';
  if (value === 'Высокая' || value === 'Тяжёлая' || value === 'Тяжёлая 3x16') return 'high';
  if (value === 'low' || value === 'mid' || value === 'high') return value;
  return 'mid';
};

export const normalizeExerciseDraftForCompare = (draft) => {
  const raw = parseFloat(String(draft?.oneRM ?? '').replace(',', '.'));
  return {
    name: String(draft?.name ?? ''),
    oneRM: Number.isFinite(raw) ? String(raw) : '',
    intensity: normalizeIntensity(draft?.intensity),
    dayId: String(draft?.dayId ?? ''),
  };
};

export const exerciseDraftsEqual = (a, b) => {
  const left = normalizeExerciseDraftForCompare(a);
  const right = normalizeExerciseDraftForCompare(b);
  return (
    left.name === right.name &&
    left.oneRM === right.oneRM &&
    left.intensity === right.intensity &&
    left.dayId === right.dayId
  );
};

export const migrateExercises = (loadedExercises) => {
  if (!Array.isArray(loadedExercises)) return [];
  return loadedExercises.map((ex) => ({
    ...ex,
    intensity: normalizeIntensity(ex.intensity),
  }));
};
