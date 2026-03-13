import { INPUT_LIMITS, LIMIT_DAYS } from '../constants';

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export const fillTemplate = (text, vars = {}) =>
  String(text ?? '').replace(/\{(\w+)\}/g, (_, key) => String(vars?.[key] ?? ''));

export const filterDecimalTyping = (raw) => {
  let s = String(raw ?? '').replace(',', '.');
  s = s.replace(/[^0-9.]/g, '');
  if (s === '.') return '';
  const parts = s.split('.');
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('');
  if (s.startsWith('.')) s = '0' + s;
  const [intPart, decPart] = s.split('.');
  if (decPart === undefined) return s;
  return `${intPart}.${decPart.slice(0, 2)}`;
};

export const normalizeDecimalOnBlur = (raw, max = INPUT_LIMITS.oneRmMaxKg) => {
  const n = parseFloat(String(raw ?? '').replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0) return '';
  return String(Math.min(n, max));
};

export const filterIntTyping = (raw) => String(raw ?? '').replace(/\D/g, '');

export const normalizeIntOnBlur = (raw, min = 1, max = INPUT_LIMITS.repsMax) => {
  const n = parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(n)) return '';
  return String(clamp(n, min, max));
};

export const filterDaysTyping = (raw) => String(raw ?? '').replace(/\D/g, '');

export const normalizeDaysOnBlur = (raw) => {
  const n = parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(n) || n < 1) return '';
  return String(Math.min(n, LIMIT_DAYS));
};
