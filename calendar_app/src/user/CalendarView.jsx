import React, { useState } from 'react';

const CalendarView = () => {
    const [view, setView] = useState('month');

    return (
        <div className="calendar-view">
            <h2>Calendar</h2>
            <div className="view-toggle">
                <button onClick={() => setView('week')}>Weekly</button>
                <button onClick={() => setView('month')}>Monthly</button>
            </div>
            <div className={`calendar ${view}`}>
                {view === 'month' ? (
                    <p>Month View - Placeholder for Calendar</p>
                ) : (
                    <p>Week View - Placeholder for Calendar</p>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
