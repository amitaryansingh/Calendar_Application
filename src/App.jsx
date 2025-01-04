import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./authentication/Home";
import Dashboard from "./user/Dashboard";
import AdminDashboard from "./Admin/AdminDashborad";
import Header from "./user/Header";
import Footer from "./user/Footer";
import "./App.css";
import CalendarView from "./user/CalendarView";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role")?.trim());

  // Handle redirection based on authentication and role
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to={role === "ADMIN" ? "/admindashboard" : "/dashboard"} />;
    }
    return element;
  };

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={role === "ADMIN" ? "/admindashboard" : "/dashboard"} />
            ) : (
              <Home setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
            )
          }
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["ADMIN"]}
            />
          }
        />

        {/* User Dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <>
                  <Dashboard />
                  <CalendarView />
                  <Footer />
                </>
              }
              allowedRoles={["USER"]}
            />
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (role === "ADMIN" ? "/admindashboard" : "/dashboard") : "/"}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
