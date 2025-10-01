// src/utils/createUserIfNotExists.ts
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { EXERCISES_COLLECTION } from "./db-collection";

export const createUserIfNotExists = async () => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Skapa användardokument
    await setDoc(userRef, {
      name: auth.currentUser.displayName || "No Name",
      email: auth.currentUser.email,
      createdAt: new Date(),
    });

    console.log("✅ User document created!");

    // Skapa några testövningar
    const exercisesRef = collection(db, "users", userId, EXERCISES_COLLECTION);
    await addDoc(exercisesRef, {
      name: "Bänkpress",
      sets: 3,
      reps: 10,
      weight: 60,
      date: "2025-08-15",
    });
    await addDoc(exercisesRef, {
      name: "Knäböj",
      sets: 4,
      reps: 8,
      weight: 80,
      date: "2025-08-15",
    });

    console.log("✅ Test exercises added!");
  } else {
    console.log("ℹ️ User already exists in Firestore");
  }
};
