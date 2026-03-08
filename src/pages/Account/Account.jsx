// Customer Account Page - Everything in one place (Profile + Cart + Orders)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingCart, FileText, Settings, LogOut, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/api';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { state, updateCartItem, removeFromCart, logout } = useApp();
  const { user, isAuthenticated, cart } = state;
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      const id = setTimeout(() => navigate('/login'), 0);
      return () => clearTimeout(id);
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await apiService.logout();
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  const cartItems = cart || [];
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateCartItem(id, newQuantity);
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <h1>My Account</h1>
          <p>Manage your profile, cart, and orders</p>
        </div>

        <div className="account-layout">
          {/* Sidebar Navigation */}
          <aside className="account-sidebar">
            <div className="account-user-info">
              <div className="user-avatar">
                {user?.firstName ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase() : 
                 user?.name ? user.name[0].toUpperCase() : 
                 user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <h3>{user?.name || user?.firstName || user?.email || 'User'}</h3>
                <p>{user?.email}</p>
              </div>
            </div>

            <nav className="account-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
                onClick={() => setActiveTab('cart')}
              >
                <ShoppingCart size={20} />
                <span>Cart ({cartItems.length})</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('prescriptions')}
              >
                <FileText size={20} />
                <span>Prescriptions</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </nav>

            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="account-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="account-section">
                <h2>Personal Information</h2>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{user?.name || user?.firstName || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user?.email || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="account-section">
                <h2>Shopping Cart ({cartItems.length} items)</h2>
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} />
                    <p>Your cart is empty</p>
                    <button onClick={() => navigate('/products')} className="btn btn-primary">
                      Browse Medicines
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-item-row">
                          <img 
                            src={item.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'%3E%3Crect fill=\'%23f0f0f0\' width=\'80\' height=\'80\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'10\'%3EMedicine%3C/text%3E%3C/svg%3E'} 
                            alt={item.name}
                            loading="lazy"
                          />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p className="item-price">${(item.price || 0).toFixed(2)}</p>
                          </div>
                          <div className="item-quantity">
                            <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="item-total">
                            <p>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="cart-summary">
                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <button onClick={() => navigate('/checkout')} className="btn btn-primary checkout-btn">
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="account-section">
                <h2>My Prescriptions</h2>
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No prescriptions yet</p>
                  <button onClick={() => navigate('/prescriptions')} className="btn btn-primary">
                    Upload Prescription
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="account-section">
                <h2>Account Settings</h2>
                <div className="settings-list">
                  <div className="setting-item">
                    <label>Notifications</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-item">
                    <label>Email Updates</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
