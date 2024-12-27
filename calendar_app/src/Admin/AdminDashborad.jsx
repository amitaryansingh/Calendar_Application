import React, { useEffect, useState } from "react";
import { getUserRoleByEmail } from "../authentication/aapi.jsx";  
import axios from "axios";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is Admin by role
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const email = localStorage.getItem("email");
        const roleResponse = await getUserRoleByEmail(email);
        if (roleResponse.data !== "ADMIN") {
          alert("You are not authorized to view this page.");
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Error checking role", err);
      }
    };

    const fetchData = async () => {
      try {
        const [companiesResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:9090/calendarapp/admindashboard/companies"),
          axios.get("http://localhost:9090/calendarapp/admindashboard/users"),
        ]);
        setCompanies(companiesResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
    fetchData();
  }, []);

  // Handle company deletion with confirmation
  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9090/calendarapp/admindashboard/companies/${id}`);
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (err) {
      setError("Error deleting company.");
    }
  };

  // Handle user deletion with confirmation
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9090/calendarapp/admindashboard/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Error deleting user.");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <h3>Companies</h3>
          <ul>
            {companies.map((company) => (
              <li key={company.id}>
                {company.name} - 
                <button onClick={() => handleDeleteCompany(company.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <h3>Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.email} - 
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
