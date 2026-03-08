import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, ShoppingCart, Heart, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { state, setUser, logout } = useApp();
  const { user, isAuthenticated, cartCount, favoritesCount } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data
    if (user) {
      setFormData({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update user profile via API
      const updatedUser = {
        ...user,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };
      
      // If user has an ID, update via API
      if (user?.id) {
        try {
          await apiService.updateUser(user.id, formData);
        } catch (err) {
          console.warn('API update failed, updating locally:', err);
        }
      }
      
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-layout">
          {/* Profile Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user?.firstName ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase() : 
                   user?.name ? user.name[0].toUpperCase() : 
                   user?.email ? user.email[0].toUpperCase() : 'U'}
                </div>
              </div>
              <div className="profile-info">
                <h2>{user?.name || user?.firstName || user?.email || 'User'}</h2>
                <p className="user-role">{user?.role || 'Customer'}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>

            <div className="profile-stats">
              <Link to="/cart" className="stat-item">
                <ShoppingCart size={20} />
                <div>
                  <span className="stat-number">{cartCount}</span>
                  <span className="stat-label">Items in Cart</span>
                </div>
              </Link>
              <Link to="/favorites" className="stat-item">
                <Heart size={20} />
                <div>
                  <span className="stat-number">{favoritesCount}</span>
                  <span className="stat-label">Favorites</span>
                </div>
              </Link>
              <Link to="/prescriptions" className="stat-item">
                <FileText size={20} />
                <div>
                  <span className="stat-number">-</span>
                  <span className="stat-label">Prescriptions</span>
                </div>
              </Link>
            </div>

            <div className="profile-actions">
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          </aside>

          {/* Profile Content */}
          <main className="profile-content">
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary edit-btn">
                    <Edit size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button onClick={handleSave} className="btn btn-primary save-btn" disabled={loading}>
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary cancel-btn">
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={18} />
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="form-value">{formData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <User size={18} />
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="form-value">{formData.lastName || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled
                    />
                  ) : (
                    <p className="form-value">{formData.email || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="form-value">{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={18} />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <p className="form-value">{formData.address || 'Not provided'}</p>
                  )}
                </div>

                {user?.createdAt && (
                  <div className="form-group">
                    <label>
                      <Calendar size={18} />
                      Member Since
                    </label>
                    <p className="form-value">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="profile-section">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>
              <div className="settings-list">
                <Link to="/orders" className="setting-item">
                  <div>
                    <h3>Order History</h3>
                    <p>View your past orders and track shipments</p>
                  </div>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/prescriptions" className="setting-item">
                  <div>
                    <h3>My Prescriptions</h3>
                    <p>Manage your prescription orders</p>
                  </div>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/favorites" className="setting-item">
                  <div>
                    <h3>My Favorites</h3>
                    <p>View your saved favorite medicines</p>
                  </div>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

