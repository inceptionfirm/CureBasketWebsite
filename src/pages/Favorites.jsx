import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Favorites.css';

const Favorites = () => {
  const { state, toggleFavorite, addToCart, removeFromFavorites } = useApp();
  const { favorites } = state;

  const handleRemoveFavorite = (medicine) => {
    removeFromFavorites(medicine.id);
  };

  const handleAddToCart = (medicine) => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image: medicine.image,
      quantity: 1
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="favorites-empty">
            <Heart size={64} className="empty-heart" />
            <h2>Your Favorites List is Empty</h2>
            <p>Start adding medicines to your favorites to see them here!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Medicines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>{favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites</p>
        </div>

        <div className="favorites-grid">
          {favorites.map((medicine) => (
            <div key={medicine.id} className="favorite-card">
              <div className="favorite-image">
                <img
                  src={medicine.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Crect fill=\'%23f0f0f0\' width=\'300\' height=\'300\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'14\'%3EMedicine%3C/text%3E%3C/svg%3E'}
                  alt={medicine.name}
                  loading="lazy"
                />
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFavorite(medicine)}
                  title="Remove from favorites"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="favorite-info">
                <h3 className="favorite-name">{medicine.name}</h3>
                {medicine.description && (
                  <p className="favorite-description">{medicine.description}</p>
                )}
                <div className="favorite-meta">
                  {medicine.manufacturer && (
                    <span className="manufacturer">{medicine.manufacturer}</span>
                  )}
                  {medicine.category && (
                    <span className="category">{medicine.category}</span>
                  )}
                </div>
                <div className="favorite-price">
                  <span className="price">${medicine.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="favorite-actions">
                  <button
                    className="btn btn-primary add-to-cart-fav"
                    onClick={() => handleAddToCart(medicine)}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <Link
                    to={`/products`}
                    className="btn btn-secondary view-details"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="favorites-footer">
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites;

