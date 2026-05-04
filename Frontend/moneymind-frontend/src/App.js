import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Expenses from "./Components/Expenses";
import Report from "./Components/Report";
import Charts from "./Components/Charts";

function hasValidSession() {
  const storedUser = localStorage.getItem("user");

  try {
    const user = storedUser ? JSON.parse(storedUser) : null;
    return Boolean(user?.token);
  } catch (error) {
    localStorage.removeItem("user");
    return false;
  }
}

function ProtectedRoute({ children }) {
  return hasValidSession() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <Charts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
