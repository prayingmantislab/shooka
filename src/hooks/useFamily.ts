"use client";

import { useState, useEffect, useCallback } from "react";
import { subscribeToItems, addItem, toggleItem, removeItem, clearItems } from "@/lib/items";
import { loadUserFamily } from "@/lib/families";
import type { FamilyDoc, ShoppingItem, CategoryId, UnitType, UserInfo } from "@/types";

export function useFamily(user: UserInfo | null) {
  const [family, setFamily] = useState<FamilyDoc | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load family on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadUserFamily(user.uid)
      .then((fam) => {
        setFamily(fam);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Subscribe to items when family is known
  useEffect(() => {
    if (!family) return;
    const unsub = subscribeToItems(family.id, setItems);
    return unsub;
  }, [family]);

  const handleAdd = useCallback(
    (payload: { name: string; categoryId: CategoryId; quantity?: number; unit?: UnitType; price?: number }) => {
      if (!family || !user) return;
      // Optimistic — Firestore will confirm via onSnapshot
      addItem(family.id, { ...payload, addedBy: user });
    },
    [family, user]
  );

  const handleToggle = useCallback(
    (item: ShoppingItem) => {
      if (!family || !user) return;
      // Optimistic local update
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, inCart: !i.inCart, checkedBy: !i.inCart ? user : undefined, updatedAt: Date.now() }
            : i
        )
      );
      toggleItem(family.id, item, user);
    },
    [family, user]
  );

  const handleRemove = useCallback(
    (itemId: string) => {
      if (!family) return;
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      removeItem(family.id, itemId);
    },
    [family]
  );

  const handleClearChecked = useCallback(() => {
    if (!family) return;
    const checked = items.filter((i) => i.inCart);
    setItems((prev) => prev.filter((i) => !i.inCart));
    clearItems(family.id, checked);
  }, [family, items]);

  const handleClearAll = useCallback(() => {
    if (!family) return;
    const all = [...items];
    setItems([]);
    clearItems(family.id, all);
  }, [family, items]);

  return {
    family,
    setFamily,
    items,
    loading,
    addItem: handleAdd,
    toggleItem: handleToggle,
    removeItem: handleRemove,
    clearChecked: handleClearChecked,
    clearAll: handleClearAll,
  };
}
