import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import MealForm from "../components/MealForm";

function MealCreate() {
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async payload => {
    setPending(true);
    setServerError("");
    try {
      await axiosClient.post("/meals", payload);
      navigate("/meals");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create meal";
      setServerError(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <section>
      <h1>Create meal</h1>
      <MealForm onSubmit={handleCreate} pending={pending} serverError={serverError} />
    </section>
  );
}

export default MealCreate;
