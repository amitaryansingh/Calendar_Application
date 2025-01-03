import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { saveAs } from "file-saver";
import {
  getMessagesByUserIdForUser,
  getUnseenMessagesByUser,
} from "../authentication/aapi";

const Report = () => {
  const [communicationFrequency, setCommunicationFrequency] = useState({});
  const [engagementMetrics, setEngagementMetrics] = useState({});
  const [overdueTrends, setOverdueTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const allMessagesResponse = await getMessagesByUserIdForUser(user_id);
        const allMessages = Array.isArray(allMessagesResponse.data)
          ? allMessagesResponse.data
          : [];

        const frequency = {};
        const engagement = {};
        const overdue = {};

        allMessages.forEach((message) => {
          const { method, date, isOverdue, isSuccessful } = message;
          frequency[method] = (frequency[method] || 0) + 1;
          engagement[method] = (engagement[method] || 0) + (isSuccessful ? 1 : 0);

          if (isOverdue) {
            const dateKey = new Date(date).toLocaleDateString();
            overdue[dateKey] = (overdue[dateKey] || 0) + 1;
          }
        });

        setCommunicationFrequency(frequency);
        setEngagementMetrics(engagement);
        setOverdueTrends(Object.entries(overdue));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Reporting and Analytics</h1>

      {/* Communication Frequency */}
      <div>
        <h2>Communication Frequency</h2>
        {Object.keys(communicationFrequency).length > 0 ? (
          <Bar
            data={{
              labels: Object.keys(communicationFrequency),
              datasets: [
                {
                  label: "Frequency",
                  data: Object.values(communicationFrequency),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        ) : (
          <p>No data available for Communication Frequency.</p>
        )}
      </div>

      {/* Engagement Effectiveness */}
      <div>
        <h2>Engagement Effectiveness</h2>
        {Object.keys(engagementMetrics).length > 0 ? (
          <Pie
            data={{
              labels: Object.keys(engagementMetrics),
              datasets: [
                {
                  data: Object.values(engagementMetrics),
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            }}
          />
        ) : (
          <p>No data available for Engagement Effectiveness.</p>
        )}
      </div>

      {/* Overdue Communication Trends */}
      <div>
        <h2>Overdue Communication Trends</h2>
        {overdueTrends.length > 0 ? (
          <ul>
            {overdueTrends.map(([date, count]) => (
              <li key={date}>
                {date}: {count} overdue communications
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available for Overdue Communication Trends.</p>
        )}
      </div>
    </div>
  );
};

export default Report;
