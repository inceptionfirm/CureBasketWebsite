import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import './Contact.css';

const Contact = () => {
  const { state } = useApp();
  const { siteConfig } = state;
  const [contactDetails, setContactDetails] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: 'idle', message: '' }); // idle | sending | success | error

  // Fetch contact us details from API
  useEffect(() => {
    const fetchContactUs = async () => {
      try {
        setContactLoading(true);
        setContactError(null);
        const res = await apiService.getContactUs();
        if (res.success && res.data) {
          setContactDetails(res.data);
        }
      } catch (err) {
        setContactError(err.message || 'Failed to load contact details');
      } finally {
        setContactLoading(false);
      }
    };
    fetchContactUs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const splitFullName = (fullName = '') => {
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { firstName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'sending', message: '' });
    try {
      const { firstName, lastName } = splitFullName(formData.name);
      const payload = {
        firstName,
        lastName,
        phoneNumber: formData.phone || '',
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };
      const res = await apiService.submitContactMessage(payload);
      if (res.success) {
        setSubmitStatus({ type: 'success', message: res.message || 'Message sent successfully. We\'ll get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: res.error || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    }
  };

  // Use API contact details when available, else fallback to siteConfig
  const phone = contactDetails?.phone != null ? String(contactDetails.phone) : (siteConfig?.contact?.phone ?? '');
  const email = contactDetails?.email ?? siteConfig?.contact?.email ?? '';
  const address = contactDetails?.address ?? siteConfig?.contact?.address ?? '';
  const pincode = contactDetails?.pincode != null ? String(contactDetails.pincode) : '';
  const hours = (contactDetails?.hours != null && String(contactDetails.hours).trim() !== '') ? String(contactDetails.hours).trim() : (siteConfig?.contact?.hours ?? 'Mon-Fri: 8AM-8PM');

  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      details: phone,
      description: 'Call us for immediate assistance'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      details: email,
      description: 'Send us an email anytime'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Address',
      details: pincode ? `${address}${address ? ', ' : ''}${pincode}` : address,
      description: 'Visit our pharmacy location'
    },
    {
      icon: <Clock size={24} />,
      title: 'Hours',
      details: hours,
      description: 'Our operating hours'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p>Get in touch with our team for any questions or assistance</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            {contactLoading && <p className="contact-loading">Loading contact details...</p>}
            {contactError && !contactLoading && <p className="contact-error">{contactError}</p>}
            <p>
              We're here to help you with all your pharmaceutical needs. 
              Reach out to us through any of the following methods.
            </p>

            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">
                    {method.icon}
                  </div>
                  <div className="method-details">
                    <h3>{method.title}</h3>
                    <p className="method-info">{method.details}</p>
                    <p className="method-description">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="emergency-contact">
              <h3>Emergency Prescription Service</h3>
              <p>
                Need urgent medication? Our emergency service is available 24/7 
                for critical prescriptions and medical emergencies.
              </p>
              <button className="btn btn-primary">
                <Phone size={16} />
                Call Emergency Line
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="prescription">Prescription Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="delivery">Delivery Question</option>
                    <option value="product">Product Information</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your inquiry in detail..."
                  required
                ></textarea>
              </div>

              {submitStatus.type === 'success' && (
                <p className="contact-form-success">{submitStatus.message}</p>
              )}
              {submitStatus.type === 'error' && (
                <p className="contact-form-error">{submitStatus.message}</p>
              )}
              <button type="submit" className="btn btn-primary" disabled={submitStatus.type === 'sending'}>
                <Send size={16} />
                {submitStatus.type === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I upload a prescription?</h3>
              <p>
                You can upload your prescription by taking a clear photo or scanning 
                the document. Visit our Prescriptions page to get started.
              </p>
            </div>
            <div className="faq-item">
              <h3>How long does delivery take?</h3>
              <p>
                Standard delivery takes 2-3 business days. Express delivery is 
                available for urgent orders within 24 hours.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you accept insurance?</h3>
              <p>
                Yes, we accept most major insurance plans. Contact us to verify 
                your coverage and benefits.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I speak to a pharmacist?</h3>
              <p>
                Absolutely! Our licensed pharmacists are available for consultation 
                via phone, chat, or in-person visits.
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <MapPin size={48} />
              <h3>Our Location</h3>
              <p>{pincode ? `${address}${address ? ', ' : ''}${pincode}` : address}</p>
              <button className="btn btn-secondary">
                Get Directions
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
