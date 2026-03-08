import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/images/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="FlyCanary Logo" className="footer-logo-image" />
          </div>
          <p className="footer-description">
            Your trusted partner for quality products and exceptional service.
            We're committed to providing the best shopping experience.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/how-to-order" className="footer-link">How to Order</Link></li>
            <li><Link to="/products" className="footer-link">Medicines</Link></li>
            <li><Link to="/prescriptions" className="footer-link">Prescriptions</Link></li>
            <li><Link to="/categories" className="footer-link">Categories</Link></li>
            <li><Link to="/blogs" className="footer-link">Blog</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* Shop */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Shop</h4>
          <ul className="footer-links">
            <li><Link to="/prescription-drugs" className="footer-link">Buy Prescription Drugs</Link></li>
            <li><Link to="/over-the-counter" className="footer-link">Buy Non-prescription Drugs</Link></li>
            <li><Link to="/prescriptions" className="footer-link">Re-Order</Link></li>
            <li><Link to="/how-to-order" className="footer-link">How to Order</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Information</h4>
          <ul className="footer-links">
            <li><Link to="/blogs" className="footer-link">Blog</Link></li>
            <li><Link to="/terms" className="footer-link">Terms of Use</Link></li>
            <li><Link to="/terms-of-sale" className="footer-link">Terms of Sale</Link></li>
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/medical-directory" className="footer-link">Medical Directory</Link></li>
            <li><Link to="/reviews" className="footer-link">Reviews</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/products" className="footer-link">Products</Link></li>
            <li><Link to="/categories" className="footer-link">Categories</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info - one horizontal line */}
        <div className="footer-section footer-contact-section">
          <h4 className="footer-subtitle">Contact Info</h4>
          <div className="footer-contact-one-line">
            <span className="footer-contact-item">
              <MapPin size={14} />
              123 Business Street, City, State 12345
            </span>
            <span className="footer-contact-item">
              <Phone size={14} />
              1-833-781-5773
            </span>
            <span className="footer-contact-item">
              <Mail size={14} />
              info@curebasket.com
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            © 2025 Cure Basket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
