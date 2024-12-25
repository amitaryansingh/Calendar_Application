import React, { useState } from 'react';
import '../userstyles/Dashboard.css';

const companies = [
    {
        name: 'Company A',
        logo: 'logo-a.png',
        email: 'contact@companya.com',
        report: 'Annual Report',
        lastCommunications: [
            {
                type: 'Email',
                date: '30th Nov',
                notes: 'Sent a proposal document.',
                summary: 'A detailed proposal document was sent over email for approval.',
                name: 'Samuel Green',
                designation: 'Project Manager'
            },
            {
                type: 'Phone Call',
                date: '28th Nov',
                notes: 'Discussed project milestones.',
                summary: 'Had a phone discussion about the upcoming project milestones.',
                name: 'Olivia Black',
                designation: 'Product Owner'
            },
            {
                type: 'Meeting',
                date: '25th Nov',
                notes: 'Team sync on product features.',
                summary: 'Met with the product and design teams to align on features for the next release.',
                name: 'Lucas Grey',
                designation: 'Lead Designer'
            },
            {
                type: 'LinkedIn Post',
                date: '22nd Nov',
                notes: 'Client success story shared.',
                summary: 'Posted a success story about a client project on LinkedIn.',
                name: 'Sophia White',
                designation: 'Marketing Manager'
            },
            {
                type: 'Follow-Up',
                date: '19th Nov',
                notes: 'Followed up after product demo.',
                summary: 'Reached out to the client after a product demo to gauge interest.',
                name: 'Daniel Blue',
                designation: 'Sales Executive'
            },
            {
                type: 'Email',
                date: '15th Nov',
                notes: 'Sent contract draft for review.',
                summary: 'Sent the initial draft of the contract for review and feedback.',
                name: 'Emily Black',
                designation: 'Legal Advisor'
            },
            {
                type: 'Phone Call',
                date: '10th Nov',
                notes: 'Confirmed the next meeting date.',
                summary: 'Had a phone call confirming the next meeting date for project review.',
                name: 'Michael Brown',
                designation: 'Operations Manager'
            },
            {
                type: 'Meeting',
                date: '5th Nov',
                notes: 'Kick-off meeting with stakeholders.',
                summary: 'Initial project kick-off meeting with all key stakeholders.',
                name: 'Mia Green',
                designation: 'Business Analyst'
            },            
            { 
                type: 'Email', 
                date: '20th Dec', 
                notes: 'Missed an important follow-up.', 
                summary: 'Missed the follow-up on the scheduled email communication.',
                name: 'John Doe', 
                designation: 'Manager' 
            },
            { 
                type: 'Phone Call', 
                date: '18th Dec', 
                notes: 'Scheduled next call.', 
                summary: 'Scheduled the next phone call for 30th Dec.',
                name: 'Jane Smith', 
                designation: 'Director' 
            },
            { 
                type: 'Meeting', 
                date: '15th Dec', 
                notes: 'Meeting with team.', 
                summary: 'Discussed team goals and project updates.',
                name: 'Alex Johnson', 
                designation: 'Lead Developer' 
            },
            { 
                type: 'LinkedIn Post', 
                date: '10th Dec', 
                notes: 'New product announcement.', 
                summary: 'Announced a new product on LinkedIn.',
                name: 'Sam Brown', 
                designation: 'Marketing' 
            },
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Follow-up on previous meeting.', 
                summary: 'Following up with the client regarding recent meeting.',
                name: 'Chris White', 
                designation: 'Sales Manager' 
            },
        ],
        nextCommunication: { type: 'Phone Call', date: '30th Dec' },
        status: 'overdue',
    },
    {
        name: 'Company B',
        logo: 'logo-b.png',
        email: 'contact@companyb.com',
        report: 'Quarterly Report',
        lastCommunications: [
            { 
                type: 'Meeting', 
                date: '22nd Dec', 
                notes: 'Discussed quarterly goals.', 
                summary: 'Quarterly goals were set for the upcoming quarter.',
                name: 'John Doe', 
                designation: 'Manager' 
            },
            { 
                type: 'Email', 
                date: '20th Dec', 
                notes: 'Followed up on progress.', 
                summary: 'Followed up on the progress of the project via email.',
                name: 'Jane Smith', 
                designation: 'Director' 
            },
            { 
                type: 'Phone Call', 
                date: '15th Dec', 
                notes: 'Confirmed next meeting.', 
                summary: 'Confirmed the next meeting date over the phone.',
                name: 'Alex Johnson', 
                designation: 'Lead Developer' 
            },
            { 
                type: 'LinkedIn Post', 
                date: '10th Dec', 
                notes: 'Product update.', 
                summary: 'Posted an update about new product features on LinkedIn.',
                name: 'Sam Brown', 
                designation: 'Marketing' 
            },
            { 
                type: 'Follow-Up', 
                date: '5th Dec', 
                notes: 'Scheduled next call.', 
                summary: 'Scheduled a follow-up phone call for the following week.',
                name: 'Chris White', 
                designation: 'Sales Manager' 
            },
        ],
        nextCommunication: { type: 'Email', date: '25th Dec' },
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
                            <img src={company.logo} alt={`${company.name} Logo`} className="company-logo" />
                            <div className="company-name">{company.name}</div>
                            <div className="company-email">{company.email}</div>
                            <div className="company-report">{company.report}</div>
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

                    <div className="next-communication highlighted">
                        <h4>Next Scheduled Communication</h4>
                        <p>{company.nextCommunication.type} - {company.nextCommunication.date}</p>
                    </div>

                    <div className="last-communications">
                        <h4>Last {communicationFilter} Communications</h4>
                        {displayedCommunications.map((comm, idx) => (
                            <div
                                key={idx}
                                className={`communication-item ${comm.type.toLowerCase().replace(' ', '-')}`}
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

                                {/* Tooltip for notes */}
                                {hoveredCommunication === comm && (
                                    <div className="tooltip">
                                        {comm.notes}
                                    </div>
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