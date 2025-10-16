import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ShowDailyMeals() {
  const [dailyMeals, setDailyMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchDailyMeals = async () => {
      const snapshot = await getDocs(collection(db, "dailyMeals"));

      const mealsData = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data = d.data();

          // 🔹 Hantera både string-ID:n och DocumentReference
          const mealIds = (data.meals || []).map((m: any) =>
            typeof m === "string" ? m : m.id
          );

          const mealDetails = await Promise.all(
            mealIds.map(async (mealId: string) => {
              const mealDoc = await getDoc(doc(db, "meals", mealId));
              return mealDoc.exists()
                ? { id: mealDoc.id, ...mealDoc.data() }
                : null;
            })
          );

          return {
            id: d.id,
            name: data.name,
            description: data.description,
            meals: mealDetails.filter(Boolean),
          };
        })
      );

      setDailyMeals(mealsData);
    };

    fetchDailyMeals();
  }, []);

  return (
    <div className="show-daily-meals">
      <h2>📅 Dagsplaner</h2>

      {dailyMeals.length === 0 ? (
        <p>Inga dagsplaner skapade ännu.</p>
      ) : (
        dailyMeals.map((day) => (
          <div key={day.id} className="daily-meal-card">
            <h3>{day.name}</h3>
            <p>{day.description}</p>

            <ul>
              {day.meals.map((meal: any) => (
                <li key={meal.id}>
                  <strong>{meal.name}</strong> – {meal.calories} kcal
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
