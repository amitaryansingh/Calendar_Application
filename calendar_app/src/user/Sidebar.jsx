import React from 'react';
import '../userstyles/Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="profile">
                <img
                    src="https://via.placeholder.com/100"
                    alt="User Avatar"
                    className="avatar"
                />
                <h3>User Name</h3>
                <p>Admin</p>
            </div>
            <ul className="menu-list">
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#calendar">Calendar</a></li>
                <li><a href="#settings">Settings</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
