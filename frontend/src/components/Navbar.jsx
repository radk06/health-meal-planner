import React from "react";
import { Link } from "react-router-dom";

function Navbar({ onLogout, isAuthed }) {
  return (
    <header
      style={{
        background: "var(--primary)",
        color: "#fff",
        padding: "0.9rem 1rem",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
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
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.2rem"
            }}
          >
            Health & Meal Planner
          </Link>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/meals" style={{ color: "#fff", fontWeight: "500" }}>
            Meals
          </Link>

          {isAuthed && (
            <Link to="/shopping" style={{ color: "#fff", fontWeight: "500" }}>
              Shopping
            </Link>
          )}

          {isAuthed ? (
            <button
              onClick={onLogout}
              style={{
                background: "var(--primary-light)",
                color: "#fff",
                padding: "8px 14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
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
