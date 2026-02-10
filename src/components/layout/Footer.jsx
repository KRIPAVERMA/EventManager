import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="brand-icon">E</span>
              <span>EventHub</span>
            </Link>
            <p className="footer-desc">
              Discover and book amazing events near you. From concerts to conferences,
              find your next unforgettable experience.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/events">Browse Events</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/events?category=concert">Concerts</Link>
            <Link to="/events?category=conference">Conferences</Link>
            <Link to="/events?category=workshop">Workshops</Link>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <HiOutlineMail />
              <span>support@eventhub.com</span>
            </div>
            <div className="contact-item">
              <HiOutlinePhone />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <HiOutlineLocationMarker />
              <span>New York, NY 10001</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
