// Core generic components
export { GenericList } from './GenericList';
export { CRUDPageLayout } from './CRUDPageLayout';
export { GenericDetailCard } from './GenericDetailCard';
export { GenericFormDialog } from './GenericFormDialog';
export { StatsGrid } from './StatsGrid';
export { useCRUDPage } from './useCRUDPage';

// Component Registry - central type-to-component mapping
export { 
  componentRegistry,
  getComponentForType,
  isTypeRegistered,
  getRegisteredTypes,
  registerComponent,
  unregisterComponent
} from './componentRegistry';
