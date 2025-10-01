import React, { useEffect, useState, FormEvent } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createExercise } from "../../firebase/dbFunctions";
import { Exercise } from "../../types";
import "./admin.css";
import { Role, useAuth } from "../../context/AuthContext";
import {
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
  EXERCISES_COLLECTION,
} from "../../utils/db-collection";
import ExercisesPage from "../exercises/Exercises";

interface NewExercise {
  name: string;
  description: string;
  muscleGroup: string;
  type: "strength" | "cardio";
}

export default function AdminPage() {
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

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(
      collection(db, EXERCISES_COLLECTION),
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExercise.name) return alert("Ange ett namn på övningen!");
    if (!user) return alert("Du måste vara inloggad för att skapa övningar.");

    try {
      await createExercise({
        ...newExercise,
        createdAt: new Date().toISOString(),
        approved: true, // admin behöver inte vänta
        createdBy: user.uid, // Include createdBy property
      });

      setNewExercise({
        name: "",
        description: "",
        muscleGroup: "",
        type: "strength",
      });
    } catch (err) {
      console.error("Fel vid skapande av övning:", err);
    }
  };

  const handleApprove = async (exerciseId: string) => {
    if (!user)
      return alert("Du måste vara inloggad för att godkänna övningar.");
    try {
      const ref = doc(db, EXERCISES_COLLECTION, exerciseId);
      await updateDoc(ref, {
        approved: true,
        approvedBy: user.uid,
        approvedAt: new Date(),
      });
    } catch (err) {
      console.error("Kunde inte godkänna:", err);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="page-title">Adminpanel – Övningar</h1>

      {/* Formulär */}
      <form onSubmit={handleSubmit} className="exercise-form">
        <h2>Lägg till ny övning</h2>
        <input
          type="text"
          placeholder="Namn"
          value={newExercise.name}
          onChange={(e) =>
            setNewExercise({ ...newExercise, name: e.target.value })
          }
        />
        <textarea
          placeholder="Beskrivning"
          value={newExercise.description}
          onChange={(e) =>
            setNewExercise({ ...newExercise, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Muskelgrupp"
          value={newExercise.muscleGroup}
          onChange={(e) =>
            setNewExercise({ ...newExercise, muscleGroup: e.target.value })
          }
        />
        <select
          value={newExercise.type}
          onChange={(e) =>
            setNewExercise({
              ...newExercise,
              type: e.target.value as "strength" | "cardio",
            })
          }
        >
          <option value="strength">Styrka</option>
          <option value="cardio">Cardio</option>
        </select>
        <button type="submit" className="btn-primary">
          Spara övning
        </button>
      </form>

      {/* Lista */}

      <div className="exercise-list">
        <ExercisesPage />
      </div>
    </div>
  );
}
