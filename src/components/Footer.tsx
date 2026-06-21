import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="restaurant-footer">
      <div className="container footer-grid">
        <div className="footer-col brand-col">
          <Link href="/" className="footer-logo">
            NITHEESHRESTUARENT
          </Link>
          <p className="footer-desc">
            An exquisite culinary sanctuary dedicated to the art of fine dining. We combine classic French techniques with contemporary innovations to create unforgettable gastronomic experiences.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Opening Hours</h4>
          <ul className="footer-list">
            <li>
              <span className="day">Wednesday - Thursday</span>
              <span className="time">5:30 PM - 10:00 PM</span>
            </li>
            <li>
              <span className="day">Friday - Saturday</span>
              <span className="time">5:30 PM - 11:00 PM</span>
            </li>
            <li>
              <span className="day">Sunday Brunch</span>
              <span className="time">11:30 AM - 3:00 PM</span>
            </li>
            <li>
              <span className="day">Monday - Tuesday</span>
              <span className="time closed">Closed</span>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Contact & Location</h4>
          <ul className="footer-list contact-list">
            <li>
              <span className="label">Address:</span>
              <span className="value">9 Place des Vosges, 75004 Paris</span>
            </li>
            <li>
              <span className="label">Reservations:</span>
              <span className="value">+33 1 42 78 51 45</span>
            </li>
            <li>
              <span className="label">Email:</span>
              <span className="value">reservations@nitheeshrestuarent.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container flex-bottom">
          <p>&copy; {new Date().getFullYear()} NitheeshRestuarent. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/admin">Admin Login</Link>
            <span className="separator">|</span>
            <Link href="/menu">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
