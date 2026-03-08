import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Phone,
  ShoppingCart,
  CreditCard,
  Search,
  Shield,
  Truck,
  ArrowRight,
} from 'lucide-react';
import './OverTheCounter.css';

const flowSteps = [
  {
    icon: <Search size={28} />,
    title: 'Browse & find',
    description: 'Search or browse our over-the-counter products by category. Find the medication or product you need with clear pricing.',
    link: '/products?prescription=no',
    linkText: 'Browse OTC products',
  },
  {
    icon: <ShoppingCart size={28} />,
    title: 'Add to cart',
    description: 'Choose the quantity you need and add items to your cart. Continue shopping or go straight to checkout.',
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
    icon: <Truck size={28} />,
    title: 'Delivered',
    description: 'We deliver your order right to your doorstep. No prescription needed for over-the-counter products.',
    link: '/products?prescription=no',
    linkText: 'Shop OTC',
  },
];

const OverTheCounter = () => {
  const { state } = useApp();
  const siteConfig = state.siteConfig || {};
  const contact = siteConfig.contact || {};
  const phone = contact.phone || '';

  return (
    <div className="otc-page">
      {/* Hero - full width */}
      <section className="otc-hero">
        <div className="otc-wrap">
          <div className="otc-hero-inner">
            <span className="otc-badge">No prescription needed</span>
            <h1 className="otc-title">Over The Counter Drugs</h1>
            <p className="otc-subtitle">
              A wide selection of over-the-counter products. Order online and get it delivered to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="otc-intro-section">
        <div className="otc-wrap">
          <div className="otc-intro-card">
            <p className="otc-intro-lead">
              We offer a wide selection of over-the-counter products. Search for the product name on our products page or browse by category.
            </p>
            <p>
              When you find what you need, add it to your cart and use our checkout to place your order. We’ll deliver it right to your doorstep. No prescription required for OTC products. Need help? <Link to="/contact">Contact us</Link> or call us—we’re happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="otc-flow">
        <div className="otc-wrap">
          <h2 className="otc-flow-title">How it works</h2>
          <p className="otc-flow-subtitle">
            Buy over-the-counter products in a few simple steps.
          </p>
          <div className="otc-flow-grid">
            {flowSteps.map((step, index) => (
              <div key={index} className="otc-flow-card">
                <div className="otc-flow-number">{index + 1}</div>
                <div className="otc-flow-icon">{step.icon}</div>
                <h3 className="otc-flow-card-title">{step.title}</h3>
                <p className="otc-flow-card-desc">{step.description}</p>
                <Link to={step.link} className="otc-flow-link">
                  {step.linkText}
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="otc-trust">
        <div className="otc-wrap">
          <div className="otc-trust-grid">
            <div className="otc-trust-item">
              <Shield size={32} />
              <span>Safe & trusted</span>
            </div>
            <div className="otc-trust-item">
              <Truck size={32} />
              <span>Delivery to your door</span>
            </div>
            <div className="otc-trust-item">
              <Pill size={32} />
              <span>Wide OTC selection</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="otc-cta-section">
        <div className="otc-wrap">
          <div className="otc-cta-inner">
            <h2 className="otc-cta-title">Shop over-the-counter</h2>
            <p className="otc-cta-desc">
              Browse our full range of non-prescription products or get in touch if you have questions.
            </p>
            <div className="otc-cta-buttons">
              <Link to="/products?prescription=no" className="otc-cta-btn primary">
                <Pill size={22} />
                Browse OTC products
              </Link>
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="otc-cta-btn secondary">
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

export default OverTheCounter;
