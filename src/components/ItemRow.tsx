"use client";

import { useState } from "react";
import type { ShoppingItem } from "@/types";

interface Props {
  item: ShoppingItem;
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
  onUpdate: (itemId: string, updates: Partial<Pick<ShoppingItem, "quantity" | "notes" | "unit" | "price">>) => void;
}

export default function ItemRow({ item, onToggle, onRemove, onUpdate }: Props) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.notes ?? "");
  const [lightbox, setLightbox] = useState(false);

  const qty = item.quantity ?? 1;
  const unit = item.unit ?? "יחידות";

  function changeQty(delta: number) {
    const next = Math.max(1, qty + delta);
    onUpdate(item.id, { quantity: next });
  }

  function saveNote() {
    setEditingNote(false);
    onUpdate(item.id, { notes: noteText.trim() });
  }

  return (
    <>
      <div
        className={`px-4 py-3 border-b border-gray-100 last:border-0 transition-opacity ${
          item.inCart ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(item)}
            className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              item.inCart
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400"
            }`}
            aria-label={item.inCart ? "הסר מהעגלה" : "הוסף לעגלה"}
          >
            {item.inCart && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Photo thumbnail */}
          {item.photoUrl && (
            <button
              onClick={() => setLightbox(true)}
              className="flex-shrink-0"
              aria-label="הצג תמונה"
            >
              <img
                src={item.photoUrl}
                alt={item.name}
                className="w-10 h-10 object-cover rounded-lg border border-gray-200"
              />
            </button>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${item.inCart ? "line-through text-gray-400" : ""}`}>
              {item.name}
            </p>
            <p className="text-sm text-gray-400">
              {item.addedBy.avatar} {item.addedBy.displayName}
              {item.inCart && item.checkedBy && (
                <> · סומן ע״י {item.checkedBy.avatar} {item.checkedBy.displayName}</>
              )}
            </p>
            {item.price != null && (
              <p className="text-sm text-gray-400">₪{item.price.toFixed(2)}</p>
            )}
          </div>

          {/* Quantity stepper */}
          {!item.inCart && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => changeQty(-1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                aria-label="הפחת כמות"
              >
                −
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                {qty} {unit}
              </span>
              <button
                onClick={() => changeQty(1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                aria-label="הוסף כמות"
              >
                +
              </button>
            </div>
          )}
          {item.inCart && item.quantity != null && (
            <span className="text-sm font-medium text-gray-500 flex-shrink-0">
              {item.quantity} {unit}
            </span>
          )}

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="מחק פריט"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notes row */}
        <div className="mr-10 mt-1">
          {editingNote ? (
            <div className="flex gap-2 mt-1">
              <input
                autoFocus
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onBlur={saveNote}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveNote();
                  if (e.key === "Escape") setEditingNote(false);
                }}
                placeholder="הוסף הערה..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          ) : (
            <button
              onClick={() => { setNoteText(item.notes ?? ""); setEditingNote(true); }}
              className="text-sm text-gray-400 hover:text-green-600 transition-colors text-right block"
            >
              {item.notes ? `📝 ${item.notes}` : "+ הוסף הערה"}
            </button>
          )}
        </div>
      </div>

      {/* Photo lightbox */}
      {lightbox && item.photoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={item.photoUrl}
            alt={item.name}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
