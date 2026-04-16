import { useState, useEffect, useRef } from 'react';

const STORAGE_VERSION = 1;

function readStorage(key, initialValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;
    const parsed = JSON.parse(raw);
    if (parsed && parsed._v === STORAGE_VERSION) {
      return parsed.data;
    }
    return initialValue;
  } catch {
    return initialValue;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ _v: STORAGE_VERSION, data: value }));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      writeStorage(key, value);
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, value]);

  return [value, setValue];
}
