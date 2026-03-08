import React from "react";
import MedicineGrid from "../../../components/Medicine/MedicineGrid";
import "./MedicinesSection.css";

const MedicinesSection = ({ medicines = [], loading = false }) => {
  if (loading) {
    return (
      <section className="medicines-section">
        <div className="container">
          <h2 className="section-title">Most Popular Medicines</h2>
          <p className="section-subtitle">
            Browse our range of trusted medicines
          </p>
          <div className="loading-state">
            <p>Loading medicines...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <section className="medicines-section">
        <div className="container">
          <h2 className="section-title">Most Popular Medicines</h2>
          <p className="section-subtitle">
            Browse our range of trusted medicines
          </p>
          <div className="empty-state">
            <p>No medicines available at the moment. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="medicines-section">
      <div className="container">
        <h2 className="section-title">Most Popular Medicines</h2>
        <p className="section-subtitle">
          Browse our range of trusted medicines
        </p>
        <MedicineGrid medicines={medicines.slice(0, 6)} loading={loading} />
      </div>
    </section>
  );
};

export default MedicinesSection;
