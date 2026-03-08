import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { state, refreshCartFromApi } = useApp();
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [formData, setFormData] = useState({
    // Shipping Information (commented out for now)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    // Billing / Payment
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveInfo: false,
    newsletter: false
  });

  const cartItems = state.cart || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null);
    setPlacingOrder(true);
    try {
      const res = await apiService.buyCartApi();
      if (res.success) {
        if (refreshCartFromApi) refreshCartFromApi();
        setStep(4);
      } else {
        setOrderError(res.error || 'Failed to place order');
      }
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5);
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

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <Link to="/cart" className="back-link">
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <h1>Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review</div>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Complete</div>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form">
            {step === 1 && (
              <div className="form-step">
                {/* Shipping Information – commented out for now; will use cart/address API later */}
                <h2>Review &amp; Payment</h2>
                <p className="step-note">Review your order summary on the right. Proceed to payment when ready.</p>
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Payment Information</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <div className="payment-methods">
                    <div className="payment-method active">
                      <CreditCard size={20} />
                      <span>Credit Card</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card *</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        e.target.value = formatCardNumber(e.target.value);
                        handleInputChange(e);
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          e.target.value = formatExpiryDate(e.target.value);
                          handleInputChange(e);
                        }}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                      />
                      <span>Save payment information for future purchases</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Review Your Order</h2>
                <form onSubmit={handleSubmit}>
                  <div className="order-summary">
                    <h3>Order Items</h3>
                    {cartItems.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image || placeholderImg} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="item-price">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address – commented out for now */}
                  {formData.address && (
                  <div className="shipping-info">
                    <h3>Shipping Address</h3>
                    <p>
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                  </div>
                  )}

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                      />
                      <span>Subscribe to our newsletter for updates and special offers</span>
                    </label>
                  </div>

                  {orderError && (
                    <div className="order-error" role="alert">
                      {orderError}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handlePrevious} disabled={placingOrder}>
                      Back to Payment
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={placingOrder}>
                      <Lock size={16} />
                      {placingOrder ? 'Placing order…' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="success-step">
                <div className="success-icon">
                  <Check size={60} />
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been successfully placed.</p>
                <div className="order-details">
                  <p><strong>Order Number:</strong> #12345</p>
                  <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                  <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
                </div>
                <div className="success-actions">
                  <Link to="/" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                  <Link to="/orders" className="btn btn-secondary">
                    View Order Details
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
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

              {/* Secure badge – commented out for now */}
              {/* <div className="security-badges">
                <div className="security-badge">
                  <Lock size={16} />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
