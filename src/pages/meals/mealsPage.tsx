import React from "react";
import ShowMeals from "../../components/meals/showMeals";
import mealspage from "./mealspage.css";
import ShowUserWeeklyMeals from "../../components/weeklyMeals/showUserWeeklyMeals";

export default function MealsPage() {
  return (
    <>
      <div>Meals Page</div>
      <ShowUserWeeklyMeals />
    </>
  );
}
