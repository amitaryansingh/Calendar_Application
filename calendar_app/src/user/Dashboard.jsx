
import React, { useState, useEffect } from "react";
import "../userstyles/Dashboard.css";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import {
  getUserProfile,
  getUserMessagesByCompanyForUser,
  getCompanyByCompanyIdForUser,
  getMessagesNotSeenByUserForCompanyforuser, // Import this function for unseen messages
  markMessageAsSeen // Import the mark as seen function
} from "../authentication/aapi";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hoveredCommunication, setHoveredCommunication] = useState(null);
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile for user_id:", user_id);
      try {
        const profiledata = await getUserProfile(user_id);
        console.log("Fetched user profile data:", profiledata);

        const companiesArray = profiledata.data.companies;
        console.log("Companies array from profile data:", companiesArray);

        if (Array.isArray(companiesArray)) {
          const companyDataPromises = companiesArray.map(async (company) => {
            try {
              console.log(`Fetching data for company mid: ${company.mid}`);
              const response = await getCompanyByCompanyIdForUser(company.mid);
              const unseenMessages = await getMessagesNotSeenByUserForCompanyforuser(
                user_id,
                company.mid
              );

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
          console.log("Final combined companies data:", validCompanies);

          setCompanies(validCompanies);
        } else {
          console.error("Companies data is not an array:", companiesArray);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [user_id]);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchMessages = async (companyId) => {
    console.log("Fetching messages for company ID:", companyId);
    try {
      const response = await getUserMessagesByCompanyForUser(user_id, companyId);
      console.log("Fetched messages:", response.data);
      if (response && response.data) {
        setMessages(response.data);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleMarkAsSeen = async (messageId) => {
    try {
      await markMessageAsSeen(messageId, user_id);
      console.log(`Message with ID ${messageId} marked as seen.`);
    } catch (err) {
      console.error("Error marking message as seen:", err);
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
          {filteredCompanies.map((company, index) => (
            <div
              key={index}
              className="company-item"
              onClick={() => fetchMessages(company.mid)}
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

        <div className="communication-details-container">
  <h3>Communication Details</h3>
  {messages.length > 0 ? (
    <div className="last-communications-list">
      {messages.map((comm, idx) => {
        // Determine the color based on seen status and message date
        let borderColor = "#ccc"; // Default color
        if (!comm?.seen) {
          borderColor = "#ff6b6b"; // Red for unseen messages
        } else if (comm?.status === "overdue") {
          borderColor = "#d9534f"; // Red for overdue communications
        } else if (comm?.status === "dueToday") {
          borderColor = "#f0ad4e"; // Yellow for due today
        } else if (comm?.status === "completed") {
          borderColor = "#5cb85c"; // Green for completed communications
        }

        return (
          <div
            key={idx}
            className={`communication-item ${
              comm?.type ? comm.type.toLowerCase().replace(" ", "-") : "unknown-type"
            } ${
              comm?.status === "overdue"
                ? "overdue"
                : comm?.status === "dueToday"
                ? "due-today"
                : ""
            }`}
            style={{ borderLeft: `5px solid ${borderColor}` }}
            onMouseEnter={() => setHoveredCommunication(comm)}
            onMouseLeave={() => setHoveredCommunication(null)}
          >
            <div className="communication-header">
              <div className="communication-left">
                <p>
                  <strong>{comm?.name || "Unknown"} {comm?.priorityLevel}</strong> - {comm?.date || "No Date"}
                </p>
              </div>
              <div className="communication-right">
                <p>
                  <strong>{comm?.clientName || "Unknown"}</strong> - {comm?.designation || "No Designation"}
                </p>
              </div>
            </div>
            <p>{comm?.description || "No Summary Available"}</p>
            {hoveredCommunication === comm && (
              <div className="tooltip" style={{ backgroundColor: borderColor }}>
                {comm?.notes || "No Notes Available"}
              </div>
            )}
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

