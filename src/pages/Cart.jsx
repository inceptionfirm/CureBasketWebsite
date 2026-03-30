import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { state, updateCartItem, removeFromCart, clearCart, refreshCartFromApi } = useApp();
  const { cart, isAuthenticated } = state;

  // Fetch latest cart from API when Cart page is opened (logged-in user) so view-cart is hit
  useEffect(() => {
    if (isAuthenticated && refreshCartFromApi) {
      refreshCartFromApi();
    }
  }, [isAuthenticated]);
  const rawCart = cart || [];
  // Newest first (top), oldest last (bottom) – stable order so +/- doesn’t move rows
  const cartItems = [...rawCart].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateCartItem(id, newQuantity);
    }
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <AlertCircle size={80} />
            </div>
            <h2>Please Login to View Cart</h2>
            <p>You need to be logged in to add items to your cart.</p>
            <Link to="/login" className="btn btn-primary">
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <Link to="/products" className="back-link">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <h1>Shopping Cart</h1>
          <p>
            {rawCart.length} item{rawCart.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <Link
                  to={`/medicine/${item.medicineId ?? item.id}`}
                  className="item-image-link"
                  title="View product details"
                >
                  <div className="item-image">
                    <img
                      src={
                        item.image ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='12'%3EMedicine%3C/text%3E%3C/svg%3E"
                      }
                      alt={item.name}
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="item-details">
                  <Link
                    to={`/medicine/${item.medicineId ?? item.id}`}
                    className="item-name-link"
                  >
                    <h3 className="item-name">{item.name}</h3>
                  </Link>
                  {item.manufacturer && (
                    <p className="item-manufacturer">by {item.manufacturer}</p>
                  )}
                  {item.prescriptionRequired && (
                    <span className="prescription-badge">
                      Prescription Required
                    </span>
                  )}
                  <div className="item-price">
                    <span className="current-price">
                      ${(item.price || 0).toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="original-price">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {item.stock !== undefined && (
                    <div className="item-stock">
                      {item.stock > 0 ? (
                        <span className="in-stock">
                          In Stock ({item.stock} available)
                        </span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  )}
                  <Link
                    to={`/medicine/${item.medicineId ?? item.id}`}
                    className="view-details-link"
                  >
                    <ExternalLink size={14} />
                    View product details
                  </Link>
                </div>

                <div className="item-actions">
                  <div className="item-quantity">
                    <label className="quantity-label">Quantity</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-btn quantity-btn-decrease"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        disabled={(item.quantity || 1) <= 1}
                        title="Decrease quantity"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={26} strokeWidth={2.5} />
                      </button>
                      <span className="quantity-value" aria-live="polite">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        className="quantity-btn quantity-btn-increase"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        disabled={
                          item.stock !== undefined &&
                          (item.quantity || 1) >= item.stock
                        }
                        title="Increase quantity"
                        aria-label="Increase quantity"
                      >
                        <Plus size={26} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>

                <div className="item-total">
                  <span className="total-label">Total:</span>
                  <span className="total-price">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-line">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-line">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-line total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <div className="shipping-note">
                <p>Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
              </div>
            )}

            <div className="checkout-actions">
              <Link to="/checkout" className="btn btn-primary btn-large">
                Confirm Order
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="btn btn-outline clear-cart-btn"
              >
                Clear Cart
              </button>
            </div>

            {/* Security Badges */}
            <div className="security-badges">
              <div className="security-badge">
                <span>🔒</span>
                <span>Admin approval required</span>
              </div>
              <div className="security-badge">
                <span>📧</span>
                <span>Details sent to your email</span>
              </div>
              <div className="security-badge">
                <span>↩️</span>
                <span>No payment gateway for now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
