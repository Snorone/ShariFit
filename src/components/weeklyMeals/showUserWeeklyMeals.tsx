import {
  collection,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

export default function ShowUserWeeklyMeals() {
  const { user } = useAuth();
  const [weeklyMeals, setWeeklyMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const fetchUserWeeklyMeals = async () => {
      try {
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) return;

        const userData = userSnapshot.data();
        const userWeeklyMealIds = (userData.weeklyMealIds || []).map(
          (id: any) => (typeof id === "string" ? id : id.id)
        );

        if (userWeeklyMealIds.length === 0) {
          setWeeklyMeals([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "weeklyMeals"),
          where("__name__", "in", userWeeklyMealIds)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.log("Fetched user weekly meals: ", data);
          setWeeklyMeals(data);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user weekly meals: ", error);
        setLoading(false);
      }
    };
    fetchUserWeeklyMeals();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
    if (weeklyMeals.length === 0) {
      return (
        <div>
          <h2>📅 Dina veckoplaner</h2>
          <p>Inga veckoplaner tillagda ännu.</p>
        </div>
      );
    }
  }
  return (
    <div className="show-user-weekly-meals">
      <h2>📅 Dina veckoplaner</h2>
      {weeklyMeals.map((wm) => (
        <div key={wm.id} className="weekly-meal-card">
          <h3>{wm.name}</h3>
          <p>{wm.description}</p>
        </div>
      ))}
    </div>
  );
}
