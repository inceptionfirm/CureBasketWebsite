import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Pill, FileText, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import logo from '../assets/images/logo.png';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, logout } = useApp();
  const { cartCount, isAuthenticated } = state;

  const handleLogout = async () => {
    await apiService.logout();
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="FlyCanary Logo" className="logo-image" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/how-to-order" className="nav-link">How to Order</Link>
          <Link to="/products" className="nav-link">
            <Pill size={16} />
            Medicines
          </Link>
          <Link to="/prescriptions" className="nav-link">
            <FileText size={16} />
            Prescriptions
          </Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/blogs" className="nav-link">Blog</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
          />
          <Search className="search-icon" />
        </div>

        {/* Right Side Icons */}
        <div className="header-actions">
          {isAuthenticated ? (
            <Link to="/account" className="action-icon" title="Profile">
              <User size={24} />
            </Link>
          ) : (
            <Link to="/login" className="action-icon" title="Login">
              <User size={24} />
            </Link>
          )}
          <Link to="/cart" className="action-icon cart-icon">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Home</Link>
          <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>About Us</Link>
          <Link to="/how-to-order" className="mobile-nav-link" onClick={toggleMenu}>How to Order</Link>
          <Link to="/products" className="mobile-nav-link" onClick={toggleMenu}>
            <Pill size={16} />
            Medicines
          </Link>
          <Link to="/prescriptions" className="mobile-nav-link" onClick={toggleMenu}>
            <FileText size={16} />
            Prescriptions
          </Link>
          <Link to="/categories" className="mobile-nav-link" onClick={toggleMenu}>Categories</Link>
          <Link to="/blogs" className="mobile-nav-link" onClick={toggleMenu}>Blog</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={toggleMenu}>Contact</Link>
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="mobile-nav-link logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={toggleMenu}>Login</Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
