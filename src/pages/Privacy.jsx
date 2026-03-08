import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="legal-page privacy-page">
      <div className="container">
        <Link to="/" className="legal-back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <header className="legal-header">
          <Shield size={40} className="legal-icon" />
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: February 2025</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect:</p>
            <ul>
              <li>Contact details (name, email, phone, address) when you register or place an order</li>
              <li>Prescription and health-related information you upload for order fulfilment</li>
              <li>Payment and transaction details necessary to process your orders</li>
              <li>Usage data (e.g. pages visited, device type) to improve our services</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use your data to process orders, fulfil prescriptions, communicate with you about your account and orders, improve our website and services, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>
              You may have the right to access, correct, or delete your personal data, and to object to or restrict certain processing. Contact us using the details on our Contact page to exercise these rights.
            </p>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or our data practices, please visit our <Link to="/contact">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
