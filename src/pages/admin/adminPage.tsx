import React, { useState } from "react";
import "./admin.css";
import { Role, useAuth } from "../../context/AuthContext";
import CreateMeals from "../../components/meals/createMeals";
import ShowMeals from "../../components/meals/showMeals";
import CreateExercise from "../../components/exercises/createExercise";
import ShowExercise from "../../components/exercises/showExercise";
import CreateDailyMeal from "../../components/dailyMeals/createDailyMeal";
import ShowDailyMeals from "../../components/dailyMeals/showDailyMeals";
import CreateWeeklyMeals from "../../components/weeklyMeals/createWeeklyMeals";
import ShowWeeklyMeals from "../../components/weeklyMeals/showWeeklyMeals";
import CreateWorkouts from "../../components/workouts/createWorkouts";
// import ShowWorkouts from "../../components/workouts/showWorkouts";

export default function AdminPage() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState<
    "exercises" | "meals" | "dailyMeals" | "weeklyMeals" | "workouts" | null
  >(null);
  const [activeAction, setActiveAction] = useState<"create" | "show" | null>(
    null
  );

  if (user === null) return <div>No user signed in.</div>;

  const isAdmin = user.role === Role.ADMIN;
  if (!isAdmin) return <div>Access denied. Admins only.</div>;

  return (
    <div className="admin-page">
      <h1 className="page-title">Adminpanel</h1>

      {/* 🔹 Huvudmeny */}
      {!activeSection && (
        <div className="admin-buttons">
          <button className="btn" onClick={() => setActiveSection("exercises")}>
            🏋️ Hantera Övningar
          </button>
          <button className="btn" onClick={() => setActiveSection("meals")}>
            🍽️ Hantera Måltider
          </button>
          <button
            className="btn"
            onClick={() => setActiveSection("dailyMeals")}
          >
            🍳 Hantera Dagliga Måltider
          </button>
          <button
            className="btn"
            onClick={() => setActiveSection("weeklyMeals")}
          >
            📅 Hantera Veckoplaner
          </button>
          <button className="btn" onClick={() => setActiveSection("workouts")}>
            💪 Hantera Workouts
          </button>
        </div>
      )}

      {/* 🔹 Övningar */}
      {activeSection === "exercises" && (
        <SectionMenu
          title="Övningar"
          onBack={() => setActiveSection(null)}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          create={<CreateExercise />}
          show={<ShowExercise />}
        />
      )}

      {/* 🔹 Måltider */}
      {activeSection === "meals" && (
        <SectionMenu
          title="Måltider"
          onBack={() => setActiveSection(null)}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          create={<CreateMeals />}
          show={<ShowMeals />}
        />
      )}

      {/* 🔹 Dagliga Måltider */}
      {activeSection === "dailyMeals" && (
        <SectionMenu
          title="Dagliga Måltider"
          onBack={() => setActiveSection(null)}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          create={<CreateDailyMeal />}
          show={<ShowDailyMeals />}
        />
      )}

      {/* 🔹 Veckoplaner */}
      {activeSection === "weeklyMeals" && (
        <SectionMenu
          title="Veckoplaner"
          onBack={() => setActiveSection(null)}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          create={<CreateWeeklyMeals />}
          show={<ShowWeeklyMeals />}
        />
      )}

      {/* 🔹 Workouts */}
      {activeSection === "workouts" && (
        <SectionMenu
          title="Workouts"
          onBack={() => setActiveSection(null)}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          create={<CreateWorkouts />}
          show={null} // kan lägga till ShowWorkouts senare
        />
      )}
    </div>
  );
}

/* 🔧 Hjälpkomponent för att minska upprepning */
function SectionMenu({
  title,
  onBack,
  activeAction,
  setActiveAction,
  create,
  show,
}: {
  title: string;
  onBack: () => void;
  activeAction: "create" | "show" | null;
  setActiveAction: React.Dispatch<
    React.SetStateAction<"create" | "show" | null>
  >;
  create: React.ReactNode;
  show: React.ReactNode | null;
}) {
  return (
    <div className="admin-submenu">
      <button
        className={`btn-secondary ${activeAction === "create" ? "active" : ""}`}
        onClick={() => setActiveAction("create")}
      >
        Skapa {title}
      </button>
      {show && (
        <button
          className={`btn-secondary ${activeAction === "show" ? "active" : ""}`}
          onClick={() => setActiveAction("show")}
        >
          Visa {title}
        </button>
      )}
      <button
        className="btn-back"
        onClick={() => {
          setActiveAction(null);
          onBack();
        }}
      >
        ⬅️ Tillbaka
      </button>

      <div className="admin-content">
        {activeAction === "create" && create}
        {activeAction === "show" && show}
      </div>
    </div>
  );
}
