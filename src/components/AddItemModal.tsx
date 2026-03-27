"use client";

import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/types";
import type { CategoryId } from "@/types";

interface Props {
  onAdd: (payload: { name: string; categoryId: CategoryId; price?: number }) => void;
  onClose: () => void;
}

export default function AddItemModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("other");
  const [price, setPrice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      categoryId,
      price: price ? parseFloat(price) : undefined,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">הוסף פריט</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">שם הפריט *</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: חלב 3%, לחם שיפון..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">קטגוריה</label>
            <div className="grid grid-cols-5 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center py-1.5 rounded-xl text-xs transition-all ${
                    categoryId === cat.id
                      ? "bg-green-100 ring-2 ring-green-500 font-semibold"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="leading-tight mt-0.5 text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">מחיר (אופציונלי)</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-8 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
            >
              הוסף לרשימה +
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
