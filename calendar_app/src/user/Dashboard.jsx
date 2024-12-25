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
                type: 'Email',
                date: '30th Nov',
                notes: 'Sent a proposal document.',
                summary: 'A detailed proposal document was sent over email for approval.',
                name: 'Samuel Green',
                designation: 'Project Manager',
                color: 'red' 
            },
            {
                type: 'Phone Call',
                date: '28th Nov',
                notes: 'Discussed project milestones.',
                summary: 'Had a phone discussion about the upcoming project milestones.',
                name: 'Olivia Black',
                designation: 'Product Owner',
                color: '#90EE90'
            },
            {
                type: 'Meeting',
                date: '25th Nov',
                notes: 'Team sync on product features.',
                summary: 'Met with the product and design teams to align on features for the next release.',
                name: 'Lucas Grey',
                designation: 'Lead Designer',
                color: '#FFB6C1' 
            },
            {
                type: 'LinkedIn Post',
                date: '22nd Nov',
                notes: 'Client success story shared.',
                summary: 'Posted a success story about a client project on LinkedIn.',
                name: 'Sophia White',
                designation: 'Marketing Manager',
                color: '#FFD700' 
            },
            {
                type: 'Follow-Up',
                date: '19th Nov',
                notes: 'Followed up after product demo.',
                summary: 'Reached out to the client after a product demo to gauge interest.',
                name: 'Daniel Blue',
                designation: 'Sales Executive',
                color: '#FF6347'
            },
            {
                type: 'Email',
                date: '15th Nov',
                notes: 'Sent contract draft for review.',
                summary: 'Sent the initial draft of the contract for review and feedback.',
                name: 'Emily Black',
                designation: 'Legal Advisor',
                color: '#D3D3D3' 
            },
            {
                type: 'Phone Call',
                date: '10th Nov',
                notes: 'Confirmed the next meeting date.',
                summary: 'Had a phone call confirming the next meeting date for project review.',
                name: 'Michael Brown',
                designation: 'Operations Manager',
                color: '#FFD700' 
            },
            {
                type: 'Meeting',
                date: '5th Nov',
                notes: 'Kick-off meeting with stakeholders.',
                summary: 'Initial project kick-off meeting with all key stakeholders.',
                name: 'Mia Green',
                designation: 'Business Analyst',
                color: '#FF4500' 
            },
            { 
                type: 'Email', 
                date: '20th Dec', 
                notes: 'Missed an important follow-up.', 
                summary: 'Missed the follow-up on the scheduled email communication.',
                name: 'John Doe', 
                designation: 'Manager', 
                color: '#ADD8E6' 
            },
            { 
                type: 'Phone Call', 
                date: '18th Dec', 
                notes: 'Scheduled next call.', 
                summary: 'Scheduled the next phone call for 30th Dec.',
                name: 'Jane Smith', 
                designation: 'Director', 
                color: '#90EE90'
            },
            { 
                type: 'Meeting', 
                date: '15th Dec', 
                notes: 'Meeting with team.', 
                summary: 'Discussed team goals and project updates.',
                name: 'Alex Johnson', 
                designation: 'Lead Developer',
                color: '#FFB6C1' // Light pink color
            },
            { 
                type: 'LinkedIn Post', 
                date: '10th Dec', 
                notes: 'New product announcement.', 
                summary: 'Announced a new product on LinkedIn.',
                name: 'Sam Brown', 
                designation: 'Marketing',
                color: '#FFD700' // Gold color
            },
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Follow-up on previous meeting.', 
                summary: 'Following up with the client regarding recent meeting.',
                name: 'Chris White', 
                designation: 'Sales Manager', 
                color: '#FF6347' // Tomato color
            },
            {
                type: 'Email',
                date: '30th Nov',
                notes: 'Sent a proposal document.',
                summary: 'A detailed proposal document was sent over email for approval.',
                name: 'Samuel Green',
                designation: 'Project Manager',
                color: 'red' 
            },
            {
                type: 'Phone Call',
                date: '28th Nov',
                notes: 'Discussed project milestones.',
                summary: 'Had a phone discussion about the upcoming project milestones.',
                name: 'Olivia Black',
                designation: 'Product Owner',
                color: '#90EE90'
            },
            {
                type: 'Meeting',
                date: '25th Nov',
                notes: 'Team sync on product features.',
                summary: 'Met with the product and design teams to align on features for the next release.',
                name: 'Lucas Grey',
                designation: 'Lead Designer',
                color: '#FFB6C1' 
            },
            {
                type: 'LinkedIn Post',
                date: '22nd Nov',
                notes: 'Client success story shared.',
                summary: 'Posted a success story about a client project on LinkedIn.',
                name: 'Sophia White',
                designation: 'Marketing Manager',
                color: '#FFD700' 
            },
            {
                type: 'Follow-Up',
                date: '19th Nov',
                notes: 'Followed up after product demo.',
                summary: 'Reached out to the client after a product demo to gauge interest.',
                name: 'Daniel Blue',
                designation: 'Sales Executive',
                color: '#FF6347'
            },
            {
                type: 'Email',
                date: '15th Nov',
                notes: 'Sent contract draft for review.',
                summary: 'Sent the initial draft of the contract for review and feedback.',
                name: 'Emily Black',
                designation: 'Legal Advisor',
                color: '#D3D3D3' 
            },
            {
                type: 'Phone Call',
                date: '10th Nov',
                notes: 'Confirmed the next meeting date.',
                summary: 'Had a phone call confirming the next meeting date for project review.',
                name: 'Michael Brown',
                designation: 'Operations Manager',
                color: '#FFD700' 
            },
            {
                type: 'Meeting',
                date: '5th Nov',
                notes: 'Kick-off meeting with stakeholders.',
                summary: 'Initial project kick-off meeting with all key stakeholders.',
                name: 'Mia Green',
                designation: 'Business Analyst',
                color: '#FF4500' 
            },
            { 
                type: 'Email', 
                date: '20th Dec', 
                notes: 'Missed an important follow-up.', 
                summary: 'Missed the follow-up on the scheduled email communication.',
                name: 'John Doe', 
                designation: 'Manager', 
                color: '#ADD8E6' 
            },
            { 
                type: 'Phone Call', 
                date: '18th Dec', 
                notes: 'Scheduled next call.', 
                summary: 'Scheduled the next phone call for 30th Dec.',
                name: 'Jane Smith', 
                designation: 'Director', 
                color: '#90EE90'
            },
            { 
                type: 'Meeting', 
                date: '15th Dec', 
                notes: 'Meeting with team.', 
                summary: 'Discussed team goals and project updates.',
                name: 'Alex Johnson', 
                designation: 'Lead Developer',
                color: '#FFB6C1' // Light pink color
            },
            { 
                type: 'LinkedIn Post', 
                date: '10th Dec', 
                notes: 'New product announcement.', 
                summary: 'Announced a new product on LinkedIn.',
                name: 'Sam Brown', 
                designation: 'Marketing',
                color: '#FFD700' // Gold color
            },
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Follow-up on previous meeting.', 
                summary: 'Following up with the client regarding recent meeting.',
                name: 'Chris White', 
                designation: 'Sales Manager', 
                color: '#FF6347' // Tomato color
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
            },
            { 
                type: 'Email', 
                date: '20th Dec', 
                notes: 'Followed up on progress.', 
                summary: 'Followed up on the progress of the project via email.',
                name: 'Jane Smith', 
                designation: 'Director',
                color: '#ADD8E6' // Light blue color
            },
            { 
                type: 'Phone Call', 
                date: '15th Dec', 
                notes: 'Confirmed next meeting.', 
                summary: 'Confirmed the next meeting date over the phone.',
                name: 'Alex Johnson', 
                designation: 'Lead Developer',
                color: '#90EE90' // Light green color
            },
            { 
                type: 'LinkedIn Post', 
                date: '10th Dec', 
                notes: 'Product update.', 
                summary: 'Posted an update about new product features on LinkedIn.',
                name: 'Sam Brown', 
                designation: 'Marketing',
                color: '#FFD700' // Gold color
            },
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Scheduled next call.', 
                summary: 'Scheduled a follow-up phone call for the following week.',
                name: 'Chris White', 
                designation: 'Sales Manager',
                color: '#FF6347' // Tomato color
            },
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
        <div className="dashboard">
            <h2>Company Dashboard</h2>
            <div className="main-container">
            

            <div className="company-list">
    <h3>Company List</h3>
    {companies.map((company, index) => (
        <div
            key={index}
            className={`company-item ${index === selectedCompanyIndex ? 'selected' : ''}`}
            onClick={() => setSelectedCompanyIndex(index)}
        >
            <div className="company-left">
                <img 
                    src={company.logo} 
                    alt={`${company.name} Logo`} 
                    className="company-logo" 
                    onClick={(e) => { 
                        e.stopPropagation();
                        // Handle company logo click here
                    }} 
                />
                <div className="company-name">{company.name}</div>
            </div>
            <div className="company-right">
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
                 {/* Notification alarm for unseen messages */}
            {company.unseenMessageCount >= 0 && (
                <div className="notification-alarm">
                    {company.unseenMessageCount}
                </div>
            )}
            </div>
           
        </div>
    ))}
</div>



                <div className="communication-details">
                    <h3>Communication Details</h3>

                    {/* Communication Filter Options */}
                    <div className="communication-options">
                        <button
                            className={`filter-button ${communicationFilter === 5 ? 'active' : ''}`}
                            onClick={() => setCommunicationFilter(5)}
                        >
                            Last 5 Communications
                        </button>
                        <button
                            className={`filter-button ${communicationFilter === 10 ? 'active' : ''}`}
                            onClick={() => setCommunicationFilter(10)}
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
                        className={`next-communication highlighted ${company.status === 'overdue' ? 'overdue' : company.status === 'dueToday' ? 'due-today' : ''}`}
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

                    <div className="last-communications">
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

                                    {/* Tooltip Positioning between date and name */}
                                    <div className="communication-tooltip-wrapper">
                                        <div className="tooltip" style={{ backgroundColor: comm.color }}>{comm.notes}</div>
                                    </div>

                                    <div className="communication-right">
                                        <p><strong>{comm.name}</strong> - {comm.designation}</p>
                                    </div>
                                </div>
                                <p>{comm.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

