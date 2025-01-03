// import React, { useState } from "react";

// const AssignmentModal = ({ message, companies, users, onClose, onAssign }) => {
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const handleUserSelect = (userId) => {
//     setSelectedUsers((prev) => {
//       if (prev.includes(userId)) {
//         return prev.filter((id) => id !== userId);
//       }
//       return [...prev, userId];
//     });
//   };

//   const handleAssign = () => {
//     onAssign(message.messageId, selectedCompany, selectedUsers);
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         <h3>Assign Users and Company</h3>
//         <div>
//           <h4>Message Details</h4>
//           <p>ID: {message.messageId}</p>
//           <p>Name: {message.name}</p>
//           <p>Description: {message.description}</p>
//           <p>Client Name: {message.clientName}</p>
//         </div>
//         <div>
//           <h4>Select Company</h4>
//           <select onChange={(e) => setSelectedCompany(e.target.value)}>
//             <option value="">Select Company</option>
//             {companies.map((company) => (
//               <option key={company.mId} value={company.mId}>
//                 {company.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <h4>Select Users</h4>
//           <ul>
//             {users.map((user) => (
//               <li key={user.uId}>
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.includes(user.uId)}
//                   onChange={() => handleUserSelect(user.uId)}
//                 />
//                 {user.firstname} {user.secondname} ({user.email})
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button onClick={handleAssign}>Assign</button>
//       </div>
//     </div>
//   );
// };

// export default AssignmentModal;