import React from "react";
import MedicineCard from "../MedicineCard";
import "./MedicineGrid.css";

const MedicineGrid = ({ medicines, loading = false }) => {
  if (loading) {
    return (
      <div className="medicine-grid-loading">
        <p>Loading medicines...</p>
      </div>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="medicine-grid-empty">
        <p>No medicines found.</p>
      </div>
    );
  }

  return (
    <div className="medicine-grid">
      {medicines.map((medicine, index) => (
        <MedicineCard
          key={medicine.id != null ? `med-${medicine.id}` : `med-${index}`}
          medicine={medicine}
        />
      ))}
    </div>
  );
};

export default MedicineGrid;
