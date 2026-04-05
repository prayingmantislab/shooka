"use client";

import { useState, useRef, useEffect } from "react";
import { CATEGORIES, UNITS } from "@/types";
import type { CategoryId, UnitType } from "@/types";

interface Props {
  onAdd: (payload: { name: string; categoryId: CategoryId; quantity?: number; unit?: UnitType; price?: number; notes?: string; photoUrl?: string }) => void;
  onClose: () => void;
  defaultCategoryId?: CategoryId;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const max = 400;
        let { width, height } = img;
        if (width > height) {
          if (width > max) { height = Math.round(height * max / width); width = max; }
        } else {
          if (height > max) { width = Math.round(width * max / height); height = max; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AddItemModal({ onAdd, onClose, defaultCategoryId }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>(defaultCategoryId ?? "other");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<UnitType>("יחידות");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPhotoUrl(compressed);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      categoryId,
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit,
      price: price ? parseFloat(price) : undefined,
      notes: notes.trim() || undefined,
      photoUrl,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">הוסף פריט</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + photo button */}
            <div>
              <label className="block text-sm font-medium mb-1">שם הפריט *</label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="לדוגמה: תפוחים, חלב 3%..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gray-300 rounded-xl text-gray-400 hover:text-green-600 hover:border-green-400 transition-colors"
                  title="צלם תמונה"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Photo preview */}
            {photoUrl && (
              <div className="relative inline-block">
                <img
                  src={photoUrl}
                  alt="תצוגה מקדימה"
                  className="h-24 w-24 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => { setPhotoUrl(undefined); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {/* Quantity + Unit */}
            <div>
              <label className="block text-sm font-medium mb-1">כמות</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24 border border-gray-300 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="flex gap-1 flex-wrap flex-1">
                  {UNITS.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                        unit === u
                          ? "bg-green-100 ring-2 ring-green-500 font-semibold"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">הערה (אופציונלי)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="לדוגמה: בלי מלח, מסוג X..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
              />
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
    </div>
  );
}
