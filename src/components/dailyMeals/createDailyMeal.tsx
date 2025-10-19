import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { createDailyMeal } from "../../firebase/dbFunctions";

export default function CreateDailyMeal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<
    (string | { id: string })[]
  >([]);

  // 🔹 Hämta alla måltider en gång när komponenten laddas
  useEffect(() => {
    const fetchMeals = async () => {
      const snapshot = await getDocs(collection(db, "meals"));
      setMeals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchMeals();
  }, []);

  // 🔹 Lägg till / ta bort måltid från listan
  const toggleMealSelection = (mealId: string | any) => {
    const id = typeof mealId === "string" ? mealId : mealId.id;
    setSelectedMeals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 🔹 Spara dagsplanen i Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedMeals.length === 0) {
      alert("Du måste ange ett namn och välja minst en måltid!");
      return;
    }

    // Se till att allt är rena ID:n
    const mealIds = selectedMeals.map((m) =>
      typeof m === "string" ? m : m.id
    );

    await createDailyMeal({ name, description, mealIds });

    setName("");
    setDescription("");
    setSelectedMeals([]);

    alert("Dagsplan skapad!");
  };

  return (
    <div className="create-daily-meal">
      <h2>🗓️ Skapa dagsplan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namn på dagsplan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h3>🍽️ Välj måltider:</h3>
        <div className="meal-list">
          {meals.map((m) => (
            <label key={m.id}>
              <input
                type="checkbox"
                checked={selectedMeals.includes(m.id)}
                onChange={() => toggleMealSelection(m.id)}
              />
              {m.name} ({m.calories} kcal)
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          💾 Spara dagsplan
        </button>
      </form>
    </div>
  );
}
