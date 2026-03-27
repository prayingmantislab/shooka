import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import type { FamilyDoc, UserDoc } from "@/types";

function generateJoinCode(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createFamily(
  familyName: string,
  user: { uid: string; displayName: string; avatar: string }
): Promise<FamilyDoc> {
  const familyId = `fam_${Date.now()}`;
  const joinCode = generateJoinCode();

  const family: FamilyDoc = {
    id: familyId,
    name: familyName,
    joinCode,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "families", familyId), family);
  await saveUserDoc({ ...user, familyId });

  return family;
}

export async function joinFamily(
  joinCode: string,
  user: { uid: string; displayName: string; avatar: string }
): Promise<FamilyDoc> {
  const q = query(
    collection(db, "families"),
    where("joinCode", "==", joinCode.replace(/[^\w]/g, "").toUpperCase())
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("קוד לא תקין — Family not found");
  }

  const family = snap.docs[0].data() as FamilyDoc;
  await saveUserDoc({ ...user, familyId: family.id });

  return family;
}

export async function loadUserFamily(uid: string): Promise<FamilyDoc | null> {
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) return null;

  const userData = userSnap.data() as UserDoc;
  if (!userData.familyId) return null;

  const famSnap = await getDoc(doc(db, "families", userData.familyId));
  if (!famSnap.exists()) return null;

  return famSnap.data() as FamilyDoc;
}

async function saveUserDoc(user: UserDoc): Promise<void> {
  await setDoc(doc(db, "users", user.uid), user, { merge: true });
}
