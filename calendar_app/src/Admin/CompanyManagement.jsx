import React, { useState, useEffect } from "react";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getAllUsers,
} from "../authentication/aapi"; // Adjust paths accordingly
import "./CompanyManagement.css"; // Add your styling here

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
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
    userIds: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    fetchCompanies();
  }, []);

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
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) => {
        const companyName = company.name || "";
        const location = company.location || "";
        const id = company.id ? company.id.toString() : "";

        return (
          companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm)
        );
      })
    );
  }, [searchTerm, companies]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const firstName = user.firstname || "";
        const email = user.email || "";
        const id = user.id ? user.id.toString() : "";

        return (
          firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm)
        );
      })
    );
  }, [searchTerm, users]);

  const handleSave = async () => {
    try {
      const companyToSave = { ...companyForm };

      if (editingCompany) {
        const response = await updateCompany(editingCompany.id, companyToSave);
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === editingCompany.id ? response.data : company
          )
        );
        setSuccess("Company updated successfully!");
      } else {
        const response = await createCompany(companyToSave);
        setCompanies((prevCompanies) => [...prevCompanies, response.data]);
        setSuccess("Company created successfully!");
      }

      resetForm();
    } catch (err) {
      setError("Error saving company.");
      console.error("Error saving company:", err);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setCompanyForm({
      ...company,
      userIds: company.users ? company.users.map((user) => user.id) : [],
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompany(id);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== id)
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
      userIds: [],
    });
    setError("");
    setSuccess("");
  };

  const handleUserSelection = (userId) => {
    setCompanyForm((prevForm) => {
      const updatedUserIds = prevForm.userIds.includes(userId)
        ? prevForm.userIds.filter((id) => id !== userId)
        : [...prevForm.userIds, userId];
      return { ...prevForm, userIds: updatedUserIds };
    });
  };

  return (
    <div className="company-management">
      <h2>Company Management</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, location, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="company-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.emails.join(", ")}</td>
                <td>{company.location}</td>
                <td>{company.linkedInProfile}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(company)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(company.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
        <h3>{editingCompany ? "Edit Company" : "Add New Company"}</h3>
        <div className="form-grid">
          <div>
            <input
              type="text"
              placeholder="Company Name"
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
              placeholder="LinkedIn Profile"
              value={companyForm.linkedInProfile}
              onChange={(e) => setCompanyForm({ ...companyForm, linkedInProfile: e.target.value })}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Emails (comma separated)"
              value={companyForm.emails.join(", ")}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, emails: e.target.value.split(", ") })
              }
            />
            <input
              type="text"
              placeholder="Phone Numbers (comma separated)"
              value={companyForm.phoneNumbers.join(", ")}
              onChange={(e) =>
                setCompanyForm({ ...companyForm, phoneNumbers: e.target.value.split(", ") })
              }
            />
            <textarea
              placeholder="Comments"
              value={companyForm.comments}
              onChange={(e) => setCompanyForm({ ...companyForm, comments: e.target.value })}
            />
            <input
              type="text"
              placeholder="Communication Periodicity"
              value={companyForm.communicationPeriodicity}
              onChange={(e) =>
                setCompanyForm({
                  ...companyForm,
                  communicationPeriodicity: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="user-selection">
          <h4>Assign Users</h4>
          <input
            type="text"
            placeholder="Search users by name, email, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="user-list">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-item">
                <input
                  type="checkbox"
                  checked={companyForm.userIds.includes(user.id)}
                  onChange={() => handleUserSelection(user.id)}
                />
                <span>
                  {user.firstname} {user.secondname} ({user.email})
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-save" onClick={handleSave}>
          {editingCompany ? "Save Changes" : "Add Company"}
        </button>
        {editingCompany && (
          <button onClick={resetForm} className="btn btn-cancel">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
