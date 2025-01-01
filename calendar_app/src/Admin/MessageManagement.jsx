import React, { useState, useEffect } from "react";
import {
  createMessage,
  updateMessage,
  deleteMessage,
  getAllMessages,
} from "../authentication/aapi"; // Adjust the import path as necessary
import "./MessageManagement.css";

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageForm, setMessageForm] = useState({
    name: "",
    description: "",
    date: "",
    clientName: "",
    assignedUsers: [],
    assignedCompany: null,
    mandatoryFlag: false,
    designation: "",
    priorityLevel: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllMessages();
        setMessages(response.data);
      } catch (err) {
        setError("Error fetching messages.");
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  const handleSave = async () => {
    try {
      const messageToSave = { ...messageForm };

      if (editingMessage) {
        const updatedMessageResponse = await updateMessage(editingMessage.id, messageToSave);
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === editingMessage.id ? updatedMessageResponse.data : message
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
      assignedUsers: message.assignedUsers || [],
      assignedCompany: message.assignedCompany || null,
      mandatoryFlag: message.mandatoryFlag || false,
      designation: message.designation || "",
      priorityLevel: message.priorityLevel || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
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
      clientName: "",
      assignedUsers: [],
      assignedCompany: null,
      mandatoryFlag: false,
      designation: "",
      priorityLevel: "",
    });
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.messageId}</td>
                <td>{message.name}</td>
                <td>{message.description}</td>
                <td>{new Date(message.date).toLocaleDateString()}</td>
                <td>{message.clientName}</td>
                <td>
                  <button onClick={() => handleEdit(message)}>Edit</button>
                  <button onClick={() => handleDelete(message.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form">
        <h3>{editingMessage ? "Edit Message" : "Add New Message"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={messageForm.name}
          onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={messageForm.description}
          onChange={(e) => setMessageForm({ ...messageForm, description: e.target.value })}
        />
        <input
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
          <option value="HIGH">HIGH</option>
          <option value="MID">MID</option>
          <option value="LOW">LOW</option>
        </select>
        <button onClick={handleSave}>{editingMessage ? "Save Changes" : "Add Message"}</button>
        {editingMessage && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
};

export default MessageManagement;
