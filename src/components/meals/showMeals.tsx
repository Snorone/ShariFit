import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  MEALS_COLLECTION,
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
} from "../../utils/db-collection";

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  createdAt: string;
}

export default function ShowMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, MEALS_COLLECTION),
      orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Meal)
      );
      setMeals(data);
    });

    return () => unsubscribe();
  }, []);

  return (
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
  );
}
