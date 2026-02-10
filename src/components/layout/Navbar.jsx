import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineTicket,
  HiOutlineCog,
  HiOutlineViewGrid,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/calendar', label: 'Calendar' },
  ];

  const renderNavLinks = (onClick) =>
    navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === '/'}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        {link.label}
      </NavLink>
    ));

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">E</span>
            <span className="brand-text">EventHub</span>
          </Link>

          {/* Desktop nav links */}
          <div className="navbar-links-desktop">
            {renderNavLinks(undefined)}
            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Admin
              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
            </button>

            {isAuthenticated ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{user?.name}</p>
                      <p className="dropdown-user-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <HiOutlineTicket /> My Bookings
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <HiOutlineUser /> Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <HiOutlineViewGrid /> Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <HiOutlineLogout /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu rendered OUTSIDE <nav> to avoid backdrop-filter stacking context */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`}>
        {renderNavLinks(() => setMobileOpen(false))}
        {isAuthenticated && isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </NavLink>
        )}
        <div className="mobile-menu-divider" />
        {isAuthenticated ? (
          <>
            <Link to="/bookings" className="nav-link" onClick={() => setMobileOpen(false)}>
              My Bookings
            </Link>
            <Link to="/profile" className="nav-link" onClick={() => setMobileOpen(false)}>
              Profile
            </Link>
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
