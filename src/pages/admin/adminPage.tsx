import React, { useEffect, useState, FormEvent } from "react";
import "./admin.css";
import { Role, useAuth } from "../../context/AuthContext";
import CreateMeals from "../../components/meals/createMeals";
import ShowMeals from "../../components/meals/showMeals";
import CreateExercise from "../../components/exercises/createExercise";
import ShowExercise from "../../components/exercises/showExercise";
import CreateDailyMeal from "../../components/dailyMeals/createDailyMeal";
import ShowDailyMeals from "../../components/dailyMeals/showDailyMeals";

export default function AdminPage() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState<
    "exercises" | "meals" | null
  >(null);
  const [activeAction, setActiveAction] = useState<"create" | "show" | null>(
    null
  );

  if (user === null) {
    return <div>No user signed in.</div>;
  }
  const isAdmin = user.role === Role.ADMIN;
  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="page-title">Adminpanel</h1>
      {!activeSection && (
        <div className="admin-buttons">
          <button className="btn" onClick={() => setActiveSection("exercises")}>
            🏋️ Hantera Övningar
          </button>
          <button className="btn" onClick={() => setActiveSection("meals")}>
            🍽️ Hantera Måltider
          </button>
        </div>
      )}

      {/* 🔹 Övningar */}
      {activeSection === "exercises" && (
        <div className="admin-submenu">
          <button
            className={`btn-secondary ${
              activeAction === "create" ? "active" : ""
            }`}
            onClick={() => setActiveAction("create")}
          >
            Skapa Övning
          </button>
          <button
            className={`btn-secondary ${
              activeAction === "show" ? "active" : ""
            }`}
            onClick={() => setActiveAction("show")}
          >
            Visa Övningar
          </button>

          {/* 🔙 Tillbaka */}
          <button
            className="btn-back"
            onClick={() => {
              setActiveSection(null);
              setActiveAction(null);
            }}
          >
            ⬅️ Tillbaka
          </button>

          <div className="admin-content">
            {activeAction === "create" && <CreateExercise />}
            {activeAction === "show" && <ShowExercise />}
          </div>
        </div>
      )}

      {/* 🔹 Måltider */}
      {activeSection === "meals" && (
        <div className="admin-submenu">
          <button
            className={`btn-secondary ${
              activeAction === "create" ? "active" : ""
            }`}
            onClick={() => setActiveAction("create")}
          >
            Skapa Måltid
          </button>
          <button
            className={`btn-secondary ${
              activeAction === "show" ? "active" : ""
            }`}
            onClick={() => setActiveAction("show")}
          >
            Visa Måltider
          </button>

          {/* 🔙 Tillbaka */}
          <button
            className="btn-back"
            onClick={() => {
              setActiveSection(null);
              setActiveAction(null);
            }}
          >
            ⬅️ Tillbaka
          </button>

          <div className="admin-content">
            {activeAction === "create" && <CreateMeals />}
            {activeAction === "show" && <ShowMeals />}
          </div>
        </div>
      )}
      <div className="section">
        <CreateDailyMeal />
        <ShowDailyMeals />
      </div>
    </div>
  );
}
