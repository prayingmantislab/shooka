"use client";

import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/types";
import type { FamilyDoc, UserInfo, ShoppingItem, CategoryId, UnitType, SavedList } from "@/types";
import CategorySection from "./CategorySection";
import AddItemModal from "./AddItemModal";
import BudgetBar from "./BudgetBar";
import SavedListsModal from "./SavedListsModal";
import { useFontSize } from "@/hooks/useFontSize";

interface Props {
  family: FamilyDoc;
  user: UserInfo;
  items: ShoppingItem[];
  onAdd: (payload: { name: string; categoryId: CategoryId; quantity?: number; unit?: UnitType; price?: number; notes?: string; photoUrl?: string }) => void;
  onUpdate: (itemId: string, updates: Partial<Pick<ShoppingItem, "quantity" | "notes" | "unit" | "price">>) => void;
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onReset: () => void;
  savedLists: SavedList[];
  onSaveList: (name: string) => void;
  onLoadList: (list: SavedList) => void;
  onDeleteSavedList: (listId: string) => void;
}

export default function ShoppingList({
  family,
  user,
  items,
  onAdd,
  onUpdate,
  onToggle,
  onRemove,
  onClearChecked,
  onClearAll,
  onReset,
  savedLists,
  onSaveList,
  onLoadList,
  onDeleteSavedList,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { fontSize, setFontSize } = useFontSize();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasChecked = items.some((i) => i.inCart);

  function copyCode() {
    navigator.clipboard.writeText(family.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.categoryId === cat.id),
  })).filter((g) => g.items.length > 0);

  const allCategories = CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg leading-tight">{family.name} 🛒</h1>
              <button
                onClick={copyCode}
                className="text-xs text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mt-0.5"
              >
                קוד: {family.joinCode} 🛒
                <span>{copiedCode ? "✅" : "📋"}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {hasChecked && (
                <button
                  onClick={onClearChecked}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-2 py-1 transition-colors"
                >
                  נקה מסומנים
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-gray-400 hover:text-red-400 border border-gray-200 rounded-lg px-2 py-1 transition-colors"
                >
                  נקה הכל
                </button>
              )}

              {/* Saved lists button */}
              <button
                onClick={() => setShowSavedLists(true)}
                className="text-gray-400 hover:text-green-600 transition-colors"
                title="רשימות שמורות"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
              </button>

              {/* Avatar menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="text-xl w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title={user.displayName}
                >
                  {user.avatar}
                </button>
                {showMenu && (
                  <div className="absolute left-0 top-11 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44 z-20">
                    <p className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100">
                      {user.displayName}
                    </p>
                    {/* Font size */}
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 mb-1.5">גודל טקסט</p>
                      <div className="flex gap-1">
                        {(["normal", "large", "xlarge"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                              fontSize === s
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {s === "normal" ? "א" : s === "large" ? "א+" : "א++"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowMenu(false); onReset(); }}
                      className="w-full text-right px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      התנתק / החלף משתמש
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BudgetBar items={items} />
      </header>

      {/* List */}
      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {items.length === 0 ? (
          <div>
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-medium">הרשימה ריקה</p>
              <p className="text-sm mt-1">לחץ + כדי להוסיף פריט</p>
            </div>
            {/* Quick add for all categories when empty */}
            <div className="mt-2">
              {allCategories.map((cat) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  items={[]}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  onQuickAdd={(name) => onAdd({ name, categoryId: cat.id, quantity: 1, unit: "יחידות" })}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {grouped.map(({ category, items: catItems }) => (
              <CategorySection
                key={category.id}
                category={category}
                items={catItems}
                onToggle={onToggle}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onQuickAdd={(name) => onAdd({ name, categoryId: category.id, quantity: 1, unit: "יחידות" })}
              />
            ))}
            {/* Categories with no items — collapsed with quick add */}
            {allCategories
              .filter((cat) => !grouped.some((g) => g.category.id === cat.id))
              .map((cat) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  items={[]}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  onQuickAdd={(name) => onAdd({ name, categoryId: cat.id, quantity: 1, unit: "יחידות" })}
                />
              ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-3xl flex items-center justify-center transition-colors z-10"
        aria-label="הוסף פריט"
      >
        +
      </button>

      {showModal && <AddItemModal onAdd={onAdd} onClose={() => setShowModal(false)} />}
      {showSavedLists && (
        <SavedListsModal
          lists={savedLists}
          currentItems={items}
          onSave={onSaveList}
          onLoad={onLoadList}
          onDelete={onDeleteSavedList}
          onClose={() => setShowSavedLists(false)}
        />
      )}
    </div>
  );
}
