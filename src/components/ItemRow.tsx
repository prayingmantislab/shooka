"use client";

import type { ShoppingItem } from "@/types";

interface Props {
  item: ShoppingItem;
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
}

export default function ItemRow({ item, onToggle, onRemove }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 transition-opacity ${
        item.inCart ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          item.inCart
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        }`}
        aria-label={item.inCart ? "הסר מהעגלה" : "הוסף לעגלה"}
      >
        {item.inCart && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${item.inCart ? "line-through text-gray-400" : ""}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-400">
          {item.addedBy.avatar} {item.addedBy.displayName}
          {item.inCart && item.checkedBy && (
            <> · סומן ע״י {item.checkedBy.avatar} {item.checkedBy.displayName}</>
          )}
        </p>
      </div>

      {/* Price */}
      {item.price != null && (
        <span className="text-sm text-gray-500 flex-shrink-0">₪{item.price.toFixed(2)}</span>
      )}

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="מחק פריט"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
