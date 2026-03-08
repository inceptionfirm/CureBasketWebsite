import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Clock, Shield } from "lucide-react";
import "./PrescriptionSection.css";

const PrescriptionSection = () => {
  return (
    <section className="prescription-upload">
      <div className="container">
        <div className="prescription-content">
          <div className="prescription-text">
            <h2>Upload Your Prescription</h2>
            <p>
              Get your medicines delivered to your doorstep. Simply upload your
              prescription and our licensed pharmacists will process your order.
            </p>
            <div className="prescription-features">
              <div className="feature-item">
                <Upload className="feature-icon" size={24} />
                <span>Easy Upload Process</span>
              </div>
              <div className="feature-item">
                <Clock className="feature-icon" size={24} />
                <span>Quick Processing</span>
              </div>
              <div className="feature-item">
                <Shield className="feature-icon" size={24} />
                <span>Licensed Pharmacist Review</span>
              </div>
            </div>
            <Link to="/prescriptions" className="btn btn-primary prescription-btn">
              Upload Prescription Now
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="prescription-image">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600"
              alt="Prescription Upload"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrescriptionSection;
