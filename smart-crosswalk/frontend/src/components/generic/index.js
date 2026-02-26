// ─── Generic layer — 3 files ──────────────────────────────────────────────────
//   GenericCard.jsx    — low-level card renderer (GenericDetailCard)
//   GenericDialog.jsx  — form dialog + tabbed dialog + useFormState hook
//   GenericLayout.jsx  — page layout + list + stats + registry + useCRUDPage

export { GenericDetailCard } from './GenericCard';
export { useFormState, GenericFormDialog, GenericDialog, GenericTabDialog } from './GenericDialog';
export {
  StatsCard, StatsGrid,
  componentRegistry, getComponentForType, isTypeRegistered, getRegisteredTypes, registerComponent, unregisterComponent,
  GenericList,
  useCRUDPage,
  GenericCRUDLayout
} from './GenericLayout';
