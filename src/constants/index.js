// ----------------- Constants (no magic numbers) -----------------

export const LIMIT_DAYS = 7;

export const PROGRESSION = {
  totalWeeks: 4,
  totalStages: 2,
  weekPercentStep: 0.05,
  stage2BonusKg: 5,
  intensityBasePercent: { low: 0.7, mid: 0.6, high: 0.5 },
  repsBase: { low: 8, mid: 12, high: 16 },
  repsWeekDecrement: 2,
  setsBase: { low: 4, mid: 3, high: 3 },
  week4SetsMinus: 1,
};

export const INPUT_LIMITS = {
  oneRmMaxKg: 1000,
  repsMax: 30,
};
