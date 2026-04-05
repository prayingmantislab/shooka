"use client";

import { useState, useRef } from "react";
import ItemRow from "./ItemRow";
import type { Category, ShoppingItem } from "@/types";

interface Props {
  category: Category;
  items: ShoppingItem[];
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
  onUpdate: (itemId: string, updates: Partial<Pick<ShoppingItem, "quantity" | "notes" | "unit" | "price">>) => void;
  onQuickAdd: (name: string) => void;
}

export default function CategorySection({ category, items, onToggle, onRemove, onUpdate, onQuickAdd }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [quickName, setQuickName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function openInput() {
    setShowInput(true);
    // Wait for render then focus
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = quickName.trim();
    if (!name) return;
    onQuickAdd(name);
    setQuickName("");
    // Stay open so user can keep adding
    inputRef.current?.focus();
  }

  function handleBlur() {
    // Close if left empty
    if (!quickName.trim()) {
      setShowInput(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setQuickName("");
      setShowInput(false);
    }
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          {category.emoji} {category.label}
          <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? "-rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="bg-white">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onToggle={onToggle} onRemove={onRemove} onUpdate={onUpdate} />
          ))}

          {/* Quick add */}
          {showInput ? (
            <form onSubmit={handleQuickAdd} className="flex gap-2 px-4 py-2 border-t border-gray-100">
              <input
                ref={inputRef}
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={`הוסף ל${category.label}...`}
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50"
              />
              <button
                type="submit"
                disabled={!quickName.trim()}
                className="w-8 h-8 bg-green-500 text-white rounded-full text-lg font-bold flex items-center justify-center hover:bg-green-600 disabled:opacity-30 transition-colors flex-shrink-0"
              >
                +
              </button>
            </form>
          ) : (
            <button
              onClick={openInput}
              className="w-full flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors border-t border-gray-50"
            >
              <span className="text-base font-bold">+</span>
              <span>הוסף ל{category.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
