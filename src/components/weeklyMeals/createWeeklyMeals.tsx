import React, { useState, useEffect, use } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { createWeeklyMeal } from "../../firebase/dbFunctions";
import { toast } from "react-hot-toast";

export default function CreateWeeklyMeals() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dailyMeals, setDailyMeals] = useState<any[]>([]);
  const [selectedDailyMeals, setSelectedDailyMeals] = useState<
    (string | { id: string })[]
  >([]);

  useEffect(() => {
    const fetchDailyMeals = async () => {
      const snapshot = await getDocs(collection(db, "dailyMeals"));
      setDailyMeals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchDailyMeals();
  }, []);

  const toggleDailyMealSelection = (dailyMealId: string | any) => {
    const id = typeof dailyMealId === "string" ? dailyMealId : dailyMealId.id;
    setSelectedDailyMeals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedDailyMeals.length === 0) {
      toast.success("Du måste ange ett namn och välja minst en dagsplan!");
      return;
    }

    const dailyMealIds = selectedDailyMeals.map((m) =>
      typeof m === "string" ? m : m.id
    );

    await createWeeklyMeal({ name, description, dailyMealIds: dailyMealIds });

    setName("");
    setDescription("");
    setSelectedDailyMeals([]);

    toast.success("Veckoplan skapad!");
  };

  return (
    <div className="create-weekly-meal">
      <h2>📅 Skapa veckoplan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namn på veckoplan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="daily-meal-selection">
          <h3>Välj dagsplaner:</h3>
          {dailyMeals.map((dm) => (
            <div key={dm.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDailyMeals.includes(dm.id)}
                  onChange={() => toggleDailyMealSelection(dm)}
                />
                {dm.name}
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Skapa Veckoplan</button>
      </form>
    </div>
  );
}
