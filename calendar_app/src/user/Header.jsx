import React from 'react';
import '../userstyles/Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Calendar APP</div>
            <nav className="menu">
                <a href="#home">Home</a>
                <a href="#report">Reports</a>
                <a href="#notifications">Notifications</a>
                <a href="#notifications">Profile</a>
            </nav>
        </header>
    );
};

export default Header;
