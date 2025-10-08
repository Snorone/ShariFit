import React from "react";
import CreateExercise from "./createExercise";
import ShowExercise from "./showExercise";
import "./Exercises.css";

export default function ExercisesPage() {
  return (
    <div className="exercises-page">
      <h1 className="page-title">Övningar</h1>
      <ShowExercise />
    </div>
  );
}
