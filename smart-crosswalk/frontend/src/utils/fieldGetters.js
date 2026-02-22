/**
 * Field Getter Utilities
 * Deep object property access with safe fallbacks
 */

/**
 * Get nested property value from object using dot notation
 * @param {object} obj - Source object
 * @param {string} path - Property path (e.g., 'location.city')
 * @param {any} defaultValue - Default value if property not found
 * @returns {any} Property value or default
 */
export function getNestedValue(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue;
  
  try {
    const value = path.split('.').reduce((current, prop) => {
      return current?.[prop];
    }, obj);
    
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (error) {
    console.warn(`Error accessing path "${path}":`, error);
    return defaultValue;
  }
}

/**
 * Extract ID from object (handles both _id and id)
 * @param {object} obj - Object with ID
 * @returns {string|null} ID value
 */
export function extractId(obj) {
  if (!obj) return null;
  return obj._id || obj.id || null;
}

/**
 * Get camera status from crosswalk object
 * @param {object} crosswalk - Crosswalk object
 * @returns {string} Camera status
 */
export function getCameraStatus(crosswalk) {
  return getNestedValue(crosswalk, 'cameraId.status', 'N/A');
}

/**
 * Get camera ID from crosswalk object
 * @param {object} crosswalk - Crosswalk object
 * @returns {string} Camera ID
 */
export function getCameraId(crosswalk) {
  return getNestedValue(crosswalk, 'cameraId._id', 'N/A');
}

/**
 * Get LED ID from crosswalk object
 * @param {object} crosswalk - Crosswalk object
 * @returns {string} LED ID
 */
export function getLEDId(crosswalk) {
  return getNestedValue(crosswalk, 'ledId._id', 'N/A');
}

/**
 * Check if object has nested property
 * @param {object} obj - Source object
 * @param {string} path - Property path
 * @returns {boolean} True if property exists
 */
export function hasNestedValue(obj, path) {
  const value = getNestedValue(obj, path);
  return value !== null && value !== undefined;
}
