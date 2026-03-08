import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Video, Clock, Users } from "lucide-react";
import "./ConsultationSection.css";

const ConsultationSection = () => {
  return (
    <section className="doctor-consultation">
      <div className="container">
        <div className="consultation-content">
          <div className="consultation-image">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600"
              alt="Doctor Consultation"
            />
          </div>
          <div className="consultation-text">
            <h2>Consult with Licensed Doctors</h2>
            <p>
              Get expert medical advice from our team of licensed doctors.
              Available 24/7 for your convenience.
            </p>
            <div className="consultation-features">
              <div className="feature-item">
                <Video className="feature-icon" size={24} />
                <span>Video Consultation</span>
              </div>
              <div className="feature-item">
                <Clock className="feature-icon" size={24} />
                <span>24/7 Availability</span>
              </div>
              <div className="feature-item">
                <Users className="feature-icon" size={24} />
                <span>Licensed Professionals</span>
              </div>
            </div>
            <Link to="/consultation" className="btn btn-primary consultation-btn">
              Book Consultation
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;
