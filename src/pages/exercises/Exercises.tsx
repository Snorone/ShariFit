import React, { useEffect, useState, FormEvent } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Role, useAuth } from "../../context/AuthContext";
import { createExercise } from "../../firebase/dbFunctions";
import { Exercise } from "../../types";
import "./Exercises.css";
import {
  APPROVED_FIELD,
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
  EXERCISES_COLLECTION,
} from "../../utils/db-collection";

interface NewExercise {
  name: string;
  description: string;
  muscleGroup: string;
  type: "strength" | "cardio";
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState<NewExercise>({
    name: "",
    description: "",
    muscleGroup: "",
    type: "strength",
  });

  const { user } = useAuth();

  if (user === null) {
    return <div>No user signed in.</div>;
  }
  const isAdmin = user.role === Role.ADMIN;

  // 🔹 Hämta övningar i realtid
  useEffect(() => {
    const q = isAdmin
      ? query(
          collection(db, EXERCISES_COLLECTION),
          orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
        )
      : query(
          collection(db, EXERCISES_COLLECTION),
          where(APPROVED_FIELD, "==", true),
          orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExercises(
        snapshot.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data(),
            } as Exercise)
        )
      );
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // 🔹 Skapa övning
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExercise.name) return alert("Ange ett namn på övningen!");
    if (!user) return alert("Du måste vara inloggad för att skapa övningar!");

    try {
      await createExercise({
        name: newExercise.name,
        description: newExercise.description,
        muscleGroup: newExercise.muscleGroup,
        type: newExercise.type,
        approved: false,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      setNewExercise({
        name: "test",
        description: "test",
        muscleGroup: "test",
        type: "strength",
      });
    } catch (err) {
      console.error("Fel vid skapande av övning:", err);
      alert("Något gick fel, försök igen!");
    }
  };

  // 🔹 Godkänn övning (endast admin)
  const handleApprove = async (exerciseId: string) => {
    try {
      const ref = doc(db, EXERCISES_COLLECTION, exerciseId);
      await updateDoc(ref, {
        approved: true,
        approvedBy: user?.uid,
        approvedAt: new Date(),
      });
    } catch (err) {
      console.error("Kunde inte godkänna:", err);
    }
  };

  return (
    <div className="exercises-page">
      <h1 className="page-title">Övningar</h1>

      {/* Lista */}
      <div className="exercise-list">
        {exercises.map((ex) => (
          <div key={ex.id} className="exercise-item">
            <h3>{ex.name}</h3>
            <p className="exercise-desc">{ex.description}</p>
            <p>
              Muskelgrupp: <strong>{ex.muscleGroup}</strong>
            </p>
            <p>Typ: {ex.type}</p>
            {!ex.approved && (
              <div className="pending">
                <p className="pending-text">⏳ Väntar på godkännande</p>
                {isAdmin && (
                  <button
                    onClick={() => handleApprove(ex.id)}
                    className="btn-approve"
                  >
                    Godkänn
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
