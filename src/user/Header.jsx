import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../userstyles/Header.css";
import { getUserProfile, updateUserProfile } from "../authentication/aapi";

const Header = () => {
    const navigate = useNavigate();
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstname: "",
        secondname: "",
        email: "",
        password: "",
    });

    // Fetch user profile on component mount
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            const fetchUserProfile = async () => {
                try {
                    const response = await getUserProfile(userId);
                    setUserProfile(response.data);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            };
            fetchUserProfile();
        }
    }, []);

    // Logout function
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                ["token", "role", "name", "user_id"].forEach((item) =>
                    localStorage.removeItem(item)
                );
                navigate("/Home");
                window.location.reload(); // Force a full page reload
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    };

    const handleProfileClick = () => {
        setShowProfilePopup(!showProfilePopup);
    };

    const handleEditClick = () => {
        setEditFormData({
            firstname: userProfile.firstname,
            secondname: userProfile.secondname,
            email: userProfile.email,
            password: "",
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSaveChanges = async () => {
        const userId = localStorage.getItem("user_id");
        try {
            await updateUserProfile(userId, editFormData);
            alert("Profile updated successfully!");
            setUserProfile({ ...userProfile, ...editFormData });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate("/Home")}>
                Calendar App
            </div>
            <nav className="menu">
                <a onClick={() => navigate("/Home")}>Home</a>
                <a href="#report">Reports</a>
                <a href="#notifications">Notifications</a>
                <a onClick={handleProfileClick}>
                    {userProfile ? userProfile.secondname : "Profile"}
                </a>
                <a onClick={handleLogout}>Logout</a>
            </nav>

            {showProfilePopup && (
                <div className="profile-popup">
                    <div className="popup-header">
                        <h2>Profile Info</h2>
                        <button onClick={handleProfileClick}>Close</button>
                    </div>
                    <div className="popup-body">
                        {!isEditing ? (
                            <>
                                <p>
                                    <strong>Name:</strong> {userProfile?.firstname}{" "}
                                    {userProfile?.secondname}
                                </p>
                                <p>
                                    <strong>Email:</strong> {userProfile?.email}
                                </p>
                                <p>
                                    <strong>Role:</strong> {userProfile?.role}
                                </p>
                                <button onClick={handleEditClick}>Edit Profile</button>
                            </>
                        ) : (
                            <div className="edit-profile-form">
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={editFormData.firstname}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        name="secondname"
                                        value={editFormData.secondname}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        value={editFormData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                    />
                                </label>
                                <div>
                                    <button onClick={handleSaveChanges}>Save Changes</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
