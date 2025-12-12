import React, { useState } from "react";
import axios from "../api/axiosClient";

function ShoppingList() {
  const [mealNames, setMealNames] = useState([]);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);

  // New search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("meal");
  const [searchLoading, setSearchLoading] = useState(false);

  const [customItems, setCustomItems] = useState([]);

  // Convert meal names → meal IDs → use backend
  const generateList = async () => {
    if (mealNames.length === 0) {
      alert("Enter at least one meal name.");
      return;
    }

    try {
      setLoading(true);

      // 1. Fetch meals from your backend by name
      const searchResponse = await axios.get("/meals");
      const allMeals = searchResponse.data.data || [];

      // 2. Match entered names to meals in DB
      const matchedMeals = allMeals.filter((m) =>
        mealNames.some((name) => m.title.toLowerCase() === name.toLowerCase())
      );

      if (matchedMeals.length === 0) {
        alert("No meals matched those names.");
        setLoading(false);
        return;
      }

      // Extract IDs
      const mealIds = matchedMeals.map((m) => m._id);

      // 3. Call the shopping backend normally
      const res = await axios.post("/shopping", { mealIds });
      setList(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate list.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchResults([]);

    try {
      let url;

      if (searchType === "meal") {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuery}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.meals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const amt = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients.push(`${ing} ${amt || ""}`.trim());
      }
    }
    return ingredients;
  };

  return (
    <section>
      <h1>Shopping Tools</h1>

      {/* SEARCH */}
      <div style={{ marginTop: "1.5rem" }}>
        <h2>Search for Meals or Ingredients</h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button
            style={{
              background: searchType === "meal" ? "var(--primary)" : "var(--secondary)",
              color: "white",
            }}
            onClick={() => setSearchType("meal")}
          >
            Search Meals
          </button>

          <button
            style={{
              background: searchType === "ingredient" ? "var(--primary)" : "var(--secondary)",
              color: "white",
            }}
            onClick={() => setSearchType("ingredient")}
          >
            Search Ingredients
          </button>
        </div>

        <input
          placeholder={searchType === "meal" ? "Search meals like: pasta" : "Search ingredient like: chicken"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        />

        <button onClick={performSearch}>
          {searchLoading ? "Searching..." : "Search"}
        </button>

        {searchResults.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Results</h2>

            {searchResults.map((meal) => (
              <div
                key={meal.idMeal}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#fff",
                  marginBottom: "12px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  borderLeft: "6px solid var(--primary)",
                }}
              >
                <h3 style={{ margin: 0 }}>{meal.strMeal}</h3>

                {meal.strMealThumb && (
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{ width: "140px", borderRadius: "8px", marginTop: "10px" }}
                  />
                )}

                {searchType === "meal" && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Ingredients:</strong>
                    <ul>
                      {extractIngredients(meal).map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    if (searchType === "meal") {
                      const ingredients = extractIngredients(meal);
                      const formatted = ingredients.map((i) => ({
                        name: i,
                        meals: [meal.strMeal],
                      }));
                      setCustomItems((prev) => [...prev, ...formatted]);
                    } else {
                      setCustomItems((prev) => [
                        ...prev,
                        { name: searchQuery, meals: ["Ingredient Search"] },
                      ]);
                    }
                  }}
                >
                  Add to Shopping List
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOM ADDED ITEMS */}
      {customItems.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Added Items</h2>

          {customItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderLeft: "6px solid var(--primary)",
                padding: "10px 14px",
                borderRadius: "6px",
                background: "#fff",
                marginBottom: "10px",
                boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{item.name}</strong>
              <br />
              Added from: {item.meals.join(", ")}
            </div>
          ))}
        </div>
      )}

      {/* NAME-BASED SHOPPING LIST GENERATOR */}
      <div style={{ marginTop: "3rem" }}>
        <h2>Generate Shopping List from Meal Names</h2>

        <input
          placeholder="Enter meal names like: Chicken Curry, Pasta"
          value={mealNames.join(", ")}
          onChange={(e) =>
            setMealNames(
              e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
            )
          }
          style={{ width: "100%", padding: "10px", margin: "12px 0" }}
        />

        <button onClick={generateList} disabled={loading}>
          {loading ? "Generating..." : "Generate Shopping List"}
        </button>

        {list && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Ingredients</h2>

            {list.items.map((item) => (
              <div
                key={item.name}
                style={{
                  borderLeft: "6px solid var(--secondary)",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  background: "#fff",
                  marginBottom: "10px",
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <strong>{item.name}</strong>
                <br />
                Used in: {item.meals.join(", ")}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ShoppingList;
