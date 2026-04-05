import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { SavedList, SavedListItem } from "@/types";

function savedListsCol(familyId: string) {
  return collection(db, "families", familyId, "savedLists");
}

export async function saveList(
  familyId: string,
  name: string,
  items: SavedListItem[]
): Promise<void> {
  const ref = doc(savedListsCol(familyId));
  const list: SavedList = { id: ref.id, name, items, createdAt: Date.now() };
  await setDoc(ref, list);
}

export async function getSavedLists(familyId: string): Promise<SavedList[]> {
  const snap = await getDocs(savedListsCol(familyId));
  return snap.docs
    .map((d) => d.data() as SavedList)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteSavedList(
  familyId: string,
  listId: string
): Promise<void> {
  await deleteDoc(doc(savedListsCol(familyId), listId));
}
