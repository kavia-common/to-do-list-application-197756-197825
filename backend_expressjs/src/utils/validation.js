'use strict';

/**
 * Small validation utilities for request payloads.
 */

// PUBLIC_INTERFACE
function isNonEmptyString(value) {
  /** Returns true if value is a non-empty string after trimming. */
  return typeof value === 'string' && value.trim().length > 0;
}

// PUBLIC_INTERFACE
function normalizeNullableString(value) {
  /** Normalize optional text fields to string or null. */
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined; // invalid; caller decides how to handle
  return value;
}

// PUBLIC_INTERFACE
function parseOptionalDateTime(value) {
  /**
   * Parse an optional ISO datetime string (or null).
   *
   * Returns:
   * - { ok: true, value: <original value or null> } for valid inputs
   * - { ok: false, message: <reason> } for invalid inputs
   *
   * Notes:
   * - We accept either null or a string parseable by Date.parse().
   * - We do NOT reformat here; we pass through the user string to mysql2, which can handle
   *   Date objects or MySQL DATETIME strings. For safety and consistency, we pass the string.
   */
  if (value === undefined) return { ok: true, value: undefined };
  if (value === null) return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false, message: 'due_date must be a string (ISO datetime) or null when provided' };

  const t = Date.parse(value);
  if (Number.isNaN(t)) {
    return { ok: false, message: 'due_date must be a valid ISO datetime string when provided' };
  }
  return { ok: true, value };
}

// PUBLIC_INTERFACE
function normalizeIsCompleted(value) {
  /**
   * Normalize boolean-like values:
   * - boolean -> boolean
   * - 0/1 -> boolean
   * Otherwise returns undefined to indicate invalid input.
   */
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 0) return false;
  if (value === 1) return true;
  return undefined;
}

module.exports = {
  isNonEmptyString,
  normalizeNullableString,
  parseOptionalDateTime,
  normalizeIsCompleted,
};
