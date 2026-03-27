"use client";

import { useState } from "react";

const AVATARS = ["🧑", "👩", "👨", "🧒", "👦", "👧", "🧔", "👩‍🦱", "👨‍🦱", "🧓", "👴", "👵"];

interface Props {
  onSave: (displayName: string, avatar: string) => void;
}

export default function UserSetup({ onSave }: Props) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onSave(name.trim(), avatar);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">ברוכים הבאים 🛒</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">בואו נתחיל — מה שמך?</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">שם תצוגה</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: אמא, דניאל..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">בחר אווטאר</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-2xl h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    avatar === a
                      ? "bg-green-100 ring-2 ring-green-500 scale-110"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
          >
            המשך ←
          </button>
        </form>
      </div>
    </div>
  );
}
