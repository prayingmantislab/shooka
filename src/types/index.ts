export type CategoryId =
  | "produce"
  | "bakery"
  | "dairy"
  | "meat"
  | "frozen"
  | "beverages"
  | "snacks"
  | "cleaning"
  | "toiletries"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "produce", label: "פירות וירקות", emoji: "🥦" },
  { id: "bakery", label: "מאפים", emoji: "🍞" },
  { id: "dairy", label: "חלב וביצים", emoji: "🥛" },
  { id: "meat", label: "בשר ודגים", emoji: "🥩" },
  { id: "frozen", label: "קפואים", emoji: "❄️" },
  { id: "beverages", label: "משקאות", emoji: "🧃" },
  { id: "snacks", label: "חטיפים", emoji: "🍿" },
  { id: "cleaning", label: "ניקיון", emoji: "🧹" },
  { id: "toiletries", label: "טואלטיקה", emoji: "🧴" },
  { id: "other", label: "אחר", emoji: "🛒" },
];

export interface UserInfo {
  uid: string;
  displayName: string;
  avatar: string;
}

export type UnitType = "יחידות" | "ק״ג" | "גרם" | "ליטר" | "מ״ל" | "אריזה";

export const UNITS: UnitType[] = ["יחידות", "ק״ג", "גרם", "ליטר", "מ״ל", "אריזה"];

export interface ShoppingItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  quantity?: number;
  unit?: UnitType;
  price?: number;
  notes?: string;
  photoUrl?: string;
  inCart: boolean;
  addedBy: UserInfo;
  checkedBy?: UserInfo;
  createdAt: number;
  updatedAt: number;
}

export interface SavedListItem {
  name: string;
  categoryId: CategoryId;
  quantity?: number;
  unit?: UnitType;
}

export interface SavedList {
  id: string;
  name: string;
  items: SavedListItem[];
  createdAt: number;
}

export interface FamilyDoc {
  id: string;
  name: string;
  joinCode: string;
  createdAt: number;
}

export interface UserDoc {
  uid: string;
  displayName: string;
  avatar: string;
  familyId?: string;
}
