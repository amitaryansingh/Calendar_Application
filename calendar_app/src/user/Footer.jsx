import React from 'react';
import '../userstyles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 Calendar APP</p>
            <ul className="footer-links">
                <li><a href="#support">Support</a></li>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </footer>
    );
};

export default Footer;
