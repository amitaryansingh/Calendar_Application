import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./authentication/Home";
import Dashboard from "./user/Dashboard";
import AdminDashboard from "./Admin/AdminDashborad";
import Header from "./user/Header";
import Footer from "./user/Footer";
import "./App.css";
import CalendarView from "./user/CalendarView";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === "USER" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/admindashboard" />
              )
            ) : (
              <Home setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admindashboard"
          element={
            isAuthenticated && userRole === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* User Dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && userRole === "user" ? (
              <>
                <Dashboard />
                <CalendarView />
                <Footer />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
