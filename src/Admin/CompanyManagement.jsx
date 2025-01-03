import React, { useState, useEffect } from "react";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getAllUsers,
  assignMultipleUsersToCompany,
  removeUserFromCompany,
} from "../authentication/aapi";
import "./CompanyManagement.css";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    logoUrl: "",
    location: "",
    linkedInProfile: "",
    emails: [],
    phoneNumbers: [],
    comments: "",
    communicationPeriodicity: "",
    assignedUsers: [],
  });
  const [removedUsers, setRemovedUsers] = useState([]); // Track removed users
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        setCompanies(response.data);
      } catch (err) {
        setError("Error fetching companies.");
        console.error("Error fetching companies:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Error fetching users.");
        console.error("Error fetching users:", err);
      }
    };

    fetchCompanies();
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, companies]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.firstname.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    );
  }, [userSearchTerm, users]);

  // const handleSave = async () => {
  //   try {
  //     const companyToSave = {
  //       name: companyForm.name,
  //       logoUrl: companyForm.logoUrl,
  //       location: companyForm.location,
  //       linkedInProfile: companyForm.linkedInProfile,
  //       emails: companyForm.emails,
  //       phoneNumbers: companyForm.phoneNumbers,
  //       comments: companyForm.comments,
  //       communicationPeriodicity: companyForm.communicationPeriodicity,
  //     };
  
  //     // Update company details
  //     if (editingCompany) {
  //       const updatedCompanyResponse = await updateCompany(editingCompany.mid, companyToSave);
  
  //       const currentUserIds = editingCompany.users.map((user) => user.uid);
  //       const newUserIds = companyForm.assignedUsers.map((user) => user.uid);
  //       const removedUserIds = removedUsers.map((user) => user.uid);
  
  //       // 1. Remove users marked for removal
  //       for (const userId of removedUserIds) {
  //         if (currentUserIds.includes(userId)) {
  //           try {
  //             await removeUserFromCompany(editingCompany.mid, userId);
  //           } catch (error) {
  //             console.error(`Failed to remove user with ID ${userId}`, error);
  //           }
  //         }
  //       }
  
  //       // 2. Assign new users
  //       const usersToAssign = newUserIds.filter((id) => !currentUserIds.includes(id));
  //       if (usersToAssign.length > 0) {
  //         try {
  //           await assignMultipleUsersToCompany(editingCompany.mid, usersToAssign);
  //         } catch (error) {
  //           console.error("Failed to assign users:", error);
  //         }
  //       }
  
  //       const updatedCompany = {
  //         ...updatedCompanyResponse.data,
  //         users: companyForm.assignedUsers,
  //       };
  
  //       setCompanies((prevCompanies) =>
  //         prevCompanies.map((company) =>
  //           company.mid === editingCompany.mid ? updatedCompany : company
  //         )
  //       );
  
  //       setSuccess("Company updated successfully!");
  //     } else {
  //       // Create a new company
  //       const newCompanyResponse = await createCompany(companyToSave);
  //       setCompanies((prevCompanies) => [...prevCompanies, newCompanyResponse.data]);
  //       setSuccess("Company created successfully!");
  //     }
  
  //     resetForm();
  //   } catch (err) {
  //     console.error("Error saving company:", err.response || err.message);
  //     setError(err.response?.data?.message || "Error saving company.");
  //   }
  // };
  
  const handleSave = async () => {
    try {
      const companyToSave = {
        name: companyForm.name,
        logoUrl: companyForm.logoUrl,
        location: companyForm.location,
        linkedInProfile: companyForm.linkedInProfile,
        emails: companyForm.emails,
        phoneNumbers: companyForm.phoneNumbers,
        comments: companyForm.comments,
        communicationPeriodicity: companyForm.communicationPeriodicity,
      };
  
      if (editingCompany) {
        const updatedCompanyResponse = await updateCompany(editingCompany.mid, companyToSave);
  
        // 1. Remove users
        for (const user of removedUsers) {
          try {
            await removeUserFromCompany(editingCompany.mid, user.uid);
          } catch (err) {
            console.error(`Error removing user ${user.uid}:`, err);
            setError(`Failed to remove user ${user.firstname}.`);
          }
        }
  
        // 2. Assign new users
        const newUserIds = companyForm.assignedUsers.map((user) => user.uid);
        if (newUserIds.length > 0) {
          try {
            await assignMultipleUsersToCompany(editingCompany.mid, newUserIds);
          } catch (err) {
            console.error("Error assigning users:", err);
            setError("Failed to assign users to the company.");
          }
        }
  
        // Update frontend state
        const updatedCompany = {
          ...updatedCompanyResponse.data,
          users: companyForm.assignedUsers, // Synchronize with the updated assigned users
        };
  
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.mid === editingCompany.mid ? updatedCompany : company
          )
        );
  
        setSuccess("Company updated successfully!");
      } else {
        // Create a new company
        const newCompanyResponse = await createCompany(companyToSave);
        setCompanies((prevCompanies) => [...prevCompanies, newCompanyResponse.data]);
        setSuccess("Company created successfully!");
      }
  
      resetForm();
    } catch (err) {
      console.error("Error saving company:", err.response || err.message);
      setError(err.response?.data?.message || "Error saving company.");
    }
  };
  

  const handleEdit = (company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name || "",
      logoUrl: company.logoUrl || "",
      location: company.location || "",
      linkedInProfile: company.linkedInProfile || "",
      emails: company.emails || [],
      phoneNumbers: company.phoneNumbers || [],
      comments: company.comments || "",
      communicationPeriodicity: company.communicationPeriodicity || "",
      assignedUsers: company.users || [],
    });
    setRemovedUsers([]); // Reset removed users on edit
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompany(id);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.mid !== id)
      );
      setSuccess("Company deleted successfully!");
    } catch (err) {
      setError("Error deleting company.");
      console.error("Error deleting company:", err);
    }
  };

  const resetForm = () => {
    setEditingCompany(null);
    setCompanyForm({
      name: "",
      logoUrl: "",
      location: "",
      linkedInProfile: "",
      emails: [],
      phoneNumbers: [],
      comments: "",
      communicationPeriodicity: "",
      assignedUsers: [],
    });
    setRemovedUsers([]);
    setError("");
    setSuccess("");
  };

  const handleAssignUser = (userId) => {
    const userToAssign = users.find((user) => user.uid === userId);
    if (userToAssign && !companyForm.assignedUsers.some((u) => u.uid === userId)) {
      setCompanyForm((prevForm) => ({
        ...prevForm,
        assignedUsers: [...prevForm.assignedUsers, userToAssign],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setCompanyForm((prevForm) => ({
      ...prevForm,
      assignedUsers: prevForm.assignedUsers.filter((user) => user.uid !== userId),
    }));

    if (!removedUsers.some((user) => user.uid === userId)) {
      const userToRemove = companyForm.assignedUsers.find((user) => user.uid === userId);
      setRemovedUsers((prev) => [...prev, userToRemove]);
    }

    setSuccess("User marked for removal. Click 'Save Changes' to persist.");
  };

  return (
    <div className="company-management">
      <h2>Company Management</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search companies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="company-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.mid}>
                <td>{company.mid}</td>
                <td>{company.name}</td>
                <td>{company.location}</td>
                <td>
                  <button onClick={() => handleEdit(company)}>Edit</button>
                  <button onClick={() => handleDelete(company.mid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
        <h3>{editingCompany ? "Edit Company" : "Add New Company"}</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Name"
            value={companyForm.name}
            onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={companyForm.logoUrl}
            onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={companyForm.location}
            onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Emails (comma-separated)"
            value={companyForm.emails.join(", ")}
            onChange={(e) =>
              setCompanyForm({ ...companyForm, emails: e.target.value.split(",").map((email) => email.trim()) })
            }
          />
          <input
            type="text"
            placeholder="Phone Numbers (comma-separated)"
            value={companyForm.phoneNumbers.join(", ")}
            onChange={(e) =>
              setCompanyForm({ ...companyForm, phoneNumbers: e.target.value.split(",").map((phone) => phone.trim()) })
            }
          />
          <input
            type="text"
            placeholder="LinkedIn Profile"
            value={companyForm.linkedInProfile}
            onChange={(e) => setCompanyForm({ ...companyForm, linkedInProfile: e.target.value })}
          />
          <textarea
            placeholder="Comments"
            value={companyForm.comments}
            onChange={(e) => setCompanyForm({ ...companyForm, comments: e.target.value })}
          />
          <select 
          value={companyForm.communicationPeriodicity}
          onChange={(e) => setCompanyForm({ ...companyForm, communicationPeriodicity: e.target.value })}>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="every 2 weeks">Every 2 Weeks</option>
          <option value="Monthly">Monthly</option> 
          </select>

          <h4>Assigned Users</h4>
          <ul>
            {companyForm.assignedUsers.map((user) => (
              <li key={`assigned-${user.uid}`}>
                {user.firstname} {user.secondname} {user.email}
                <button onClick={() => handleRemoveUser(user.uid)}>Remove</button>
              </li>
            ))}
          </ul>

          {editingCompany && (
            <div className="user-search">
              <input
                type="text"
                placeholder="Search users"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
              <ul>
                {filteredUsers
                  .filter((user) => !companyForm.assignedUsers.some((u) => u.uid === user.uid))
                  .map((user) => (
                    <li key={`available-${user.uid}`}>
                      {user.firstname} {user.secondname}
                      <button onClick={() => handleAssignUser(user.uid)}>Assign</button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <button onClick={handleSave}>
          {editingCompany ? "Save Changes" : "Add Company"}
        </button>
        {editingCompany && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
};

export default CompanyManagement;
