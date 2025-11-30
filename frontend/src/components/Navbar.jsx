import React from "react";
import { Link } from "react-router-dom";

function Navbar({ onLogout, isAuthed }) {
  return (
    <header
      style={{
        background: "#222",
        color: "#fff",
        padding: "0.75rem 1rem"
      }}
    >
      <nav
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
            Health & Meal Planner
          </Link>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/meals" style={{ color: "#fff" }}>
            Meals
          </Link>
          {isAuthed ? (
            <button onClick={onLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ color: "#fff" }}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
