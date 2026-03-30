import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { state, refreshCartFromApi } = useApp();
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  const cartItems = state.cart || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);
    if (!confirmChecked) {
      setOrderError('Please confirm to place your order.');
      return;
    }
    setPlacingOrder(true);
    try {
      const snapshot = { cartItems, subtotal, shipping, tax, total };
      const res = await apiService.buyCartApi();
      if (res.success) {
        if (refreshCartFromApi) refreshCartFromApi();
        setOrderSnapshot(snapshot);
        setStep(2);
      } else {
        setOrderError(res.error || 'Failed to place order');
      }
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <Lock size={48} />
            </div>
            <h2>Please login to complete your order</h2>
            <p>You need an active customer account before placing a medicine order.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add medicines from the cart to proceed to checkout.</p>
            <div className="auth-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/cart" className="btn btn-primary">View Cart</Link>
              <Link to="/products" className="btn btn-secondary">Shop Medicines</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='10'%3EMedicine%3C/text%3E%3C/svg%3E";
  const safeSnapshot = orderSnapshot || { cartItems: [], subtotal, shipping, tax, total };
  const totalToShow = safeSnapshot.total;

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <Link to="/cart" className="back-link">
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <h1>Confirm Order</h1>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Confirm</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Waiting</div>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form">
            {step === 1 && (
              <div className="form-step">
                <h2>Confirm your order</h2>
                <p className="step-note">
                  Place the order request now. An admin member will approve it and send you medicine details and payment details on your registered email.
                </p>

                <form onSubmit={handleConfirmOrder}>
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={confirmChecked}
                        onChange={(e) => setConfirmChecked(e.target.checked)}
                      />
                      <span>
                        I confirm that there is no payment gateway right now and I will check my email for payment details after admin approval.
                      </span>
                    </label>
                  </div>

                  {orderError && (
                    <div className="order-error" role="alert">
                      {orderError}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={placingOrder || !confirmChecked}>
                      <Lock size={16} />
                      {placingOrder ? 'Submitting…' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="success-step">
                <div className="success-icon">
                  <Check size={60} />
                </div>
                <h2>Order submitted!</h2>
                <p>
                  You will get the medicine details and payment details on your registered email after admin approval.
                </p>
                <p style={{ marginTop: '-1rem' }}>
                  <strong>Kindly check your email.</strong>
                </p>

                <div className="order-details">
                  <p><strong>Total Amount:</strong> ${totalToShow.toFixed(2)}</p>
                </div>
                <div className="success-actions">
                  <Link to="/" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                  <Link to="/cart" className="btn btn-secondary">
                    Back to Cart
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step === 1 && (
            <div className="order-summary-sidebar">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image || placeholderImg} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="item-price">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-line">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
