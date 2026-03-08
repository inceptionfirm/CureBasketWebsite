// Overview Section - Visit more: page-specific links, dynamic counts, aligned layout
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Grid, Mail, BookOpen } from 'lucide-react';
import './OverviewSection.css';

const OverviewSection = ({ medicines = [], categories = [], blogs = [] }) => {
  const cards = [
    { to: '/products', label: 'View All Medicines', count: medicines.length, suffix: 'Available', desc: 'Browse our complete range of pharmaceutical products', Icon: Package, className: 'medicines' },
    { to: '/categories', label: 'Browse Categories', count: categories.length, suffix: 'Categories', desc: 'Explore products by category', Icon: Grid, className: 'categories' },
    { to: '/contact', label: 'Contact Us', count: null, suffix: '', desc: 'Get in touch with us', Icon: Mail, className: 'contact' },
    { to: '/blogs', label: 'Visit Blog', count: blogs.length, suffix: 'Posts', desc: 'Health tips and updates', Icon: BookOpen, className: 'blogs' },
  ];

  return (
    <section className="overview-section">
      <div className="container">
        <h2 className="overview-heading">Visit more</h2>
        <div className="overview-grid">
          {cards.map(({ to, label, count, suffix, desc, Icon, className }) => (
            <div key={className} className="overview-card">
              <div className={`overview-icon ${className}`}>
                <Icon size={32} />
              </div>
              <div className="overview-content">
                <h3>{className.charAt(0).toUpperCase() + className.slice(1)}</h3>
                {count != null && suffix ? <p className="overview-count">{count} {suffix}</p> : null}
                <p className="overview-desc">{desc}</p>
                <Link to={to} className="overview-btn">
                  {label} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
