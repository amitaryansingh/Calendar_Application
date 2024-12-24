import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import "./UserHome.css";

const UserHome = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Company A",
      lastCommunications: [
        { type: "Email", date: "2024-12-01", notes: "Discussed proposal." },
        { type: "Phone Call", date: "2024-11-20", notes: "Follow-up call." },
      ],
      nextScheduled: { type: "LinkedIn Post", date: "2024-12-25" },
      status: "due", // "overdue", "due", or "none"
    },
    {
      id: 2,
      name: "Company B",
      lastCommunications: [
        { type: "LinkedIn Message", date: "2024-12-10", notes: "Reached out for feedback." },
      ],
      nextScheduled: { type: "Email", date: "2024-12-24" },
      status: "overdue",
    },
  ]);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: "",
    date: "",
    notes: "",
  });

  // Handle row selection
  const toggleSelectCompany = (id) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((companyId) => companyId !== id) : [...prev, id]
    );
  };

  // Handle modal submission
  const handleCommunicationSubmit = () => {
    const updatedCompanies = companies.map((company) => {
      if (selectedCompanies.includes(company.id)) {
        return {
          ...company,
          lastCommunications: [
            { type: newCommunication.type, date: newCommunication.date, notes: newCommunication.notes },
            ...company.lastCommunications,
          ].slice(0, 5),
          nextScheduled: null, // Reset highlights
          status: "none",
        };
      }
      return company;
    });
    setCompanies(updatedCompanies);
    setSelectedCompanies([]);
    setOpenModal(false);
    setNewCommunication({ type: "", date: "", notes: "" });
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Last Five Communications</TableCell>
            <TableCell>Next Scheduled Communication</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              className={`${
                company.status === "overdue"
                  ? "highlight-red"
                  : company.status === "due"
                  ? "highlight-yellow"
                  : ""
              }`}
              onClick={() => toggleSelectCompany(company.id)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{company.name}</TableCell>
              <TableCell>
                {company.lastCommunications.map((comm, index) => (
                  <Tooltip key={index} title={comm.notes} arrow>
                    <span>
                      {comm.type} ({comm.date}){index < company.lastCommunications.length - 1 ? ", " : ""}
                    </span>
                  </Tooltip>
                ))}
              </TableCell>
              <TableCell>
                {company.nextScheduled
                  ? `${company.nextScheduled.type} (${company.nextScheduled.date})`
                  : "None"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        disabled={selectedCompanies.length === 0}
        onClick={() => setOpenModal(true)}
      >
        Communication Performed
      </Button>

      {/* Modal for Communication Action */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-box">
          <h3>Log Communication</h3>
          <Select
            fullWidth
            value={newCommunication.type}
            onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
          >
            <MenuItem value="LinkedIn Post">LinkedIn Post</MenuItem>
            <MenuItem value="LinkedIn Message">LinkedIn Message</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Phone Call">Phone Call</MenuItem>
          </Select>
          <TextField
            fullWidth
            type="date"
            value={newCommunication.date}
            onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
            style={{ marginTop: "1em" }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add Notes"
            value={newCommunication.notes}
            onChange={(e) => setNewCommunication({ ...newCommunication, notes: e.target.value })}
            style={{ marginTop: "1em" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommunicationSubmit}
            style={{ marginTop: "1em" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserHome;
