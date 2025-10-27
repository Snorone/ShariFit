import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { createWorkout } from "../../firebase/dbFunctions";

export default function CreateWorkouts() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    (string | { id: string })[]
  >([]);

  // Hämta alla exercises en gång när komponenten laddas
  useEffect(() => {
    const fetchExercises = async () => {
      const snapshot = await getDocs(collection(db, "exercises"));
      setExercises(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchExercises();
  }, []);

  // Lägg till / ta bort exercises från listan
  const toggleExerciseSelection = (exerciseIds: string | any) => {
    const id = typeof exerciseIds === "string" ? exerciseIds : exerciseIds.id;
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 🔹 Spara workouten i Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedExercises.length === 0) {
      alert("Du måste ange ett namn och välja minst en övning!");
      return;
    }

    // Se till att allt är rena ID:n
    const exerciseIds = selectedExercises.map((m) =>
      typeof m === "string" ? m : m.id
    );

    await createWorkout({ name, description, exerciseIds });

    setName("");
    setDescription("");
    setSelectedExercises([]);

    alert("Workout skapad!");
  };

  return (
    <div className="create-daily-meal">
      <h2>Skapa träningsplan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namn på träningsplan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h3>🍽️ Välj övningar:</h3>
        <div className="meal-list">
          {exercises.map((m) => (
            <label key={m.id}>
              <input
                type="checkbox"
                checked={selectedExercises.includes(m.id)}
                onChange={() => toggleExerciseSelection(m.id)}
              />
              {m.name} ({m.description})
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          💾 Spara träningsplan
        </button>
      </form>
    </div>
  );
}
