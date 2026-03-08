import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Package,
  ShoppingCart,
  CreditCard,
  FileText,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import './HowToOrder.css';

const steps = [
  {
    step: 1,
    title: 'Find your medication',
    icon: <Search size={28} />,
    description:
      'We have a products page where you can browse medicines by category or use our search bar to find the exact medication you need.',
    cta: 'Browse medicines',
    to: '/products',
  },
  {
    step: 2,
    title: 'Select dosage and quantity',
    icon: <Package size={28} />,
    description:
      'On each medicine page we show the strength and options available. Select the dosage your doctor prescribed and the quantity you need, then add it to your cart.',
    cta: 'View products',
    to: '/products',
  },
  {
    step: 3,
    title: 'Add to cart',
    icon: <ShoppingCart size={28} />,
    description:
      'We have a cart where you can review your selections. Add all the items you need, then go to checkout when you are ready.',
    cta: 'Go to cart',
    to: '/cart',
  },
  {
    step: 4,
    title: 'Complete checkout',
    icon: <CreditCard size={28} />,
    description:
      'We have a simple checkout process. Review your cart, then proceed to billing. If you have an account you can sign in; if not, you can create one. Enter your payment and shipping details, review our terms and privacy policy, and submit your order.',
    cta: 'Checkout',
    to: '/checkout',
  },
  {
    step: 5,
    title: 'Send us your prescription',
    icon: <FileText size={28} />,
    description:
      'For prescription medicines we have an upload option on the site. You can upload your prescription document from your doctor through our prescriptions page. Our team will process it and fulfil your order.',
    cta: 'Upload prescription',
    to: '/prescriptions',
  },
];

const HowToOrder = () => {
  const { state } = useApp();
  const { siteConfig } = state;
  const name = siteConfig?.name ?? 'Cure Basket';
  const contact = siteConfig?.contact ?? {};
  const phone = contact.phone ?? '';
  const email = contact.email ?? '';

  return (
    <div className="how-to-order-page">
      <div className="how-to-order-container">
        <header className="how-to-order-header">
          <h1 className="how-to-order-title">How to Order</h1>
          <p className="how-to-order-intro">
            With just 5 simple steps you can order your medication online. We also have a contact option—you can reach out to us and our team is happy to help. Otherwise, follow the steps below.
          </p>
        </header>

        <div className="how-to-order-options">
          <div className="how-to-order-option primary">
            <span className="how-to-order-option-label">Order online</span>
            <p>Use our website to browse, add to cart, and checkout.</p>
          </div>
          {(phone || email) && (
            <div className="how-to-order-option">
              <span className="how-to-order-option-label">Contact us</span>
              <p>Reach out for help or to place an order with our team.</p>
              <Link to="/contact" className="how-to-order-option-link">
                Contact <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        <section className="how-to-order-steps">
          <h2 className="how-to-order-steps-heading">Steps to order</h2>
          {steps.map((item) => (
            <div key={item.step} className="how-to-order-step">
              <div className="how-to-order-step-number">
                <span className="how-to-order-step-num">{item.step}</span>
                <div className="how-to-order-step-icon">{item.icon}</div>
              </div>
              <div className="how-to-order-step-content">
                <h3 className="how-to-order-step-title">
                  Step {item.step}: {item.title}
                </h3>
                <p className="how-to-order-step-desc">{item.description}</p>
                <Link to={item.to} className="how-to-order-step-cta">
                  {item.cta}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="how-to-order-cta">
          <div className="how-to-order-cta-inner">
            <CheckCircle2 size={32} className="how-to-order-cta-icon" />
            <h2 className="how-to-order-cta-title">Ready to get started?</h2>
            <p className="how-to-order-cta-desc">
              We have everything you need to order online. Browse our medicines or contact us if you have questions.
            </p>
            <div className="how-to-order-cta-buttons">
              <Link to="/products" className="btn btn-primary how-to-order-cta-btn">
                Browse medicines
              </Link>
              <Link to="/contact" className="btn btn-outline how-to-order-cta-btn">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToOrder;
