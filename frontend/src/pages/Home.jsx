import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <h1>Health & Meal Planner</h1>
      <p>
        Use this app to plan meals, manage ingredients, and generate shopping lists.
      </p>
      <p>
        Go to <Link to="/meals">Meals</Link> to view or add meals.
      </p>
    </section>
  );
}

export default Home;
