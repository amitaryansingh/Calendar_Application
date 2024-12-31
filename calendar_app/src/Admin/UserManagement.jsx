import React, { useState, useEffect } from "react";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllCompanies,
  assignCompanyToUser,
  removeCompanyFromUser,
} from "../authentication/aapi";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    firstname: "",
    secondname: "",
    email: "",
    password: "",
    role: "USER",
    assignedCompanies: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Error fetching users.");
        console.error("Error fetching users:", err);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchUsers();
    fetchCompanies();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const firstName = user.firstname || "";
        const email = user.email || "";
        const id = user.uid ? user.uid.toString() : "";

        return (
          firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm)
        );
      })
    );
  }, [searchTerm, users]);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) =>
        company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
      )
    );
  }, [companySearchTerm, companies]);

  const handleSave = async () => {
    try {
      const userToSave = {
        firstname: userForm.firstname,
        secondname: userForm.secondname,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
      };

      if (editingUser) {
        const response = await updateUser(editingUser.uid, userToSave);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === editingUser.uid ? response.data : user
          )
        );
        await Promise.all(
          userForm.assignedCompanies.map((companyId) =>
            assignCompanyToUser(editingUser.uid, companyId)
          )
        );
        setSuccess("User updated successfully!");
      } else {
        const response = await createUser(userToSave);
        await Promise.all(
          userForm.assignedCompanies.map((companyId) =>
            assignCompanyToUser(response.data.uid, companyId)
          )
        );
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setSuccess("User created successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving user:", err.response || err.message);
      setError(err.response?.data?.message || "Error saving user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      firstname: user.firstname || "",
      secondname: user.secondname || "",
      email: user.email || "",
      password: "", // Clear password field
      role: user.role || "USER",
      assignedCompanies: user.companies || [], // Use user's companies
    });
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== id));
      setSuccess("User deleted successfully!");
    } catch (err) {
      setError("Error deleting user.");
      console.error("Error deleting user:", err);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setUserForm({
      firstname: "",
      secondname: "",
      email: "",
      password: "",
      role: "USER",
      assignedCompanies: [],
    });
    setError("");
    setSuccess("");
  };

  const handleAssignCompany = (companyId) => {
    if (!userForm.assignedCompanies.includes(companyId)) {
      setUserForm((prevForm) => ({
        ...prevForm,
        assignedCompanies: [...prevForm.assignedCompanies, companyId],
      }));
    }
  };

  const handleRemoveCompany = (companyId) => {
    setUserForm((prevForm) => ({
      ...prevForm,
      assignedCompanies: prevForm.assignedCompanies.filter((id) => id !== companyId),
    }));
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Second Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.firstname}</td>
                <td>{user.secondname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.uid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
        <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="First Name"
            value={userForm.firstname}
            onChange={(e) => setUserForm({ ...userForm, firstname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Second Name"
            value={userForm.secondname}
            onChange={(e) => setUserForm({ ...userForm, secondname: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
          />
          <select
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

           <h4>Assigned Companies</h4>
           <ul>
           {userForm.assignedCompanies.map((company) => (
           <li key={company.mid}>
            {company.name}
            <button onClick={() => handleRemoveCompany(company.mid)}>Remove</button></li>
             ))}
             </ul>

          <div className="company-search">
            <input
              type="text"
              placeholder="Search companies"
              value={companySearchTerm}
              onChange={(e) => setCompanySearchTerm(e.target.value)}
            />
            <ul>
              {filteredCompanies.map((company) => (
                <li key={company.id}>
                  {company.name}
                  <button onClick={() => handleAssignCompany(company.id)}>Assign</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button onClick={handleSave}>{editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
};

export default UserManagement;
