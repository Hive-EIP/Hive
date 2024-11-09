// Navigation.js
import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/admin">Admin</Link> |{" "}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navigation;