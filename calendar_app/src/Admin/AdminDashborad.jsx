import React, { useEffect, useState } from "react";
import { getUserRoleByEmail } from "../authentication/aapi";
import UserManagement from "./UserManagement";
import CompanyManagement from "./CompanyManagement"; // Import the CompanyManagement component
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const email = localStorage.getItem("email");
        const roleResponse = await getUserRoleByEmail(email);
        if (roleResponse.data !== "ADMIN") {
          alert("You are not authorized to view this page.");
          window.location.href = "/";
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        setError("Error checking user role.");
        console.error("Error checking role", err);
      }
    };

    checkAdminRole();
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div className="sections">
        <div
          className={`section-box ${activeSection === "users" ? "active" : ""}`}
          onClick={() => toggleSection("users")}
        >
          <h2>Manage Users</h2>
        </div>
        <div
          className={`section-box ${
            activeSection === "companies" ? "active" : ""
          }`}
          onClick={() => toggleSection("companies")}
        >
          <h2>Manage Companies</h2>
        </div>
        <div
          className={`section-box ${
            activeSection === "messages" ? "active" : ""
          }`}
          onClick={() => toggleSection("messages")}
        >
          <h2>Manage Messages</h2>
        </div>
      </div>
      <div className="section-content">
        {activeSection === "users" && <UserManagement />}
        {activeSection === "companies" && <CompanyManagement />} {/* Add CompanyManagement here */}
        {activeSection === "messages" && (
          <div>
            <h3>Message Management</h3>
            {/* Add message management logic */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
