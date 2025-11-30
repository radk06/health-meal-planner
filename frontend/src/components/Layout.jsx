import React from "react";
import Navbar from "./Navbar";

function Layout({ children, onLogout, isAuthed }) {
  return (
    <div>
      <Navbar onLogout={onLogout} isAuthed={isAuthed} />
      <main style={{ maxWidth: "960px", margin: "1.5rem auto", padding: "0 1rem" }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
