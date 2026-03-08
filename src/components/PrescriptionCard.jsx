import React from 'react';
import { FileText, Calendar, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './PrescriptionCard.css';

const PrescriptionCard = ({ prescription, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFilePreview = () => {
    if (prescription.files && prescription.files.length > 0) {
      const firstFile = prescription.files[0];
      if (firstFile.type === 'image') {
        return (
          <div className="prescription-preview-image">
            <img src={firstFile.url} alt="Prescription preview" />
          </div>
        );
      }
      return (
        <div className="prescription-preview-pdf">
          <FileText size={48} />
        </div>
      );
    }
    return (
      <div className="prescription-preview-placeholder">
        <FileText size={48} />
      </div>
    );
  };

  return (
    <div className="prescription-card" onClick={onClick}>
      <div className="prescription-card-header">
        {getFilePreview()}
        <div className="prescription-card-status">
          <StatusBadge status={prescription.status} size="sm" />
        </div>
      </div>
      
      <div className="prescription-card-body">
        <div className="prescription-card-info">
          <h3 className="prescription-number">
            {prescription.prescriptionNumber}
          </h3>
          <p className="prescription-doctor">
            <strong>Dr.</strong> {prescription.doctorName}
          </p>
          <div className="prescription-meta">
            <span className="prescription-date">
              <Calendar size={16} />
              {formatDate(prescription.createdAt)}
            </span>
            {prescription.files && prescription.files.length > 0 && (
              <span className="prescription-files-count">
                {prescription.files.length} file{prescription.files.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="prescription-card-footer">
        <button className="btn-view-details">
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default PrescriptionCard;
