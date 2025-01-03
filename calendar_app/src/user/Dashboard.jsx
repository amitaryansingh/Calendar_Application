
// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [hoveredCommunication, setHoveredCommunication] = useState(null);
//   const [filter, setFilter] = useState("last5"); // State to manage the filter type
//   const user_id = localStorage.getItem("user_id");
//   const role = localStorage.getItem("role");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       console.log("Fetching user profile for user_id:", user_id);
//       try {
//         const profiledata = await getUserProfile(user_id);
//         console.log("Fetched user profile data:", profiledata);

//         const companiesArray = profiledata.data.companies;
//         console.log("Companies array from profile data:", companiesArray);

//         if (Array.isArray(companiesArray)) {
//           const companyDataPromises = companiesArray.map(async (company) => {
//             try {
//               console.log(`Fetching data for company mid: ${company.mid}`);
//               const response = await getCompanyByCompanyIdForUser(company.mid);
//               const unseenMessages = await getMessagesNotSeenByUserForCompanyforuser(
//                 user_id,
//                 company.mid
//               );

//               return {
//                 ...response.data,
//                 unseenMessagesCount: unseenMessages.data.length,
//               };
//             } catch (err) {
//               console.error(`Error fetching data for company mid ${company.mid}:`, err);
//               return null;
//             }
//           });

//           const allCompanyData = await Promise.all(companyDataPromises);
//           const validCompanies = allCompanyData.filter((data) => data !== null);
//           console.log("Final combined companies data:", validCompanies);

//           setCompanies(validCompanies);
//         } else {
//           console.error("Companies data is not an array:", companiesArray);
//         }
//       } catch (err) {
//         console.error("Error fetching user profile:", err);
//       }
//     };

//     fetchUserProfile();
//   }, [user_id]);

//   // Filter companies based on search query
//   const filteredCompanies = companies.filter((company) =>
//     company.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const fetchMessages = async (companyId, filterType) => {
//     console.log("Fetching messages for company ID:", companyId, "with filter:", filterType);
//     try {
//       let response;
//       // Determine the fetch type based on filter state
//       if (filterType === "last5") {
//         response = await getUserMessagesByCompanyForUser(user_id, companyId); // Fetch all messages for the company
        
//         // Filter for past messages (messages with a date before today)
//         const pastMessages = response.data.filter(msg => new Date(msg.date) < new Date());
  
//         // Sort past messages by date in descending order (latest past message first)
//         const sortedPastMessages = pastMessages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
//         // Get the latest 5 past messages
//         const last5PastMessages = sortedPastMessages.slice(0, 5);
        
//         setMessages(last5PastMessages);
//       } else if (filterType === "upcoming") {
//         // Fetch upcoming messages
//         response = await getUserMessagesByCompanyForUser(user_id, companyId);
//         const upcomingMessages = response.data.filter(
//           (msg) => new Date(msg.date) > new Date() // Filter for future dates
//         );
//         setMessages(upcomingMessages);
//       } else {
//         // Default: fetch all messages
//         response = await getUserMessagesByCompanyForUser(user_id, companyId);
//         setMessages(response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     }
//   };
  

//   const handleMarkAsSeen = async (messageId) => {
//     try {
//       await markMessageAsSeen(messageId, user_id);
//       console.log(`Message with ID ${messageId} marked as seen.`);
//     } catch (err) {
//       console.error("Error marking message as seen:", err);
//     }
//   };

//   // Effect to automatically fetch messages when filter or company changes
//   useEffect(() => {
//     if (companies.length > 0) {
//       const selectedCompany = companies[0]; // Assuming selecting the first company
//       fetchMessages(selectedCompany.mid, filter); // Fetch messages with the current filter
//     }
//   }, [filter, companies]); // Dependency on filter and companies

//   return (
//     <div className="company-dashboard">
//       <h2>Company Dashboard</h2>
//       <div className="dashboard-container">
//         <div className="company-list-container">
//           <div className="company-list-header">
//             <h3>Company List</h3>
//             <input
//               type="text"
//               placeholder="Search companies..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-bar"
//             />
//           </div>
//           <div className="company-viewer-list">
//           {filteredCompanies.map((company, index) => (
//             <div
//               key={index}
//               className="company-item"
//               onClick={() => fetchMessages(company.mid, filter)} // Pass the current filter state
//             >
//               <div className="company-info">
//                 <img
//                   src={company.logoUrl}
//                   alt={`${company.name} Logo`}
//                   className="company-logo"
//                 />
//                 <div className="company-name">{company.name}</div>
//                 <div className="company-location">{company.location}</div>
//               </div>
//               <div className="company-actions">
//                 <MdEmail
//                   className="icon"
//                   size={20}
//                   color="gray"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     window.location.href = `mailto:${company.emails}`;
//                   }}
//                 />
//                 <FaLinkedin
//                   className="icon"
//                   size={20}
//                   color="#0077b5"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     window.open(
//                       `https://www.linkedin.com/company/${company.name}`,
//                       "_blank"
//                     );
//                   }}
//                 />
//                 <HiDocumentReport
//                   className="icon"
//                   size={20}
//                   color="blue"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     alert(`Opening ${company.report}`);
//                   }}
//                 />
//                 {company.unseenMessagesCount > 0 && (
//                   <div className="notification-badge">
//                     {company.unseenMessagesCount}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         </div>
//         <div className="communication-details-container">
//           <h3>Communication Details</h3>
//           <div className="communication-filter-options">
//             <button
//               className={`filter-button ${filter === "last5" ? "active" : ""}`}
//               onClick={() => setFilter("last5")}
//             >
//               Last 5 Past Messages
//             </button>
//             <button
//               className={`filter-button ${filter === "upcoming" ? "active" : ""}`}
//               onClick={() => setFilter("upcoming")}
//             >
//               Upcoming Messages
//             </button>
//             <button
//               className={`filter-button ${filter === "all" ? "active" : ""}`}
//               onClick={() => setFilter("all")}
//             >
//               All Messages
//             </button>
//           </div>

//           {messages.length > 0 ? (
//             <div className="last-communications-list">
//               {messages.map((comm, idx) => {
//                 let borderColor = "#ccc";
//                 if (!comm?.seen) {
//                   borderColor = "#ff6b6b"; // Red for unseen messages
//                 } else if (comm?.status === "overdue") {
//                   borderColor = "#d9534f"; // Red for overdue communications
//                 } else if (comm?.status === "dueToday") {
//                   borderColor = "#f0ad4e"; // Yellow for due today
//                 } else if (comm?.status === "completed") {
//                   borderColor = "#5cb85c"; // Green for completed communications
//                 }

//                 return (
//                   <div
//                     key={idx}
//                     className={`communication-item ${comm?.type ? comm.type.toLowerCase().replace(" ", "-") : "unknown-type"}`}
//                     style={{ borderLeft: `5px solid ${borderColor}` }}
//                     onMouseEnter={() => setHoveredCommunication(comm)}
//                     onMouseLeave={() => setHoveredCommunication(null)}
//                   >
//                     <div className="communication-header">
//                       <div className="communication-left">
//                         <p>
//                           <strong>{comm?.name || "Unknown"} {comm?.priorityLevel}</strong> - {comm?.date || "No Date"}
//                         </p>
//                       </div>
//                       <div className="communication-right">
//                         <p>
//                           <strong>{comm?.clientName || "Unknown"}</strong> - {comm?.designation || "No Designation"}
//                         </p>
//                       </div>
//                     </div>
//                     <p>{comm?.description || "No Summary Available"}</p>
//                     {hoveredCommunication === comm && (
//                       <div className="tooltip" style={{ backgroundColor: borderColor }}>
//                         {comm?.notes || "No Notes Available"}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p>No communications available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import "../userstyles/Dashboard.css";
// import { MdEmail } from "react-icons/md";
// import { FaLinkedin } from "react-icons/fa";
// import { HiDocumentReport } from "react-icons/hi";
// import { updateSeenStatus } from "../authentication/aapi"; // Assuming updateSeenStatus is imported from aapi.js


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
  markMessageAsSeen,
  updateSeenStatus
} from "../authentication/aapi";


const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hoveredCommunication, setHoveredCommunication] = useState(null);
  const [filter, setFilter] = useState("last5"); // State to manage the filter type
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetching user profile and company data as before
    const fetchUserProfile = async () => {
      try {
        const profiledata = await getUserProfile(user_id);
        const companiesArray = profiledata.data.companies;
        
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
      }
    };

    fetchUserProfile();
  }, [user_id]);

  // Fetching messages based on the current filter
  const fetchMessages = async (companyId, filterType) => {
    try {
      console.log("Fetching messages for company ID:", companyId, "with filter:", filterType);
  
      let response = await getUserMessagesByCompanyForUser(user_id, companyId);
      console.log("Messages fetched from API:", response.data);
  
      let messagesList = response.data;
  
      // Apply filters
      if (filterType === "last5") {
        console.log("Applying 'last5' filter...");
        messagesList = messagesList
          .filter((msg) => new Date(msg.date) < new Date())
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      } else if (filterType === "upcoming") {
        console.log("Applying 'upcoming' filter...");
        messagesList = messagesList.filter((msg) => new Date(msg.date) > new Date());
      }
  
      console.log("Filtered messages list:", messagesList);
  
      // Fetch seen status for each message
      const messagesWithSeenStatus = await Promise.all(
        messagesList.map(async (message) => {
          try {
            console.log(`Fetching seen status for message ID: ${message.messageId}`);
            const seenResponse = await getSeenStatusByMessageIDAndUserID(
              message.messageId,user_id);
            const seenStatus = seenResponse.data; // Default to false if not available
            console.log(`Seen status for message ID ${message.messageId}:`, seenStatus);
            return { ...message, seen: seenStatus };
          } catch (err) {
            console.error(`Error fetching seen status for message ${message.messageId}:`, err);
            return { ...message, seen: false }; // Assume unseen in case of error
          }
        })
      );
  
      console.log("Messages with seen status:", messagesWithSeenStatus);
  
      setMessages(messagesWithSeenStatus);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  
  

  // Mark a message as seen
  const handleMarkAsSeen = async (messageId) => {
    try {
      await updateSeenStatus(messageId, user_id, true); // Set seen to true
      console.log(`Message with ID ${messageId} marked as seen.`);
    } catch (err) {
      console.error("Error marking message as seen:", err);
    }
  };

  // Mark a message as unseen
  const handleMarkAsUnseen = async (messageId) => {
    try {
      await updateSeenStatus(messageId, user_id, false); // Set seen to false
      console.log(`Message with ID ${messageId} marked as unseen.`);
    } catch (err) {
      console.error("Error marking message as unseen:", err);
    }
  };

  useEffect(() => {
    if (companies.length > 0) {
      const selectedCompany = companies[0];
      fetchMessages(selectedCompany.mid, filter); // Fetch messages with the current filter
    }
  }, [filter, companies]);

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
          <div className="company-viewer-list">
            {companies.map((company, index) => (
              <div
                key={index}
                className="company-item"
                onClick={() => fetchMessages(company.mid, filter)} // Pass the current filter state
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
        </div>
        <div className="communication-details-container">
          <h3>Communication Details</h3>
          <div className="communication-filter-options">
            <button
              className={`filter-button ${filter === "last5" ? "active" : ""}`}
              onClick={() => setFilter("last5")}
            >
              Last 5 Past Messages
            </button>
            <button
              className={`filter-button ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming Messages
            </button>
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Messages
            </button>
          </div>

          {messages.length > 0 ? (
            <div className="last-communications-list">
            {messages.map((comm, idx) => {
              let borderColor = "#ccc"; // Default border color
              const messageDate = new Date(comm?.date);
              const today = new Date();

          
              if (!comm?.seen) {
                if (messageDate < today) {
                  borderColor = "#ff6b6b"; // Red for unseen messages with past dates
                } else if (messageDate.getDate() === today.getDate()) {
                  borderColor = "#ffcc00"; // Yellow for unseen messages with today's date
                } else if (messageDate > today) {
                  borderColor = "#007bff"; // Blue for unseen messages with future dates
                }
              } else {
                borderColor = "#28a745"; // Green for seen messages
              }
          
              console.log(
                `Message ID: ${comm.messageId}, Seen: ${comm.seen}, Date: ${comm.date}, Border Color: ${borderColor}`
              );
          
              return (
                <div
                  key={idx}
                  className={`communication-item ${
                    comm?.type ? comm.type.toLowerCase().replace(" ", "-") : "unknown-type"
                  }`}
                  style={{ borderLeft: `5px solid ${borderColor}` }}
                  onMouseEnter={() => setHoveredCommunication(comm)}
                  onMouseLeave={() => setHoveredCommunication(null)}
                >
                  <div className="communication-header">
                    <div className="communication-left">
                      <p>
                        <strong>
                          {comm?.name || "Unknown"} {comm?.priorityLevel}
                        </strong>{" "}
                        - {comm?.date || "No Date"}
                      </p>
                    </div>
                    <div className="communication-right">
                      <p>
                        <strong>{comm?.clientName || "Unknown"}</strong> -{" "}
                        {comm?.designation || "No Designation"}
                      </p>
                    </div>
                  </div>
                  <p>{comm?.description || "No Summary Available"}</p>
                  {hoveredCommunication === comm && (
                    <div className="tooltip" style={{ backgroundColor: borderColor }}>
                      {comm?.notes || "No Notes Available"}
                    </div>
                  )}
                  <div className="mark-as-read-unread-buttons">
                    {!comm?.seen ? (
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
