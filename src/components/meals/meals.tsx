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
import { createMeal } from "../../firebase/dbFunctions";
import { Mealsen, NewMeal } from "../../types";
import "./meals.css";
import {
  APPROVED_FIELD,
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
  MEALS_COLLECTION,
} from "../../utils/db-collection";

export default function Meals() {
  const [meals, setMeals] = useState<Mealsen[]>([]);
  const [newMeal, setNewMeal] = useState<NewMeal>({
    name: "",
    description: "",
    calories: 0,
  });

  const { user } = useAuth();

  if (user === null) {
    return <div>No user signed in.</div>;
  }
  const isAdmin = user.role === Role.ADMIN;

  useEffect(() => {
    const q = isAdmin
      ? query(
          collection(db, MEALS_COLLECTION),
          orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
        )
      : query(
          collection(db, MEALS_COLLECTION),
          //   where(APPROVED_FIELD, "==", true),
          orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMeals(
        snapshot.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data(),
            } as Mealsen)
        )
      );
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMeal.name) return alert("Ange ett namn på övningen!");
    if (!user) return alert("Du måste vara inloggad för att skapa övningar!");

    try {
      await createMeal({
        name: newMeal.name,
        description: newMeal.description,
        calories: newMeal.calories,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      setNewMeal({
        name: "test",
        description: "test",
        calories: 100,
      });
    } catch (err) {
      console.error("Fel vid skapande av måltid:", err);
      alert("Något gick fel, försök igen!");
    }
  };

  return (
    <div className="meals-page">
      <h1 className="page-title">Måltider</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="meals-form">
          <h2>Lägg till ny måltid</h2>
          <input
            type="text"
            placeholder="Namn"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <textarea
            placeholder="Beskrivning"
            value={newMeal.description}
            onChange={(e) =>
              setNewMeal({ ...newMeal, description: e.target.value })
            }
          />
          <input
            placeholder="Muskelgrupp"
            value={newMeal.calories}
            onChange={(e) =>
              setNewMeal({ ...newMeal, calories: Number(e.target.value) })
            }
          />
          <button type="submit" className="btn-primary">
            Spara övning
          </button>
        </form>
      )}
      {/* Lista */}
      <div className="meals-list">
        {meals.map((m) => (
          <div key={m.id} className="meals-item">
            <h3>{m.name}</h3>
            <p className="meals-desc">{m.description}</p>
            <p>
              Kalorier: <strong>{m.calories}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
