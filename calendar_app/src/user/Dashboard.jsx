// import React, { useState } from 'react';
// import '../userstyles/Dashboard.css';
// import { MdEmail } from 'react-icons/md';
// import { FaLinkedin } from 'react-icons/fa';
// import { HiDocumentReport } from 'react-icons/hi';


// const companies = [
//     {
//         name: 'Company A',
//         logo: 'logo-a.png',
//         email: 'contact@companya.com',
//         report: 'Annual Report',
//         unseenMessageCount: 3,
//         lastCommunications: [
//             { 
//                 type: 'Follow-Up', 
//                 date: '5th Dec', 
//                 notes: 'Follow-up on previous meeting.', 
//                 summary: 'Following up with the client regarding recent meeting.',
//                 name: 'Chris White', 
//                 designation: 'Sales Manager', 
//                 color: '#FF6347'
//             },
//         ],
//         nextCommunication: { 
//             type: 'Phone Call', 
//             date: '30th Dec',
//             name: 'Jane Smith', 
//             designation: 'Director'
//         },
//         status: 'overdue',
//     },
//     {
//         name: 'Company B',
//         logo: 'logo-b.png',
//         email: 'contact@companyb.com',
//         report: 'Quarterly Report',
//         unseenMessageCount: 0,
//         lastCommunications: [
//             { 
//                 type: 'Meeting', 
//                 date: '22nd Dec', 
//                 notes: 'Discussed quarterly goals.', 
//                 summary: 'Quarterly goals were set for the upcoming quarter.',
//                 name: 'John Doe', 
//                 designation: 'Manager',
//                 color: '#FF4500' // OrangeRed color
//             }
//         ],
//         nextCommunication: { 
//             type: 'Email', 
//             date: '25th Dec',
//             name: 'Alex Johnson', 
//             designation: 'Lead Developer'
//         },
//         status: 'dueToday',
//     },
// ];

// const Dashboard = () => {
//     const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(0);
//     const [communicationFilter, setCommunicationFilter] = useState(5); // Default to Last 5 Communications
//     const [hoveredCommunication, setHoveredCommunication] = useState(null); // State for hovered communication

//     const company = companies[selectedCompanyIndex];
//     const displayedCommunications = company.lastCommunications.slice(0, communicationFilter);

//     return (
//         <div className="dashboard">
//             <h2>Company Dashboard</h2>
//             <div className="main-container">
            

//             <div className="company-list">
//     <h3>Company List</h3>
//     {companies.map((company, index) => (
//         <div
//             key={index}
//             className={`company-item ${index === selectedCompanyIndex ? 'selected' : ''}`}
//             onClick={() => setSelectedCompanyIndex(index)}
//         >
//             <div className="company-left">
//                 <img 
//                     src={company.logo} 
//                     alt={`${company.name} Logo`} 
//                     className="company-logo" 
//                     onClick={(e) => { 
//                         e.stopPropagation();
//                         // Handle company logo click here
//                     }} 
//                 />
//                 <div className="company-name">{company.name}</div>
//             </div>
//             <div className="company-right">
//                 <MdEmail
//                     className="icon"
//                     size={20}
//                     color="gray"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         window.location.href = `mailto:${company.email}`;
//                     }}
//                 />
//                 <FaLinkedin
//                     className="icon"
//                     size={20}
//                     color="#0077b5"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         window.open(`https://www.linkedin.com/company/${company.name}`, '_blank');
//                     }}
//                 />
//                 <HiDocumentReport
//                     className="icon"
//                     size={20}
//                     color="blue"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         alert(`Opening ${company.report}`);
//                     }}
//                 />
//                  {/* Notification alarm for unseen messages */}
//             {company.unseenMessageCount >= 0 && (
//                 <div className="notification-alarm">
//                     {company.unseenMessageCount}
//                 </div>
//             )}
//             </div>
           
//         </div>
//     ))}
// </div>
//                 <div className="communication-details">
//                     <h3>Communication Details</h3>

//                     {/* Communication Filter Options */}
//                     <div className="communication-options">
//                         <button
//                             className={`filter-button ${communicationFilter === 5 ? 'active' : ''}`}
//                             onClick={() => setCommunicationFilter(5)}
//                         >
//                             Last 5 Communications
//                         </button>
//                         <button
//                             className={`filter-button ${communicationFilter === 10 ? 'active' : ''}`}
//                             onClick={() => setCommunicationFilter(10)}
//                         >
//                             Last 10 Communications
//                         </button>
//                         <button
//                             className={`filter-button ${communicationFilter === company.lastCommunications.length ? 'active' : ''}`}
//                             onClick={() => setCommunicationFilter(company.lastCommunications.length)}
//                         >
//                             All Communications
//                         </button>
//                     </div>

//                     <div 
//                         className={`next-communication highlighted ${company.status === 'overdue' ? 'overdue' : company.status === 'dueToday' ? 'due-today' : ''}`}
//                     >
//                         <h3>Next Scheduled Communication</h3>
//                         <div className="communication-header">
//                         <div className="communication-left">
//                         <p>{company.nextCommunication.type} - {company.nextCommunication.date}</p>
//                         </div>
//                         <div className="communication-right">
//                         <p><strong>{company.nextCommunication.name}</strong> - {company.nextCommunication.designation}</p>
//                         </div>
//                         </div>
//                     </div>

//                     <div className="last-communications">
//                         <h4>Last {communicationFilter} Communications</h4>
//                         {displayedCommunications.map((comm, idx) => (
//                             <div
//                                 key={idx}
//                                 className={`communication-item ${comm.type.toLowerCase().replace(' ', '-')}`}
//                                 style={{ borderLeft: `5px solid ${comm.color}` }} 
//                                 onMouseEnter={() => setHoveredCommunication(comm)}
//                                 onMouseLeave={() => setHoveredCommunication(null)}
//                             >
//                                 <div className="communication-header">
//                                     <div className="communication-left">
//                                         <p><strong>{comm.type}</strong> - {comm.date}</p>
//                                     </div>

//                                     {/* Tooltip Positioning between date and name */}
//                                     <div className="communication-tooltip-wrapper">
//                                         <div className="tooltip" style={{ backgroundColor: comm.color }}>{comm.notes}</div>
//                                     </div>

//                                     <div className="communication-right">
//                                         <p><strong>{comm.name}</strong> - {comm.designation}</p>
//                                     </div>
//                                 </div>
//                                 <p>{comm.summary}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useState } from 'react';
import '../userstyles/Dashboard.css';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { HiDocumentReport } from 'react-icons/hi';

const companies = [
    {
        name: 'Company A',
        logo: 'logo-a.png',
        email: 'contact@companya.com',
        report: 'Annual Report',
        unseenMessageCount: 3,
        lastCommunications: [
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Follow-up on previous meeting.', 
                summary: 'Following up with the client regarding recent meeting.',
                name: 'Chris White', 
                designation: 'Sales Manager', 
                color: '#FF6347'
            },
        ],
        nextCommunication: { 
            type: 'Phone Call', 
            date: '30th Dec',
            name: 'Jane Smith', 
            designation: 'Director'
        },
        status: 'overdue',
    },
    {
        name: 'Company B',
        logo: 'logo-b.png',
        email: 'contact@companyb.com',
        report: 'Quarterly Report',
        unseenMessageCount: 0,
        lastCommunications: [
            { 
                type: 'Meeting', 
                date: '22nd Dec', 
                notes: 'Discussed quarterly goals.', 
                summary: 'Quarterly goals were set for the upcoming quarter.',
                name: 'John Doe', 
                designation: 'Manager',
                color: '#FF4500' // OrangeRed color
            }
        ],
        nextCommunication: { 
            type: 'Email', 
            date: '25th Dec',
            name: 'Alex Johnson', 
            designation: 'Lead Developer'
        },
        status: 'dueToday',
    },
];

const Dashboard = () => {
    const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(0);
    const [communicationFilter, setCommunicationFilter] = useState(5); // Default to Last 5 Communications
    const [hoveredCommunication, setHoveredCommunication] = useState(null); // State for hovered communication

    const company = companies[selectedCompanyIndex];
    const displayedCommunications = company.lastCommunications.slice(0, communicationFilter);

    return (
        <div className="company-dashboard">
            <h2>Company Dashboard</h2>
            <div className="dashboard-container">
                <div className="company-list-container">
                    <h3>Company List</h3>
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className={`company-item ${index === selectedCompanyIndex ? 'selected-company' : ''}`}
                            onClick={() => setSelectedCompanyIndex(index)}
                        >
                            <div className="company-info">
                                <img 
                                    src={company.logo} 
                                    alt={`${company.name} Logo`} 
                                    className="company-logo" 
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                    }} 
                                />
                                <div className="company-name">{company.name}</div>
                            </div>
                            <div className="company-actions">
                                <MdEmail
                                    className="icon"
                                    size={20}
                                    color="gray"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${company.email}`;
                                    }}
                                />
                                <FaLinkedin
                                    className="icon"
                                    size={20}
                                    color="#0077b5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.linkedin.com/company/${company.name}`, '_blank');
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
                                {company.unseenMessageCount > 0 && (
                                    <div className="notification-badge">
                                        {company.unseenMessageCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="communication-details-container">
                    <h3>Communication Details</h3>
                    <div className="communication-filter-options">
                        <button
                            className={`filter-button ${communicationFilter === 5 ? 'active' : ''}`}
                            onClick={() => setCommunicationFilter(5)}
                        >
                            Last 5 Communications
                        </button>
                        <button
                            className={`filter-button ${communicationFilter === 10 ? 'active' : ''}`}
                            onClick={() => setCommunicationFilter(10 )}
                        >
                            Last 10 Communications
                        </button>
                        <button
                            className={`filter-button ${communicationFilter === company.lastCommunications.length ? 'active' : ''}`}
                            onClick={() => setCommunicationFilter(company.lastCommunications.length)}
                        >
                            All Communications
                        </button>
                    </div>

                    <div 
                        className={`next-communication-highlighted ${company.status === 'overdue' ? 'overdue' : company.status === 'dueToday' ? 'due-today' : ''}`}
                    >
                        <h3>Next Scheduled Communication</h3>
                        <div className="communication-header">
                            <div className="communication-left">
                                <p>{company.nextCommunication.type} - {company.nextCommunication.date}</p>
                            </div>
                            <div className="communication-right">
                                <p><strong>{company.nextCommunication.name}</strong> - {company.nextCommunication.designation}</p>
                            </div>
                        </div>
                    </div>

                    <div className="last-communications-list">
                        <h4>Last {communicationFilter} Communications</h4>
                        {displayedCommunications.map((comm, idx) => (
                            <div
                                key={idx}
                                className={`communication-item ${comm.type.toLowerCase().replace(' ', '-')}`}
                                style={{ borderLeft: `5px solid ${comm.color}` }} 
                                onMouseEnter={() => setHoveredCommunication(comm)}
                                onMouseLeave={() => setHoveredCommunication(null)}
                            >
                                <div className="communication-header">
                                    <div className="communication-left">
                                        <p><strong>{comm.type}</strong> - {comm.date}</p>
                                    </div>
                                    <div className="communication-right">
                                        <p><strong>{comm.name}</strong> - {comm.designation}</p>
                                    </div>
                                </div>
                                <p>{comm.summary}</p>
                                {hoveredCommunication === comm && (
                                    <div className="tooltip" style={{ backgroundColor: comm.color }}>{comm.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;