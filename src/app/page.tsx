"use client";

import { useLocalUser } from "@/hooks/useLocalUser";
import { useFamily } from "@/hooks/useFamily";
import { useSavedLists } from "@/hooks/useSavedLists";
import UserSetup from "@/components/UserSetup";
import FamilySetup from "@/components/FamilySetup";
import ShoppingList from "@/components/ShoppingList";
import type { SavedList } from "@/types";

export default function Home() {
  const { user, loaded, saveUser, clearUser } = useLocalUser();
  const {
    family,
    setFamily,
    items,
    loading,
    addItem,
    updateItem,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
  } = useFamily(user);

  const { lists: savedLists, saveCurrentList, deleteList } = useSavedLists(family?.id);

  if (!loaded) return null;

  if (!user) {
    return (
      <UserSetup
        onSave={(displayName, avatar) => saveUser(displayName, avatar)}
      />
    );
  }

  if (!loading && !family) {
    return <FamilySetup user={user} onFamily={setFamily} />;
  }

  if (loading || !family) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>טוען... ⏳</p>
      </div>
    );
  }

  function handleReset() {
    clearUser();
    setFamily(null);
  }

  function handleLoadList(list: SavedList) {
    for (const listItem of list.items) {
      addItem({
        name: listItem.name,
        categoryId: listItem.categoryId,
        quantity: listItem.quantity,
        unit: listItem.unit,
      });
    }
  }

  return (
    <ShoppingList
      family={family}
      user={user}
      items={items}
      onAdd={addItem}
      onUpdate={updateItem}
      onToggle={toggleItem}
      onRemove={removeItem}
      onClearChecked={clearChecked}
      onClearAll={clearAll}
      onReset={handleReset}
      savedLists={savedLists}
      onSaveList={(name) => saveCurrentList(name, items)}
      onLoadList={handleLoadList}
      onDeleteSavedList={deleteList}
    />
  );
}
