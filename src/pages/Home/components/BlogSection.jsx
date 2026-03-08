import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./BlogSection.css";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3EBlog%3C/text%3E%3C/svg%3E";

const BlogSection = ({ blogs = [] }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <section className="blog-section">
        <div className="container">
          <header className="blog-section-header">
            <h2 className="blog-section-title">From Our Blog</h2>
            <p className="blog-section-subtitle">Health tips and updates</p>
          </header>
          <div className="blog-empty-state">
            <p>No blog posts at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const featured = blogs[0];
  const imageUrl =
    featured?.imageUrl ||
    featured?.image ||
    PLACEHOLDER_IMG;
  const title = featured?.title || featured?.itemName || "Blog Post";
  const excerpt = featured?.description
    ? String(featured.description).slice(0, 120) + (featured.description.length > 120 ? "…" : "")
    : "";

  return (
    <section className="blog-section">
      <div className="container">
        <header className="blog-section-header">
          <h2 className="blog-section-title">From Our Blog</h2>
          <p className="blog-section-subtitle">Health tips and updates</p>
        </header>

        <div className="blog-feature-row">
          <div className="blog-feature-image-wrap">
            <Link to={`/blog/${featured.id}`} className="blog-feature-image-link">
              <img
                src={imageUrl}
                alt={title}
                className="blog-feature-image"
                loading="lazy"
              />
              <span className="blog-feature-image-label">LATEST POST</span>
            </Link>
          </div>
          <div className="blog-feature-content">
            <div className="blog-feature-card">
              <h3 className="blog-feature-card-title">Featured</h3>
              <p className="blog-feature-card-text">
                {title}
              </p>
              {excerpt && (
                <p className="blog-feature-card-desc">{excerpt}</p>
              )}
              <Link to={`/blog/${featured.id}`} className="blog-feature-read-more">
                Read more <ArrowRight size={16} />
              </Link>
            </div>
            {blogs[1] && (
              <div className="blog-feature-card">
                <h3 className="blog-feature-card-title">More from blog</h3>
                <p className="blog-feature-card-text">
                  {blogs[1].title || blogs[1].itemName || "Post"}
                </p>
                <Link to={`/blog/${blogs[1].id}`} className="blog-feature-read-more">
                  Read more <ArrowRight size={16} />
                </Link>
              </div>
            )}
            <div className="blog-feature-card blog-feature-card-cta">
              <h3 className="blog-feature-card-title">Explore all</h3>
              <p className="blog-feature-card-text">
                Health tips, wellness advice and updates from our team.
              </p>
              <Link to="/blogs" className="blog-feature-visit-btn">
                Visit Blog <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="blog-below-desc">
          <p className="blog-below-desc-text">
            Stay updated with the latest health tips, medicine insights and wellness advice. 
            Our blog brings you trusted information to support your healthcare journey.
          </p>
          <Link to="/blogs" className="blog-below-btn">
            Visit Blog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
