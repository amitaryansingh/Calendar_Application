import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../userstyles/CalendarView.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getUserProfile,
  getUnseenMessagesByUser ,
  getMessagesByUserIdForUser ,
  getCompanyByCompanyIdForUser ,
} from "../authentication/aapi";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const handleEventClick = (event) => {
    setPopupContent(event.message);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");

        // Fetch user profile
        const profile = await getUserProfile(user_id);
        console.log("User  Profile:", profile); // Debugging step
        setUserProfile(profile);

        // Fetch unseen messages
        const unseenMessagesResponse = await getUnseenMessagesByUser (user_id);
        console.log("Unseen Messages:", unseenMessagesResponse.data); // Debugging step
        const unseenMessages = Array.isArray(unseenMessagesResponse.data)
          ? unseenMessagesResponse.data
          : [];

        // Fetch all messages
        const allMessagesResponse = await getMessagesByUserIdForUser (user_id);
        console.log("All Messages:", allMessagesResponse.data); // Debugging step
        const allMessages = Array.isArray(allMessagesResponse.data)
          ? allMessagesResponse.data
          : [];

        // Format events
        const formattedEvents = await Promise.all(allMessages.map(async (message) => {
          const isUnseen = unseenMessages.some(
            (unseen) => unseen.messageId === message.messageId
          );

          // Fetch company details
          const companyDetails = await getCompanyByCompanyIdForUser (message.companyId);
          console.log("Company Details:", companyDetails); // Debugging step

          return {
            id: message.messageId,
            title: message.name,
            start: new Date(message.date),
            end: new Date(message.date),
            allDay: true,
            color: isUnseen ? "#FFD700" : "#90EE90",
            message,
            company: companyDetails, // Include company details in the event
          };
        }));

        console.log("Formatted Events:", formattedEvents); // Debugging step
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const eventPropGetter = (event) => ({
    style: { backgroundColor: event.color },
  });

  const dayPropGetter = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    const hasEvent = events.some(event => moment(event.start).format('YYYY-MM-DD') === dateString);
    return hasEvent ? { style: { border: '2px solid black' } } : {};
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">Calendar View</h1> {/* Added Heading */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width:900, margin: "0px" }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        onSelectEvent={handleEventClick}
      />

      {/* {showPopup && (
        <div className="popup">
          <div className="popup-header">
            {popupContent.company && (
              <img
                src={popupContent.company.logoUrl}
                alt={popupContent.company.name}
              />
            )}
            <h3>{popupContent.company?.name || "No Company Info"}</h3>
          </div>
          <div className="popup-body">
            <p><strong>Message:</strong> {popupContent.description}</p>
            <p><strong>Date:</strong> {popupContent.date}</p>
            <p><strong>Priority:</strong> {popupContent.priorityLevel}</p>
            <p ><strong>Sender:</strong> {popupContent.clientName} {popupContent.designation} </p>
          </div>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )} */}

{showPopup && (
  <div className="popup">
    <div className="popup-header">
      {popupContent?.company?.data?.logoUrl && (
        <img
          src={popupContent.company.data.logoUrl}
          alt={popupContent.company.data.name || "Company Logo"}
        />
      )}
      <h3>{popupContent?.company?.data?.name || "No Company Info"}</h3>
    </div>
    <div className="popup-body">
      <p><strong>Message:</strong> {popupContent?.description}</p>
      <p><strong>Date:</strong> {popupContent?.date}</p>
      <p><strong>Priority:</strong> {popupContent?.priorityLevel}</p>
      <p><strong>Sender:</strong> {popupContent?.clientName} {popupContent?.designation}</p>
    </div>
    <button onClick={() => setShowPopup(false)}>Close</button>
  </div>
)}

    </div>
  );
};

export default CalendarView;