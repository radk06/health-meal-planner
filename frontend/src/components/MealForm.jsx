import React, { useState, useEffect } from "react";

const defaultMeal = {
  title: "",
  calories: "",
  ingredients: "",
  tags: ""
};

function MealForm({ initialMeal, onSubmit, pending, serverError }) {
  const [meal, setMeal] = useState(initialMeal || defaultMeal);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialMeal) setMeal(initialMeal);
  }, [initialMeal]);

  const validate = () => {
    const errs = {};
    if (!meal.title.trim()) errs.title = "Title is required";
    if (!meal.ingredients.trim()) errs.ingredients = "At least one ingredient is required";
    if (meal.calories === "" || Number.isNaN(Number(meal.calories))) {
      errs.calories = "Calories must be a number";
    } else if (Number(meal.calories) < 0) {
      errs.calories = "Calories cannot be negative";
    }
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setMeal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      title: meal.title.trim(),
      calories: Number(meal.calories),
      ingredients: meal.ingredients
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      tags: meal.tags
        ? meal.tags
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
        : []
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}

      <div>
        <label>Title *</label>
        <input
          name="title"
          value={meal.title}
          onChange={handleChange}
          required
        />
        {errors.title && <small style={{ color: "red" }}>{errors.title}</small>}
      </div>

      <div>
        <label>Calories *</label>
        <input
          name="calories"
          type="number"
          min="0"
          value={meal.calories}
          onChange={handleChange}
          required
        />
        {errors.calories && (
          <small style={{ color: "red" }}>{errors.calories}</small>
        )}
      </div>

      <div>
        <label>Ingredients (comma separated) *</label>
        <input
          name="ingredients"
          value={meal.ingredients}
          onChange={handleChange}
          required
          placeholder="chicken, rice, broccoli"
        />
        {errors.ingredients && (
          <small style={{ color: "red" }}>{errors.ingredients}</small>
        )}
      </div>

      <div>
        <label>Tags (comma separated, optional)</label>
        <input
          name="tags"
          value={meal.tags}
          onChange={handleChange}
          placeholder="high protein, low carb"
        />
      </div>

      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export default MealForm;
