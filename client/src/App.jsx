import React from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CardFormPage from "./pages/CardFormPage";

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/dashboard"></Link> |
        <Link to="/add">Add Card</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<CardFormPage />} />
      </Routes>
    </Router>
  );
}
