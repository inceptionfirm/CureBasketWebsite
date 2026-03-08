import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./CategoriesSection.css";

const CategoriesSection = ({ categories = [] }) => {
  // Show section even if empty, but with a message
  if (!categories || categories.length === 0) {
    return (
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Healthcare Categories</h2>
              <p className="section-subtitle">
                Explore our comprehensive range of pharmaceutical products
              </p>
            </div>
          </div>
          <div className="empty-state">
            <p>No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Healthcare Categories</h2>
            <p className="section-subtitle">
              Explore our comprehensive range of pharmaceutical products
            </p>
          </div>
        </div>

        <div className="categories-grid">
          {categories.slice(0, 6).map((category) => (
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
      </div>
    </section>
  );
};

export default CategoriesSection;
