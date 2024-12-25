import React from 'react';
import Header from './user/Header';
import Sidebar from './user/Sidebar';
import Dashboard from './user/Dashboard';
import CalendarView from './user/CalendarView';
import Footer from './user/Footer';
import './index.css';
const App = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                
                <div className="content">
                    <Dashboard />
                    <CalendarView />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default App;
