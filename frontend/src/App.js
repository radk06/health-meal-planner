import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import MealsList from "./pages/MealsList";
import MealCreate from "./pages/MealCreate";
import MealEdit from "./pages/MealEdit";
import ShoppingList from "./pages/ShoppingList";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const PrivateRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout} isAuthed={!!token}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/verify-otp"
            element={<OtpVerify setToken={setToken} />}
          />
          <Route
            path="/meals"
            element={
              <PrivateRoute>
                <MealsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/new"
            element={
              <PrivateRoute>
                <MealCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals/:id/edit"
            element={
              <PrivateRoute>
                <MealEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/shopping"
            element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
