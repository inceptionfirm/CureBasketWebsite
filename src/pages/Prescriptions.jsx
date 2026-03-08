import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle, Clock, CreditCard, ShieldCheck, Truck, Upload, Mail, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import PrescriptionUpload from '../components/PrescriptionUpload';
import PrescriptionCard from '../components/PrescriptionCard';
import PrescriptionDetails from '../components/PrescriptionDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import './Prescriptions.css';

const TAB_KEYS = { UPLOAD: 'upload', EMAIL: 'email', MAIL_FAX: 'mailfax' };

const Prescriptions = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [activeRxTab, setActiveRxTab] = useState(TAB_KEYS.UPLOAD);

  const siteConfig = state.siteConfig || {};
  const contact = siteConfig.contact || {};
  const contactEmail = contact.email || '';
  const contactAddress = contact.address || '';
  const contactFax = contact.fax || '';

  // Load prescriptions from API (customer-specific: GET /customer/view-prescriptions)
  const loadPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);

      const response = await apiService.getCustomerPrescriptions();

      if (response.unauthorized) {
        dispatch({ type: 'SET_PRESCRIPTIONS', payload: [] });
        return;
      }

      if (response.success && response.data != null) {
        const prescriptions = Array.isArray(response.data)
          ? response.data
          : (response.data.prescriptions || response.data.content || []);

        const mappedPrescriptions = prescriptions.map((pres) => ({
          id: String(pres.id),
          prescriptionNumber: pres.prescriptionNumber || pres.number || `RX-${pres.id}`,
          patientName: pres.patientName || pres.patient?.name || '',
          doctorName: pres.doctorName || pres.doctor?.name || '',
          diagnosis: pres.diagnosis,
          notes: pres.notes || pres.note || pres.description,
          files: pres.files || (pres.image ? [{ type: 'image', url: pres.image }] : []),
          medications: pres.medications || pres.medicines || [],
          amount: pres.amount || pres.totalAmount,
          status: (pres.status || 'pending').toLowerCase(),
          transactionId: pres.transactionId,
          createdAt: pres.createdAt || pres.createdDate,
          expiryDate: pres.expiryDate
        }));

        dispatch({ type: 'SET_PRESCRIPTIONS', payload: mappedPrescriptions });
      } else {
        dispatch({ type: 'SET_PRESCRIPTIONS', payload: [] });
      }
    } catch (error) {
      console.error('Failed to load prescriptions from API:', error);
      setApiError('Failed to load prescriptions. Please try again.');
      dispatch({ type: 'SET_PRESCRIPTIONS', payload: [] });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    loadPrescriptions();
  }, [state.isAuthenticated, loadPrescriptions]);

  // Use prescriptions from context (updated by API or local)
  const prescriptions = state.prescriptions && state.prescriptions.length > 0 
    ? state.prescriptions 
    : [];

  // Calculate stats
  const stats = {
    pending: prescriptions.filter(p => p.status === 'pending').length,
    approved: prescriptions.filter(p => p.status === 'approved').length,
    paid: prescriptions.filter(p => p.status === 'paid').length,
    verified: prescriptions.filter(p => p.status === 'verified').length,
    dispatched: prescriptions.filter(p => p.status === 'dispatched').length
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    loadPrescriptions();
  };

  const handleOpenUpload = () => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowUploadModal(true);
  };

  const handleCardClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPrescription(null);
  };

  // Upload Prescription Document section (tabs + content) – used for both auth and non-auth
  const renderUploadDocSection = () => (
    <section className="upload-rx-section">
      <h1 className="upload-rx-title">Upload Prescription Document</h1>
      <p className="upload-rx-intro">
        Before your order for prescription medications can be filled, you must provide us with a copy of your written prescription from your doctor. Please follow the steps below to send us your prescription document through our website. Alternatively, you may send your prescription by Mail, Email, or Fax.
      </p>
      <p className="upload-rx-note">
        Please allow 1 business day to process. If you have any questions or concerns, please do not hesitate to <Link to="/contact">contact us</Link>.
      </p>

      <div className="upload-rx-tabs">
        <button
          type="button"
          className={`upload-rx-tab ${activeRxTab === TAB_KEYS.UPLOAD ? 'active' : ''}`}
          onClick={() => setActiveRxTab(TAB_KEYS.UPLOAD)}
        >
          <Upload size={18} />
          Upload Rx
        </button>
        <button
          type="button"
          className={`upload-rx-tab ${activeRxTab === TAB_KEYS.EMAIL ? 'active' : ''}`}
          onClick={() => setActiveRxTab(TAB_KEYS.EMAIL)}
        >
          <Mail size={18} />
          By Email
        </button>
        <button
          type="button"
          className={`upload-rx-tab ${activeRxTab === TAB_KEYS.MAIL_FAX ? 'active' : ''}`}
          onClick={() => setActiveRxTab(TAB_KEYS.MAIL_FAX)}
        >
          <Send size={18} />
          By Mail or Fax
        </button>
      </div>

      <div className="upload-rx-tab-content">
        {activeRxTab === TAB_KEYS.UPLOAD && (
          <div className="upload-rx-panel upload-rx-panel-upload">
            <h2 className="upload-rx-panel-title">Upload your prescription</h2>
            <p className="upload-rx-panel-desc">
              The document types we accept are PDF, GIF, JPG, PNG, and TIF only. Each document uploaded must be less than 10MB.
            </p>
            {state.isAuthenticated ? (
              <div
                className="upload-rx-dropzone"
                onClick={handleOpenUpload}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenUpload()}
                role="button"
                tabIndex={0}
                aria-label="Click to upload prescription"
              >
                <Upload size={48} />
                <p>Click or drag Rx files here to upload</p>
              </div>
            ) : (
              <div className="upload-rx-signin">
                <p>Please sign in to upload your prescription through our website.</p>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login to upload
                </button>
              </div>
            )}
          </div>
        )}

        {activeRxTab === TAB_KEYS.EMAIL && (
          <div className="upload-rx-panel">
            <h2 className="upload-rx-panel-title">Send prescription by email</h2>
            <p className="upload-rx-panel-desc">
              You can send your prescription document to our email. Attach a clear copy (PDF or image) of your written prescription from your doctor.
            </p>
            {contactEmail ? (
              <p className="upload-rx-contact-line">
                <Mail size={20} />
                <a href={`mailto:${contactEmail}?subject=Prescription%20Document`}>{contactEmail}</a>
              </p>
            ) : (
              <p className="upload-rx-contact-line">Please see our <Link to="/contact">Contact</Link> page for email details.</p>
            )}
          </div>
        )}

        {activeRxTab === TAB_KEYS.MAIL_FAX && (
          <div className="upload-rx-panel">
            <h2 className="upload-rx-panel-title">Send prescription by mail or fax</h2>
            <p className="upload-rx-panel-desc">
              You can mail or fax a copy of your written prescription to us. Please include your name and any order or reference number if you have one.
            </p>
            <div className="upload-rx-contact-block">
              {contactAddress && (
                <p className="upload-rx-contact-line">
                  <strong>Mailing address:</strong><br />
                  {contactAddress}
                </p>
              )}
              {contactFax && (
                <p className="upload-rx-contact-line">
                  <strong>Fax:</strong> {contactFax}
                </p>
              )}
              {!contactAddress && !contactFax && (
                <p className="upload-rx-contact-line">Please see our <Link to="/contact">Contact</Link> page for mailing address and fax details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  // Require authentication for prescription management
  if (!state.isAuthenticated) {
    return (
      <div className="prescriptions-page prescriptions-page--auth-required">
        <div className="container">
          <div className="prescriptions-list">
            <h2>My Prescriptions</h2>
            <div className="empty-prescriptions">
              <div className="empty-icon">
                <Plus size={48} />
              </div>
              <h3>Please sign in to view prescriptions</h3>
              <p>Login or create an account to upload and track your medical prescriptions.</p>
              <div className="auth-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <Link to="/signup" className="btn btn-secondary">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
          {renderUploadDocSection()}
        </div>
      </div>
    );
  }

  return (
    <div className="prescriptions-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>My Prescriptions</h1>
          <p>Manage your prescription uploads and track their status</p>
          <button 
            className="btn btn-primary"
            onClick={handleOpenUpload}
          >
            <Plus size={20} />
            Upload New Prescription
          </button>
        </div>

        {/* Prescription Stats */}
        {prescriptions.length > 0 && (
          <div className="prescription-stats">
            {stats.pending > 0 && (
              <div className="stat-card">
                <div className="stat-icon pending">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.pending}</h3>
                  <p>Pending</p>
                </div>
              </div>
            )}
            {stats.approved > 0 && (
              <div className="stat-card">
                <div className="stat-icon approved">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.approved}</h3>
                  <p>Approved</p>
                </div>
              </div>
            )}
            {stats.paid > 0 && (
              <div className="stat-card">
                <div className="stat-icon paid">
                  <CreditCard size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.paid}</h3>
                  <p>Paid</p>
                </div>
              </div>
            )}
            {stats.verified > 0 && (
              <div className="stat-card">
                <div className="stat-icon verified">
                  <ShieldCheck size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.verified}</h3>
                  <p>Verified</p>
                </div>
              </div>
            )}
            {stats.dispatched > 0 && (
              <div className="stat-card">
                <div className="stat-icon dispatched">
                  <Truck size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.dispatched}</h3>
                  <p>Dispatched</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions List */}
        <div className="prescriptions-list">
          <h2>My Prescriptions</h2>
          {loading ? (
            <LoadingSpinner />
          ) : apiError ? (
            <div className="api-error-message">
              <p>{apiError}</p>
            </div>
          ) : null}
          {!loading && prescriptions.length > 0 ? (
            <div className="prescriptions-grid">
              {prescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onClick={() => handleCardClick(prescription)}
                />
              ))}
            </div>
          ) : !loading ? (
            <div className="empty-prescriptions">
              <div className="empty-icon">
                <Plus size={48} />
              </div>
              <h3>No Prescriptions Yet</h3>
              <p>Upload your first prescription to get started</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                <Plus size={20} />
                Upload Prescription
              </button>
            </div>
          ) : null}
        </div>

        {/* Upload Prescription Document – text and tabs (after My Prescriptions) */}
        {renderUploadDocSection()}

        {/* Upload Instructions */}
        <div className="upload-instructions">
          <h2>How to Upload Prescriptions</h2>
          <div className="instructions-grid">
            <div className="instruction-step">
              <div className="step-number">1</div>
              <h3>Take Clear Photos</h3>
              <p>Ensure your prescription is clearly visible with good lighting</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <h3>Fill Prescription Details</h3>
              <p>Enter patient name, doctor name, and any additional information</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <h3>Upload Files</h3>
              <p>Upload images or PDF files of your prescription</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">4</div>
              <h3>Wait for Review</h3>
              <p>Our pharmacists will review and process your prescription</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <PrescriptionUpload
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadSuccess}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <PrescriptionDetails
          prescription={selectedPrescription}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Prescriptions;
