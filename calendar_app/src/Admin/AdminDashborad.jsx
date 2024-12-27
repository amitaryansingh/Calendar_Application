import React, { useEffect, useState } from "react";
import { getUserRoleByEmail, getAllCompanies, getAllUsers, createCompany, createUser, deleteCompany, deleteUser } from "../authentication/aapi";
import './AdminDashboard.css'; // Import the CSS file

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

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error && <p className="error-message">{error}</p>}

          <section className="form-section">
            <h3>Create Company</h3>
            <form onSubmit={handleCreateCompany} className="form">
              <input
                type="text"
                name="name"
                value={companyForm.name}
                onChange={handleCompanyInputChange}
                placeholder="Company Name"
                required
                className="input-field"
              />
              <input
                type="text"
                name="location"
                value={companyForm.location}
                onChange={handleCompanyInputChange}
                placeholder="Location"
                required
                className="input-field"
              />
              <input
                type="url"
                name="linkedIn"
                value={companyForm.linkedIn}
                onChange={handleCompanyInputChange}
                placeholder="LinkedIn Profile"
                className="input-field"
              />
              <input
                type="email"
                name="emails"
                value={companyForm.emails}
                onChange={handleCompanyInputChange}
                placeholder="Emails"
                className="input-field"
              />
              <input
                type="text"
                name="phoneNumbers"
                value={companyForm.phoneNumbers}
                onChange={handleCompanyInputChange}
                placeholder="Phone Numbers"
                className="input-field"
              />
              <textarea
                name="comments"
                value={companyForm.comments}
                onChange={handleCompanyInputChange}
                placeholder="Comments"
                className="textarea-field"
              />
              <input
                type="text"
                name="communicationPeriodicity"
                value={companyForm.communicationPeriodicity}
                onChange={handleCompanyInputChange}
                placeholder="Communication Periodicity"
                className="input-field"
              />
              <button type="submit" className="submit-btn">Create Company</button>
            </form>
          </section>

          <section className="data-section">
            <h3>Companies</h3>
            <ul className="data-list">
              {companies.map((company) => (
                <li key={company.id} className="data-item">
                  {company.name} - 
                  <button className="delete-btn" onClick={() => handleDeleteCompany(company.id)}>Delete</button>
                </li>
              ))}
            </ul>

            <h3>Create User</h3>
            <form onSubmit={handleCreateUser} className="form">
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserInputChange}
                placeholder="Email"
                required
                className="input-field"
              />
              <input
                type="text"
                name="username"
                value={userForm.username}
                onChange={handleUserInputChange}
                placeholder="Username"
                required
                className="input-field"
              />
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserInputChange}
                placeholder="Password"
                required
                className="input-field"
              />
              <select
                name="role"
                value={userForm.role}
                onChange={handleUserInputChange}
                className="select-field"
              >
                <option value="USER">User</option>
              </select>
              <button type="submit" className="submit-btn">Create User</button>
            </form>

            <h3>Users</h3>
            <ul className="data-list">
              {users.map((user) => (
                <li key={user.id} className="data-item">
                  {user.email} - 
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
