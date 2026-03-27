"use client";

import type { ShoppingItem } from "@/types";

interface Props {
  items: ShoppingItem[];
}

export default function BudgetBar({ items }: Props) {
  const inCartItems = items.filter((i) => i.inCart && i.price != null);
  const total = inCartItems.reduce((sum, i) => sum + (i.price ?? 0), 0);

  if (inCartItems.length === 0) return null;

  return (
    <div className="bg-green-500 text-white px-4 py-2 flex items-center justify-between text-sm font-medium">
      <span>🛒 {inCartItems.length} פריטים בעגלה</span>
      <span>סה״כ: ₪{total.toFixed(2)}</span>
    </div>
  );
}
