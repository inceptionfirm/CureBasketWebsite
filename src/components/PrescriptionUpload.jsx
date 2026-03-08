import React, { useState } from 'react';
import { Upload, X, FileText, Camera, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import './PrescriptionUpload.css';

const PrescriptionUpload = ({ onClose, onUpload }) => {
  const { state, dispatch } = useApp();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  /** Prescription id from create response; file upload stays disabled until this is set */
  const [createdPrescriptionId, setCreatedPrescriptionId] = useState(null);
  const [createdPrescription, setCreatedPrescription] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    diagnosis: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!createdPrescriptionId) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (!createdPrescriptionId) return;
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateDetailsOnly = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!createdPrescriptionId) {
      newErrors.submit = 'Save prescription details first.';
      setErrors(newErrors);
      return false;
    }
    if (!files || files.length === 0) {
      newErrors.files = 'Please upload at least one prescription file';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePrescriptionNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RX-${timestamp}-${random}`;
  };

  const handleUpload = async () => {
    setErrors({});

    // Step 1: No id yet — save prescription first, then enable file upload
    if (!createdPrescriptionId) {
      if (!validateDetailsOnly()) return;
      setUploading(true);
      try {
        const prescriptionNumber = generatePrescriptionNumber();
        const createPayload = {
          prescriptionNumber,
          itemType: 'PRESCRIPTION',
          patientName: formData.patientName.trim(),
          patientId: '',
          doctorName: formData.doctorName.trim(),
          doctorId: '',
          note: formData.notes.trim() || '',
          diagnosis: formData.diagnosis.trim() || '',
          status: 'PENDING',
          priority: 'HIGH'
        };
        const createResponse = await apiService.createPrescription(createPayload);
        if (!createResponse.success) {
          setErrors({
            submit: createResponse.error || createResponse.message || 'Failed to create prescription. Please try again.'
          });
          return;
        }
        const created = createResponse.data;
        const itemId =
          typeof created === 'number'
            ? created
            : (created?.id ?? created?.prescriptionId ?? null);
        if (itemId == null) {
          setErrors({ submit: 'Prescription saved but could not get ID for file upload.' });
          return;
        }
        setCreatedPrescriptionId(itemId);
        setCreatedPrescription(created);
      } catch (error) {
        console.error('Create prescription failed:', error);
        setErrors({ submit: error.message || 'Failed to save prescription. Please try again.' });
      } finally {
        setUploading(false);
      }
      return;
    }

    // Step 2: Id received — validate files and upload, then close
    if (!validateForm()) return;
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      files.forEach((file) => uploadFormData.append('file', file));
      uploadFormData.append('itemType', 'PRESCRIPTION');
      uploadFormData.append('documentType', files.map((_, i) => `file${i + 1}`).join(', '));

      const uploadResponse = await apiService.uploadPrescriptionFiles(Number(createdPrescriptionId), uploadFormData);
      if (!uploadResponse.success && !uploadResponse.unauthorized) {
        setErrors({
          submit: 'File upload failed. Please try again or close and check your list.'
        });
        return;
      }

      const prescriptionFiles = files.map((file) => ({
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        name: file.name
      }));

      const newPrescription = {
        id: String(createdPrescriptionId),
        prescriptionNumber: createdPrescription?.prescriptionNumber ?? '',
        patientName: formData.patientName.trim(),
        doctorName: formData.doctorName.trim(),
        diagnosis: formData.diagnosis.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        files: prescriptionFiles,
        medications: [],
        amount: undefined,
        status: (createdPrescription?.status || 'PENDING').toLowerCase(),
        transactionId: undefined,
        createdAt: createdPrescription?.createdAt ?? createdPrescription?.createdDate ?? new Date().toISOString(),
        expiryDate: undefined
      };

      dispatch({ type: 'ADD_PRESCRIPTION', payload: newPrescription });
      if (onUpload) onUpload(newPrescription);
      setFiles([]);
      setFormData({ patientName: '', doctorName: '', diagnosis: '', notes: '' });
      setCreatedPrescriptionId(null);
      setCreatedPrescription(null);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ submit: error.message || 'Failed to upload prescription. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Camera size={20} />;
    }
    return <FileText size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="prescription-upload-overlay">
      <div className="prescription-upload-modal">
        <div className="modal-header">
          <h2>Upload Prescription</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body modal-content">
          {/* Form Fields Section */}
          <div className="form-section">
            <h3>Prescription Details</h3>
            
            <div className="form-fields-grid">
              <div className="form-group">
                <label htmlFor="patientName" className="form-label">
                  Patient Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.patientName ? 'error' : ''}`}
                  placeholder="Enter patient name"
                />
                {errors.patientName && (
                  <span className="error-message">{errors.patientName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="doctorName" className="form-label">
                  Doctor Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.doctorName ? 'error' : ''}`}
                  placeholder="Enter doctor name"
                />
                {errors.doctorName && (
                  <span className="error-message">{errors.doctorName}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis <span className="optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter diagnosis if available"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes" className="form-label">
                  Notes <span className="optional">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Any additional notes or instructions"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* File Upload Section — disabled until prescription is saved and we have id */}
          <div className={`form-section ${!createdPrescriptionId ? 'upload-section-disabled' : ''}`}>
            <h3>Upload Prescription Files</h3>
            {!createdPrescriptionId && (
              <p className="upload-disabled-hint">Save prescription details below first to add images.</p>
            )}
            <div className="upload-instructions">
              <div className="instruction-item">
                <AlertCircle size={20} />
                <span>Upload clear images or PDF files of your prescription</span>
              </div>
              <div className="instruction-item">
                <AlertCircle size={20} />
                <span>Maximum file size: 10MB per file</span>
              </div>
              <div className="instruction-item">
                <AlertCircle size={20} />
                <span>Supported formats: JPG, PNG, PDF</span>
              </div>
            </div>

            <div
              className={`upload-area ${dragActive && createdPrescriptionId ? 'drag-active' : ''} ${errors.files ? 'error' : ''} ${!createdPrescriptionId ? 'upload-area--disabled' : ''}`}
              onDragEnter={createdPrescriptionId ? handleDrag : undefined}
              onDragLeave={createdPrescriptionId ? handleDrag : undefined}
              onDragOver={createdPrescriptionId ? handleDrag : undefined}
              onDrop={createdPrescriptionId ? handleDrop : undefined}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleChange}
                className="file-input"
                id="prescription-upload"
                disabled={!createdPrescriptionId}
              />
              <label
                htmlFor={createdPrescriptionId ? 'prescription-upload' : undefined}
                className="upload-label"
                onClick={!createdPrescriptionId ? (e) => e.preventDefault() : undefined}
              >
                <Upload size={48} />
                <h3>
                  {createdPrescriptionId
                    ? 'Drop files here or click to browse'
                    : 'Save prescription details first to enable'}
                </h3>
                <p>
                  {createdPrescriptionId
                    ? 'Upload your prescription images or PDF files'
                    : 'Click "Save prescription" below, then add your files'}
                </p>
              </label>
            </div>
            {errors.files && (
              <span className="error-message">{errors.files}</span>
            )}

            {files.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files ({files.length})</h4>
                <div className="files-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-info">
                        {getFileIcon(file)}
                        <div className="file-details">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <button
                        className="remove-file-btn"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading
              ? (createdPrescriptionId ? 'Uploading...' : 'Saving...')
              : createdPrescriptionId
                ? 'Upload prescription'
                : 'Save prescription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
