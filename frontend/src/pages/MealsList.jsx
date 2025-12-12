import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMeals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosClient.get("/meals", {
        params: { q, page, limit }
      });
      setMeals(res.data.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load meals";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    loadMeals();
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      await axiosClient.delete(`/meals/${id}`);
      setSuccess("Meal deleted");
      loadMeals();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete meal";
      setError(msg);
    }
  };

  const totalPages = total && limit ? Math.ceil(total / limit) : 1;

  return (
    <section>
      <h1>Meals</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/meals/new">Create new meal</Link>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Search by title or ingredient"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {loading && <p>Loading...</p>}

      {!loading && meals.length === 0 && <p>No meals found</p>}

      <ul>
        {meals.map(meal => (
          <li key={meal._id || meal.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{meal.title}</strong> - {meal.calories} kcal
            <div>
              <Link to={`/meals/${meal._id || meal.id}/edit`}>Edit</Link>
              {" | "}
              <button type="button" onClick={() => handleDelete(meal._id || meal.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span style={{ margin: "0 0.5rem" }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default MealsList;
