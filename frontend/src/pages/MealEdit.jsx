import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import MealForm from "../components/MealForm";

function MealEdit() {
  const { id } = useParams();
  const [initialMeal, setInitialMeal] = useState(null);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const res = await axiosClient.get(`/meals/${id}`);
        const m = res.data;
        setInitialMeal({
          title: m.title || "",
          calories: m.calories || 0,
          ingredients: (m.ingredients || []).join(", "),
          tags: (m.tags || []).join(", ")
        });
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load meal";
        setServerError(msg);
      } finally {
        setLoading(false);
      }
    };
    loadMeal();
  }, [id]);

  const handleUpdate = async payload => {
    setPending(true);
    setServerError("");
    try {
      await axiosClient.put(`/meals/${id}`, payload);
      navigate("/meals");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update meal";
      setServerError(msg);
    } finally {
      setPending(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h1>Edit meal</h1>
      <MealForm
        initialMeal={initialMeal}
        onSubmit={handleUpdate}
        pending={pending}
        serverError={serverError}
      />
    </section>
  );
}

export default MealEdit;
