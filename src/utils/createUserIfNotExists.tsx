// src/utils/createUserIfNotExists.ts
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { User } from "firebase/auth";

export const createUserIfNotExists = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Skapa användardokument
    await setDoc(userRef, {
      name: user.displayName || "No Name",
      email: user.email,
      createdAt: new Date(),
    });

    console.log("✅ User document created!");
  }
};
