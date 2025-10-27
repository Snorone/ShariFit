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

export default function ShowUserWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const fetchUserWorkouts = async () => {
      try {
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) return;

        const userData = userSnapshot.data();
        const userWorkoutsIds = (userData.workoutsIds || []).map((id: any) =>
          typeof id === "string" ? id : id.id
        );

        if (userWorkoutsIds.length === 0) {
          setWorkouts([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "workouts"),
          where("__name__", "in", userWorkoutsIds)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.log("Fetched user workouts: ", data);
          setWorkouts(data);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user workouts: ", error);
        setLoading(false);
      }
    };
    fetchUserWorkouts();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
    if (workouts.length === 0) {
      return (
        <div>
          <h2>Dina träningsplaner</h2>
          <p>Inga veckoplaner tillagda ännu.</p>
        </div>
      );
    }
  }
  return (
    <div className="show-user-workouts">
      <h2>📅 Dina träningsplaner</h2>
      {workouts.map((wo) => (
        <div key={wo.id} className="workouts-card">
          <h3>{wo.name}</h3>
          <p>{wo.description}</p>
        </div>
      ))}
    </div>
  );
}
