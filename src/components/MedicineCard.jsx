import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, AlertTriangle, Shield, Clock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './MedicineCard.css';

// Placeholder when API has no image (avoid empty string in img src)
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EMedicine%3C/text%3E%3C/svg%3E";

const MedicineCard = ({ medicine, viewMode = 'grid' }) => {
  const { addToCart, state } = useApp();
  const { user } = state;

  if (!medicine) return null;

  // Ensure stable string id for navigation (avoid /medicine/undefined or wrong links)
  const medicineId = medicine.id != null && String(medicine.id).trim() && String(medicine.id) !== "undefined"
    ? String(medicine.id)
    : null;
  const detailUrl = medicineId ? `/medicine/${medicineId}` : null;

  // Normalize API shape: API may omit type, rating, reviews; use stock for inStock
  const safe = {
    ...medicine,
    type: medicine?.type ?? 'otc',
    rating: medicine?.rating ?? 0,
    reviews: medicine?.reviews ?? 0,
    inStock: medicine?.inStock ?? (medicine?.stock != null ? medicine.stock > 0 : true),
    name: medicine?.name ?? '',
    description: medicine?.description ?? '',
    image: medicine?.image && String(medicine.image).trim() ? medicine.image : PLACEHOLDER_IMAGE,
    price: medicine?.price ?? 0
  };

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (safe.prescriptionRequired && !user) {
      return;
    }
    addToCart(medicine);
  };

  const getMedicineTypeColor = (type) => {
    const colors = {
      prescription: '#DC2626',
      otc: '#059669',
      supplement: '#7C3AED',
      equipment: '#0891B2'
    };
    return colors[type] || '#6B7280';
  };

  const getMedicineTypeIcon = (type) => {
    switch (type) {
      case 'prescription':
        return <AlertTriangle size={16} />;
      case 'otc':
        return <Shield size={16} />;
      case 'supplement':
        return <Heart size={16} />;
      case 'equipment':
        return <Clock size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (viewMode === 'list') {
    return (
      <div className="medicine-card list-view">
        <div className="medicine-image">
          <img
            src={safe.image}
            alt={safe.name || 'Medicine'}
            onError={(e) => {
              if (e.target.src !== PLACEHOLDER_IMAGE) e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          {safe.discount && (
            <div className="discount-badge">
              {calculateDiscount(safe.originalPrice, safe.price)}% OFF
            </div>
          )}
        </div>
        
        <div className="medicine-info">
          <div className="medicine-header">
            <h3 className="medicine-name">{safe.name}</h3>
            <div className="medicine-type" style={{ color: getMedicineTypeColor(safe.type) }}>
              {getMedicineTypeIcon(safe.type)}
              <span>{String(safe.type).toUpperCase()}</span>
            </div>
          </div>
          {(safe.category || safe.prescriptionRequired !== undefined) && (
            <p className="medicine-meta">
              {safe.category && <span className="medicine-meta-category">{safe.category}</span>}
              {safe.category && (safe.prescriptionRequired !== undefined) && <span className="medicine-meta-sep"> · </span>}
              <span className="medicine-meta-prescription">Prescription: {safe.prescriptionRequired ? 'Yes' : 'No'}</span>
            </p>
          )}
          <p className="medicine-description">{safe.description}</p>
          
          <div className="medicine-details">
            <div className="medicine-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(safe.rating) ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {safe.rating} ({safe.reviews} reviews)
              </span>
            </div>
            
            <div className="medicine-price">
              <span className="current-price">{formatPrice(safe.price)}</span>
              {safe.originalPrice && (
                <span className="original-price">{formatPrice(safe.originalPrice)}</span>
              )}
            </div>
          </div>
          
          <div className="medicine-actions">
            {detailUrl ? (
              <Link to={detailUrl} className="view-details-btn">
                <Info size={16} />
                View details
              </Link>
            ) : (
              <span className="view-details-btn disabled">View details</span>
            )}
            <button 
              className={`add-to-cart-btn ${!safe.inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!safe.inStock}
            >
              <ShoppingCart size={16} />
              {safe.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-card grid-view">
      <div className="medicine-image">
        <img
          src={safe.image}
          alt={safe.name || 'Medicine'}
          onError={(e) => {
            if (e.target.src !== PLACEHOLDER_IMAGE) e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        {safe.discount && (
          <div className="discount-badge">
            {calculateDiscount(safe.originalPrice, safe.price)}% OFF
          </div>
        )}
        {!safe.inStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="medicine-info">
        <div className="medicine-header">
          <h3 className="medicine-name">{safe.name}</h3>
          <div className="medicine-type" style={{ color: getMedicineTypeColor(safe.type) }}>
            {getMedicineTypeIcon(safe.type)}
            <span>{String(safe.type).toUpperCase()}</span>
          </div>
        </div>
        {(safe.category || safe.prescriptionRequired !== undefined) && (
          <p className="medicine-meta">
            {safe.category && <span className="medicine-meta-category">{safe.category}</span>}
            {safe.category && (safe.prescriptionRequired !== undefined) && <span className="medicine-meta-sep"> · </span>}
            <span className="medicine-meta-prescription">Prescription: {safe.prescriptionRequired ? 'Yes' : 'No'}</span>
          </p>
        )}
        <p className="medicine-description">{safe.description}</p>
        
        <div className="medicine-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(safe.rating) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">
            {safe.rating} ({safe.reviews})
          </span>
        </div>
        
        <div className="medicine-price">
          <span className="current-price">{formatPrice(safe.price)}</span>
          {safe.originalPrice && (
            <span className="original-price">{formatPrice(safe.originalPrice)}</span>
          )}
        </div>
        
        <div className="medicine-actions grid-actions">
          {detailUrl ? (
            <Link to={detailUrl} className="view-details-btn">
              <Info size={16} />
              View details
            </Link>
          ) : (
            <span className="view-details-btn disabled">View details</span>
          )}
          <button 
            className={`add-to-cart-btn ${!safe.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!safe.inStock}
          >
            <ShoppingCart size={16} />
            {safe.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
