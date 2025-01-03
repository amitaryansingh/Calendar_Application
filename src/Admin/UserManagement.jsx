import React, { useState, useEffect } from "react";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllCompanies,
  assignMultipleCompaniesToUser,
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
  const [removedCompanies, setRemovedCompanies] = useState([]);
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
        const uniqueCompanies = response.data.filter(
          (company, index, self) =>
            index === self.findIndex((c) => c.mid === company.mid)
        );
        setCompanies(uniqueCompanies);
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

  // const handleSave = async () => {
  //   try {
  //     const userToSave = {
  //       firstname: userForm.firstname,
  //       secondname: userForm.secondname,
  //       email: userForm.email,
  //       password: userForm.password,
  //       role: userForm.role,
  //     };

  //     // Handle the case of updating an existing user
  //     if (editingUser) {
  //       const updatedUserResponse = await updateUser(editingUser.uid, userToSave);

  //       // Only update company assignments if needed
  //       const newCompanyIds = userForm.assignedCompanies.map((company) => company.mid);
  //       const removedCompanyIds = removedCompanies.map((company) => company.mid);

  //       // Call the remove company API for the removed companies
  //       if (removedCompanyIds.length > 0) {
  //         for (const companyId of removedCompanyIds) {
  //           await removeCompanyFromUser(editingUser.uid, companyId);
  //         }
  //       }

  //       // Assign the new companies to the user if needed
  //       if (newCompanyIds.length > 0) {
  //         await assignMultipleCompaniesToUser(editingUser.uid, newCompanyIds);
  //       }

  //       // Update the local state after saving changes
  //       setUsers((prevUsers) =>
  //         prevUsers.map((user) =>
  //           user.uid === editingUser.uid ? updatedUserResponse.data : user
  //         )
  //       );

  //       setSuccess("User updated successfully!");

  //       // Fetch the updated user data to reflect the change
  //       const updatedUser = await getAllUsers();
  //       setUsers(updatedUser.data);
  //     } else {
  //       // Handle the case of creating a new user
  //       const newUserResponse = await createUser(userToSave);
  //       setUsers((prevUsers) => [...prevUsers, newUserResponse.data]);
  //       setSuccess("User created successfully!");
  //     }

  //     resetForm();
  //   } catch (err) {
  //     console.error("Error saving user:", err.response || err.message);
  //     setError(err.response?.data?.message || "Error saving user.");
  //   }
  // };

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
        const updatedUserResponse = await updateUser(editingUser.uid, userToSave);
  
        // Extract the current assigned company IDs from the editing user
        const currentCompanyIds = editingUser.companies
          ? editingUser.companies.map((company) => company.mid)
          : [];
  
        // Extract the new assigned company IDs from the form
        const newCompanyIds = userForm.assignedCompanies.map((company) => company.mid);
  
        // Determine which companies are newly added
        const companiesToAdd = newCompanyIds.filter(
          (id) => !currentCompanyIds.includes(id)
        );
  
        // Determine which companies are removed
        const companiesToRemove = currentCompanyIds.filter(
          (id) => !newCompanyIds.includes(id)
        );
  
        // Remove companies that are no longer assigned
        if (companiesToRemove.length > 0) {
          for (const companyId of companiesToRemove) {
            await removeCompanyFromUser(editingUser.uid, companyId);
          }
        }
  
        // Assign newly added companies
        if (companiesToAdd.length > 0) {
          await assignMultipleCompaniesToUser(editingUser.uid, companiesToAdd);
        }
  
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === editingUser.uid ? updatedUserResponse.data : user
          )
        );
  
        setSuccess("User updated successfully!");
  
        // Fetch the updated user data to reflect the changes
        const updatedUser = await getAllUsers();
        setUsers(updatedUser.data);
      } else {
        // Handle the case of creating a new user
        const newUserResponse = await createUser(userToSave);
        setUsers((prevUsers) => [...prevUsers, newUserResponse.data]);
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
    setRemovedCompanies([]); // Reset removed companies on edit
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
    setRemovedCompanies([]);
    setError("");
    setSuccess("");
  };

  const handleAssignCompany = (companyMid) => {
    const companyToAssign = companies.find((company) => company.mid === companyMid);
    if (companyToAssign && !userForm.assignedCompanies.some(c => c.mid === companyMid)) {
      setUserForm((prevForm) => ({
        ...prevForm,
        assignedCompanies: [...prevForm.assignedCompanies, companyToAssign],
      }));
    }
  };

  const handleRemoveCompany = (companyMid) => {
    const companyToRemove = companies.find((company) => company.mid === companyMid);
    setUserForm((prevForm) => ({
      ...prevForm,
      assignedCompanies: prevForm.assignedCompanies.filter(
        (company) => company.mid !== companyMid
      ),
    }));
    setRemovedCompanies((prevRemoved) => [
      ...prevRemoved,
      companyToRemove,
    ]);
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
              <li key={`assigned-${company.mid}`}>
                {company.name}
                <button onClick={() => handleRemoveCompany(company.mid)}>Remove</button>
              </li>
            ))}
          </ul>

          {editingUser && (
            <div className="company-search">
              <input
                type="text"
                placeholder="Search companies"
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
              />
              <ul>
                {filteredCompanies
                  .filter((company) => !userForm.assignedCompanies.some(c => c.mid === company.mid)) // Filter out already assigned companies
                  .map((company) => (
                    <li key={`available-${company.mid}`}>
                      {company.name}
                      <button onClick={() => handleAssignCompany(company.mid)}>Assign</button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <button onClick={handleSave}>{editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
};

export default UserManagement;
