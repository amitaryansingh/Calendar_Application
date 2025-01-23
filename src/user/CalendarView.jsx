
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
        return { style: { border: "1px solid #ff0000" } }; // Red border for unseen past
      }
  
      if (hasUnseenTodayEvents) {
        return { style: { border: "1px solid #ffcc00" } }; // Yellow border for unseen today
      }
  
      if (hasFutureEvents) {
        return { style: { border: "1px solid #007bff" } }; // Blue border for future
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
        style={{ height: 600, width: 1300, margin: "0px" }}
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
