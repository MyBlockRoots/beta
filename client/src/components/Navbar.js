import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="My Block Roots Logo" height="40" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {currentUser && (
          <>
            <Link to="/upload-gedcom">Upload GEDCOM</Link>
            <Link to="/family-tree">Family Tree</Link>
          </>
        )}
      </div>
      <div className="auth-buttons">
        {currentUser ? (
          <>
            <span style={{ color: 'var(--primary-color)', marginRight: '15px' }}>
              Welcome, {currentUser.username}
            </span>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 