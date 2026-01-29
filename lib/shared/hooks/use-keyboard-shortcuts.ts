'use client';

import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

type ShortcutMap = {
  [key: string]: ShortcutHandler;
};

/**
 * Normalize keyboard shortcut string
 * Converts various formats to a consistent pattern
 *
 * @example
 * 'ctrl+a' -> 'ctrl+a'
 * 'cmd+a' -> 'meta+a'
 * 'Ctrl+A' -> 'ctrl+a'
 */
function normalizeShortcut(shortcut: string): string {
  return shortcut
    .toLowerCase()
    .replace('cmd', 'meta')
    .replace('command', 'meta');
}

/**
 * Check if a keyboard event matches a shortcut string
 */
function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const normalized = normalizeShortcut(shortcut);
  const parts = normalized.split('+');

  let ctrlOrCmd = false;
  let shift = false;
  let alt = false;
  let key = '';

  for (const part of parts) {
    if (part === 'ctrl' && event.ctrlKey) ctrlOrCmd = true;
    if (part === 'meta' && event.metaKey) ctrlOrCmd = true;
    if (part === 'shift' && event.shiftKey) shift = true;
    if (part === 'alt' && event.altKey) alt = true;
    if (part.length === 1) key = part;
  }

  const eventKey = event.key.toLowerCase();

  // Handle special keys
  const specialKeyMap: Record<string, string> = {
    escape: 'Escape',
    delete: 'Delete',
    backspace: 'Backspace',
    enter: 'Enter',
    tab: 'Tab',
    space: ' ',
  };

  const matchKey =
    eventKey === key || specialKeyMap[key]?.toLowerCase() === eventKey;

  const requiredCtrlOrCmd = normalized.includes('ctrl') || normalized.includes('meta');
  const requiredShift = normalized.includes('shift');
  const requiredAlt = normalized.includes('alt');

  // Check modifiers
  if (requiredCtrlOrCmd && !ctrlOrCmd) return false;
  if (requiredShift && !shift) return false;
  if (requiredAlt && !alt) return false;

  // Check key (if it's not just modifiers)
  if (key) {
    return matchKey;
  }

  return false;
}

/**
 * Check if an element is an input field
 */
function isInputElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    element.getAttribute('contenteditable') === 'true'
  );
}

/**
 * Hook to handle keyboard shortcuts
 *
 * @param shortcuts Map of shortcut strings to handler functions
 * @param options Configuration options
 *
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+a': () => console.log('Select all'),
 *   'escape': () => console.log('Cancel'),
 *   'delete': () => console.log('Delete'),
 * });
 *
 * @example
 * // Prevent shortcut when in input field
 * useKeyboardShortcuts(
 *   {
 *     'ctrl+s': handleSave,
 *   },
 *   { ignoreInputFields: false }
 * );
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  options?: {
    ignoreInputFields?: boolean;
  }
): void {
  const { ignoreInputFields = true } = options || {};

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if in input field and ignoreInputFields is true
      if (ignoreInputFields && isInputElement(document.activeElement)) {
        return;
      }

      // Check each shortcut
      for (const [shortcut, handler] of Object.entries(shortcuts)) {
        if (matchesShortcut(event, shortcut)) {
          event.preventDefault();
          handler(event);
          break; // Only handle first matching shortcut
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, ignoreInputFields]);
}

/**
 * Common keyboard shortcuts
 */
export const commonShortcuts = {
  selectAll: 'ctrl+a',
  escape: 'escape',
  delete: 'delete',
  backspace: 'backspace',
  enter: 'enter',
  search: '/',
  save: 'ctrl+s',
} as const;
