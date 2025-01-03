import React, { useState, useEffect } from "react";
import "../userstyles/Dashboard.css";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import {
  getUserProfile,
  getSeenStatusByMessageIDAndUserID,
  getUserMessagesByCompanyForUser,
  getCompanyByCompanyIdForUser,
  getMessagesNotSeenByUserForCompanyforuser,
  updateSeenStatus,
} from "../authentication/aapi";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [hoveredCommunication, setHoveredCommunication] = useState(null);
  const [filter, setFilter] = useState("last5");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const profileData = await getUserProfile(user_id);
        const companiesArray = profileData.data.companies;

        if (Array.isArray(companiesArray)) {
          const companyDataPromises = companiesArray.map(async (company) => {
            try {
              const response = await getCompanyByCompanyIdForUser(company.mid);
              const unseenMessages = await getMessagesNotSeenByUserForCompanyforuser(user_id, company.mid);

              return {
                ...response.data,
                unseenMessagesCount: unseenMessages.data.length,
              };
            } catch (err) {
              console.error(`Error fetching data for company mid ${company.mid}:`, err);
              return null;
            }
          });

          const allCompanyData = await Promise.all(companyDataPromises);
          const validCompanies = allCompanyData.filter((data) => data !== null);
          setCompanies(validCompanies);
        } else {
          console.error("Companies data is not an array:", companiesArray);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [user_id]);

  const fetchMessages = async (companyId, filterType) => {
    setLoadingMessages(true);
    try {
      let response = await getUserMessagesByCompanyForUser(user_id, companyId);
      let messagesList = response.data;

      if (filterType === "last5") {
        messagesList = messagesList
          .filter((msg) => new Date(msg.date) < new Date())
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      } else if (filterType === "upcoming") {
        messagesList = messagesList.filter((msg) => new Date(msg.date) > new Date());
      }

      const messagesWithSeenStatus = await Promise.all(
        messagesList.map(async (message) => {
          try {
            const seenResponse = await getSeenStatusByMessageIDAndUserID(message.messageId, user_id);
            return { ...message, seen: seenResponse.data };
          } catch (err) {
            console.error(`Error fetching seen status for message ${message.messageId}:`, err);
            return { ...message, seen: false };
          }
        })
      );

      setMessages(messagesWithSeenStatus);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchMessages(selectedCompany.mid, filter);
    }
  }, [filter, selectedCompany]);

  const handleMarkAsSeen = async (messageId) => {
    try {
      await updateSeenStatus(messageId, user_id, true);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, seen: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as seen:", err);
    }
  };

  const handleMarkAsUnseen = async (messageId) => {
    try {
      await updateSeenStatus(messageId, user_id, false);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, seen: false } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as unseen:", err);
    }
  };

  return (
    <div className="company-dashboard">
      <h2>Company Dashboard</h2>

      <div className="dashboard-container">
        <div className="company-list-container">
          <div className="company-list-header">
            <h3>Company List</h3>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>
          {loadingCompanies ? (
            <p>Loading companies...</p>
          ) : (
            <div className="company-viewer-list">
              {companies
                .filter((company) =>
                  company.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((company, index) => (
                  <div
                    key={index}
                    className="company-item"
                    onClick={() => {
                      setSelectedCompany(company);
                      fetchMessages(company.mid, filter);
                    }}
                  >
                    <div className="company-info">
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} Logo`}
                        className="company-logo"
                      />
                      <div className="company-name">{company.name}</div>
                      <div className="company-location">{company.location}</div>
                    </div>
                    <div className="company-actions">
                      <MdEmail
                        className="icon"
                        size={20}
                        color="gray"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${company.emails}`;
                        }}
                      />
                      <FaLinkedin
                        className="icon"
                        size={20}
                        color="#0077b5"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://www.linkedin.com/company/${company.name}`,
                            "_blank"
                          );
                        }}
                      />
                      <HiDocumentReport
                        className="icon"
                        size={20}
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Opening ${company.report}`);
                        }}
                      />
                      {company.unseenMessagesCount > 0 && (
                        <div className="notification-badge">
                          {company.unseenMessagesCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="communication-details-container">
          <h3>Communication Details</h3>

          <div className="communication-filter-options">
            {[
              { label: "Last 5 Past Messages", value: "last5" },
              { label: "Upcoming Messages", value: "upcoming" },
              { label: "All Messages", value: "all" },
            ].map((btn) => (
              <button
                key={btn.value}
                className={`filter-button ${filter === btn.value ? "active" : ""}`}
                onClick={() => setFilter(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : messages.length > 0 ? (
            <div className="last-communications-list">
              {messages.map((comm, idx) => {
                const compareDates = (messageDate) => {
                  const messageDateObj = new Date(messageDate);
                  const today = new Date();
                
                  // Strip the time part to compare only the dates
                  messageDateObj.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                
                  // Compare the dates only
                  return messageDateObj.getTime() === today.getTime();
                };
                
                let borderColor = comm.seen
                  ? "#28a745" // Green if seen
                  : compareDates(comm.date)
                  ? "#ffcc00" // Yellow if it's today's date
                  : new Date(comm.date) < new Date()
                  ? "#ff6b6b" // Red if past
                  : "#007bff"; // Blue if future
                

                return (
                  <div
                    key={idx}
                    className={`communication-item ${
                      comm.type ? comm.type.toLowerCase().replace(" ", "-") : "unknown-type"
                    }`}
                    style={{ borderLeft: `5px solid ${borderColor}` }}
                    onMouseEnter={() => setHoveredCommunication(comm)}
                    onMouseLeave={() => setHoveredCommunication(null)}
                  >
                    <div className="communication-header">
                      <div className="communication-left">
                        <p>
                          <strong>{comm.name || "Unknown"}</strong> - {comm.date || "No Date"}
                        </p>
                      </div>
                      <div className="communication-right">
                        <p>
                          <strong>{comm.clientName || "Unknown"}</strong> - {comm.designation || "No Designation"}
                        </p>
                      </div>
                    </div>
                    <p>{comm.description || "No Summary Available"}</p>

                    {hoveredCommunication === comm && (
                      <div className="tooltip" style={{ backgroundColor: borderColor }}>
                        {comm.notes || "No Notes Available"}
                      </div>
                    )}

                    <div className="mark-as-read-unread-buttons">
                      {!comm.seen ? (
                        <button
                          className="mark-as-read"
                          onClick={() => handleMarkAsSeen(comm.messageId)}
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          className="mark-as-unread"
                          onClick={() => handleMarkAsUnseen(comm.messageId)}
                        >
                          Mark as Unread
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No communications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
