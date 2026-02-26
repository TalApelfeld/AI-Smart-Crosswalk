/**
 * Component Registry
 * Central mapping of item types to their corresponding React components
 * 
 * This registry uses the Strategy Pattern to eliminate hard-coded switch statements
 * and make the system easily extensible.
 * 
 * To add a new item type:
 * 1. Create the component (e.g., SensorCard.jsx)
 * 2. Import it here
 * 3. Add one entry to the registry object
 * 
 * No other files need to be modified!
 */

import { CrosswalkItem, AlertItem } from '../features/cardRegistry';
import { DeviceRowItem } from '../features/DeviceRowItem';

/**
 * Layout types for rendering
 * @typedef {'card' | 'row' | 'grid'} LayoutType
 */

/**
 * Registry entry structure
 * @typedef {Object} RegistryEntry
 * @property {React.ComponentType} component - The React component to render
 * @property {LayoutType} layout - How to lay out the items (card list, table row, grid)
 * @property {string[]} [columns] - Column headers for table layout
 * @property {Object} [metadata] - Default metadata for this type
 */

/**
 * Component Registry Map
 * Maps type strings to component configurations
 * 
 * @type {Record<string, RegistryEntry>}
 */
export const componentRegistry = {
  // Crosswalk items - displayed as cards
  crosswalk: {
    component: CrosswalkItem,
    layout: 'card',
    metadata: {
      icon: '🚦',
      variant: 'default'
    }
  },
  
  // Alert items — variant passed via itemProps: 'list' (default) or 'history'
  alert: {
    component: AlertItem,
    layout: 'card',
    metadata: { icon: '🚨' }
  },
  
  // Camera devices - displayed as table rows with status and edit
  camera: {
    component: DeviceRowItem,
    layout: 'row',
    columns: ['ID', 'Status', 'Created', 'Actions'],
    config: {
      showStatus: true,
      showEdit: true
    },
    metadata: {
      icon: '📷'
    }
  },
  
  // LED devices - displayed as table rows (no status or edit)
  led: {
    component: DeviceRowItem,
    layout: 'row',
    columns: ['ID', 'Created', 'Actions'],
    config: {
      showStatus: false,
      showEdit: false
    },
    metadata: {
      icon: '💡'
    }
  }
};

/**
 * Get component configuration for a given type
 * @param {string} type - Item type identifier
 * @returns {RegistryEntry} Registry entry with component and configuration
 * @throws {Error} If type is not registered
 */
export function getComponentForType(type) {
  const entry = componentRegistry[type];
  
  if (!entry) {
    console.error(`No component registered for type: "${type}"`);
    throw new Error(`Unknown component type: ${type}`);
  }
  
  return entry;
}

/**
 * Check if a type is registered
 * @param {string} type - Item type identifier
 * @returns {boolean} True if type exists in registry
 */
export function isTypeRegistered(type) {
  return type in componentRegistry;
}

/**
 * Get all registered types
 * @returns {string[]} Array of registered type names
 */
export function getRegisteredTypes() {
  return Object.keys(componentRegistry);
}

/**
 * Register a new component type (for extensions/plugins)
 * @param {string} type - Item type identifier
 * @param {RegistryEntry} entry - Registry entry configuration
 */
export function registerComponent(type, entry) {
  if (!type || typeof type !== 'string') {
    throw new Error('Type must be a non-empty string');
  }
  
  if (!entry || !entry.component) {
    throw new Error('Entry must have a component property');
  }
  
  if (!entry.layout) {
    entry.layout = 'card'; // Default layout
  }
  
  componentRegistry[type] = entry;
  console.log(`✓ Registered component type: "${type}"`);
}

/**
 * Unregister a component type
 * @param {string} type - Item type identifier
 * @returns {boolean} True if type was removed
 */
export function unregisterComponent(type) {
  if (type in componentRegistry) {
    delete componentRegistry[type];
    return true;
  }
  return false;
}
