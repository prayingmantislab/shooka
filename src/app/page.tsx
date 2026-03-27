"use client";

import { useLocalUser } from "@/hooks/useLocalUser";
import { useFamily } from "@/hooks/useFamily";
import UserSetup from "@/components/UserSetup";
import FamilySetup from "@/components/FamilySetup";
import ShoppingList from "@/components/ShoppingList";

export default function Home() {
  const { user, loaded, saveUser } = useLocalUser();
  const {
    family,
    setFamily,
    items,
    loading,
    addItem,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
  } = useFamily(user);

  if (!loaded) return null;

  // Step 1: collect user identity
  if (!user) {
    return (
      <UserSetup
        onSave={(displayName, avatar) => saveUser(displayName, avatar)}
      />
    );
  }

  // Step 2: attach to family
  if (!loading && !family) {
    return <FamilySetup user={user} onFamily={setFamily} />;
  }

  // Step 3: loading or ready
  if (loading || !family) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>טוען... ⏳</p>
      </div>
    );
  }

  return (
    <ShoppingList
      family={family}
      user={user}
      items={items}
      onAdd={addItem}
      onToggle={toggleItem}
      onRemove={removeItem}
      onClearChecked={clearChecked}
      onClearAll={clearAll}
    />
  );
}
