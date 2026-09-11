import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Given a light image path (`name.png`), return its `_dark` twin the same way
// content.js does for in-body figures. If the path is already a `_dark` file it
// is returned unchanged. Dark-only renders are copied to both names, so this is
// a no-op swap for them (same image served in either theme).
export function darkVariant(src) {
  if (!src || /_dark(\.[a-zA-Z0-9]+)$/.test(src)) return src;
  return src.replace(/(\.[a-zA-Z0-9]+)$/, '_dark$1');
}
