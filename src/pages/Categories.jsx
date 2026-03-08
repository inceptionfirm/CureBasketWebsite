import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Categories.css";

const Categories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getPublicCategories(100);
        if (response.success && response.data) {
          const d = response.data;
          const list = Array.isArray(d)
            ? d
            : (d.categories ?? d.content ?? []);
          setCategories(Array.isArray(list) ? list : []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setError("Failed to load categories.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleViewMedicines = () => {
    if (selectedCategoryId) {
      navigate(`/products?category=${encodeURIComponent(selectedCategoryId)}`);
    } else {
      navigate("/products");
    }
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="container">
          <h1 className="categories-page-title">Healthcare Categories</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page">
        <div className="container">
          <h1 className="categories-page-title">Healthcare Categories</h1>
          <p className="categories-page-error">{error}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        <div className="section-header">
          <h1 className="categories-page-title">Healthcare Categories</h1>
          <p className="categories-page-subtitle">
            Explore our comprehensive range of pharmaceutical products
          </p>
        </div>

        {/* View medicines by category - dropdown filter */}
        {categories.length > 0 && (
          <div className="view-medicines-by-category">
            <h2 className="view-medicines-heading">
              <Package size={22} /> View medicines by category
            </h2>
            <p className="view-medicines-desc">
              Select a category below to see all medicines in that category.
            </p>
            <div className="view-medicines-controls">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="view-medicines-select"
                aria-label="Select category"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleViewMedicines}
                className="btn btn-primary view-medicines-btn"
              >
                View medicines
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {!categories || categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories available at the moment.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-image">
                  <img
                    src={
                      category.image ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='12'%3ECategory%3C/text%3E%3C/svg%3E"
                    }
                    alt={category.name}
                    loading="lazy"
                  />
                  <div className="category-overlay">
                    <Link
                      to={`/category/${category.id}`}
                      className="category-btn"
                    >
                      View details
                    </Link>
                  </div>
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  <Link
                    to={`/category/${category.id}`}
                    className="btn btn-primary category-action-btn"
                  >
                    View details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
