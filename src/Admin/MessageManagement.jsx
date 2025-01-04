import React, { useState, useEffect } from "react";
import {
  createMessage,
  updateMessage,
  deleteMessage,
  getAllMessages,
  getAllCompanies,
  getAllUsers,
  assignUsersAndCompanyToMessage,
} from "../authentication/aapi";
import "./MessageManagement.css";

const MessageManagement = () => {
  
  const [messages, setMessages] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageForm, setMessageForm] = useState({
    name: "",
    description: "",
    date: "",
    mandatoryFlag: false,
    clientName: "",
    designation: "",
    priorityLevel: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesResponse, companiesResponse, usersResponse] = await Promise.all([
          getAllMessages(),
          getAllCompanies(),
          getAllUsers(),
        ]);

        setMessages(messagesResponse.data);
        setCompanies(companiesResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError("Error fetching data.");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.secondname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCompanyName = (companyId) => {
    if (!companyId) return "Not Assigned";
    const company = companies.find((comp) => comp.mid === companyId);
    return company ? company.name : "Unknown Company";
  };

  const getUserName = (userIds) => {
    if (!userIds || userIds.length === 0) return "Not Assigned";
    
    const userNames = userIds.map((id) => {
      const user = users.find((user) => user.uid === id);
      return user ? `${user.firstname} ${user.secondname}` : "Unknown User";
    });
  
    return userNames.length > 0 ? userNames.join(", ") : "Unknown Ids";
  };

  const handleSave = async () => {
    try {
      const messageToSave = { ...messageForm };

      if (editingMessage) {
        const updatedMessageResponse = await updateMessage(editingMessage.messageId, messageToSave);
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.messageId === editingMessage.messageId
              ? updatedMessageResponse.data
              : message
          )
        );
        setSuccess("Message updated successfully!");
      } else {
        const newMessageResponse = await createMessage(messageToSave);
        setMessages((prevMessages) => [...prevMessages, newMessageResponse.data]);
        setSuccess("Message created successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving message:", err.response || err.message);
      setError(err.response?.data?.message || "Error saving message.");
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setMessageForm({
      name: message.name || "",
      description: message.description || "",   
      date: message.date || "",
      clientName: message.clientName || "",
      mandatoryFlag: message.mandatoryFlag || false,
      designation: message.designation || "",
      priorityLevel: message.priorityLevel || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.messageId !== id)
      );
      setSuccess("Message deleted successfully!");
    } catch (err) {
      setError("Error deleting message.");
      console.error("Error deleting message:", err);
    }
  };

  const handleAssign = (message) => {
    setCurrentMessage(message);
    setIsAssignModalOpen(true);
  };

  const handleAssignClose = () => {
    setIsAssignModalOpen(false);
    setCurrentMessage(null);
    setSelectedCompany(null);
    setSelectedUsers([]);
  };

  const handleAssignSubmit = async () => {
    try {
      await assignUsersAndCompanyToMessage(currentMessage.messageId, selectedCompany, selectedUsers);
      setSuccess("Users and company assigned successfully!");
      handleAssignClose();
    } catch (err) {
      setError("Error assigning users and company.");
      console.error("Error assigning:", err);
    }
  };

  const resetForm = () => {
    setEditingMessage(null);
    setMessageForm({
      name: "",
      description: "",
      date: "",
      mandatoryFlag: false,
      clientName: "",
      designation: "",
      priorityLevel: "",
    });
    setSelectedUsers([]);
    setError("");
    setSuccess("");
  };

  return (
    <div className="message-management">
      <h2>Message Management</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="message-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Client Name</th>
              <th>Priority</th>
              <th>Assigned Company</th>
              <th>Assigned User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.messageId}>
                <td>{message.messageId}</td>
                <td>{message.name}</td>
                <td>{message.description}</td>
                <td>{new Date(message.date).toLocaleDateString()}</td>
                <td>{message.clientName}</td>
                <td>{message.priorityLevel}</td>
                <td>{getCompanyName(message.companyId)}</td>
                <td>{getUserName(message.userIds)}</td>
                <td>
                  <button onClick={() => handleEdit(message)}>Edit</button>
                  <button onClick={() => handleDelete(message.messageId)}>Delete</button>
                  <button onClick={() => handleAssign(message)}>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
  <h3>{editingMessage ? "Edit Message" : "Add New Message"}</h3>

  <select value={messageForm.name}
          onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
        >
          <option value="">Select Message Type</option>
          <option value="LINKEDIN_POST">LinkedIn Post</option>
          <option value="LINKEDIN_MESSAGE">LinkedIn Message</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE_CALL">Phone Call</option>
          <option value="OTHER">Other</option>
        </select>
  <label>Description</label>
  <textarea
    placeholder="Message Description"
    value={messageForm.description}
    onChange={(e) => setMessageForm({ ...messageForm, description: e.target.value })}
  />

  <label>Date</label>
  <input
    type="date"
    value={messageForm.date}
    onChange={(e) => setMessageForm({ ...messageForm, date: e.target.value })}
  />

  <label>Client Name</label>
  <input
    type="text"
    placeholder="Client Name"
    value={messageForm.clientName}
    onChange={(e) => setMessageForm({ ...messageForm, clientName: e.target.value })}
  />

  <label>
    <input
      type="checkbox"
      checked={messageForm.mandatoryFlag}
      onChange={(e) =>
        setMessageForm({ ...messageForm, mandatoryFlag: e.target.checked })
      }
    />
    Mandatory
  </label>

  <label>Designation</label>
  <input
    type="text"
    placeholder="Designation"
    value={messageForm.designation}
    onChange={(e) => setMessageForm({ ...messageForm, designation: e.target.value })}
  />

  <label>Priority Level</label>
  <select
    value={messageForm.priorityLevel}
    onChange={(e) => setMessageForm({ ...messageForm, priorityLevel: e.target.value })}
  >
    <option value="">Select Priority</option>
    <option value="HIGH">High</option>
    <option value="MEDIUM">Mid</option>
    <option value="LOW">Low</option>
  </select>

  <button onClick={handleSave}>
    {editingMessage ? "Save Changes" : "Add Message"}
  </button>

  {editingMessage && (
    <button className="cancel-btn" onClick={resetForm}>
      Cancel
    </button>
  )}
</div>

          

       
      {isAssignModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleAssignClose}>&times;</span>
            <h3>Assign Users and Company</h3>
            <div>
              <h4>Message Details</h4>
              <table className="message-details-table">
                <tbody>
                  <tr>
                    <td><strong>ID:</strong></td>
                    <td>{currentMessage.messageId}</td>
                  </tr>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{currentMessage.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>{currentMessage.description}</td>
                  </tr>
                  <tr>
                    <td><strong>Client Name:</strong></td>
                    <td>{currentMessage.clientName}</td>
                  </tr>
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>{new Date(currentMessage.date).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Company Selection */}
            <div>
              <h4>Select Company</h4>
              <select onChange={(e) => setSelectedCompany(e.target.value)}>
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.mid} value={company.mid}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar for Users */}
            <div>
              <h4>Select Users</h4>
              <input
                type="text"
                placeholder="Search Users"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Scrollable List of Users */}
            <div className="user-grid-container">
              <div className="user-grid">
                {filteredUsers.map((user) => (
                  <div key={user.uid} className="user-item">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.uid)}
                      onChange={() => {
                        if (selectedUsers.includes(user.uid)) {
                          setSelectedUsers(selectedUsers.filter((id) => id !== user.uid));
                        } else {
                          setSelectedUsers([...selectedUsers, user.uid]);
                        }
                      }}
                    />
                    <label>
                      {user.firstname} {user.secondname} ({user.email})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleAssignSubmit}>Assign</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManagement;
