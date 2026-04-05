import type { CategoryId, UnitType } from "@/types";

export interface DefaultItem {
  name: string;
  categoryId: CategoryId;
  quantity: number;
  unit: UnitType;
}

export const DEFAULT_ITEMS: DefaultItem[] = [
  // פירות וירקות
  { name: "עגבניות", categoryId: "produce", quantity: 1, unit: "ק״ג" },
  { name: "מלפפונים", categoryId: "produce", quantity: 1, unit: "ק״ג" },
  { name: "בצל", categoryId: "produce", quantity: 1, unit: "ק״ג" },
  { name: "תפוחי אדמה", categoryId: "produce", quantity: 1, unit: "ק״ג" },
  { name: "גזר", categoryId: "produce", quantity: 1, unit: "ק״ג" },
  { name: "פלפל", categoryId: "produce", quantity: 3, unit: "יחידות" },
  { name: "חסה", categoryId: "produce", quantity: 1, unit: "יחידות" },
  { name: "לימון", categoryId: "produce", quantity: 3, unit: "יחידות" },

  // מאפים
  { name: "לחם", categoryId: "bakery", quantity: 1, unit: "יחידות" },
  { name: "פיתות", categoryId: "bakery", quantity: 1, unit: "אריזה" },

  // חלב וביצים
  { name: "חלב 3%", categoryId: "dairy", quantity: 2, unit: "יחידות" },
  { name: "ביצים", categoryId: "dairy", quantity: 12, unit: "יחידות" },
  { name: "גבינה לבנה 5%", categoryId: "dairy", quantity: 1, unit: "יחידות" },
  { name: "יוגורט", categoryId: "dairy", quantity: 4, unit: "יחידות" },
  { name: "גבינה צהובה", categoryId: "dairy", quantity: 1, unit: "אריזה" },
  { name: "חמאה", categoryId: "dairy", quantity: 1, unit: "יחידות" },

  // בשר ודגים
  { name: "חזה עוף", categoryId: "meat", quantity: 1, unit: "ק״ג" },
  { name: "בשר טחון", categoryId: "meat", quantity: 500, unit: "גרם" },

  // קפואים
  { name: "שניצל", categoryId: "frozen", quantity: 1, unit: "אריזה" },
  { name: "אפונה קפואה", categoryId: "frozen", quantity: 1, unit: "אריזה" },

  // משקאות
  { name: "מים מינרליים", categoryId: "beverages", quantity: 6, unit: "יחידות" },
  { name: "מיץ תפוזים", categoryId: "beverages", quantity: 1, unit: "יחידות" },

  // ניקיון
  { name: "נייר טואלט", categoryId: "cleaning", quantity: 1, unit: "אריזה" },
  { name: "אקונומיקה", categoryId: "cleaning", quantity: 1, unit: "יחידות" },
  { name: "סבון כלים", categoryId: "cleaning", quantity: 1, unit: "יחידות" },
  { name: "שקיות אשפה", categoryId: "cleaning", quantity: 1, unit: "אריזה" },

  // טואלטיקה
  { name: "שמפו", categoryId: "toiletries", quantity: 1, unit: "יחידות" },
  { name: "סבון ידיים", categoryId: "toiletries", quantity: 1, unit: "יחידות" },
  { name: "משחת שיניים", categoryId: "toiletries", quantity: 1, unit: "יחידות" },
];
