import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("Invalid blog ID.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await apiService.getPublicBlogById(id);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <p className="detail-error">{error || "Blog post not found."}</p>
          <Link to="/blogs" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl =
    blog.imageUrl ||
    blog.image ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='18'%3EBlog%3C/text%3E%3C/svg%3E";
  const title = blog.title || blog.itemName || blog.itemHeading || "Blog Post";
  const description = blog.description || blog.content || blog.itemDescription || "";
  const author = blog.author || blog.createdBy || blog.createdByUser || "";
  const date = blog.createDate || blog.createdAt || blog.publishDate || blog.updatedAt || "";

  return (
    <div className="blog-detail-page">
      <div className="container">
        <Link to="/blogs" className="detail-back-link">
          <ArrowLeft size={20} /> Back to Blog
        </Link>

        <article className="blog-detail-article">
          <header className="blog-detail-header">
            <h1 className="blog-detail-title">{title}</h1>
            <div className="blog-detail-meta">
              {author && (
                <span className="blog-detail-meta-item">
                  <User size={16} /> {author}
                </span>
              )}
              {date && (
                <span className="blog-detail-meta-item">
                  <Calendar size={16} /> {String(date).replace(/\s*IST\s*$/i, "").trim()}
                </span>
              )}
              {blog.status && (
                <span className="blog-detail-status">{String(blog.status)}</span>
              )}
            </div>
          </header>

          <div className="blog-detail-image-wrap">
            <img
              src={imageUrl}
              alt={title}
              className="blog-detail-image"
              loading="lazy"
            />
          </div>

          <div className="blog-detail-body">
            {description && (
              <div className="blog-detail-description">
                {description.split("\n").map((para, i) => (
                  <p key={i}>{para || "\u00A0"}</p>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
