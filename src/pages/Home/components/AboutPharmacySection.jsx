import React from "react";
import { Link } from "react-router-dom";
import { Clock, Mail, Phone } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import "./AboutPharmacySection.css";

const AboutPharmacySection = () => {
  const { state } = useApp();
  const siteConfig = state.siteConfig || {};
  const contact = siteConfig.contact || {};
  const phone = contact.phone || "1-833-781-5773";
  const email = contact.email || "";
  const hours = contact.hours || "";
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";
  const phoneDisplay = "XXXXXX";

  const siteName = siteConfig.name || "Cure Basket";

  return (
    <section className="about-pharmacy-section">
      <div className="about-pharmacy-container">
        <h2 className="about-pharmacy-title">About {siteName}</h2>
        <div className="about-pharmacy-card">
          <div className="about-pharmacy-content">
          <p className="about-pharmacy-lead">
            {siteName} is your trusted pharmaceutical partner. We are committed to providing safe, affordable medications and healthcare solutions with the same care and expertise you expect from your local pharmacy.
          </p>
          <p>
            We offer a wide range of brand name and generic medications, all sourced from licensed suppliers. Our pharmacy team ensures every prescription is handled with care and dispensed according to the highest standards.
          </p>
          <p>
            Whether you need prescription medications, over-the-counter products, or healthcare advice, our qualified pharmacists and pharmacy technicians are here to help. We make it easy to order online, upload your prescription, and have your medications delivered to your doorstep.
          </p>
          <p>
            You can place your order by calling{" "}
            <a href={phoneHref} className="about-pharmacy-phone">
              <Phone size={18} />
              {phoneDisplay}
            </a>
            , uploading your prescription online, or browsing our{" "}
            <Link to="/products" className="about-pharmacy-link">product catalog</Link>.
          </p>

          <div className="about-pharmacy-contact" aria-label="Contact details">
            <a href={phoneHref} className="about-pharmacy-contactItem">
              <Phone size={18} />
              <span>{phoneDisplay}</span>
            </a>
            {email ? (
              <a href={`mailto:${email}`} className="about-pharmacy-contactItem">
                <Mail size={18} />
                <span>{email}</span>
              </a>
            ) : null}
            {hours ? (
              <div className="about-pharmacy-contactItem about-pharmacy-contactItemStatic">
                <Clock size={18} />
                <span>{hours}</span>
              </div>
            ) : null}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPharmacySection;
