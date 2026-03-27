import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { ShoppingItem, CategoryId, UnitType, UserInfo } from "@/types";

function itemsCol(familyId: string) {
  return collection(db, "families", familyId, "items");
}

export function subscribeToItems(
  familyId: string,
  onItems: (items: ShoppingItem[]) => void
): Unsubscribe {
  const q = query(itemsCol(familyId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => d.data() as ShoppingItem);
    onItems(items);
  });
}

export async function addItem(
  familyId: string,
  payload: {
    name: string;
    categoryId: CategoryId;
    quantity?: number;
    unit?: UnitType;
    price?: number;
    addedBy: UserInfo;
  }
): Promise<void> {
  const ref = doc(itemsCol(familyId));
  const now = Date.now();
  const item: ShoppingItem = {
    id: ref.id,
    name: payload.name,
    categoryId: payload.categoryId,
    ...(payload.quantity != null && { quantity: payload.quantity }),
    ...(payload.unit != null && { unit: payload.unit }),
    ...(payload.price != null && { price: payload.price }),
    inCart: false,
    addedBy: payload.addedBy,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, item);
}

export async function toggleItem(
  familyId: string,
  item: ShoppingItem,
  checkedBy: UserInfo
): Promise<void> {
  const ref = doc(itemsCol(familyId), item.id);
  const inCart = !item.inCart;
  await setDoc(
    ref,
    {
      inCart,
      checkedBy: inCart ? checkedBy : null,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function removeItem(
  familyId: string,
  itemId: string
): Promise<void> {
  await deleteDoc(doc(itemsCol(familyId), itemId));
}

export async function clearItems(
  familyId: string,
  items: ShoppingItem[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const item of items) {
    batch.delete(doc(itemsCol(familyId), item.id));
  }
  await batch.commit();
}
