import React from 'react';

/**
 * Safely converts any value to an array for safe .map() usage.
 * Handles: undefined, null, single object, or array.
 */
export const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

/**
 * Before rendering any content section, guard against objects to avoid React runtime crashes.
 */
export const safeRender = (value) => {
  if (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !React.isValidElement(value)
  ) {
    console.warn('Attempted to render plain object as React child:', value);
    return null; // silently skip — do not crash
  }
  return value;
};
