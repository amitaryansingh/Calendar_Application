import React, { useEffect, useState } from "react";
import { getUserRoleByEmail, getAllCompanies, getAllUsers, createCompany, createUser, deleteCompany, deleteUser } from "../authentication/aapi"; // Import API functions
import axios from "axios";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    location: "",
    linkedIn: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    communicationPeriodicity: ""
  });
  const [userForm, setUserForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "USER"
  });

  // Check if user is Admin by role
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
        console.error("Error checking role", err);
      }
    };

    checkAdminRole();
  }, []);

  // Fetch companies and users when isAdmin is true
  useEffect(() => {
    if (isAdmin) {
      const fetchData = async () => {
        try {
          const [companiesResponse, usersResponse] = await Promise.all([
            getAllCompanies(),
            getAllUsers(),
          ]);
          setCompanies(companiesResponse.data);
          setUsers(usersResponse.data);
        } catch (err) {
          setError("Error fetching data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAdmin]);

  // Handle company deletion with confirmation
  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (!confirmDelete) return;

    try {
      await deleteCompany(id);
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
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Error deleting user.");
    }
  };

  // Handle company form input changes
  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
  };

  // Handle user form input changes
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Handle company creation
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await createCompany(companyForm);
      setCompanies([...companies, response.data]);
      setCompanyForm({
        name: "",
        location: "",
        linkedIn: "",
        emails: "",
        phoneNumbers: "",
        comments: "",
        communicationPeriodicity: ""
      });
    } catch (err) {
      setError("Error creating company.");
    }
  };

  // Handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(userForm);
      setUsers([...users, response.data]);
      setUserForm({
        email: "",
        username: "",
        password: "",
        role: "USER"
      });
    } catch (err) {
      setError("Error creating user.");
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

          <h3>Create Company</h3>
          <form onSubmit={handleCreateCompany}>
            <input
              type="text"
              name="name"
              value={companyForm.name}
              onChange={handleCompanyInputChange}
              placeholder="Company Name"
              required
            />
            <input
              type="text"
              name="location"
              value={companyForm.location}
              onChange={handleCompanyInputChange}
              placeholder="Location"
              required
            />
            <input
              type="url"
              name="linkedIn"
              value={companyForm.linkedIn}
              onChange={handleCompanyInputChange}
              placeholder="LinkedIn Profile"
            />
            <input
              type="email"
              name="emails"
              value={companyForm.emails}
              onChange={handleCompanyInputChange}
              placeholder="Emails"
            />
            <input
              type="text"
              name="phoneNumbers"
              value={companyForm.phoneNumbers}
              onChange={handleCompanyInputChange}
              placeholder="Phone Numbers"
            />
            <textarea
              name="comments"
              value={companyForm.comments}
              onChange={handleCompanyInputChange}
              placeholder="Comments"
            />
            <input
              type="text"
              name="communicationPeriodicity"
              value={companyForm.communicationPeriodicity}
              onChange={handleCompanyInputChange}
              placeholder="Communication Periodicity"
            />
            <button type="submit">Create Company</button>
          </form>

          <h3>Companies</h3>
          <ul>
            {companies.map((company) => (
              <li key={company.id}>
                {company.name} - 
                <button onClick={() => handleDeleteCompany(company.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <h3>Create User</h3>
          <form onSubmit={handleCreateUser}>
            <input
              type="email"
              name="email"
              value={userForm.email}
              onChange={handleUserInputChange}
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="username"
              value={userForm.username}
              onChange={handleUserInputChange}
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              value={userForm.password}
              onChange={handleUserInputChange}
              placeholder="Password"
              required
            />
            <select
              name="role"
              value={userForm.role}
              onChange={handleUserInputChange}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Create User</button>
          </form>

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
