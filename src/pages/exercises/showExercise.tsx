import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  EXERCISES_COLLECTION,
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
} from "../../utils/db-collection";
import { Exercise } from "../../types";

export default function ShowExercise() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, EXERCISES_COLLECTION),
      orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...docSnap.data(),
          } as Exercise)
      );
      setExercises(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="exercise-list">
      {exercises.map((ex) => (
        <div key={ex.id} className="exercise-item">
          <h3>{ex.name}</h3>
          <p>{ex.description}</p>
          <p>
            Muskelgrupp: <strong>{ex.muscleGroup}</strong>
          </p>
          <p>Typ: {ex.type}</p>
        </div>
      ))}
    </div>
  );
}
