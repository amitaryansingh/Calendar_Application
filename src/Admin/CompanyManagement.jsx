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
  const [assignedUserSearchTerm, setAssignedUserSearchTerm] = useState("");
  const [availableUserSearchTerm, setAvailableUserSearchTerm] = useState("");
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
  const [removedUsers, setRemovedUsers] = useState([]);
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
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

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

        // Remove users
        for (const user of removedUsers) {
          try {
            await removeUserFromCompany(editingCompany.mid, user.uid);
          } catch (err) {
            console.error(`Error removing user ${user.uid}:`, err);
            setError(`Failed to remove user ${user.firstname}.`);
          }
        }

        // Assign new users
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
          users: companyForm.assignedUsers,
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

      {/* Search Bar for Companies */}
      <div className="search-bar-container">
  <input
    type="text"
    className="search-bar"
    placeholder="Search by name, email, or ID"
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
              setCompanyForm({
                ...companyForm,
                emails: e.target.value.split(",").map((email) => email.trim()),
              })
            }
          />
          <input
            type="text"
            placeholder="Phone Numbers (comma-separated)"
            value={companyForm.phoneNumbers.join(", ")}
            onChange={(e) =>
              setCompanyForm({
                ...companyForm,
                phoneNumbers: e.target.value.split(",").map((phone) => phone.trim()),
              })
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
            onChange={(e) =>
              setCompanyForm({ ...companyForm, communicationPeriodicity: e.target.value })
            }
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Every 2 weeks">Every 2 Weeks</option>
            <option value="Monthly">Monthly</option>
          </select>

          {/* Show Assigned Users and Available Users only when editing */}
          {editingCompany && (
            <div className="user-table-container">
              <div className="assigned-users">
                <h4>Assigned Users</h4>
                {/* Search Bar for Assigned Users */}
                <input
                  type="text"
                  placeholder="Search assigned users"
                  value={assignedUserSearchTerm}
                  onChange={(e) => setAssignedUserSearchTerm(e.target.value)}
                />
                <div className="user-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyForm.assignedUsers
                        .filter((user) =>
                          user.firstname.toLowerCase().includes(assignedUserSearchTerm.toLowerCase())
                        )
                        .slice(0, 3)
                        .map((user) => (
                          <tr key={user.uid}>
                            <td>{user.firstname} {user.secondname}</td>
                            <td>{user.email}</td>
                            <td>
                              <button className="remove-btn" onClick={() => handleRemoveUser(user.uid)}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="available-users">
                <h4>Available Users</h4>
                {/* Search Bar for Available Users */}
                <input
                  type="text"
                  placeholder="Search available users"
                  value={availableUserSearchTerm}
                  onChange={(e) => setAvailableUserSearchTerm(e.target.value)}
                />
                <div className="user-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers
                        .filter(
                          (user) =>
                            !companyForm.assignedUsers.some((assignedUser) => assignedUser.uid === user.uid) &&
                            user.firstname.toLowerCase().includes(availableUserSearchTerm.toLowerCase())
                        )
                        .slice(0, 3)
                        .map((user) => (
                          <tr key={user.uid}>
                            <td>{user.firstname} {user.secondname}</td>
                            <td>{user.email}</td>
                            <td>
                              <button className="assign-btn" onClick={() => handleAssignUser(user.uid)}>
                                Assign
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button onClick={handleSave}>{editingCompany ? "Save Changes" : "Create Company"}</button>
          <button onClick={resetForm}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
