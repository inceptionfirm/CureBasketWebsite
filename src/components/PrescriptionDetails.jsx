import React from 'react';
import { X, Calendar, FileText, Download, User, Stethoscope, FileImage, Pill, CreditCard, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import StatusTimeline from './StatusTimeline';
import './PrescriptionDetails.css';

const PrescriptionDetails = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleDownload = (file) => {
    // TODO: Replace with actual download logic from API
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || 'prescription';
    link.click();
  };

  return (
    <div className="prescription-details-overlay" onClick={onClose}>
      <div className="prescription-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Prescription Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Prescription Info Section */}
          <div className="details-section">
            <h3 className="section-title">Prescription Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Prescription Number</span>
                <span className="info-value prescription-number">{prescription.prescriptionNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <StatusBadge status={prescription.status} />
              </div>
              <div className="info-item">
                <span className="info-label">
                  <Calendar size={16} />
                  Upload Date
                </span>
                <span className="info-value">{formatDate(prescription.createdAt)}</span>
              </div>
              {prescription.expiryDate && (
                <div className="info-item">
                  <span className="info-label">
                    <Clock size={16} />
                    Expiry Date
                  </span>
                  <span className="info-value">{formatDate(prescription.expiryDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Patient & Doctor Section */}
          <div className="details-section">
            <h3 className="section-title">Patient & Doctor</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">
                  <User size={16} />
                  Patient Name
                </span>
                <span className="info-value">{prescription.patientName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <Stethoscope size={16} />
                  Doctor Name
                </span>
                <span className="info-value">{prescription.doctorName}</span>
              </div>
            </div>
          </div>

          {/* Medical Details Section */}
          {(prescription.diagnosis || prescription.notes) && (
            <div className="details-section">
              <h3 className="section-title">Medical Details</h3>
              <div className="info-grid">
                {prescription.diagnosis && (
                  <div className="info-item full-width">
                    <span className="info-label">Diagnosis</span>
                    <span className="info-value">{prescription.diagnosis}</span>
                  </div>
                )}
                {prescription.notes && (
                  <div className="info-item full-width">
                    <span className="info-label">Notes</span>
                    <span className="info-value">{prescription.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Uploaded Documents Section */}
          {prescription.files && prescription.files.length > 0 && (
            <div className="details-section">
              <h3 className="section-title">Uploaded Documents</h3>
              <div className="files-grid">
                {prescription.files.map((file, index) => (
                  <div key={index} className="file-card">
                    {file.type === 'image' ? (
                      <div className="file-preview-image">
                        <img src={file.url} alt={`Prescription ${index + 1}`} />
                      </div>
                    ) : (
                      <div className="file-preview-pdf">
                        <FileText size={48} />
                        <span>PDF Document</span>
                      </div>
                    )}
                    <div className="file-actions">
                      <button 
                        className="btn-download"
                        onClick={() => handleDownload(file)}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medicines Section (Future - Admin Added) */}
          <div className="details-section">
            <h3 className="section-title">Medicines</h3>
            {prescription.medications && prescription.medications.length > 0 ? (
              <div className="medications-list">
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="medication-item">
                    <div className="medication-icon">
                      <Pill size={20} />
                    </div>
                    <div className="medication-details">
                      <h4 className="medication-name">{medication.name}</h4>
                      {(medication.dosage || medication.frequency) && (
                        <div className="medication-meta">
                          {medication.dosage && (
                            <span className="medication-dosage">Dosage: {medication.dosage}</span>
                          )}
                          {medication.frequency && (
                            <span className="medication-frequency">Frequency: {medication.frequency}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Pill size={32} />
                <p>No medicines added yet. Medicines will be added by the pharmacist after review.</p>
              </div>
            )}
          </div>

          {/* Payment Info Section (Future) */}
          <div className="details-section">
            <h3 className="section-title">Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">
                  <CreditCard size={16} />
                  Amount
                </span>
                <span className="info-value amount">{formatCurrency(prescription.amount)}</span>
              </div>
              {prescription.transactionId && (
                <div className="info-item">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value transaction-id">{prescription.transactionId}</span>
                </div>
              )}
            </div>
            {!prescription.amount && (
              <div className="empty-state small">
                <p>Payment information will be available after prescription approval and amount calculation.</p>
              </div>
            )}
          </div>

          {/* Status Timeline Section */}
          <div className="details-section">
            <h3 className="section-title">Status Timeline</h3>
            <StatusTimeline currentStatus={prescription.status} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetails;
