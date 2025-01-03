import { useNavigate } from "react-router-dom";
import React from 'react';
import '../userstyles/Header.css';

const Header = () => {

    const navigate = useNavigate(); // Initialize navigate function

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        ["token", "role", "name", "user_id"].forEach((item) =>
          localStorage.removeItem(item)
        );
        navigate("/Home"); 
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
    return (
        <header className="header">
            <div className="logo">Calendar APP</div>
            <nav className="menu">
                <a href="#home">Home</a>
                <a href="#report">Reports</a>
                <a href="#notifications">Notifications</a>
                <a href="#notifications">Profile</a>
                <a onClick={handleLogout}>Logout</a>
            </nav>
        </header>
    );
};

export default Header;
