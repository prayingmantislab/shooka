"use client";

import { useState } from "react";
import type { SavedList, ShoppingItem } from "@/types";

interface Props {
  lists: SavedList[];
  currentItems: ShoppingItem[];
  onSave: (name: string) => void;
  onLoad: (list: SavedList) => void;
  onDelete: (listId: string) => void;
  onClose: () => void;
}

export default function SavedListsModal({ lists, currentItems, onSave, onLoad, onDelete, onClose }: Props) {
  const [tab, setTab] = useState<"saved" | "save">("saved");
  const [saveName, setSaveName] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSave(saveName.trim());
    setSaveName("");
    setTab("saved");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold">רשימות שמורות</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mx-6 flex-shrink-0">
          <button
            onClick={() => setTab("saved")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "saved" ? "border-b-2 border-green-500 text-green-600" : "text-gray-400"}`}
          >
            הרשימות שלי ({lists.length})
          </button>
          <button
            onClick={() => setTab("save")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "save" ? "border-b-2 border-green-500 text-green-600" : "text-gray-400"}`}
          >
            שמור רשימה נוכחית
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "save" ? (
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                {currentItems.length === 0
                  ? "הרשימה הנוכחית ריקה"
                  : `תשמור ${currentItems.length} פריטים`}
              </p>
              <form onSubmit={handleSave} className="space-y-3">
                <input
                  autoFocus
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="שם הרשימה..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  disabled={!saveName.trim() || currentItems.length === 0}
                  className="w-full bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
                >
                  שמור רשימה
                </button>
              </form>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-12 text-gray-400 px-6">
              <p className="text-3xl mb-3">📋</p>
              <p className="font-medium">אין רשימות שמורות עדיין</p>
              <p className="text-sm mt-1">שמור את הרשימה הנוכחית כתבנית לשימוש חוזר</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lists.map((list) => (
                <div key={list.id} className="flex items-center gap-3 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{list.name}</p>
                    <p className="text-sm text-gray-400">{list.items.length} פריטים</p>
                  </div>
                  <button
                    onClick={() => { onLoad(list); onClose(); }}
                    className="text-sm bg-green-100 text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    טען
                  </button>
                  <button
                    onClick={() => onDelete(list.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="מחק רשימה"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
