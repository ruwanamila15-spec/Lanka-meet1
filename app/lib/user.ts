
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function generatePublicUserId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let id = "LM-";

  for (let i = 0; i < 6; i++) {
    id += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return id;
}

export async function createOrGetUserProfile(user: any) {
  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  const publicUserId = generatePublicUserId();

  const userData = {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    publicUserId,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, userData);

  return userData;
}

