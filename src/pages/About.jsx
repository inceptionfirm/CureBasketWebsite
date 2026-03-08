import React from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  FileText,
  Truck,
  Shield,
  Heart,
  CheckCircle2,
  ArrowRight,
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import aboutBanner from '../assets/images/AboutBanner.jpg';
import aboutMission from '../assets/images/AboutMission.jpg';
import aboutVision from '../assets/images/AboutVision.jpg';
import './About.css';

const About = () => {
  const { state } = useApp();
  const { siteConfig } = state;
  const name = siteConfig?.name ?? 'Cure Basket';
  const contact = siteConfig?.contact ?? {};
  const phone = contact.phone ?? '';
  const email = contact.email ?? '';
  const address = contact.address ?? '';
  const hours = contact.hours ?? 'Mon–Fri: 8AM–8PM';

  const whatWeDo = [
    {
      icon: <Pill size={28} />,
      title: 'Prescription & OTC Medicines',
      description:
        'We offer a wide range of medications, both prescription and over-the-counter. From commonly used products to medications for rare conditions, we have it all—including products that may not be available elsewhere. Delivered right to your doorstep.',
    },
    {
      icon: <FileText size={28} />,
      title: 'Streamlined Ordering',
      description:
        'We have no middle man and no extra steps. A streamlined, personalized ordering process is the most efficient way to get your medications so you can get back to daily life.',
    },
    {
      icon: <Truck size={28} />,
      title: 'Order Your Way',
      description:
        'Whether you order online, over the phone with one of our pharmacy associates, or through the mail, we’ll make sure you get your order. Get in touch for a price quote and get started today.',
    },
  ];

  const howWeDoIt = [
    {
      icon: <Shield size={24} />,
      title: 'Licensed pharmacy',
      text: 'We are a licensed brick-and-mortar pharmacy. We handle everything in-house so we are responsible for every order.',
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: 'In-house handling',
      text: 'Everything is done in-house to ensure quality, accuracy, and accountability for every order.',
    },
    {
      icon: <Package size={24} />,
      title: 'Secure & reliable',
      text: 'Medicines are stored and handled under proper conditions so they reach you safely and in the right condition.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Patient-first',
      text: 'We work in community healthcare and have been serving as a local, neighborhood pharmacy, providing services to every one of our patients.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-banner-full">
          <img src={aboutBanner} alt={`${name} – Your trusted pharmacy`} className="about-hero-banner-img" />
          <div className="about-hero-overlay" />
          <div className="about-hero-content container">
            <p className="about-hero-label">About {name}</p>
            <h1 className="about-hero-title">
              Welcome to {name}
            </h1>
            <p className="about-hero-sub">
              Community healthcare you can trust.
            </p>
            <p className="about-hero-lead">
              {name} works in community healthcare. We have been serving as a local, neighborhood pharmacy for years, providing services to every one of our patients.
            </p>
          </div>
        </div>
      </section>

      {/* Helping you afford medications */}
      <section className="about-section about-what">
        <div className="container">
          <span className="about-section-label">How we help</span>
          <h2 className="about-section-title">Affordable medications, delivered</h2>
          <p className="about-section-intro">
            If you are having difficulty affording your medications, we want to help. We are here to provide the same service with quality and care—so you can get the medication you need without extra hassle.
          </p>
          <div className="about-cards about-what-grid">
            {whatWeDo.map((item, i) => (
              <div key={i} className="about-card about-what-card">
                <div className="about-card-icon">{item.icon}</div>
                <h3 className="about-card-title">{item.title}</h3>
                <p className="about-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission: in-house, no middleman */}
      <section className="about-section about-mission">
        <div className="container">
          <div className="about-mission-grid">
            <div className="about-mission-image-wrap">
              <img src={aboutMission} alt="Our mission – quality healthcare for all" className="about-mission-img" />
            </div>
            <div className="about-mission-content">
              <span className="about-section-label">Our approach</span>
              <h2 className="about-section-title about-mission-heading">Licensed, in-house, no middle man</h2>
              <p className="about-mission-text">
                {name} is a licensed brick-and-mortar pharmacy. We handle everything in-house to ensure we are responsible for every order.
              </p>
              <p className="about-mission-text">
                We offer a wide range of medications, both prescription and over-the-counter. Our product list ensures we have what you need—even products that are not available elsewhere. We get you the medication you need, delivered right to your doorstep.
              </p>
              <p className="about-mission-text">
                We have no middle man and no extra steps. A streamlined, personalized ordering process is the most efficient way to get your medications so you can go back to daily life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How we do it */}
      <section className="about-section about-how">
        <div className="container">
          <span className="about-section-label">How we do it</span>
          <h2 className="about-section-title">Our commitment to your care</h2>
          <p className="about-section-intro">
            We take responsibility for every order. Here’s how we work to keep your experience safe, simple, and reliable.
          </p>
          <div className="about-how-grid">
            {howWeDoIt.map((item, i) => (
              <div key={i} className="about-how-item">
                <div className="about-how-icon">{item.icon}</div>
                <h3 className="about-how-title">{item.title}</h3>
                <p className="about-how-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="about-section about-purpose">
        <div className="container">
          <div className="about-purpose-grid">
            <div className="about-purpose-content">
              <span className="about-section-label">Get started</span>
              <h2 className="about-purpose-title">
                Whether you order online, over the phone, or through the mail—we’ll make sure you get your order.
              </h2>
              <p className="about-purpose-text">
                Call or get in touch now for a price quote and get started today. We’re here to help you get the medication you need, with a simple and efficient process.
              </p>
              <Link to="/contact" className="about-cta-btn about-purpose-btn">
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="about-purpose-image-wrap">
              <img src={aboutVision} alt="Get in touch – we're here to help" className="about-purpose-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="about-section about-cta">
        <div className="container">
          <div className="about-cta-inner">
            <div className="about-cta-stats">
              <div className="about-stat">
                <span className="about-stat-num">100%</span>
                <span className="about-stat-label">In-house handling</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">No</span>
                <span className="about-stat-label">Middle man</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">Simple</span>
                <span className="about-stat-label">Ordering process</span>
              </div>
            </div>
            <div className="about-cta-box">
              <h2 className="about-cta-title">Have questions? We’re here to help.</h2>
              <p className="about-cta-desc">
                Get in touch for prescriptions, orders, or any healthcare query.
              </p>
              <div className="about-cta-contact-details">
                {phone && (
                  <p className="about-cta-contact-item">
                    <Phone size={18} />
                    <span>{phone}</span>
                  </p>
                )}
                {email && (
                  <p className="about-cta-contact-item">
                    <Mail size={18} />
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                )}
                {address && (
                  <p className="about-cta-contact-item">
                    <MapPin size={18} />
                    <span>{address}</span>
                  </p>
                )}
                {hours && (
                  <p className="about-cta-contact-item">
                    <Clock size={18} />
                    <span><strong>Hours:</strong> {hours}</span>
                  </p>
                )}
              </div>
              <Link to="/contact" className="about-cta-btn">
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Short disclaimer – no partners mentioned */}
      <section className="about-section about-disclaimer">
        <div className="container">
          <p className="about-disclaimer-text">
            We operate as a licensed pharmacy and comply with applicable pharmacy regulations in our jurisdiction. Our team is responsible for every order we dispense.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
