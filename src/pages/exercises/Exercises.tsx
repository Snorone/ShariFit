// src/pages/Exercises.tsx
import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import "./Exercises.css";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

export default function Exercises() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");
  const [sets, setSets] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  // Hämta övningar från Firestore i realtid
  useEffect(() => {
    if (!user) return;

    const exercisesRef = collection(db, "users", user.uid, "exercises");

    const unsubscribe = onSnapshot(exercisesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Exercise, "id">),
      }));
      setExercises(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Lägg till ny övning
  const handleAddExercise = async () => {
    if (!user || !name || sets <= 0 || reps <= 0 || weight < 0) return;

    const exercisesRef = collection(db, "users", user.uid, "exercises");

    await addDoc(exercisesRef, {
      name,
      sets,
      reps,
      weight,
      date: new Date().toISOString().split("T")[0],
    });

    // Rensa formuläret
    setName("");
    setSets(0);
    setReps(0);
    setWeight(0);
  };

  // Ta bort övning
  const handleDeleteExercise = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "exercises", id));
  };

  return (
    <div className="exercises-container">
      <h1 className="exercises-title">Mina Övningar</h1>

      {/* Formulär för ny övning */}
      <div className="exercise-form">
        <input
          type="text"
          placeholder="Övningens namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Set"
          value={sets || ""}
          onChange={(e) => setSets(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps || ""}
          onChange={(e) => setReps(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Vikt (kg)"
          value={weight || ""}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <button onClick={handleAddExercise}>Lägg till</button>
      </div>

      {/* Lista med övningar */}
      <ul className="exercise-list">
        {exercises.map((exercise) => (
          <li key={exercise.id} className="exercise-item">
            <span>
              <strong>{exercise.name}</strong> – {exercise.sets} set × {exercise.reps} reps – {exercise.weight} kg ({exercise.date})
            </span>
            <button onClick={() => handleDeleteExercise(exercise.id)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
