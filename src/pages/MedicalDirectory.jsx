import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Pill, Package, Grid, Search, Phone } from 'lucide-react';
import './MedicalDirectory.css';

const directoryLinks = [
  {
    icon: <Pill size={32} />,
    title: 'Prescription Drugs',
    description: 'Browse brand name and generic prescription medications. Find the strength and quantity you need.',
    to: '/prescription-drugs',
    label: 'View prescription drugs',
  },
  {
    icon: <Package size={32} />,
    title: 'Over-the-Counter',
    description: 'Wide selection of non-prescription products. No prescription needed.',
    to: '/over-the-counter',
    label: 'View OTC products',
  },
  {
    icon: <Grid size={32} />,
    title: 'All Products',
    description: 'Search or browse our full range of medications and healthcare products.',
    to: '/products',
    label: 'Browse all products',
  },
  {
    icon: <Search size={32} />,
    title: 'Categories',
    description: 'Browse by category to find medications and products by type.',
    to: '/categories',
    label: 'Browse categories',
  },
];

const MedicalDirectory = () => {
  const { state } = useApp();
  const siteConfig = state.siteConfig || {};
  const contact = siteConfig.contact || {};
  const phone = contact.phone || '';

  return (
    <div className="medical-directory-page">
      <section className="medical-directory-hero">
        <div className="medical-directory-wrap">
          <div className="medical-directory-hero-inner">
            <span className="medical-directory-badge">Find your medications</span>
            <h1 className="medical-directory-title">Medical Directory</h1>
            <p className="medical-directory-subtitle">
              We offer a wide range of prescription and over-the-counter medications. Use this directory to find what you need—browse by category, search for a specific medication, or explore our prescription and OTC sections.
            </p>
          </div>
        </div>
      </section>

      <section className="medical-directory-intro">
        <div className="medical-directory-wrap">
          <div className="medical-directory-intro-card">
            <p>
              When you find the medication you’re looking for you will see the brand name and generic options as well as pricing. You can choose what suits your needs, add it to your cart, then continue shopping or check out and place your order. If you add the wrong item to your cart, use the remove button. Need help? Call us or use our contact page—we’re here to assist.
            </p>
          </div>
        </div>
      </section>

      <section className="medical-directory-links">
        <div className="medical-directory-wrap">
          <h2 className="medical-directory-links-title">Browse our directory</h2>
          <div className="medical-directory-grid">
            {directoryLinks.map((item, index) => (
              <Link to={item.to} key={index} className="medical-directory-card">
                <div className="medical-directory-card-icon">{item.icon}</div>
                <h3 className="medical-directory-card-title">{item.title}</h3>
                <p className="medical-directory-card-desc">{item.description}</p>
                <span className="medical-directory-card-link">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {phone && (
        <section className="medical-directory-cta">
          <div className="medical-directory-wrap">
            <p className="medical-directory-cta-text">
              <Phone size={20} />
              Questions about a medication? Call us: <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default MedicalDirectory;
