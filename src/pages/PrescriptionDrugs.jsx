import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Phone,
  ShoppingCart,
  CreditCard,
  FileText,
  Search,
  Shield,
  Truck,
  ArrowRight,
} from 'lucide-react';
import './PrescriptionDrugs.css';

const flowSteps = [
  {
    icon: <Search size={28} />,
    title: 'Browse & find',
    description: 'Search or browse our prescription medicines by category. View brand name and generic options with clear pricing.',
    link: '/products?prescription=yes',
    linkText: 'Browse prescription medicines',
  },
  {
    icon: <ShoppingCart size={28} />,
    title: 'Add to cart',
    description: 'Choose the strength and quantity you need. Add items to your cart and continue shopping or go straight to checkout.',
    link: '/cart',
    linkText: 'View cart',
  },
  {
    icon: <CreditCard size={28} />,
    title: 'Checkout',
    description: 'Review your order, enter shipping and payment details. Sign in or create an account—then place your order.',
    link: '/checkout',
    linkText: 'Go to checkout',
  },
  {
    icon: <FileText size={28} />,
    title: 'Send your prescription',
    description: 'For prescription items, upload your doctor’s prescription via our upload page. We process orders within 1 business day.',
    link: '/prescriptions',
    linkText: 'Upload prescription',
  },
];

const PrescriptionDrugs = () => {
  const { state } = useApp();
  const siteConfig = state.siteConfig || {};
  const contact = siteConfig.contact || {};
  const phone = contact.phone || '';

  return (
    <div className="prescription-drugs-page">
      {/* Hero - full width */}
      <section className="prescription-drugs-hero">
        <div className="prescription-drugs-wrap">
          <div className="prescription-drugs-hero-inner">
            <span className="prescription-drugs-badge">Prescription medicines</span>
            <h1 className="prescription-drugs-title">Prescription Drugs</h1>
            <p className="prescription-drugs-subtitle">
              Brand name and generic options, delivered with care. Order online or speak with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Intro - full width container */}
      <section className="prescription-drugs-intro-section">
        <div className="prescription-drugs-wrap">
          <div className="prescription-drugs-intro-card">
            <p className="prescription-drugs-intro-lead">
              We offer brand name and generic options for prescription medication. Our pharmacy makes it easy to order prescription and over-the-counter medications online.
            </p>
            <p>
              Browse our <Link to="/products?prescription=yes">prescription medicines</Link> or view <Link to="/products?prescription=no">over-the-counter products</Link>. When you find the medication you need, you’ll see pricing and options—add to cart, then checkout. For prescription items, upload your prescription through our site. Need help? Remove items from your cart anytime, or call us to place an order or speak with a pharmacist.
            </p>
          </div>
        </div>
      </section>

      {/* How it works - flow steps */}
      <section className="prescription-drugs-flow">
        <div className="prescription-drugs-wrap">
          <h2 className="prescription-drugs-flow-title">How it works</h2>
          <p className="prescription-drugs-flow-subtitle">
            Order prescription medicines in four simple steps.
          </p>
          <div className="prescription-drugs-flow-grid">
            {flowSteps.map((step, index) => (
              <div key={index} className="prescription-drugs-flow-card">
                <div className="prescription-drugs-flow-number">{index + 1}</div>
                <div className="prescription-drugs-flow-icon">{step.icon}</div>
                <h3 className="prescription-drugs-flow-card-title">{step.title}</h3>
                <p className="prescription-drugs-flow-card-desc">{step.description}</p>
                <Link to={step.link} className="prescription-drugs-flow-link">
                  {step.linkText}
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why order with us - trust strip */}
      <section className="prescription-drugs-trust">
        <div className="prescription-drugs-wrap">
          <div className="prescription-drugs-trust-grid">
            <div className="prescription-drugs-trust-item">
              <Shield size={32} />
              <span>Licensed pharmacy</span>
            </div>
            <div className="prescription-drugs-trust-item">
              <Truck size={32} />
              <span>Delivery to your door</span>
            </div>
            <div className="prescription-drugs-trust-item">
              <Pill size={32} />
              <span>Brand & generic options</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - full width */}
      <section className="prescription-drugs-cta-section">
        <div className="prescription-drugs-wrap">
          <div className="prescription-drugs-cta-inner">
            <h2 className="prescription-drugs-cta-title">Ready to order?</h2>
            <p className="prescription-drugs-cta-desc">
              Browse our full range of prescription medicines or get in touch if you have questions.
            </p>
            <div className="prescription-drugs-cta-buttons">
              <Link to="/products?prescription=yes" className="prescription-drugs-cta-btn primary">
                <Pill size={22} />
                Browse prescription medicines
              </Link>
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="prescription-drugs-cta-btn secondary">
                  <Phone size={20} />
                  Call {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrescriptionDrugs;
