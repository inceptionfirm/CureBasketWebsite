import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Blogs.css";

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getPublicBlogs(100);
        if (response.success && response.data) {
          const d = response.data;
          const list = Array.isArray(d)
            ? d
            : (d?.blogs ?? d?.content ?? []);
          setBlogs(Array.isArray(list) ? list : []);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        setError("Failed to load blogs.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  if (loading) {
    return (
      <div className="blogs-page">
        <div className="container">
          <h1 className="blogs-page-title">From Our Blog</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-page">
        <div className="container">
          <h1 className="blogs-page-title">From Our Blog</h1>
          <p className="blogs-page-error">{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="container">
        <div className="blogs-page-header">
          <h1 className="blogs-page-title">From Our Blog</h1>
          <p className="blogs-page-subtitle">
            Health tips and updates from Cure Basket
          </p>
        </div>

        {!blogs || blogs.length === 0 ? (
          <div className="blogs-empty-state">
            <p>No blog posts at the moment.</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <article key={blog.id} className="blogs-card">
                <Link to={`/blog/${blog.id}`} className="blogs-card-link">
                  <div className="blogs-card-image">
                    <img
                      src={
                        blog.imageUrl ||
                        blog.image ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220'%3E%3Crect fill='%23e5e7eb' width='400' height='220'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3EBlog%3C/text%3E%3C/svg%3E"
                      }
                      alt={blog.title || blog.itemName || "Blog"}
                      loading="lazy"
                    />
                  </div>
                  <div className="blogs-card-info">
                    <h3>{blog.title || blog.itemName || "Post"}</h3>
                    {blog.description && (
                      <p className="blogs-card-excerpt">
                        {String(blog.description).slice(0, 120)}
                        {String(blog.description).length > 120 ? "…" : ""}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
