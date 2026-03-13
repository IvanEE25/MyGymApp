import { ALL_DAY_PREFIXES, TRANSLATIONS } from '../locales';

export const parseDefaultDayName = (name) => {
  if (!name) return null;
  const trimmed = String(name).trim();
  const match = trimmed.match(/^(.*)\s+(\d{1,2})$/);
  if (!match) return null;

  const prefix = match[1].trim();
  const num = parseInt(match[2], 10);
  if (!Number.isFinite(num) || num < 1) return null;

  if (ALL_DAY_PREFIXES.includes(prefix)) return { prefix, num };
  return null;
};

// Renumber days strictly by order: 1..N
export const renumberDays = (arr, langKey) => {
  const safe = Array.isArray(arr) ? arr : [];
  const dk = TRANSLATIONS[langKey] ? langKey : 'ru';

  return safe.map((d, i) => {
    const num = i + 1;

    const isDefaultName =
      typeof d?.isDefaultName === 'boolean' ? d.isDefaultName : !!parseDefaultDayName(d?.name);

    const name = isDefaultName
      ? `${TRANSLATIONS[dk].day_default} ${num}`
      : d?.name ?? `${TRANSLATIONS[dk].day_default} ${num}`;

    return { ...d, num, isDefaultName, name };
  });
};

export const migrateDays = (loadedDays, langKey) => {
  const safe = Array.isArray(loadedDays) ? loadedDays : [];
  const dk = TRANSLATIONS[langKey] ? langKey : 'ru';

  const migrated = safe.map((d, i) => {
    const parsed = parseDefaultDayName(d?.name);
    const isDefaultName =
      typeof d?.isDefaultName === 'boolean' ? d.isDefaultName : !!parsed;

    const num = Number.isFinite(d?.num) && d.num > 0 ? d.num : parsed?.num ?? i + 1;

    const name = isDefaultName
      ? `${TRANSLATIONS[dk].day_default} ${num}`
      : d?.name ?? `${TRANSLATIONS[dk].day_default} ${num}`;

    return { ...d, num, isDefaultName, name };
  });

  return renumberDays(migrated, dk);
};
