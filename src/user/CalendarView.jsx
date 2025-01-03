// import React, { useEffect, useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "../userstyles/CalendarView.css";

// import {
//   getUserProfile,
//   getUnseenMessagesByUser ,
//   getMessagesByUserIdForUser ,
//   getCompanyByCompanyIdForUser ,
// } from "../authentication/aapi";

// const localizer = momentLocalizer(moment);

// const CalendarView = () => {
//   const [events, setEvents] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupContent, setPopupContent] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const user_id = localStorage.getItem("user_id");

//         // Fetch user profile
//         const profile = await getUserProfile(user_id);
//         console.log("User  Profile:", profile); // Debugging step
//         setUserProfile(profile);

//         // Fetch unseen messages
//         const unseenMessagesResponse = await getUnseenMessagesByUser (user_id);
//         console.log("Unseen Messages:", unseenMessagesResponse.data); // Debugging step
//         const unseenMessages = Array.isArray(unseenMessagesResponse.data)
//           ? unseenMessagesResponse.data
//           : [];

//         // Fetch all messages
//         const allMessagesResponse = await getMessagesByUserIdForUser (user_id);
//         console.log("All Messages:", allMessagesResponse.data); // Debugging step
//         const allMessages = Array.isArray(allMessagesResponse.data)
//           ? allMessagesResponse.data
//           : [];

//         // Format events
//         const formattedEvents = await Promise.all(allMessages.map(async (message) => {
//           const isUnseen = unseenMessages.some(
//             (unseen) => unseen.messageId === message.messageId
//           );

//           // Fetch company details
//           const companyDetails = await getCompanyByCompanyIdForUser (message.companyId);
//           console.log("Company Details:", companyDetails); // Debugging step

//           return {
//             id: message.messageId,
//             title: message.name,
//             start: new Date(message.date),
//             end: new Date(message.date),
//             allDay: true,
//             color: isUnseen ? "#FFD700" : "#90EE90",
//             message,
//             company: companyDetails, // Include company details in the event
//           };
//         }));

//         console.log("Formatted Events:", formattedEvents); // Debugging step
//         setEvents(formattedEvents);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleEventClick = (event) => {
//     setPopupContent(event.message);
//     setShowPopup(true);
//   };

//   const eventPropGetter = (event) => ({
//     style: { backgroundColor: event.color },
//   });

//   const dayPropGetter = (date) => {
//     const dateString = moment(date).format('YYYY-MM-DD');
//     const hasEvent = events.some(event => moment(event.start).format('YYYY-MM-DD') === dateString);
//     return hasEvent ? { style: { border: '2px solid blue' } } : {};
//   };

//   return (
//     <div className="calendar-container">
//       <h1 className="calendar-heading">Calendar View</h1> {/* Added Heading */}
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 500, width: 1100, margin: "50px" }}
//         eventPropGetter={eventPropGetter}
//         dayPropGetter={dayPropGetter}
//         onSelectEvent={handleEventClick}
//       />

//       {showPopup && (
//         <div className="popup">
//           <div className="popup-header">
//             {popupContent.company && (
//               <img
//                 src={popupContent[0].company.logoUrl}
//                 alt={popupContent[0].company.name}
//               />
//             )}
//             <h3>{popupContent[0]?.company?.data?.name || "No Company Info"}</h3>
//           </div>
//           <div className="popup-body">
//             <p><strong>Message:</strong> {popupContent.description}</p>
//             <p><strong>Date:</strong> {popupContent.date}</p>
//             <p><strong>Priority:</strong> {popupContent.priorityLevel}</p>
//             <p><strong>Sender:</strong> {popupContent.senderName}</p>
//           </div>
//           <button onClick={() => setShowPopup(false)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CalendarView;


import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../userstyles/CalendarView.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getUserProfile,
  getUnseenMessagesByUser,
  getMessagesByUserIdForUser,
  getCompanyByCompanyIdForUser,
  getSeenStatusByMessageIDAndUserID,
} from "../authentication/aapi";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const handleEventClick = (event) => {
    const selectedEvents = events.filter(
      (e) => moment(e.start).isSame(moment(event.start), "day")
    );
    setPopupContent(selectedEvents);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");

        const profile = await getUserProfile(user_id);
        setUserProfile(profile);

        const allMessagesResponse = await getMessagesByUserIdForUser(user_id);
        const allMessages = Array.isArray(allMessagesResponse.data)
          ? allMessagesResponse.data
          : [];

        const formattedEvents = await Promise.all(
          allMessages.map(async (message) => {
            const seenStatusResponse = await getSeenStatusByMessageIDAndUserID(
              message.messageId,
              user_id
            );
            const isSeen = seenStatusResponse.data;

            const companyDetails = await getCompanyByCompanyIdForUser(
              message.companyId
            );

            return {
              id: message.messageId,
              title: message.name,
              start: new Date(message.date),
              end: new Date(message.date),
              allDay: true,
              isSeen,
              message,
              company: companyDetails || {},
            };
          })
        );

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const eventPropGetter = (event) => ({
    style: { backgroundColor: event.isSeen ? "#90EE90" : "#ba8e23" },
  });

  const dayPropGetter = (date) => {
    const today = moment().startOf("day");
    const eventsOnDate = events.filter((event) =>
      moment(event.start).isSame(moment(date), "day")
    );
  
    if (eventsOnDate.length > 0) {
      const hasUnseenPastEvents = eventsOnDate.some(
        (event) => !event.isSeen && moment(event.start).isBefore(today)
      );
      const hasUnseenTodayEvents = eventsOnDate.some(
        (event) => !event.isSeen && moment(event.start).isSame(today, "day")
      );
      const hasFutureEvents = eventsOnDate.some((event) =>
        moment(event.start).isAfter(today)
      );
  
      if (hasUnseenPastEvents) {
        return { style: { border: "3px solid #ff0000" } }; // Red border for unseen past
      }
  
      if (hasUnseenTodayEvents) {
        return { style: { border: "3px solid #ffcc00" } }; // Yellow border for unseen today
      }
  
      if (hasFutureEvents) {
        return { style: { border: "3px solid #007bff" } }; // Blue border for future
      }
    }
  
    return {};
  };
  
  

  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">Calendar View</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: 1100, margin: "0px" }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        onSelectEvent={handleEventClick}
      />

      {showPopup && popupContent && popupContent.length > 0 && (
        <div className="popup">
          <div className="popup-body">
            {popupContent.map((event) => (
              <div key={event.id} className="popup-section">
                <div className="company-info">
                  {event.company?.data?.logoUrl && (
                    <img
                      src={event.company.data.logoUrl}
                      alt={event.company.data.name || "Company Logo"}
                      className="company-logo"
                    />
                  )}
                  <h3>{event.company?.data?.name || "No Company Info"}</h3>
                </div>
                <div className="message-details">
                  <p>
                    <strong>Message:</strong>{" "}
                    {event.message.description || "No description available"}
                  </p>
                  <p>
                    <strong>Date:</strong> {event.message.date || "N/A"}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    {event.message.priorityLevel || "Normal"}
                  </p>
                  <p>
                    <strong>Sender:</strong> {event.message.clientName || "Unknown"}{" "}
                    {event.message.designation || "N/A"}
                  </p>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <button onClick={() => setShowPopup(false)} className="close-popup-btn">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
