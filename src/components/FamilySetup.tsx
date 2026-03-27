"use client";

import { useState } from "react";
import { createFamily, joinFamily } from "@/lib/families";
import type { FamilyDoc, UserInfo } from "@/types";

interface Props {
  user: UserInfo;
  onFamily: (family: FamilyDoc) => void;
}

export default function FamilySetup({ user, onFamily }: Props) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [familyName, setFamilyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!familyName.trim()) return;
    setError("");
    setLoading(true);
    try {
      const fam = await createFamily(familyName.trim(), user);
      onFamily(fam);
    } catch {
      setError("שגיאה ביצירת משפחה, נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setError("");
    setLoading(true);
    try {
      const fam = await joinFamily(joinCode.trim(), user);
      onFamily(fam);
    } catch {
      setError("קוד לא נמצא — בדוק שהזנת נכון.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <p className="text-center text-gray-400 mb-1 text-sm">שלום, {user.avatar} {user.displayName}</p>
        <h1 className="text-2xl font-bold text-center mb-6">הצטרף למשפחה</h1>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {(["create", "join"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === t ? "bg-green-500 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "create" ? "צור משפחה" : "הצטרף לקוד"}
            </button>
          ))}
        </div>

        {tab === "create" ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">שם המשפחה</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="לדוגמה: משפחת לוי"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!familyName.trim() || loading}
              className="w-full bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
            >
              {loading ? "יוצר..." : "צור משפחה ✨"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">קוד הצטרפות</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="לדוגמה: AB1C2🛒"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!joinCode.trim() || loading}
              className="w-full bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
            >
              {loading ? "מחפש..." : "הצטרף 🚪"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
