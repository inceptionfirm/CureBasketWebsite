import React from "react";
import "./OffersSection.css";

const OffersSection = () => {
  return (
    <section className="special-offers">
      <div className="container">
        <h2 className="section-title">Special Offers & Deals</h2>
        <p className="section-subtitle">
          Save more on your healthcare essentials
        </p>
        <div className="offers-grid">
          <div className="offer-card">
            <div className="offer-icon">💊</div>
            <h3>Prescription Discount</h3>
            <p>
              Get 20% off on all prescription medicines with valid prescription
            </p>
            <div className="offer-code">Code: PRESC20</div>
          </div>
          <div className="offer-card">
            <div className="offer-icon">🚚</div>
            <h3>Free Delivery</h3>
            <p>
              Free home delivery on orders above $50. Same-day delivery
              available
            </p>
            <div className="offer-code">Code: FREEDEL</div>
          </div>
          <div className="offer-card">
            <div className="offer-icon">🎁</div>
            <h3>First Order Bonus</h3>
            <p>
              Get 15% off on your first order. Use code at checkout to avail
              the discount
            </p>
            <div className="offer-code">Code: FIRST15</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
