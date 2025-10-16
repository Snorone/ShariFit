import React, { useState, FormEvent } from "react";
import { createExercise } from "../../firebase/dbFunctions";
import { useAuth, Role } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface NewExercise {
  name: string;
  description: string;
  muscleGroup: string;
  type: "strength" | "cardio";
}

export default function CreateExercise() {
  const [newExercise, setNewExercise] = useState<NewExercise>({
    name: "",
    description: "",
    muscleGroup: "",
    type: "strength",
  });

  const { user } = useAuth();
  const isAdmin = user?.role === Role.ADMIN;

  if (!user)
    return toast.success("Du måste vara inloggad för att skapa övningar!");
  if (!isAdmin) return toast.success("Endast admin kan skapa övningar!");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExercise.name) return toast.success("Ange ett namn på övningen!");
    if (!user)
      return toast.success("Du måste vara inloggad för att skapa övningar!");

    try {
      await createExercise({
        name: newExercise.name,
        description: newExercise.description,
        muscleGroup: newExercise.muscleGroup,
        type: newExercise.type,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success("träning skapades!");

      setNewExercise({
        name: "",1w
        description: "",
        muscleGroup: "",
        type: "strength",
      });
    } catch (err) {
      console.error("Fel vid skapande av exercise:", err);
      toast.success("Något gick fel, försök igen!");
      throw err;
    }
  };
  return (
    <form onSubmit={handleSubmit} className="exercise-form">
      <h2>Skapa ny övning</h2>
      <input
        type="text"
        placeholder="Namn"
        value={newExercise.name}
        onChange={(e) =>
          setNewExercise({ ...newExercise, name: e.target.value })
        }
      />
      <textarea
        placeholder="Beskrivning"
        value={newExercise.description}
        onChange={(e) =>
          setNewExercise({ ...newExercise, description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Muskelgrupp"
        value={newExercise.muscleGroup}
        onChange={(e) =>
          setNewExercise({ ...newExercise, muscleGroup: e.target.value })
        }
      />
      <select
        value={newExercise.type}
        onChange={(e) =>
          setNewExercise({
            ...newExercise,
            type: e.target.value as "strength" | "cardio",
          })
        }
      >
        <option value="strength">Styrka</option>
        <option value="cardio">Cardio</option>
      </select>
      <button type="submit" className="btn-primary">
        Spara övning
      </button>
    </form>
  );
}
