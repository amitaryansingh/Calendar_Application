import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./authentication/Home";
import Dashboard from "./user/Dashboard";
import AdminDashboard from "./Admin/AdminDashborad";
import Header from "./user/Header";
import Footer from "./user/Footer";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Home setIsAuthenticated={setIsAuthenticated} />
          }
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admindashboard"
          element={
            isAuthenticated ? (
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
            isAuthenticated ? (
              <>
                <Dashboard />
                <Footer />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
