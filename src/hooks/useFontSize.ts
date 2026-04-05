"use client";

import { useState, useEffect } from "react";

export type FontSize = "normal" | "large" | "xlarge";

const STORAGE_KEY = "easycart_font_size";

function applyFontSize(size: FontSize) {
  document.documentElement.classList.remove("font-large", "font-xlarge");
  if (size === "large") document.documentElement.classList.add("font-large");
  if (size === "xlarge") document.documentElement.classList.add("font-xlarge");
}

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as FontSize | null;
    if (stored && ["normal", "large", "xlarge"].includes(stored)) {
      setFontSizeState(stored);
      applyFontSize(stored);
    }
  }, []);

  function setFontSize(size: FontSize) {
    setFontSizeState(size);
    localStorage.setItem(STORAGE_KEY, size);
    applyFontSize(size);
  }

  return { fontSize, setFontSize };
}
