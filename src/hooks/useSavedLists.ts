"use client";

import { useState, useEffect, useCallback } from "react";
import { saveList, getSavedLists, deleteSavedList } from "@/lib/savedLists";
import type { SavedList, ShoppingItem } from "@/types";

export function useSavedLists(familyId: string | undefined) {
  const [lists, setLists] = useState<SavedList[]>([]);

  useEffect(() => {
    if (!familyId) return;
    getSavedLists(familyId).then(setLists);
  }, [familyId]);

  const saveCurrentList = useCallback(
    async (name: string, items: ShoppingItem[]) => {
      if (!familyId) return;
      const listItems = items.map(({ name, categoryId, quantity, unit }) => ({
        name,
        categoryId,
        quantity,
        unit,
      }));
      await saveList(familyId, name, listItems);
      const updated = await getSavedLists(familyId);
      setLists(updated);
    },
    [familyId]
  );

  const deleteList = useCallback(
    async (listId: string) => {
      if (!familyId) return;
      await deleteSavedList(familyId, listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
    },
    [familyId]
  );

  return { lists, saveCurrentList, deleteList };
}
