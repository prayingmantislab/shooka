"use client";

import { useState } from "react";
import ItemRow from "./ItemRow";
import type { Category, ShoppingItem } from "@/types";

interface Props {
  category: Category;
  items: ShoppingItem[];
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
}

export default function CategorySection({ category, items, onToggle, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false);

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
            <ItemRow key={item.id} item={item} onToggle={onToggle} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
