"use client";

import { useState, useEffect } from "react";
import type { UserInfo } from "@/types";

const STORAGE_KEY = "easycart_user";

export function useLocalUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore corrupt data
      }
    }
    setLoaded(true);
  }, []);

  function saveUser(displayName: string, avatar: string): UserInfo {
    const uid = `local_${Date.now()}`;
    const info: UserInfo = { uid, displayName, avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    setUser(info);
    return info;
  }

  function clearUser() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return { user, loaded, saveUser, clearUser };
}
