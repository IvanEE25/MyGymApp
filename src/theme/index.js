import { StyleSheet } from 'react-native';

// --- Design tokens ---
export const stylesVars = {
  bg: '#0B0F14',
  surface: '#132036',
  surface2: '#0B1220',
  border: '#1F2A3A',
  text: '#EAF0FF',
  muted: '#A9B4C6',
  muted2: '#6E7B90',
  accent: '#3B82F6',
  success: '#22C55E',
  danger: '#EF4444',
};

// --- Styles ---
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: stylesVars.bg,
    alignItems: 'center',
  },

  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
  },

  mainList: {
    flex: 1,
  },
  mainListContent: {
    padding: 16,
    paddingBottom: 110,
    flexGrow: 1,
  },

  // Setup
  setupWrap: { flex: 1, padding: 20, paddingTop: 20, justifyContent: 'center' },
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
    paddingTop: 10,
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

  // Day section card
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

  // Exercise cards
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
  exerciseCardFlash: {
    borderColor: 'rgba(34,197,94,0.85)',
    backgroundColor: 'rgba(34,197,94,0.10)',
  },
  exName: { color: stylesVars.text, fontSize: 16, fontWeight: '900' },
  exMeta: { color: stylesVars.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  exSub: { color: stylesVars.muted2, fontSize: 12, marginTop: 2 },

  rightBox: { alignItems: 'flex-end', justifyContent: 'space-between' },
  weightText: { color: stylesVars.success, fontSize: 18, fontWeight: '900' },
  repsText: { color: stylesVars.muted, fontSize: 12, marginTop: 2, marginBottom: 8 },

  progressWrap: { alignSelf: 'stretch', marginBottom: 8, gap: 6 },
  progressLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  progressTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  progressFill: { height: 6, borderRadius: 999, backgroundColor: 'rgba(59,130,246,0.8)' },
  progressFill2: { height: 6, borderRadius: 999, backgroundColor: 'rgba(34,197,94,0.8)' },
  progressText: { color: stylesVars.muted2, fontSize: 11, fontWeight: '800', minWidth: 72, textAlign: 'right' },

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

  emptyState: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stylesVars.border,
    backgroundColor: stylesVars.surface2,
    marginBottom: 12,
  },
  emptyTitle: { color: stylesVars.text, fontWeight: '900', fontSize: 13, marginBottom: 4 },
  emptyBody: { color: stylesVars.muted, fontSize: 12, lineHeight: 16 },

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

  dangerBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stylesVars.danger,
    backgroundColor: stylesVars.danger,
    alignItems: 'center',
  },
  dangerBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },

  // Dialog modal
  dialogCard: { maxWidth: 420 },
  dialogTitle: { color: stylesVars.text, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  dialogBody: { color: stylesVars.muted, fontSize: 13, lineHeight: 18, textAlign: 'center', marginTop: 10 },
  dialogBtnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  dialogBtn: { flex: 1, minWidth: 120, marginBottom: 0 },

  snackbarWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  snackbar: {
    maxWidth: 420,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(11,18,32,0.94)',
    borderWidth: 1,
    borderColor: stylesVars.border,
  },
  snackbarText: { color: stylesVars.text, fontSize: 12, fontWeight: '800', textAlign: 'center' },

  fieldLabel: { color: stylesVars.muted, fontSize: 12, fontWeight: '800', marginBottom: 6, marginLeft: 4 },

  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, marginTop: 2 },
  infoIcon: { color: stylesVars.muted, fontSize: 14, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 2 },
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

  inputError: { borderColor: 'rgba(239,68,68,0.8)', backgroundColor: 'rgba(239,68,68,0.06)' },
  errorText: { color: stylesVars.danger, fontSize: 12, fontWeight: '700', marginTop: -6, marginBottom: 10, marginLeft: 4 },

  segmentRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: { backgroundColor: 'rgba(59,130,246,0.30)', borderColor: stylesVars.accent },
  segmentText: { color: stylesVars.muted, fontWeight: '900', fontSize: 12, textAlign: 'center' },
  segmentScheme: { color: stylesVars.muted2, fontWeight: '700', fontSize: 11, textAlign: 'center', marginTop: 2 },
  segmentTextActive: { color: '#FFFFFF' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 18,
    alignItems: 'center',
  },
  modalKeyboardWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
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

  langFullBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: stylesVars.surface2,
    borderWidth: 1,
    borderColor: stylesVars.border,
    alignItems: 'center',
  },
  langFullBtnActive: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: stylesVars.accent,
  },
  langFullText: { color: stylesVars.text, fontSize: 16, fontWeight: '800' },
  langFullTextActive: { color: stylesVars.accent },

  // Danger zone separator in InfoModal
  dangerZoneWrap: {
    borderTopWidth: 1,
    borderTopColor: stylesVars.border,
    marginTop: 18,
    paddingTop: 14,
  },
  linkText: { color: stylesVars.muted, textAlign: 'center', fontWeight: '800' },
  dangerLink: { color: stylesVars.danger, textAlign: 'center', fontWeight: '900' },
});
