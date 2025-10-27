import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { getDoc, doc } from "firebase/firestore";

export default function ShowWeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "weeklyMeals"),
      async (snapshot) => {
        const mealsData = await Promise.all(
          snapshot.docs.map(async (d) => {
            const data = d.data();

            // 🔹 Hantera både string-ID:n och DocumentReference
            const dailyMealIds = (data.dailyMealIds || []).map((m: any) =>
              typeof m === "string" ? m : m.id
            );

            const dailyMealDetails = await Promise.all(
              dailyMealIds.map(async (mealId: string) => {
                const mealDoc = await getDoc(doc(db, "dailyMeals", mealId));
                return mealDoc.exists()
                  ? { id: mealDoc.id, ...mealDoc.data() }
                  : null;
              })
            );
            return {
              id: d.id,
              name: data.name,
              description: data.description,
              dailyMeals: (dailyMealDetails || []).filter(Boolean),
            };
          })
        );

        setWeeklyMeals(mealsData);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="show-weekly-meals">
      <h2>📅 Veckoplaner</h2>

      {weeklyMeals.length === 0 ? (
        <p>Inga veckoplaner skapade ännu.</p>
      ) : (
        weeklyMeals.map((wm) => (
          <div key={wm.id} className="weekly-meal-card">
            <h3>{wm.name}</h3>
            <p>{wm.description}</p>
            <h4>Dagsplaner:</h4>
            <ul>
              {wm.dailyMeals &&
                wm.dailyMeals.map((dailyMeal: any) => (
                  <li key={dailyMeal.id}>
                    <strong>{dailyMeal.name}</strong>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
