import React from "react";
import ShowUserWorkouts from "../../components/workouts/showUserWorkouts";

export default function WorkoutsPage() {
  return (
    <div className="workouts-page">
      <h1 className="page-title">Träningspass</h1>
      <ShowUserWorkouts />
    </div>
  );
}
