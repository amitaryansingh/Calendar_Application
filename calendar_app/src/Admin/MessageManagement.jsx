import React, { useState, useEffect } from "react";
import {
  createMessage,
  updateMessage,
  deleteMessage,
  getAllMessages,
  getAllCompanies,
  getAllUsers,
} from "../authentication/aapi"; 
import "./MessageManagement.css";

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [messageForm, setMessageForm] = useState({
    name: "",
    description: "",
    date: "",
    mandatoryFlag: false,
    clientName: "",
    designation: "",
    priorityLevel: "", // PriorityLevel ENUM
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const getCompanyName = (companyId) => {
    if (!companyId) return "Not Assigned";
    const company = companies.find((comp) => comp.mid === companyId);
    return company ? company.name : "Unknown Company";
  };
  
  
  const getUserDetails = (userIds) => {
    return users.filter((user) => userIds.includes(user.uId));
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
    if (!message) {
      console.error("Message is undefined or null");
      return;
    }
  
    setEditingMessage(message);
  
    setMessageForm({
      name: message.name || "",
      description: message.description || "",
      date: message.date || "",
      clientName: message.clientName || "",
      assignedUsers: Array.isArray(message.userIds) ? message.userIds : [], // Ensure this is an array
      assignedCompany: message.companyId || null, // Default to null if companyId is not provided
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
    setAssignedUsers([]);
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
                <td>
                  <button onClick={() => handleEdit(message)}>Edit</button>
                  <button onClick={() => handleDelete(message.messageId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
        <h3>{editingMessage ? "Edit Message" : "Add New Message"}</h3>
        <select
          value={messageForm.name}
          onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
        >
          <option value="">Select Message Type</option>
          <option value="LINKEDIN_POST">LinkedIn Post</option>
          <option value="LINKEDIN_MESSAGE">LinkedIn Message</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE_CALL">Phone Call</option>
          <option value="OTHER">Other</option>
        </select>
        <textarea
           id="description"
          placeholder="Description"
          value={messageForm.description}
          onChange={(e) => setMessageForm({ ...messageForm, description: e.target.value })}
        />
        <input
          id="Date"
          type="date"
          value={messageForm.date}
          onChange={(e) => setMessageForm({ ...messageForm, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Client Name"
          value={messageForm.clientName}
          onChange={(e) => setMessageForm({ ...messageForm, clientName: e.target.value })}
        />
        <input
          type="checkbox"
          checked={messageForm.mandatoryFlag}
          onChange={(e) =>
            setMessageForm({ ...messageForm, mandatoryFlag: e.target.checked })
          }
        />
        <input
          type="text"
          placeholder="Designation"
          value={messageForm.designation}
          onChange={(e) => setMessageForm({ ...messageForm, designation: e.target.value })}
        />
        <select
          value={messageForm.priorityLevel}
          onChange={(e) => setMessageForm({ ...messageForm, priorityLevel: e.target.value })}
        >
          <option value="">Select Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {editingMessage && (
          <div className="assigned-users">
            <h4>Assigned Users</h4>
            <ul>
              {assignedUsers.map((user) => (
                <li key={user.uId}>
                  {user.firstName} {user.secondName} ({user.email})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={handleSave}>{editingMessage ? "Save Changes" : "Add Message"}</button>
        {editingMessage && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
};

export default MessageManagement;
